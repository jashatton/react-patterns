import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Expensive function that takes time to compute
function findPrimes(max: number): number[] {
  console.log('🔥 Computing primes... (this is slow!)');
  const primes: number[] = [];

  for (let num = 2; num <= max; num++) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(num);
    }
  }

  return primes;
}

export function ExpensiveCalculation() {
  const [count, setCount] = useState(0);
  const [maxNumber, setMaxNumber] = useState(1000);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // BUG: Expensive calculation runs on EVERY render!
  // Even when maxNumber hasn't changed
  const startTime = performance.now();
  const primes = findPrimes(maxNumber);
  const calculationTime = Math.round(performance.now() - startTime);

  return (
    <div className={theme === 'dark' ? 'bg-gray-800 text-white p-4 rounded' : 'p-4'}>
      <RenderCounter name="ExpensiveCalculation" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold mb-2 text-gray-900">Unrelated State:</div>
          <div className="space-y-2">
            <div className="text-gray-900">Count: {count}</div>
            <Button onClick={() => setCount(count + 1)} size="sm">
              Increment Count
            </Button>
            <div className="mt-2">
              <Button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                size="sm"
                variant="secondary"
              >
                Toggle Theme
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <div className="font-semibold mb-2 text-gray-900">Prime Number Calculator:</div>
          <div className="space-y-2">
            <div className="text-gray-900">
              <label className="block text-sm mb-1">Find primes up to:</label>
              <input
                type="number"
                value={maxNumber}
                onChange={(e) => setMaxNumber(Number(e.target.value))}
                min="100"
                max="5000000"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              />
            </div>
            <div className="text-sm text-gray-900">
              <strong>Found {primes.length} primes</strong>
            </div>
            <div className="text-sm text-red-600 font-semibold">
              ⏱️ Calculation took {calculationTime}ms
            </div>
            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
              First 10 primes: {primes.slice(0, 10).join(', ')}...
            </div>
          </div>
        </div>

        <div className="text-sm bg-yellow-200 p-2 border border-y-amber-400">Note: Performance varies by CPU specs.</div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Set the number to 10000 (will take ~100-200ms to calculate)</li>
              <li>Watch the calculation time in the red text</li>
              <li>Now click "Increment Count" or "Toggle Theme" 🤯</li>
              <li>The expensive calculation runs again even though maxNumber didn't change!</li>
              <li>Check the console - see "Computing primes..." on every render</li>
              <li>Every unrelated state change triggers the expensive work</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> The <code className="bg-red-200 px-1 rounded">findPrimes(maxNumber)</code> calculation
              runs on every render, even when <code className="bg-red-200 px-1 rounded">maxNumber</code> hasn't changed.
              React doesn't know this is expensive - it just re-runs all the code in your component body on every render.
              This wastes CPU and makes your app sluggish!
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Note:</strong> In development, Strict Mode doubles renders, making this even slower!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
