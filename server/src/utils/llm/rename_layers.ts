import OpenAI from "openai";

// Initialize OpenAI SDK
const client = new OpenAI({
    apiKey: Deno.env.get("SAMBANOVA_API_KEY"),
    baseURL: "https://api.sambanova.ai/v1",
});

interface RenameLayersInput {
    context: string;
    layers: Array<{ id: string; n: string; t: string; hi: string; w: number; h: number }>;
}

interface RenamedLayer {
    id: string;
    n: string;
}

/**
 * Renames layers using OpenAI without using Zod for validation.
 *
 * @param input - The input containing context and layer data.
 * @returns Renamed layers with their unique IDs and new names.
 */
export const renameLayersUsingAI = async (input: RenameLayersInput): Promise<RenamedLayer[]> => {
    const { context, layers } = input;

    const prompt = `
      Context: ${context}
      Layers: ${JSON.stringify(layers)}
      Instruction: Return a JSON array strictly in the following format:
      [
        {"id": "string", "n": "string"}
      ]
      Do not include any other text, explanation, or formatting outside the JSON block.
    `;

    try {
        const completion = await client.chat.completions.create({
            model: "Meta-Llama-3.2-3B-Instruct",
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
        const renamedLayers: RenamedLayer[] = parsedResponse.map((layer) => {
            if (typeof layer.id !== "string" || typeof layer.n !== "string") {
                throw new Error(`Invalid layer structure: ${JSON.stringify(layer)}`);
            }
            return { id: layer.id, n: layer.n };
        });

        return renamedLayers;
    } catch (error) {
        console.error("Error renaming layers using AI:", error);
        throw new Error("Failed to rename layers. See logs for more details.");
    }
};
