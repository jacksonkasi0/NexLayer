// ** import types
import { LayerData } from "@/types/layer";

// Recursive function to count layers, including all nested children
export function countLayers(layers: LayerData[]): number {
    return layers.reduce((count, layer) => {
        const childCount = layer.children ? countLayers(layer.children) : 0;
        return count + 1 + childCount;
    }, 0);
}