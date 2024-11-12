import { EventHandler } from '@create-figma-plugin/utilities';

// ** import types
import { LayerData } from '@/types/layer';

export interface NotificationHandler extends EventHandler {
  name: 'NOTIFY';
  handler: (message: string, type: 'success' | 'warn' | 'error' | 'loading', timeout?: number) => void;
}
export interface FetchLayerStructureHandler extends EventHandler {
  name: 'FETCH_LAYER_STRUCTURE';
  handler: (layerStructure: { layers: LayerData[] }) => void;
}