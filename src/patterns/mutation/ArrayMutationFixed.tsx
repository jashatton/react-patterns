import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function ArrayMutationFixed() {
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2']);

  const handleAddItem = () => {
    // FIXED: Create a new array with spread operator
    setItems((current) => [...current, `Item ${current.length + 1}`]);
    console.log('New array created');
  };

  const handleRemoveItem = () => {
    // FIXED: filter creates a new array (no mutation)
    setItems((current) => current.filter((_, index) => index !== current.length - 1));
  };

  return (
    <div>
      <RenderCounter name="ArrayMutationFixed" />

      <div className="space-y-4 mt-4">
        <div className="flex gap-2">
          <Button onClick={handleAddItem}>Add Item</Button>
          <Button onClick={handleRemoveItem} variant="secondary">
            Remove Last
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

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add Item" - it appears immediately! 🎉</li>
              <li>Try "Remove Last" - it removes instantly</li>
              <li>No force re-render button needed</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Using <code className="bg-green-200 px-1 rounded">[...items, newItem]</code> creates
              a NEW array with a different reference. React sees the reference changed and knows to re-render.
              Same with <code className="bg-green-200 px-1 rounded">filter()</code> and spread operator for sorting - they all create new arrays.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
