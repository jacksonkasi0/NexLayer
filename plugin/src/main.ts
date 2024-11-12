// ** import figma utils
import { emit, on, showUI } from '@create-figma-plugin/utilities';

// ** import handlers
import { fetchLayerStructure } from '@/core/handlers/fetch-layer-structure-handler';

// ** import lib
import notify from '@/lib/notify';

// ** import types
import { FetchLayerStructureHandler, NotificationHandler } from '@/types/events';


export default function () {
  showUI({
    height: 210,
    width: 320,
  });
}

// ** Notification handler **
on<NotificationHandler>('NOTIFY', (message, type, timeout = 3000) => {
  let options: NotificationOptions = { timeout };

  switch (type) {
    case 'success':
      message = `✔️ ${message}`;
      break;
    case 'warn':
      message = `⚠️ ${message}`;
      break;
    case 'error':
      message = `✘ ${message}`;
      options.error = true; // Use Figma's error style
      break;
    case 'loading':
      message = `⏳ ${message}`;
      break;
  }

  figma.notify(message, options);
});
/**
 * Fetch layer structure and emit JSON structure with error handling
 */
const fetchAndEmitLayerStructure = async () => {
  const selectedNodes = figma.currentPage.selection;
  try {
    const layerStructure = await fetchLayerStructure(selectedNodes);
    console.log("Layer structure:", layerStructure); // Debug log
    emit<FetchLayerStructureHandler>('FETCH_LAYER_STRUCTURE', layerStructure);
  } catch (error) {
    console.error("Error fetching layer structure:", error);
    figma.notify("✘ Failed to fetch layer structure.", { error: true });
  }
};

// Initial fetch and emit
void fetchAndEmitLayerStructure();

// Listener for selection changes with error handling
figma.on('selectionchange', async () => {
  await fetchAndEmitLayerStructure();
});