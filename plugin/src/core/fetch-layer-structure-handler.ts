// ** import types
import { LayerData } from '@/types/layer';

export async function fetchLayerStructure(nodes: ReadonlyArray<SceneNode>): Promise<{ layers: LayerData[] }> {
  const layers: LayerData[] = [];

  for (const node of nodes) {
    try {
      const layerData = await getLayerData(node);
      layers.push(layerData);
    } catch (error) {
      console.error(`Error processing node ${node.id}:`, error);
    }
  }

  return { layers };
}

async function getLayerData(node: SceneNode): Promise<LayerData> {
  const layerData: LayerData = {
    id: node.id,
    n: node.name,
    t: node.type,
    hi: node.parent ? buildHierarchyPath(node) : node.id,
    w: node.width,
    h: node.height,
  };

  if ('characters' in node) {
    layerData.tx = node.characters;
    layerData.fs = node.fontSize as number;
  }

  if ('children' in node) {
    layerData.children = [];
    for (const child of node.children) {
      try {
        layerData.children.push(await getLayerData(child));
      } catch (error) {
        console.error(`Error processing child node ${child.id}:`, error);
      }
    }
  }

  return layerData;
}

function buildHierarchyPath(node: SceneNode): string {
  const path = [];
  let currentNode: SceneNode | null = node;
  while (currentNode) {
    path.unshift(currentNode.id);
    currentNode = currentNode.parent as SceneNode | null;
  }
  return path.join(' > ');
}
