import OpenAI from "openai";

// Initialize OpenAI SDK
export const llm_client = new OpenAI({
    apiKey: Deno.env.get("SAMBANOVA_API_KEY"),
    baseURL: "https://api.sambanova.ai/v1",
});
