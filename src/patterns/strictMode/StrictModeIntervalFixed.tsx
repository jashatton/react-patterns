import { useState, useEffect } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StrictModeIntervalFixed() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);

  // FIXED: Cleanup function cancels the interval on unmount
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(id); // Cleanup cancels the leaked interval
  }, [running]);

  return (
    <div>
      <RenderCounter name="IntervalFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-6 bg-gray-100 rounded text-center">
          <div className="text-5xl font-mono font-bold mb-2">{count}</div>
          <div className="text-gray-600 text-sm">seconds elapsed</div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setRunning(true)} variant="primary">
            Start
          </Button>
          <Button
            onClick={() => {
              setRunning(false);
              setCount(0);
            }}
            variant="secondary"
          >
            Reset
          </Button>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click Start and watch the counter</li>
              <li>
                Notice it increments exactly <strong>once per second</strong>
              </li>
              <li>Strict Mode still double-mounts, but cleanup clears the first interval</li>
              <li>Only the interval from the final mount survives</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> The cleanup function{' '}
              <code className="bg-green-200 px-1 rounded">return () =&gt; clearInterval(id)</code>{' '}
              runs during Strict Mode's unmount phase, cancelling the leaked interval before the
              remount starts a fresh one.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}