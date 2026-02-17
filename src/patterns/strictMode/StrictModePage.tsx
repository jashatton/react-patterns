import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { StrictModeIntervalBug } from './StrictModeIntervalBug';
import { StrictModeIntervalFixed } from './StrictModeIntervalFixed';
import { StrictModeListenerBug } from './StrictModeListenerBug';
import { StrictModeListenerFixed } from './StrictModeListenerFixed';

const intervalBugCode = `// BUG: No cleanup — interval leaks when Strict Mode unmounts
useEffect(() => {
  if (!running) return;
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  // Missing: return () => clearInterval(id);
}, [running]);`;

const intervalFixedCode = `// FIXED: Cleanup cancels the interval on unmount
useEffect(() => {
  if (!running) return;
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(id); // Cleanup!
}, [running]);`;

const listenerBugCode = `// BUG: Listener added to document but never removed
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setKeyCount((c) => c + 1);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  // Missing: return () => document.removeEventListener('keydown', handleKeyDown);
}, []);`;

const listenerFixedCode = `// FIXED: Listener removed in cleanup
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setKeyCount((c) => c + 1);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown); // Cleanup!
}, []);`;

export function StrictModePage() {
  return (
    <PatternPage
      title="Strict Mode & useEffect Cleanup"
      description="React Strict Mode intentionally mounts components twice in development to expose effects that are missing cleanup functions — bugs that would otherwise hide until production."
    >
      <ExplanationCard title="How Strict Mode Finds Cleanup Bugs">
        <p className="mb-2">
          In React 18+, Strict Mode performs a deliberate{' '}
          <strong>mount → unmount → remount</strong> cycle on every component in development. This
          simulates real scenarios: navigating away and back, fast refresh during development, and
          React's upcoming concurrent features that may pause and resume components.
        </p>
        <p>
          <strong>The Strict Mode lifecycle (development only):</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Component mounts → effect runs (sets up interval, listener, subscription...)</li>
          <li>Component unmounts → cleanup runs (only if you returned a cleanup function)</li>
          <li>Component remounts → effect runs again with a fresh setup</li>
        </ol>
        <p className="mt-2">
          If your effect leaks resources during step 2, you'll see doubled behaviour in step 3 —
          making the bug immediately visible during development instead of silently shipping to
          production.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="setInterval Without Cleanup"
        description="A setInterval without a cleanup function leaves a leaked interval running after Strict Mode's unmount phase. Both the leaked interval and the new one fire simultaneously."
        wrong={
          <div>
            <StrictModeIntervalBug />
            <CodeBlock code={intervalBugCode} title="Wrong: No Cleanup" />
          </div>
        }
        right={
          <div>
            <StrictModeIntervalFixed />
            <CodeBlock code={intervalFixedCode} title="Right: Cleanup Clears the Interval" />
          </div>
        }
      />

      <ExplanationCard title="Why the Counter Increments Twice Per Second" type="warning">
        <p>
          Without{' '}
          <code className="bg-yellow-100 px-1 rounded">return () =&gt; clearInterval(id)</code>,
          Strict Mode's unmount phase has nothing to cancel. The first interval keeps ticking. When
          the component remounts, a second interval starts. Now two intervals fire every second —
          doubling the count rate. In production (single mount, no double-invoke), this bug stays
          hidden and only surfaces when components actually unmount via navigation or conditional
          rendering.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Document Event Listener Without Cleanup"
        description="Global listeners on document or window persist across component mounts. Without cleanup, Strict Mode's remount registers a second listener, causing every event to fire twice."
        wrong={
          <div>
            <StrictModeListenerBug />
            <CodeBlock code={listenerBugCode} title="Wrong: Listener Leaks onto document" />
          </div>
        }
        right={
          <div>
            <StrictModeListenerFixed />
            <CodeBlock code={listenerFixedCode} title="Right: Listener Removed in Cleanup" />
          </div>
        }
      />

      <ExplanationCard title="The Golden Rule for useEffect" type="info">
        <p className="mb-2">
          <strong>If your effect starts something, the cleanup must stop it.</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="bg-blue-50 px-1 rounded">setInterval</code> → cleanup with{' '}
            <code className="bg-blue-50 px-1 rounded">clearInterval</code>
          </li>
          <li>
            <code className="bg-blue-50 px-1 rounded">setTimeout</code> → cleanup with{' '}
            <code className="bg-blue-50 px-1 rounded">clearTimeout</code>
          </li>
          <li>
            <code className="bg-blue-50 px-1 rounded">addEventListener</code> → cleanup with{' '}
            <code className="bg-blue-50 px-1 rounded">removeEventListener</code>
          </li>
          <li>WebSocket connection → cleanup closes the connection</li>
          <li>
            Fetch request → cleanup aborts with{' '}
            <code className="bg-blue-50 px-1 rounded">AbortController</code>
          </li>
          <li>Observable / library subscription → cleanup unsubscribes</li>
        </ul>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>Always return a cleanup function from effects that start ongoing work</li>
          <li>
            Write effects to be <em>idempotent</em>: safe to run, cancel, and run again
          </li>
          <li>Strict Mode only double-mounts in development — production builds are unaffected</li>
          <li>
            Treat Strict Mode double-invocation as a feature, not a bug — it surfaces real issues
            early
          </li>
          <li>
            If removing <code className="bg-green-50 px-1 rounded">&lt;StrictMode&gt;</code>{' '}
            "fixes" a problem, you have a missing cleanup, not a Strict Mode problem
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}