import { Hono } from "@hono/hono";

// ** import third-party
import { zValidator } from "@hono/zod-validator";

// ** import validators
import { figmaNodeLayersSchema } from "@/validations/layers.ts";

// ** import utils
import { renameLayersUsingAI } from "@/utils/llm/rename_layers.ts";

// ** import types
import { FigmaNodeLayers } from "@/types/layers.ts";

// Define the environment type for Hono
interface Env {
  Variables: {
    json: FigmaNodeLayers;
  };
}

export const layersApi = new Hono<Env>();

layersApi.post(
  "/generate",
  // @ts-ignore: type-error
  zValidator("json", figmaNodeLayersSchema), // Ensure request validation
  async (c) => {
    try {
      // @ts-ignore: type-error
      const figmaNodeLayers: FigmaNodeLayers = c.req.valid("json");

      // Rename layers using OpenAI
      const renamedLayers = await renameLayersUsingAI(figmaNodeLayers);

      return c.json(
        {
          success: true,
          message: "Successfully renamed layers using AI",
          data: renamedLayers,
        },
        200
      );
    } catch (error) {
      console.error(`Error in - layersApi POST /generate : ${error}`);
      return c.json(
        {
          success: false,
          message: "Error in processing layers",
          data: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
);
