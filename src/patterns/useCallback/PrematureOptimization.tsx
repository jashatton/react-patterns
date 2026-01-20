import { useState, useCallback } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Simple child component - NOT memoized
// Will re-render whenever parent re-renders regardless of useCallback
function SimpleDisplay({ message }: { message: string }) {
  return (
    <div className="p-3 border border-gray-300 rounded bg-white">
      <RenderCounter name="SimpleDisplay" />
      <div className="text-sm">{message}</div>
    </div>
  );
}

export function PrematureOptimization() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // BUG: Wrapping everything in useCallback unnecessarily!
  // None of these callbacks are passed to memoized components
  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // Overhead: Creating callback, checking deps

  const handleDecrement = useCallback(() => {
    setCount((c) => c - 1);
  }, []); // More overhead

  const handleReset = useCallback(() => {
    setCount(0);
  }, []); // Even more overhead

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []); // Unnecessary - inline would be fine

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []); // Adds complexity for no benefit

  const handleSubmit = useCallback(() => {
    console.log('Submitting:', { name, email });
  }, [name, email]); // Dependencies make it harder to reason about

  return (
    <div>
      <RenderCounter name="PrematureOptimization" />

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-gray-50 border border-gray-300 rounded">
          <div className="font-semibold mb-3">Counter:</div>
          <div className="text-2xl font-bold mb-3">{count}</div>
          <div className="flex gap-2">
            <Button onClick={handleIncrement} size="sm">+</Button>
            <Button onClick={handleDecrement} size="sm" variant="secondary">-</Button>
            <Button onClick={handleReset} size="sm" variant="secondary">Reset</Button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-300 rounded">
          <div className="font-semibold mb-3">Form:</div>
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <Button onClick={handleSubmit} size="sm">Submit</Button>
          </div>
        </div>

        <SimpleDisplay message={`Count: ${count}, Name: ${name || 'Empty'}`} />

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at all the <code className="bg-red-200 px-1 rounded">useCallback</code> wrappers in the code</li>
              <li>Notice SimpleDisplay is NOT wrapped in React.memo</li>
              <li>Click the counter buttons - SimpleDisplay re-renders anyway</li>
              <li>Type in the form - SimpleDisplay re-renders on every keystroke</li>
              <li>All those useCallback wrappers provide ZERO benefit!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why it's bad:</strong> Every <code className="bg-red-200 px-1 rounded">useCallback</code> has a cost:
              creating a closure, storing dependencies, and running comparison checks. Without React.memo on the child components,
              these callbacks are recreated anyway (due to deps) or provide no benefit (stable functions not needed).
              This makes code harder to read and adds unnecessary overhead.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
