import { useState, useEffect, useRef } from 'react';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UnnecessaryDependenciesFixed() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const effectRunCount = useRef(0);

  // FIXED: setResults removed from dependencies
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
  }, [query]); // Fixed: Only query as dependency!

  return (
    <div>
      <RenderCounter name="UnnecessaryDepsFixed" />

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

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Type in the search box - it works perfectly!</li>
              <li>Look at the clean dependency array: <code className="bg-green-200 px-1 rounded">[query]</code></li>
              <li>Only the values that actually need tracking are included</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> The dependency array only includes <code className="bg-green-200 px-1 rounded">query</code>.
              React's setState functions (like setResults) are guaranteed to be stable and never need to be dependencies.
              This makes the code clearer and follows React best practices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
