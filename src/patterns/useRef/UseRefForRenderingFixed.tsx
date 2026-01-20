import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UseRefForRenderingFixed() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    // FIXED: setState triggers a re-render, so the UI updates immediately
  };

  return (
    <div>
      <RenderCounter name="UseRefForRenderingFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold mb-2">Counter Display:</div>
          <div className="text-3xl font-bold mb-3">Count: {count}</div>
          <Button onClick={handleIncrement}>Increment</Button>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Increment" once</li>
              <li>The count updates instantly from 0 to 1! ✨</li>
              <li>Click it a few more times - every click immediately updates the UI</li>
              <li>No force re-render button needed!</li>
              <li>The UI always shows the current, accurate value</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Using <code className="bg-green-200 px-1 rounded">useState</code>{' '}
              means calling <code className="bg-green-200 px-1 rounded">setCount()</code> triggers a re-render.
              React knows the state changed and immediately updates the UI. This is the correct pattern for any
              value you want to display to users.
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Rule of thumb:</strong> If it shows in the UI, use useState. If it's just metadata or
              doesn't affect rendering, use useRef.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
