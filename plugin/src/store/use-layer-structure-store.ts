// src/store/use-layer-structure-store.ts

import { create } from 'zustand';
import { LayerData } from '@/types/layer';

interface LayerStructureState {
  layerStructure: LayerData[];
  layerCount: number;
  selectedNodeIds: string[];
  
  setLayerStructure: (layers: LayerData[]) => void;
  setLayerCount: (count: number) => void;
  resetSelection: () => void;
}

export const useLayerStructureStore = create<LayerStructureState>((set) => ({
  layerStructure: [],
  layerCount: 0,
  selectedNodeIds: [],
  
  setLayerStructure: (layers) => set({ layerStructure: layers }),
  setLayerCount: (count) => set({ layerCount: count }),
  resetSelection: () => set({ selectedNodeIds: [] }),
}));
