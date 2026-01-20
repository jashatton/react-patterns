import { useState, memo } from 'react';
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

export function InlineArrowFunctions() {
  const [count, setCount] = useState(0);
  const [items] = useState(['Apple', 'Banana', 'Cherry']);

  return (
    <div>
      <RenderCounter name="InlineArrowFunctions" />

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
          {/* BUG: Inline arrow function creates new reference on every render!
              This arrow function is a new reference every render,
              so React.memo thinks props changed and re-renders all items! */}
          {items.map((item) => (
            <ItemDisplay
              key={item}
              item={item}
              onDelete={(item) => console.log('Delete:', item)}
            />
          ))}
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the render counters for each item - they start at 2 (Strict Mode)</li>
              <li>Click "Increment Count" in the parent</li>
              <li>Watch ALL three items re-render (counts go up) even though items didn't change! 🤯</li>
              <li>Each child re-renders because the onDelete function is a new reference</li>
              <li>React.memo optimization is completely defeated</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> The inline arrow function <code className="bg-red-200 px-1 rounded">{`(item) => console.log(...)`}</code> is
              recreated on every render. Even though ItemDisplay is wrapped in <code className="bg-red-200 px-1 rounded">React.memo</code>,
              it sees a new function reference and thinks the props changed. This is a very common performance bug when using
              inline functions with memoized components!
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Note:</strong> Counts increment by 2 in development due to React Strict Mode. In production, it increments by 1.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
