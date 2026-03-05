import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StaleSetStateFixed() {
  const [count, setCount] = useState(0);

  const handleAddThree = () => {
    // FIXED: Functional updates receive the latest queued value, not the stale closure.
    // Each call sees the result of the previous one.
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  const handleReset = () => setCount(0);

  return (
    <div>
      <RenderCounter name="StaleSetStateFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-gray-100 rounded text-center">
          <div className="text-4xl font-bold mb-1">{count}</div>
          <div className="text-sm text-gray-600">current count</div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAddThree}>Add 3</Button>
          <Button onClick={handleReset} variant="secondary">Reset</Button>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add 3" — count goes up by exactly 3! 🎉</li>
              <li>Click multiple times — always increments by 3</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> The functional form{' '}
              <code className="bg-green-200 px-1 rounded">setCount(prev =&gt; prev + 1)</code> receives the
              latest <em>queued</em> value from React's update queue — not the stale closure value.
              Each call chains off the previous one: 0 → 1 → 2 → 3.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
