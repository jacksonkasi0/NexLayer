import { z } from "zod";

import { LayerData } from "@/types/layers.ts";

// Define the Zod schema for LayerData
export const layerDataSchema: z.ZodType<LayerData> = z.lazy(() =>
    z.object({
        id: z.string(), // Unique identifier for the layer
        n: z.string(), // Name of the layer
        t: z.string(), // Type of the layer (FRAME, TEXT, VECTOR, etc.)
        hi: z.string(), // Hierarchy path
        w: z.number(), // Width of the layer
        h: z.number(), // Height of the layer
        tx: z.string().optional(), // Optional text content for TEXT nodes
        fs: z.number().optional(), // Optional font size for TEXT nodes
        children: z.array(layerDataSchema).optional(), // Use z.lazy() to define the recursive structure for children
    })
);

// Define the Zod schema for an array of LayerData
export const figmaNodeLayersSchema = z.array(layerDataSchema);
