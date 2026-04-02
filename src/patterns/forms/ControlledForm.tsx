import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function ControlledForm() {
  // React state is the single source of truth
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Derived values computed directly during render — no useEffect needed
  const nameCharCount = name.length;
  const emailValid = email.includes('@') && email.includes('.');
  const canSubmit = name.length >= 2 && emailValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubmitted(false);
  };

  return (
    <div>
      <RenderCounter name="ControlledForm" />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-gray-400 font-normal">({nameCharCount} chars)</span>
          </label>
          {/* FIXED: value + onChange — React owns the value */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="At least 2 characters"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {email.length > 0 && !emailValid && (
            <p className="text-red-600 text-xs mt-1">Must contain @ and .</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={!canSubmit}>
            Submit
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {submitted && (
          <div className="p-3 bg-green-100 rounded text-sm text-green-800">
            Submitted: {name} / {email}
          </div>
        )}
      </form>

      <div className="p-4 bg-green-100 border-2 border-green-400 rounded mt-4">
        <div className="text-sm text-green-800 space-y-2">
          <div className="font-bold text-base">✅ The Fix:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>One source of truth: React state</li>
            <li>Validation and char count computed inline — no effects</li>
            <li>Reset just clears state — DOM follows automatically</li>
            <li>No refs, no event listeners, no synchronization logic</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-green-300">
            <strong>Why it works:</strong> When the input has{' '}
            <code className="bg-green-200 px-1 rounded">value</code> and{' '}
            <code className="bg-green-200 px-1 rounded">onChange</code>, React is the source of truth.
            Every keystroke updates state, and everything that depends on the value just reads from state
            during render — no side effects required.
          </div>
        </div>
      </div>
    </div>
  );
}
