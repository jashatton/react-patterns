import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function ArrayMutation() {
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2']);
  const [_forceUpdate, setForceUpdate] = useState(0);

  const handleAddItem = () => {
    // BUG: Mutating the array directly!
    items.push(`Item ${items.length + 1}`);
    setItems(items); // This doesn't trigger a re-render because the reference is the same
    console.log('Array after push:', items); // Array is updated in memory
  };

  const handleForceRerender = () => {
    // Force a re-render to show that items are actually in the array
    setForceUpdate(prev => prev + 1);
  };

  return (
    <div>
      <RenderCounter name="ArrayMutation" />

      <div className="space-y-4 mt-4">
        <div className="flex gap-2">
          <Button onClick={handleAddItem}>Add Item</Button>
          <Button onClick={handleForceRerender} variant="secondary">
            Force Re-render
          </Button>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="mb-2 font-semibold">Items in list:</div>
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-sm">
                • {item}
              </li>
            ))}
          </ul>
          <div className="mt-2 text-xs text-gray-600">
            Array length: {items.length}
          </div>
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add Item" button multiple times</li>
              <li>Notice nothing appears in the list! 🤯</li>
              <li>Check the console - the array IS being modified</li>
              <li>Click "Force Re-render" to reveal all the hidden items</li>
              <li>All the items you added suddenly appear!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> The code uses <code className="bg-red-200 px-1 rounded">items.push()</code> which mutates the
              existing array. Then it calls <code className="bg-red-200 px-1 rounded">setItems(items)</code> with the same array reference.
              React compares references, sees they're identical, and skips the re-render. The data changed but React doesn't know!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
