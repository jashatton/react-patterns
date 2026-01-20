import { useState, useRef } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StaleClosuresFixed() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  // Use a ref to always have access to the latest value
  const countRef = useRef(count);
  countRef.current = count; // Update on every render

  // FIXED Option 1: Use functional update to get current value
  const handleDelayedLog = () => {
    setTimeout(() => {
      // Access the ref to get the CURRENT value, not the captured one
      setMessage(`Count was ${countRef.current} when timeout executed`);
      console.log('Current count (from ref):', countRef.current);
    }, 3000);
  };

  // FIXED Option 2: Use functional setState to work with latest state
  const handleDelayedIncrement = () => {
    setTimeout(() => {
      // Function receives the CURRENT state value!
      setCount((currentCount) => {
        console.log('Incrementing from current state:', currentCount);
        return currentCount + 1;
      });
    }, 2000);
  };

  return (
    <div>
      <RenderCounter name="StaleClosuresFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <div className="text-2xl font-bold mb-4">Count: {count}</div>
          <div className="space-y-2">
            <Button onClick={() => setCount(count + 1)}>
              Increment Now
            </Button>
            <Button onClick={handleDelayedLog} variant="secondary">
              Log Count After 3 Seconds
            </Button>
            <Button onClick={handleDelayedIncrement} variant="secondary">
              Increment After 2 Seconds
            </Button>
          </div>
        </div>

        {message && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <div className="font-semibold mb-1">Logged Message:</div>
            <div className="text-sm">{message}</div>
          </div>
        )}

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Current count is 0</li>
              <li>Click "Log Count After 3 Seconds"</li>
              <li>Quickly click "Increment Now" 5 times (count becomes 5)</li>
              <li>Wait 3 seconds...</li>
              <li>Message shows "Count was 5"! 🎉 It uses the current value!</li>
              <li className="mt-2">Try this: Set count to 10, click "Increment After 2 Seconds" twice quickly</li>
              <li>Count becomes 12 correctly! Each timeout increments from current state</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Two solutions:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <strong>useRef:</strong> <code className="bg-green-200 px-1 rounded">countRef.current</code> always
                  points to the latest value, avoiding stale closures
                </li>
                <li>
                  <strong>Functional setState:</strong> <code className="bg-green-200 px-1 rounded">{`setCount(current => current + 1)`}</code>
                  receives the actual current state, not the captured value
                </li>
              </ul>
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Best practice:</strong> Use functional updates for setState when the new value depends on the old value,
              especially in async operations or event handlers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
