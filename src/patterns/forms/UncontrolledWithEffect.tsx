import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UncontrolledWithEffect() {
  // Uncontrolled: refs are the "source of truth"
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // But we need the values in state for validation and derived UI...
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // BUG: Two sources of truth. DOM holds the real value,
  // state tries to mirror it via useEffect.
  useEffect(() => {
    const el = nameRef.current;
    const sync = () => setName(el?.value ?? '');
    el?.addEventListener('input', sync);
    return () => el?.removeEventListener('input', sync);
  }, []);

  useEffect(() => {
    const el = emailRef.current;
    const sync = () => setEmail(el?.value ?? '');
    el?.addEventListener('input', sync);
    return () => el?.removeEventListener('input', sync);
  }, []);

  // Derived values — only work because of the useEffect syncing above
  const nameCharCount = name.length;
  const emailValid = email.includes('@') && email.includes('.');
  const canSubmit = name.length >= 2 && emailValid;


  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    setName('');
    setEmail('');
    setSubmitted(false);
  };

  return (
    <div>
      <RenderCounter name="UncontrolledWithEffect" />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-gray-400 font-normal">({nameCharCount} chars)</span>
          </label>
          <input
            ref={nameRef}
            type="text"
            placeholder="At least 2 characters"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            ref={emailRef}
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

      <div className="p-4 bg-red-100 border-2 border-red-400 rounded mt-4">
        <div className="text-sm text-red-800 space-y-2">
          <div className="font-bold text-base">🐛 The Problem:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>The inputs are uncontrolled — the DOM owns the values</li>
            <li>But we need the values for validation and the char count</li>
            <li>So we added <code className="bg-red-200 px-1 rounded">useEffect</code> to manually mirror DOM → state</li>
            <li>Now there are two sources of truth: the DOM <em>and</em> React state</li>
            <li>Reset requires manually clearing both the DOM refs and the state</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-red-300">
            <strong>Why?</strong> We reached for <code className="bg-red-200 px-1 rounded">useRef</code> first,
            then bolted on <code className="bg-red-200 px-1 rounded">useEffect</code> to access the value in React.
            This is a sign the component wants to be <em>controlled</em> instead.
          </div>
        </div>
      </div>
    </div>
  );
}
