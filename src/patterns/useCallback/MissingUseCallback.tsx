/* eslint-disable react-hooks/purity */
import { useState, memo } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Expensive child component wrapped in React.memo
// Should only re-render when props actually change - but it doesn't because
// handleItemClick is a new reference every render, defeating memo
const ExpensiveList = memo(({ items, onItemClick }: { items: string[]; onItemClick: (item: string) => void }) => {
  // Simulate expensive rendering
  const startTime = performance.now();
  while (performance.now() - startTime < 10) {
    // Burn 10ms to simulate expensive computation
  }

  return (
    <div className="p-4 border-2 border-gray-300 rounded bg-gray-50">
      <RenderCounter name="ExpensiveList" />
      <div className="mb-2 text-sm font-semibold">List Items:</div>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item}
            onClick={() => onItemClick(item)}
            className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-blue-50 cursor-pointer text-sm"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        (This component takes 10ms to render - simulating expensive work)
      </div>
    </div>
  );
});

ExpensiveList.displayName = 'ExpensiveList';

// Static items array - same reference every time
const ITEMS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

export function MissingUseCallback() {
  const [count, setCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // BUG: Creating a new function on every render!
  // Even though ExpensiveList is memo'd, it re-renders because
  // handleItemClick is a new reference every time
  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    console.log('Item clicked:', item);
  };

  return (
    <div>
      <RenderCounter name="MissingUseCallback" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold mb-2">Parent State:</div>
          <div className="text-sm space-y-2">
            <div>Count: {count}</div>
            <div>Selected Item: {selectedItem || 'None'}</div>
          </div>
          <div className="mt-3">
            <Button onClick={() => setCount(count + 1)} size="sm">
              Increment Count (unrelated to list)
            </Button>
          </div>
        </div>

        <ExpensiveList items={ITEMS} onItemClick={handleItemClick} />

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the ExpensiveList render counter - it starts at 2 (Strict Mode)</li>
              <li>Click "Increment Count" in the parent</li>
              <li>Watch ExpensiveList re-render (count goes up by 2) even though items didn't change! 🤯</li>
              <li>The list takes 10ms to render each time (wasted work)</li>
              <li>Click the counter multiple times - ExpensiveList keeps re-rendering</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> The <code className="bg-red-200 px-1 rounded">handleItemClick</code> function is
              recreated on every render. Even though ExpensiveList is wrapped in <code className="bg-red-200 px-1 rounded">React.memo</code>,
              React sees a new function reference and thinks the props changed, so it re-renders the child.
              React.memo's optimization is completely defeated!
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Note:</strong> Counts increment by 2 in development due to React Strict Mode (double-renders to catch bugs).
              In production, it increments by 1.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
