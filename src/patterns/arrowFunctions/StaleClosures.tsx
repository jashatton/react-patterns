import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StaleClosures() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  // BUG: This function captures the current value of count
  // When setTimeout runs later, it uses the OLD value!
  const handleDelayedLog = () => {
    setTimeout(() => {
      // This closure captures count at the time handleDelayedLog was created
      setMessage(`Count was ${count} when button was clicked`);
      console.log('Delayed count:', count);
    }, 3000);
  };

  const handleDelayedIncrement = () => {
    setTimeout(() => {
      // This also uses the captured count value!
      setCount(count + 1); // BUG: Always adds 1 to the CAPTURED value
      console.log('Incrementing from captured count:', count);
    }, 2000);
  };

  return (
    <div>
      <RenderCounter name="StaleClosures" />

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
          <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
            <div className="font-semibold mb-1">Logged Message:</div>
            <div className="text-sm">{message}</div>
          </div>
        )}

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Current count is 0</li>
              <li>Click "Log Count After 3 Seconds"</li>
              <li>Quickly click "Increment Now" 5 times (count should be 5)</li>
              <li>Wait 3 seconds...</li>
              <li>Message shows "Count was 0"! 🤯 It captured the old value!</li>
              <li className="mt-2">Try this: Set count to 10, click "Increment After 2 Seconds" twice quickly</li>
              <li>Both timeouts set count to 11 (not 11 then 12!) because they both captured 10</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> Arrow functions in <code className="bg-red-200 px-1 rounded">setTimeout</code> capture
              the <code className="bg-red-200 px-1 rounded">count</code> value from when they were created (closure).
              When the timeout executes later, it uses that old captured value, not the current state. This is called a
              "stale closure" and leads to bugs where async operations use outdated data!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
