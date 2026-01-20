import { useState, useEffect, useRef } from 'react';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UnnecessaryDependencies() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const effectRunCount = useRef(0);

  // BUG: setResults is included in dependencies unnecessarily
  // React guarantees setState functions are stable and don't need to be in deps
  useEffect(() => {
    effectRunCount.current += 1;
    console.log(`Effect ran ${effectRunCount.current} times`);

    if (query) {
      // Simulate search
      const searchResults = [
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`,
      ];
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, setResults]); // BUG: setResults is unnecessary here!

  return (
    <div>
      <RenderCounter name="UnnecessaryDeps" />

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Query:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type to search..."
          />
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="mb-2 text-sm text-gray-600">Effect has run: {effectRunCount.current} times</div>
          {results.length > 0 ? (
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={index} className="text-sm">
                  • {result}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">
              {query ? 'Searching...' : 'Enter a search query'}
            </div>
          )}
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Type in the search box to see results appear</li>
              <li>Look at the dependency array in the code: <code className="bg-red-200 px-1 rounded">[query, setResults]</code></li>
              <li>Notice <code className="bg-red-200 px-1 rounded">setResults</code> is listed unnecessarily</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why it's bad:</strong> While this doesn't cause bugs (React's setState functions are stable),
              it makes the code harder to read and suggests to other developers that setResults might change.
              It also triggers unnecessary ESLint warnings and can cause issues in more complex scenarios.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
