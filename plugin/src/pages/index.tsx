import { h } from 'preact';
import { useEffect } from 'preact/hooks';

// ** import store
import { useLayerStructureStore } from '@/store/use-layer-structure-store';

// ** import components
import LayerItem from '@/components/layer-item';

const Root = () => {
  const { layerStructure, layerCount } = useLayerStructureStore();

  useEffect(() => {
    console.log('Layer Structure Updated:', layerStructure);
  }, [layerStructure]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Layer Structure</h1>
      <p className="text-sm text-gray-600">Total Layers: {layerCount}</p>
      <div className="space-y-2">
        {layerStructure.length > 0 ? (
          layerStructure.map((layer) => (
            <LayerItem key={layer.id} layer={layer} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No layers selected.</p>
        )}
      </div>
    </div>
  );
};

export default Root;
