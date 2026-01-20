import { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UseStateForNonRenderingFixed() {
  const [count, setCount] = useState(0);
  const clickCount = useRef(0);
  const renderCount = useRef(0);

  // FIXED: Using useRef doesn't cause re-renders
  useEffect(() => {
    renderCount.current += 1;
    console.log('Component rendered. Total renders:', renderCount.current);
  });

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleTrackClick = () => {
    // FIXED: Using useRef means no re-render!
    clickCount.current += 1;
    console.log('Button clicked (internal tracking):', clickCount.current);
  };

  return (
    <div>
      <RenderCounter name="UseStateForNonRenderingFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold mb-2">Main Counter (needs to display):</div>
          <div className="text-2xl font-bold mb-2">Count: {count}</div>
          <Button onClick={handleIncrement}>Increment</Button>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold mb-2">Internal Tracking (metadata only):</div>
          <div className="text-sm text-gray-700 mb-2">
            Clicks tracked: {clickCount.current}
          </div>
          <Button onClick={handleTrackClick} variant="secondary">
            Track Click (Internal Analytics)
          </Button>
          <div className="text-xs text-green-700 mt-2">
            Using useRef - updates without re-rendering! Check console.
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-300 rounded">
          <div className="font-semibold mb-2">Auto-Track Renders with useRef</div>
          <div className="text-sm text-gray-700">
            Total renders: {renderCount.current} (updated in useEffect)
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Updates automatically without causing infinite loops!
          </div>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the RenderCounter - it starts at 2 (React Strict Mode)</li>
              <li>Click "Track Click" button 3 times - RenderCounter stays at 2! ✨</li>
              <li>The clickCount updates (check console), but NO re-renders happen!</li>
              <li>Click "Increment" to cause a real re-render</li>
              <li>Now you can see the updated clickCount - it was tracking all along!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Using <code className="bg-green-200 px-1 rounded">useRef</code>{' '}
              means updating <code className="bg-green-200 px-1 rounded">.current</code> doesn't trigger
              re-renders. The values persist between renders but stay "invisible" to React's rendering system.
              Perfect for tracking, logging, timers, and other metadata!
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Safe in useEffect:</strong> renderCount updates in useEffect without causing infinite
              loops, since changing a ref doesn't trigger re-renders or re-run effects.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
