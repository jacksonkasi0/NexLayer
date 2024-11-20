// ** import config
import { config } from '@/config';

// ** import types
import { LayerData } from '@/types/layer';

const BASE_URL = config.BASE_URL

export const analyzeImage = async (formData: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}/vision/upload`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error in analyzeImage API:", error);
    throw new Error("Failed to analyze image.");
  }
};

export const renameLayers = async (data: { context: string; layers: LayerData[] }) => {
  try {
    const response = await fetch(`${BASE_URL}/layers/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error in renameLayers API:", error);
    throw new Error("Failed to rename layers.");
  }
};
