import { h } from 'preact';
import { useEffect } from 'preact/hooks';

// ** import figma utils & ui
import { emit, on } from '@create-figma-plugin/utilities';
import { render } from '@create-figma-plugin/ui';

// ** import pages & styles
import Page from '@/pages';
import '!./styles/output.css';

// ** import store
import { layerStructure, layerCount } from '@/store/use-layer-structure-store';

// ** import lib
import { countLayers } from '@/lib/count-layer';

// ** import types
import { LayerData } from '@/types/layer';
import { FetchLayerStructureHandler } from '@/types/events';


function Plugin() {
  
  // Listen for layer structure updates
  useEffect(() => {
    on<FetchLayerStructureHandler>('FETCH_LAYER_STRUCTURE', ({ layers }: { layers: LayerData[] }) => {
      layerStructure.set(layers);
      layerCount.set(countLayers(layers));
    });
  }, []);

  return <Page />;
}

export default render(Plugin);
