// ** import types
import { LayerData } from '@/types/layer';

export async function fetchLayerStructure(nodes: ReadonlyArray<SceneNode>): Promise<{ layers: LayerData[] }> {
  const layers: LayerData[] = [];

  for (const node of nodes) {
    try {
      const layerData = await getLayerData(node);
      layers.push(layerData);
    } catch (error) {
      console.error(`Error fetching layer data for node ${node.id}:`, error);
    }
  }

  return { layers };
}

async function getLayerData(node: SceneNode): Promise<LayerData> {
  try {
    const layerData: LayerData = {
      id: node.id,
      n: node.name,
      t: node.type,
      hi: node.parent ? buildHierarchyPath(node) : node.id,
      w: node.width,
      h: node.height,
    };

    if ('characters' in node) {
      layerData.tx = node.characters; // Text content if the node has text
      layerData.fs = node.fontSize as number;
    }

    if ('children' in node) {
      layerData.children = [];
      for (const child of node.children) {
        try {
          layerData.children.push(await getLayerData(child));
        } catch (error) {
          console.error(`Error fetching child layer data for node ${child.id}:`, error);
        }
      }
    }

    return layerData;
  } catch (error) {
    console.error(`Error processing layer data for node ${node.id}:`, error);
    throw error; // Re-throw to ensure parent calls handle errors as needed
  }
}

function buildHierarchyPath(node: SceneNode): string {
  try {
    const path = [];
    let currentNode: SceneNode | null = node;
    while (currentNode) {
      path.unshift(currentNode.id);
      currentNode = currentNode.parent as SceneNode | null;
    }
    return path.join(' > ');
  } catch (error) {
    console.error('Error building hierarchy path:', error);
    return '';
  }
}
