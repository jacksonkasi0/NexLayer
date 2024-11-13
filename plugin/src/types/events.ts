import { EventHandler } from '@create-figma-plugin/utilities';

// ** import types
import { LayerData } from '@/types/layer';
import { ImageData } from '@/types/utils';
import { FetchImageTrigger } from './enums';

export interface NotificationHandler extends EventHandler {
  name: 'NOTIFY';
  handler: (message: string, type: 'success' | 'warn' | 'error' | 'loading', timeout?: number) => void;
}

export interface FetchLayerStructureHandler extends EventHandler {
  name: 'FETCH_LAYER_STRUCTURE';
  handler: (layerStructure: { layers: LayerData[] }) => void;
}


export interface FetchImageHandler extends EventHandler {
  name: 'FETCH_IMAGE';
  handler: (nodeId: string, trigger: FetchImageTrigger) => void;
}

export interface ExportCompleteHandler extends EventHandler {
  name: 'RECEIVE_IMAGE';
  handler: (data: ImageData, trigger: FetchImageTrigger) => void;
}
