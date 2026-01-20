import { useState, memo, useCallback } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Expensive child component wrapped in React.memo
// Should only re-render when props actually change
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

export function MissingUseCallbackFixed() {
  const [count, setCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // FIXED: Wrap in useCallback to maintain stable reference
  // Now ExpensiveList only re-renders when items or the function logic changes
  const handleItemClick = useCallback((item: string) => {
    setSelectedItem(item);
    console.log('Item clicked:', item);
  }, []); // Empty deps - function never needs to change

  return (
    <div>
      <RenderCounter name="MissingUseCallbackFixed" />

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

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the ExpensiveList render counter - it starts at 2 (Strict Mode)</li>
              <li>Click "Increment Count" in the parent multiple times</li>
              <li>ExpensiveList render counter stays at 2! 🎉</li>
              <li>The list doesn't re-render because props didn't actually change</li>
              <li>Click an item in the list - it still works perfectly!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Wrapping <code className="bg-green-200 px-1 rounded">handleItemClick</code> in
              <code className="bg-green-200 px-1 rounded">useCallback</code> returns the same function reference across renders.
              Now when React.memo compares props, it sees the same function and correctly skips re-rendering the child.
              This saves 10ms per avoided render - in a real app with many expensive children, this adds up!
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Note:</strong> Counts start at 2 in development due to React Strict Mode (double-renders to catch bugs).
              In production, it starts at 1.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
