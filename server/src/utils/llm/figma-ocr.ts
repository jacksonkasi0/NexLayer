// ** import config
import { llm_client } from "@/config/llm.ts";

// ** import utils
import { convertFileToBase64 } from "@/utils/convert-to-base64.ts";


interface AnalyzeFigmaFrameInput {
    files: File[]; // Array of raw image files
}

interface FigmaFrameAnalysisResponse {
    content: string; // The detailed breakdown of the design
}

/**
 * Analyze Figma frame design using OpenAI Vision and return detailed feedback.
 *
 * @param input - The input containing raw image files for analysis.
 * @returns The detailed analysis of the Figma frame design.
 */
export const analyzeFigmaFrameDesign = async (
    input: AnalyzeFigmaFrameInput
): Promise<FigmaFrameAnalysisResponse> => {
    const { files } = input;

    // Convert files to base64 and build message objects dynamically
    const fileMessages = await Promise.all(
        files.map(async (file) => {
            const base64Image = await convertFileToBase64(file);
            return {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Analyzing the following image: ${file.name}`,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${file.type};base64,${base64Image}`,
                        },
                    },
                ],
            };
        })
    );

    // Add the initial prompt as the first message
    const messages: any = [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: `Please thoroughly analyze the Figma frame design and provide a detailed breakdown of each element, one by one, explaining:
                    
1. The content used in the design, including typography, colors, and imagery.
2. The design flow, including any patterns, textures, or other visual elements used to guide the user's attention.

Please use clear and specific language, avoiding ambiguity and ensuring that each element is fully explained. The goal is to provide a comprehensive understanding of the design, including its components and how they work together to create the desired visual effect.`,
                },
            ],
        },
        ...fileMessages,
    ];


    try {
        const completion = await llm_client.chat.completions.create({
            model: "Llama-3.2-11B-Vision-Instruct",
            messages
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
            throw new Error("No response content received from OpenAI.");
        }

        return { content: responseContent };
    } catch (error) {
        console.error("Error analyzing Figma frame design:", error);
        throw new Error("Failed to analyze the Figma frame design. See logs for more details.");
    }
};
