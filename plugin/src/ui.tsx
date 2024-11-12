import { h } from 'preact';
import { useEffect } from 'preact/hooks';

// ** import figma utils & ui
import { on } from '@create-figma-plugin/utilities';
import { render } from '@create-figma-plugin/ui';

// ** import pages & styles
import Root from '@/pages';
import '!./styles/output.css';

// ** import hooks
import { useLayerStructureStore } from '@/store/use-layer-structure-store';

// ** import types
import { LayerData } from '@/types/layer';
import { FetchLayerStructureHandler } from '@/types/events';

function Plugin() {
  const { setLayerStructure, setLayerCount, resetSelection } = useLayerStructureStore();

  // Listen for layer structure updates
  useEffect(() => {
    on<FetchLayerStructureHandler>('FETCH_LAYER_STRUCTURE', ({ layers }: { layers: LayerData[] }) => {
      setLayerStructure(layers);
      setLayerCount(layers.length);
      resetSelection();
    });
  }, [setLayerStructure, setLayerCount, resetSelection]);

  return <Root />;
}

export default render(Plugin);
