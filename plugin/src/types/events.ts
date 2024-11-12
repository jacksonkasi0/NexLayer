import { EventHandler } from '@create-figma-plugin/utilities';

// ** import types
import { LayerData } from '@/types/layer';

export interface FetchLayerStructureHandler extends EventHandler {
  name: 'FETCH_LAYER_STRUCTURE';
  handler: (layerStructure: { layers: LayerData[] }) => void;
}
