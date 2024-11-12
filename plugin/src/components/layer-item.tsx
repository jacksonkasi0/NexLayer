import { h } from 'preact';

// ** import types
import { LayerData } from '@/types/layer';

interface LayerItemProps {
  layer: LayerData;
}

const LayerItem = ({ layer }: LayerItemProps) => {
  return (
    <div className="border p-2 rounded-lg bg-gray-100">
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-semibold">{layer.n} ({layer.t})</span>
        {layer.w && layer.h && (
          <span className="text-xs text-gray-500">
            Dimensions: {layer.w} x {layer.h}
          </span>
        )}
        {layer.tx && (
          <span className="text-xs text-gray-500">Text: {layer.tx}</span>
        )}
      </div>
      {layer.children && layer.children.length > 0 && (
        <div className="ml-4 border-l pl-2 mt-2">
          {layer.children.map((child) => (
            <LayerItem key={child.id} layer={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerItem;
