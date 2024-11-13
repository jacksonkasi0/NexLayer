import { h } from 'preact';

// ** import store
import { useStore } from '@nanostores/preact';
import { layerCount, layerStructure } from '@/store/use-layer-structure-store';

// ** import components
import LayerItem from '@/components/layer-item';

const Root = () => {

  const layers = useStore(layerStructure);
  const count = useStore(layerCount);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Layer Structure</h1>
      <p className="text-sm text-gray-600">Total Layers: {count}</p>
      <div className="space-y-2">
        {layers.length > 0 ? (
          layers.map((layer) => (
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
