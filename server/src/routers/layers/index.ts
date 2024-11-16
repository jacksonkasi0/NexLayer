import { Hono } from "@hono/hono";

// ** import third-party
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// ** import validators
import { figmaNodeLayersSchema } from "@/validations/layers.ts";

// ** import types
import { FigmaNodeLayers } from "@/types/layers.ts";

// Define the environment type for Hono
interface Env {
  Variables: {
    json: z.infer<typeof figmaNodeLayersSchema>[];
  };
}

export const layersApi = new Hono<Env>();

layersApi.post(
  "/generate",
  zValidator("json", figmaNodeLayersSchema), // This ensures request validation
  async (c) => {
    try {
      // Explicitly cast the result to the expected type
      // @ts-ignore : type-error json
      const figmaNodeLayers: FigmaNodeLayers = c.req.valid("json");

      return c.json(
        {
          success: true,
          message: "Successfully processed AI content",
          data: figmaNodeLayers, // Include the processed data in the response
        },
        200,
      );
    } catch (error) {
      console.error(`Error in - layersApi POST /generate : ${error}`);
      return c.json(
        {
          success: false,
          message: "Error in processing layers",
          data: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  },
);
