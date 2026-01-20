import { useRef, useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UseRefForRendering() {
  const count = useRef(0);
  const [, setForceUpdate] = useState(0);

  const handleIncrement = () => {
    count.current += 1;
    // BUG: The UI doesn't update because changing ref.current doesn't trigger re-renders!
    console.log('Actual count in memory:', count.current);
  };

  const handleForceRerender = () => {
    // This is a hack to see the updated value
    setForceUpdate((prev) => prev + 1);
  };

  return (
    <div>
      <RenderCounter name="UseRefForRendering" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold mb-2">Counter Display:</div>
          <div className="text-3xl font-bold mb-3">Count: {count.current}</div>
          <div className="flex gap-2">
            <Button onClick={handleIncrement}>Increment</Button>
            <Button onClick={handleForceRerender} variant="secondary">
              Force Re-render
            </Button>
          </div>
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Increment" 5 times</li>
              <li>Notice the count still shows 0! Nothing updates in the UI! 🤯</li>
              <li>Open your browser console - you'll see "Actual count in memory" is increasing</li>
              <li>Now click "Force Re-render"</li>
              <li>Suddenly the count jumps to 5 - all your clicks were actually counted!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> Updating <code className="bg-red-200 px-1 rounded">count.current</code>{' '}
              is just a regular JavaScript mutation. React has no way to detect it happened, so no re-render
              occurs. The value changes in memory but the UI shows stale data until something else forces a
              re-render.
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Real-world impact:</strong> Users click buttons and nothing happens. The app appears
              broken even though the data is updating in the background. This is a critical bug!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
