import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { MissingUseCallback } from './MissingUseCallback';
import { MissingUseCallbackFixed } from './MissingUseCallbackFixed';
import { PrematureOptimization } from './PrematureOptimization';
import { PrematureOptimizationFixed } from './PrematureOptimizationFixed';

const missingUseCallbackCode = `// BUG: Function recreated every render
function Parent() {
  const [count, setCount] = useState(0);

  // New function reference on every render!
  const handleClick = (item) => {
    console.log(item);
  };

  return <ExpensiveChild onItemClick={handleClick} />;
  // Even though ExpensiveChild is memo'd, it re-renders
  // because handleClick is always a new reference
}`;

const missingUseCallbackFixedCode = `// FIXED: Stable function reference
function Parent() {
  const [count, setCount] = useState(0);

  // Same function reference across renders!
  const handleClick = useCallback((item) => {
    console.log(item);
  }, []); // Empty deps - never changes

  return <ExpensiveChild onItemClick={handleClick} />;
  // Now React.memo works! Child only re-renders when needed
}`;

const prematureOptimizationCode = `// BUG: useCallback everywhere unnecessarily
function Form() {
  const [name, setName] = useState('');

  // Unnecessary - not passed to memoized component
  const handleChange = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    console.log(name);
  }, [name]); // Recreated when name changes anyway!

  // All this adds complexity for no benefit
  return <SimpleForm onChange={handleChange} />;
}`;

const prematureOptimizationFixedCode = `// FIXED: Simple and clear
function Form() {
  const [name, setName] = useState('');

  // Inline functions are perfectly fine!
  const handleSubmit = () => {
    console.log(name);
  };

  return (
    <SimpleForm
      onChange={(e) => setName(e.target.value)}
      onSubmit={handleSubmit}
    />
  );
}`;

export function UseCallbackPage() {
  return (
    <PatternPage
      title="useCallback Usage"
      description="useCallback memoizes functions to prevent unnecessary re-renders of child components. But using it everywhere adds complexity without benefit. Learn when it actually helps and when to skip it."
    >
      <ExplanationCard title="What is useCallback?">
        <p className="mb-2">
          <code>useCallback</code> returns a memoized version of a callback function. It only creates a new function
          when its dependencies change. This is useful for:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>Passing callbacks to React.memo'd components (prevents unnecessary re-renders)</li>
          <li>Using functions as dependencies in useEffect or useMemo</li>
          <li>Optimizing performance in very large lists or expensive operations</li>
        </ul>
        <p>
          <strong>Key point:</strong> Function creation is cheap in JavaScript. Only use useCallback when you have a
          specific performance reason, not "just in case."
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Missing useCallback with React.memo"
        description="When you pass a function to a memoized child component without useCallback, the child re-renders on every parent render because the function is a new reference each time. React.memo's optimization is defeated."
        wrong={
          <div>
            <MissingUseCallback />
            <CodeBlock code={missingUseCallbackCode} title="Wrong: No useCallback" />
          </div>
        }
        right={
          <div>
            <MissingUseCallbackFixed />
            <CodeBlock code={missingUseCallbackFixedCode} title="Right: With useCallback" />
          </div>
        }
      />

      <ExplanationCard title="When useCallback Actually Helps" type="success">
        <p className="mb-2">Use useCallback in these specific scenarios:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <strong>With React.memo:</strong> When passing callbacks to memoized children (like the example above)
          </li>
          <li>
            <strong>As useEffect dependencies:</strong> Prevents effect from re-running unnecessarily
          </li>
          <li>
            <strong>As useMemo dependencies:</strong> Prevents expensive calculations from re-running
          </li>
          <li>
            <strong>Custom hooks:</strong> When returning functions that consumers might use as dependencies
          </li>
          <li>
            <strong>Very large lists:</strong> When rendering thousands of items that need stable event handlers
          </li>
        </ol>
      </ExplanationCard>

      <ComparisonLayout
        title="Premature Optimization"
        description="Wrapping every function in useCallback adds complexity and overhead without benefit. Only use it when you have a specific performance need, not as a default pattern."
        wrong={
          <div>
            <PrematureOptimization />
            <CodeBlock code={prematureOptimizationCode} title="Wrong: useCallback Everywhere" />
          </div>
        }
        right={
          <div>
            <PrematureOptimizationFixed />
            <CodeBlock code={prematureOptimizationFixedCode} title="Right: Simple Inline Functions" />
          </div>
        }
      />

      <ExplanationCard title="The Cost of useCallback" type="warning">
        <p className="mb-2">
          useCallback isn't free! Each use has costs:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            <strong>Memory:</strong> Stores the function and its dependencies
          </li>
          <li>
            <strong>Comparison:</strong> React checks if dependencies changed on every render
          </li>
          <li>
            <strong>Complexity:</strong> Makes code harder to read and maintain
          </li>
          <li>
            <strong>Bugs:</strong> Missing dependencies can cause stale closures
          </li>
        </ul>
        <p>
          Creating a new function is extremely cheap in modern JavaScript. Don't optimize unless you have a
          measurable performance problem!
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="info">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Default to inline functions:</strong> They're simple and performant enough for most cases
          </li>
          <li>
            <strong>Add useCallback when needed:</strong> When passing to memo'd components or using as dependencies
          </li>
          <li>
            <strong>Profile first:</strong> Use React DevTools Profiler to find actual performance issues
          </li>
          <li>
            <strong>Include all dependencies:</strong> Use ESLint's exhaustive-deps rule to avoid stale closures
          </li>
          <li>
            <strong>Pair with React.memo:</strong> useCallback without memo is usually pointless
          </li>
          <li>
            <strong>Consider useEvent (future):</strong> React's upcoming useEvent hook for event handlers
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
