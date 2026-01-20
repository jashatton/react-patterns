import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Simple child component - NOT memoized
// Will re-render whenever parent re-renders
function SimpleDisplay({ message }: { message: string }) {
  return (
    <div className="p-3 border border-gray-300 rounded bg-white">
      <RenderCounter name="SimpleDisplay" />
      <div className="text-sm">{message}</div>
    </div>
  );
}

export function PrematureOptimizationFixed() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // FIXED: Simple inline functions - no useCallback needed!
  // These are cheap to create and there's no memoized children to optimize for
  const handleSubmit = () => {
    console.log('Submitting:', { name, email });
  };

  return (
    <div>
      <RenderCounter name="PrematureOptimizationFixed" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-gray-50 border border-gray-300 rounded">
          <div className="font-semibold mb-3">Counter:</div>
          <div className="text-2xl font-bold mb-3">{count}</div>
          <div className="flex gap-2">
            {/* Inline functions are perfectly fine here */}
            <Button onClick={() => setCount((c) => c + 1)} size="sm">+</Button>
            <Button onClick={() => setCount((c) => c - 1)} size="sm" variant="secondary">-</Button>
            <Button onClick={() => setCount(0)} size="sm" variant="secondary">Reset</Button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-300 rounded">
          <div className="font-semibold mb-3">Form:</div>
          <div className="space-y-2">
            {/* Inline onChange handlers are fine - they're fast to create */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <Button onClick={handleSubmit} size="sm">Submit</Button>
          </div>
        </div>

        <SimpleDisplay message={`Count: ${count}, Name: ${name || 'Empty'}`} />

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the clean, simple code without useCallback clutter</li>
              <li>Click the counter buttons - works perfectly!</li>
              <li>Type in the form - everything responds normally</li>
              <li>The code is easier to read and maintain</li>
              <li>No performance penalty - function creation is fast!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Creating functions is cheap! Modern JavaScript engines optimize this extremely well.
              Only use <code className="bg-green-200 px-1 rounded">useCallback</code> when:
              (1) Passing to React.memo'd children, (2) Functions are dependencies in useEffect/useMemo, or
              (3) Profiling shows actual performance issues. Otherwise, keep it simple with inline functions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
