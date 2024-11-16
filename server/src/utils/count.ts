// ** import types
import { LayerData } from "@/types/layers.ts";

/**
 * Recursively counts all layers, including nested children.
 *
 * @param layers - Array of LayerData objects.
 * @returns Total count of layers including their nested children.
 */
export const countAllLayers = (layers: LayerData[]): number => {
    let count = layers.length;
    for (const layer of layers) {
        if (layer.children && layer.children.length > 0) {
            count += countAllLayers(layer.children);
        }
    }
    return count;
};