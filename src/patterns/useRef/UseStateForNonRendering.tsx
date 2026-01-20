import { useState, useEffect } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UseStateForNonRendering() {
  const [count, setCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  // BUG: Tracking clicks in state causes unnecessary re-renders
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleTrackClick = () => {
    // This updates state just for logging/analytics - doesn't need to render!
    setClickCount(clickCount + 1);
    console.log('Button clicked (internal tracking):', clickCount + 1);
  };

  // Simulating what happens if we try to auto-track renders with useState
  const [autoRenderCount, setAutoRenderCount] = useState(0);
  const [enableAutoTracking, setEnableAutoTracking] = useState(false);

  useEffect(() => {
    if (enableAutoTracking) {
      // This creates an infinite loop! (safely limited here)
      if (autoRenderCount < 5) {
        setAutoRenderCount(autoRenderCount + 1);
      }
    }
  }, [enableAutoTracking, autoRenderCount]);

  return (
    <div>
      <RenderCounter name="UseStateForNonRendering" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold mb-2">Main Counter (needs to display):</div>
          <div className="text-2xl font-bold mb-2">Count: {count}</div>
          <Button onClick={handleIncrement}>Increment</Button>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="font-semibold mb-2">Internal Tracking (metadata only):</div>
          <div className="text-sm text-gray-700 mb-2">Clicks tracked: {clickCount}</div>
          <Button onClick={handleTrackClick} variant="secondary">
            Track Click (Internal Analytics)
          </Button>
          <div className="text-xs text-gray-600 mt-2">
            This is just for logging - doesn't need to be in state!
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded">
          <div className="font-semibold mb-2">Dangerous: Auto-Track Renders with useState</div>
          <div className="text-sm mb-2">Auto-render count: {autoRenderCount}</div>
          <Button
            onClick={() => setEnableAutoTracking(!enableAutoTracking)}
            variant={enableAutoTracking ? "danger" : "secondary"}
          >
            {enableAutoTracking ? 'Stop Auto-Tracking' : 'Start Auto-Tracking'}
          </Button>
          <div className="text-xs text-yellow-800 mt-2">
            When enabled, watch it trigger 5 re-renders instantly!
          </div>
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the RenderCounter - it starts at 2 (React Strict Mode)</li>
              <li>Click "Track Click" button 3 times - watch RenderCounter increase!</li>
              <li>Each click causes a re-render even though nothing visible changes! 🤯</li>
              <li>Now click "Start Auto-Tracking" - watch it render 5 more times instantly!</li>
              <li>This shows why useState in useEffect for tracking is dangerous</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> Using <code className="bg-red-200 px-1 rounded">useState</code> for{' '}
              tracking/metadata forces re-renders when the data changes, even though the UI doesn't need to
              update. The auto-tracking example shows how this creates render loops - we had to limit it to 5
              to prevent infinite loops!
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Real-world impact:</strong> Tracking clicks, logging, render counts, timer IDs, etc.
              shouldn't trigger re-renders. Using useState wastes performance and can cause infinite loops.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
