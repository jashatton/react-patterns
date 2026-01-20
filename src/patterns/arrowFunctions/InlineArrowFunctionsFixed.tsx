import { useState, memo, useCallback } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Child component wrapped in React.memo
// Should only re-render when props change
const ItemDisplay = memo(({ item, onDelete }: { item: string; onDelete: (item: string) => void }) => {
  return (
    <div className="p-3 border border-gray-300 rounded bg-white flex justify-between items-center">
      <div>
        <RenderCounter name={`ItemDisplay-${item}`} />
        <span className="ml-2">{item}</span>
      </div>
      <Button onClick={() => onDelete(item)} size="sm" variant="danger">
        Delete
      </Button>
    </div>
  );
});

ItemDisplay.displayName = 'ItemDisplay';

export function InlineArrowFunctionsFixed() {
  const [count, setCount] = useState(0);
  const [items] = useState(['Apple', 'Banana', 'Cherry']);

  // FIXED: Wrap in useCallback for stable reference
  const handleDelete = useCallback((item: string) => {
    console.log('Delete:', item);
  }, []); // Empty deps - function never changes

  return (
    <div>
      <RenderCounter name="InlineArrowFunctionsFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold mb-2">Unrelated State:</div>
          <div className="text-sm space-y-2">
            <div>Count: {count}</div>
            <Button onClick={() => setCount(count + 1)} size="sm">
              Increment Count (unrelated to items)
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {/* FIXED: Same stable function reference for all items! */}
          {items.map((item) => (
            <ItemDisplay
              key={item}
              item={item}
              /* handleDelete is the same reference every render, so React.memo correctly skips re-rendering! */
              onDelete={handleDelete}
            />
          ))}
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the render counters for each item - they start at 2 (Strict Mode)</li>
              <li>Click "Increment Count" in the parent multiple times</li>
              <li>The item render counts stay at 2! 🎉</li>
              <li>Only the parent re-renders, children are properly skipped</li>
              <li>Click a Delete button - still works perfectly!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Using <code className="bg-green-200 px-1 rounded">useCallback</code> gives us a
              stable function reference that's the same across renders. Now when React.memo compares props, it sees the same
              function and correctly skips re-rendering the children. This is the proper way to pass functions to memoized components!
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Note:</strong> Counts start at 2 in development due to React Strict Mode. In production, they start at 1.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
