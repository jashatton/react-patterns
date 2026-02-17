import { useState, useEffect } from 'react';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StrictModeListenerFixed() {
  const [keyCount, setKeyCount] = useState(0);

  // FIXED: Listener removed in cleanup so only one is ever active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setKeyCount((c) => c + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown); // Cleanup!
  }, []);

  return (
    <div>
      <RenderCounter name="ListenerFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-6 bg-gray-100 rounded text-center">
          <div className="text-5xl font-mono font-bold mb-2">{keyCount}</div>
          <div className="text-gray-600 text-sm">Space key presses registered</div>
        </div>

        <div className="p-3 bg-gray-200 rounded text-center text-sm text-gray-700 font-medium">
          Click here to focus, then press{' '}
          <kbd className="px-2 py-1 bg-white border border-gray-400 rounded text-xs font-mono shadow-sm">
            Space
          </kbd>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the grey area above to focus the page</li>
              <li>
                Press{' '}
                <kbd className="px-1 bg-green-200 border border-green-400 rounded text-xs">Space</kbd>{' '}
                once
              </li>
              <li>
                Notice the count increases by exactly <strong>1 per press</strong>
              </li>
              <li>The cleanup removed the first listener before the remount added a new one</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong>{' '}
              <code className="bg-green-200 px-1 rounded">
                return () =&gt; document.removeEventListener(...)
              </code>{' '}
              runs during Strict Mode's unmount phase, removing the first listener so the remount
              starts fresh with exactly one.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}