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
 * Fetch layer structure and emit JSON structure
 */
const fetchAndEmitLayerStructure = async () => {
  const selectedNodes = figma.currentPage.selection;
  const layerStructure = await fetchLayerStructure(selectedNodes);
  emit<FetchLayerStructureHandler>('FETCH_LAYER_STRUCTURE', layerStructure);
};

void fetchAndEmitLayerStructure();

figma.on('selectionchange', async () => {
  await fetchAndEmitLayerStructure();
});
