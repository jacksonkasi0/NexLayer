import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

// ** import llm zod schema
import { renameLayersResponseSchema } from '../schema.ts';

// Initialize OpenAI SDK
const client = new OpenAI({
    apiKey: Deno.env.get("SAMBANOVA_API_KEY"),
    baseURL: "https://api.sambanova.ai/v1"
})

interface RenameLayersInput {
    context: string;
    layers: Array<{ id: string; n: string; t: string; hi: string; w: number; h: number }>;
}

/**
 * Renames layers using OpenAI and validates the structured output using Zod.
 *
 * @param input - The input containing context and layer data.
 * @returns Renamed layers with their unique IDs and new names.
 */
export const renameLayersUsingAI = async (input: RenameLayersInput) => {
    const { context, layers } = input;

    const prompt = `
    Context: ${context}
    Layers: ${JSON.stringify(layers)}
    Instruction: Rename the layers based on the context and their attributes. Provide only the ID and new name for each layer in a JSON format.
  `;

    try {
        const completion = await client.beta.chat.completions.parse({
            model: 'Meta-Llama-3.1-8B-Instruct',
            messages: [{ role: 'user', content: prompt }],
            response_format: zodResponseFormat(renameLayersResponseSchema, 'renameLayersSchema'),
        });
        

        const result = completion.choices[0]?.message?.parsed;

        if (!result) {
            throw new Error('No parsed result returned from OpenAI');
        }

        return result.renamedLayers;
    } catch (error) {
        console.error('Error renaming layers using AI:', error);
        throw new Error('Failed to rename layers. See logs for more details.');
    }
};
