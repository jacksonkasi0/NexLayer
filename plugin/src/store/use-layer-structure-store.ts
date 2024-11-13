import { atom } from 'nanostores';
import { LayerData } from '@/types/layer';

export const layerStructure = atom<LayerData[]>([]);
export const layerCount = atom<number>(0);
