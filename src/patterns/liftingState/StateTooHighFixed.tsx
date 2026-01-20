import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// FIXED: Each component manages its own state internally
function CounterSection() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <RenderCounter name="CounterSection" />
      <div className="font-semibold mb-2">Counter Feature:</div>
      <div className="text-2xl font-bold mb-2">Count: {count}</div>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}

function SearchSection() {
  const [query, setQuery] = useState('');

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <RenderCounter name="SearchSection" />
      <div className="font-semibold mb-2">Search Feature:</div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
        className="w-full px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {query && (
        <div className="mt-2 text-sm text-gray-700">
          Searching for: <strong>{query}</strong>
        </div>
      )}
    </div>
  );
}

function StaticSection() {
  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded">
      <RenderCounter name="StaticSection" />
      <div className="font-semibold mb-2">Static Feature:</div>
      <p className="text-sm text-gray-700">
        This component doesn't use any state from the parent.
        It should never re-render!
      </p>
    </div>
  );
}

export function StateTooHighFixed() {
  // FIXED: Parent has no state - just renders children
  return (
    <div>
      <RenderCounter name="StateTooHighFixed (Parent)" />

      <div className="space-y-4 mt-4">
        <CounterSection />
        <SearchSection />
        <StaticSection />

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at all the RenderCounters - they start at 2 (React Strict Mode)</li>
              <li>Click "Increment" - only CounterSection re-renders! ✨</li>
              <li>Type in the search box - only SearchSection re-renders! ✨</li>
              <li>The StaticSection never re-renders at all!</li>
              <li>The Parent component also never re-renders - it has no state!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Each component manages its own state internally using{' '}
              <code className="bg-green-200 px-1 rounded">useState</code>. State changes are isolated to the
              component that owns them, preventing unnecessary re-renders in unrelated components.
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Performance win:</strong> By keeping state as local as possible, we minimize re-renders
              and improve performance. This is especially important in large apps with many independent features.
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Best practice:</strong> Start with state in the component that needs it. Only lift state
              up when multiple components need to share it. This is the "lift state only when needed" principle.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
