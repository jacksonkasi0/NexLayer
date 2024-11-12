// ** import figma utils
import { emit, showUI } from '@create-figma-plugin/utilities';

// ** import handlers
import { fetchLayerStructure } from '@/core/handlers/fetch-layer-structure-handler';

// ** import types
import { FetchLayerStructureHandler } from '@/types/events';

export default function () {
  showUI({
    height: 210,
    width: 320,
  });
}

/**
 * Fetch layer structure and emit JSON structure with error handling
 */
const fetchAndEmitLayerStructure = async () => {
  try {
    const selectedNodes = figma.currentPage.selection;
    const layerStructure = await fetchLayerStructure(selectedNodes);
    emit<FetchLayerStructureHandler>('FETCH_LAYER_STRUCTURE', layerStructure);
  } catch (error) {
    console.error('Error fetching layer structure:', error);
    figma.notify('An error occurred while fetching layer structure. Please try again.');
  }
};

// Initial fetch and emit
try {
  void fetchAndEmitLayerStructure();
} catch (error) {
  console.error('Initial fetch error:', error);
  figma.notify('An error occurred during the initial fetch. Please try again.');
}

// Listener for selection changes with error handling
figma.on('selectionchange', async () => {
  try {
    console.log('trigger - selectionchange');
    await fetchAndEmitLayerStructure();
  } catch (error) {
    console.error('Error on selection change:', error);
    figma.notify('An error occurred on selection change. Please try again.');
  }
});
