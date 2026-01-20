import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Child component that only needs the counter
function CounterSection({ count, onIncrement }: { count: number; onIncrement: () => void }) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <RenderCounter name="CounterSection" />
      <div className="font-semibold mb-2">Counter Feature:</div>
      <div className="text-2xl font-bold mb-2">Count: {count}</div>
      <Button onClick={onIncrement}>Increment</Button>
    </div>
  );
}

// Child component that only needs the search query
function SearchSection({ query, onQueryChange }: { query: string; onQueryChange: (q: string) => void }) {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <RenderCounter name="SearchSection" />
      <div className="font-semibold mb-2">Search Feature:</div>
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
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

// Child component that doesn't use any state
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

export function StateTooHigh() {
  // BUG: All state is at the top level, even though components use it independently
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');

  return (
    <div>
      <RenderCounter name="StateTooHigh (Parent)" />

      <div className="space-y-4 mt-4">
        <CounterSection count={count} onIncrement={() => setCount(count + 1)} />
        <SearchSection query={query} onQueryChange={setQuery} />
        <StaticSection />

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at all the RenderCounters - they start at 2 (React Strict Mode)</li>
              <li>Click "Increment" button - all 4 components re-render! 🤯</li>
              <li>Type in the search box - all 4 components re-render again!</li>
              <li>
                Notice that <strong>SearchSection</strong> re-renders when you increment the counter
              </li>
              <li>
                Notice that <strong>CounterSection</strong> re-renders when you type in search
              </li>
              <li>
                Even <strong>StaticSection</strong> re-renders when it doesn't use any state!
              </li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> All state is in the parent component{' '}
              <code className="bg-red-200 px-1 rounded">StateTooHigh</code>. When any state changes, the
              parent re-renders, which re-renders all children - even those that don't use the changed state.
              This is wasted performance!
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Real-world impact:</strong> In large apps with many features, lifting all state to the
              top causes massive performance problems. Every state change triggers a full app re-render, making
              the UI sluggish and unresponsive.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
