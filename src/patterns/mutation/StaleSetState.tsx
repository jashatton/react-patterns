import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StaleSetState() {
  const [count, setCount] = useState(0);

  const handleAddThree = () => {
    // BUG: All three calls read the same stale `count` from the closure.
    // React batches these and the last write wins — but they all write count+1.
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const handleReset = () => setCount(0);

  return (
    <div>
      <RenderCounter name="StaleSetState" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-gray-100 rounded text-center">
          <div className="text-4xl font-bold mb-1">{count}</div>
          <div className="text-sm text-gray-600">current count</div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAddThree}>Add 3</Button>
          <Button onClick={handleReset} variant="secondary">Reset</Button>
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add 3" — it only goes up by 1! 🤯</li>
              <li>Click it again — still only +1 each time</li>
              <li>We called <code className="bg-red-200 px-1 rounded">setCount</code> three times, so why?</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> All three <code className="bg-red-200 px-1 rounded">setCount(count + 1)</code> calls
              read the same stale <code className="bg-red-200 px-1 rounded">count</code> value from the closure — the one
              that existed when the handler was created. React batches the updates, and since all three
              schedule the same value, the counter only increments once.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
