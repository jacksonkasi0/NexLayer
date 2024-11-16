import { z } from "zod";

import { LayerData } from "@/types/layers.ts";


// Define the Zod schema for LayerData
export const layerDataSchema: z.ZodType<LayerData> = z.lazy(() =>
    z.object({
        id: z.string(), // Unique identifier for the layer
        n: z.string(), // Name of the layer
        t: z.string(), // Type of the layer (e.g., FRAME, TEXT, VECTOR)
        hi: z.string(), // Hierarchy path
        w: z.number(), // Width of the layer
        h: z.number(), // Height of the layer
        tx: z.string().optional(), // Optional text content for TEXT nodes
        fs: z.number().optional(), // Optional font size for TEXT nodes
        children: z.array(z.lazy(() => layerDataSchema)).optional(), // Recursive structure for child layers
    })
);

// Define the main schema to include context and layers
export const figmaNodeLayersSchema = z.object({
    context: z.string(), // Descriptive context about the Figma design
    layers: z.array(layerDataSchema), // Array of LayerData
});