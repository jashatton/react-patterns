import { useState, useMemo } from 'react';
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

export function ExpensiveCalculationFixed() {
  const [count, setCount] = useState(0);
  const [maxNumber, setMaxNumber] = useState(1000);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // FIXED: useMemo only recalculates when maxNumber changes!
  const { primes, calculationTime } = useMemo(() => {
    const startTime = performance.now();
    const result = findPrimes(maxNumber);
    const time = Math.round(performance.now() - startTime);
    return { primes: result, calculationTime: time };
  }, [maxNumber]); // Only re-run when maxNumber changes

  return (
    <div className={theme === 'dark' ? 'bg-gray-800 text-white p-4 rounded' : 'p-4'}>
      <RenderCounter name="ExpensiveCalculationFixed" />

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
            <div className="text-sm text-green-600 font-semibold">
              ⏱️ Calculation took {calculationTime}ms
            </div>
            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
              First 10 primes: {primes.slice(0, 10).join(', ')}...
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Set the number to 10000 (calculation runs once, ~100-200ms)</li>
              <li>Now click "Increment Count" or "Toggle Theme" multiple times</li>
              <li>The UI updates instantly! 🎉</li>
              <li>The expensive calculation doesn't run again</li>
              <li>Check the console - "Computing primes..." only appears when you change maxNumber</li>
              <li>Change maxNumber to 5000 - calculation runs again (as expected)</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Wrapping the calculation in
              <code className="bg-green-200 px-1 rounded">useMemo</code> with <code className="bg-green-200 px-1 rounded">[maxNumber]</code> as
              dependencies tells React to only recalculate when maxNumber changes. React caches the result and returns the
              cached value on subsequent renders, skipping the expensive work entirely!
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Note:</strong> In development, Strict Mode runs effects twice, but useMemo still prevents unnecessary recalculations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
