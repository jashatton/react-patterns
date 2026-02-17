import { useState, useEffect } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StrictModeIntervalBug() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);

  // BUG: No cleanup — interval is never cleared on unmount
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    // Missing: return () => clearInterval(id);
  }, [running]);

  return (
    <div>
      <RenderCounter name="IntervalBug" />

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

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click Start and watch the counter</li>
              <li>
                Notice it increments <strong>twice per second</strong> instead of once
              </li>
              <li>Strict Mode mounts this component twice on initial render</li>
              <li>Without cleanup, the first interval is never cleared — both run simultaneously</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> React 18 Strict Mode intentionally runs a mount → unmount →
              remount cycle in development. Without a cleanup function, the first interval leaks and
              keeps firing alongside the second one.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}