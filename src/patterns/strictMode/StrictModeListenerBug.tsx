import { useState, useEffect } from 'react';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function StrictModeListenerBug() {
  const [keyCount, setKeyCount] = useState(0);

  // BUG: Document listener added but never removed on unmount
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setKeyCount((c) => c + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Missing: return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div>
      <RenderCounter name="ListenerBug" />

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

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the grey area above to focus the page</li>
              <li>
                Press <kbd className="px-1 bg-red-200 border border-red-400 rounded text-xs">Space</kbd>{' '}
                once
              </li>
              <li>
                Notice the count jumps by <strong>2 instead of 1</strong>
              </li>
              <li>Two listeners are registered — both fire on every keypress</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> <code className="bg-red-200 px-1 rounded">document</code> persists
              across component mounts. Without a cleanup, Strict Mode's unmount phase leaves the first
              listener attached to the document. The remount adds a second one. Every Space press
              triggers both.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}