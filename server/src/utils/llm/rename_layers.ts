// ** import config
import { llm_client } from "@/config/llm.ts";

interface RenameLayersInput {
    context: string;
    layers: Array<{ id: string; n: string; t: string; hi: string; w: number; h: number }>;
}

interface RenamedLayer {
    id: string;
    n: string;
}

/**
 * Splits an array into chunks of a specified size.
 *
 * @param array - The array to split.
 * @param size - The size of each chunk.
 * @returns An array of chunks.
 */
const chunkArray = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

/**
 * Renames layers using OpenAI in parallel mode with batch processing.
 *
 * @param input - The input containing context and layer data.
 * @returns Renamed layers with their unique IDs and new names.
 */
export const renameLayersUsingAI = async (input: RenameLayersInput): Promise<RenamedLayer[]> => {
    const { context, layers } = input;

    // Define batch size
    const batchSize = 5;

    // Split layers into batches
    const layerBatches = chunkArray(layers, batchSize);

    const processBatch = async (batch: typeof layers): Promise<RenamedLayer[]> => {
        const prompt = `
      You are a Figma assistant specializing in renaming layers for improved clarity and organization.
      Given the context and details about Figma layers, suggest meaningful, standardized names for each layer.
      - Consider the context: "${context}"
      - Use the details provided for each layer to infer its purpose or role.
      - If a layer has children, consider its hierarchical structure.

      Here are the layers:
      ${JSON.stringify(batch)}

      Instruction: Rename the layers and return a JSON array strictly in the following format:
      [
        {"id": "string", "n": "string"}
      ]
      Do not include any other text, explanation, or formatting outside the JSON block.
    `;

        try {
            const completion = await llm_client.chat.completions.create({
                model: "Meta-Llama-3.1-8B-Instruct",
                messages: [{ role: "user", content: prompt }],
            });

            const responseContent = completion.choices[0]?.message?.content;
            if (!responseContent) {
                throw new Error("No response content returned from OpenAI");
            }

            // Extract JSON content directly
            const jsonMatch = responseContent.match(/\[.*\]/s); // Matches JSON array
            if (!jsonMatch) {
                throw new Error("No valid JSON array found in the response");
            }

            const jsonPart = jsonMatch[0];
            const parsedResponse: any[] = JSON.parse(jsonPart);

            // Validate structure of each item
            return parsedResponse.map((layer) => {
                if (typeof layer.id !== "string" || typeof layer.n !== "string") {
                    throw new Error(`Invalid layer structure: ${JSON.stringify(layer)}`);
                }
                return { id: layer.id, n: layer.n };
            });
        } catch (error) {
            console.error("Error processing batch using AI:", error);
            throw new Error("Failed to process batch. See logs for more details.");
        }
    };

    // Process all batches in parallel
    const renamedLayersArrays = await Promise.all(layerBatches.map((batch) => processBatch(batch)));

    // Flatten the results into a single array
    return renamedLayersArrays.flat();
};
