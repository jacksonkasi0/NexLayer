// ** import figma utils
import { emit } from '@create-figma-plugin/utilities';

// ** import types
import { ImageData } from '@/types/utils';
import { FetchImageTrigger } from '@/types/enums';
import { ExportCompleteHandler } from '@/types/events';

export const exportSelectedNode = async (nodeId: string, trigger: FetchImageTrigger) => {

  try {
    const node = figma.getNodeById(nodeId) as SceneNode;
    if (!node) throw new Error(`Node with ID ${nodeId} not found`);

    const exportSettings: ExportSettingsImage = {
      format: 'JPG',
      constraint: { type: 'SCALE', value: 1.5 },
    };

    const imageData = await node.exportAsync(exportSettings);

    const exportedImage: ImageData = {
      nodeName: node.name,
      imageData: Array.from(imageData),
      formatOption: 'JPG',
    };

    emit<ExportCompleteHandler>('RECEIVE_IMAGE', exportedImage, trigger); // Emit image data back
  } catch (error) {
    console.error('Error exporting selected node:', error);
    figma.notify('✘ Failed to export selected node', { error: true });
  }
};
