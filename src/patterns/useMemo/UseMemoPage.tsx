import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { ExpensiveCalculation } from './ExpensiveCalculation';
import { ExpensiveCalculationFixed } from './ExpensiveCalculationFixed';
import { PrematureMemoization } from './PrematureMemoization';
import { PrematureMemoizationFixed } from './PrematureMemoizationFixed';

const expensiveCalculationCode = `// BUG: Expensive calculation on every render
function Component() {
  const [count, setCount] = useState(0);
  const [max, setMax] = useState(1000);

  // Runs on EVERY render, even when max hasn't changed!
  const primes = findPrimes(max); // Takes 100ms+

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count} {/* Clicking this re-runs findPrimes! */}
      </button>
      <div>Primes: {primes.length}</div>
    </div>
  );
}`;

const expensiveCalculationFixedCode = `// FIXED: Memoize expensive calculation
function Component() {
  const [count, setCount] = useState(0);
  const [max, setMax] = useState(1000);

  // Only recalculates when max changes!
  const primes = useMemo(() => {
    return findPrimes(max); // Takes 100ms+
  }, [max]); // Dependency: only re-run when max changes

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count} {/* Fast! Doesn't re-run findPrimes */}
      </button>
      <div>Primes: {primes.length}</div>
    </div>
  );
}`;

const prematureMemoizationCode = `// BUG: Memoizing trivial calculations
function UserCard({ firstName, lastName }) {
  // Unnecessary - string concat is instant
  const fullName = useMemo(() => {
    return \`\${firstName} \${lastName}\`;
  }, [firstName, lastName]);

  // Unnecessary - toUpperCase() is instant
  const initials = useMemo(() => {
    return \`\${firstName[0]}\${lastName[0]}\`.toUpperCase();
  }, [firstName, lastName]);

  // More memoization overhead than benefit!
  return <div>{fullName} ({initials})</div>;
}`;

const prematureMemoizationFixedCode = `// FIXED: Simple and fast
function UserCard({ firstName, lastName }) {
  // Just calculate - it's instant!
  const fullName = \`\${firstName} \${lastName}\`;
  const initials = \`\${firstName[0]}\${lastName[0]}\`.toUpperCase();

  // Clean, readable, and actually faster
  return <div>{fullName} ({initials})</div>;
}`;

export function UseMemoPage() {
  return (
    <PatternPage
      title="useMemo Usage"
      description="useMemo caches expensive calculation results to avoid redundant work. But most calculations are so fast that memoization overhead is worse than recalculating. Learn when it helps and when to skip it."
    >
      <ExplanationCard title="What is useMemo?">
        <p className="mb-2">
          <code>useMemo</code> memoizes (caches) the result of a calculation. It only recalculates when dependencies
          change. This is useful for:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>Expensive calculations that take &gt;10ms (filtering large arrays, complex math, data transformations)</li>
          <li>Maintaining reference equality for objects/arrays passed to React.memo'd children</li>
          <li>Calculations used as dependencies in useEffect or other useMemo hooks</li>
        </ul>
        <p>
          <strong>Key point:</strong> Most calculations are so fast (microseconds) that useMemo's overhead makes things
          <em> slower</em>. Profile before optimizing!
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Missing useMemo for Expensive Calculations"
        description="When you have genuinely expensive calculations (>10ms), running them on every render wastes CPU and makes your app sluggish. useMemo prevents redundant work by caching results."
        wrong={
          <div>
            <ExpensiveCalculation />
            <CodeBlock code={expensiveCalculationCode} title="Wrong: No useMemo" />
          </div>
        }
        right={
          <div>
            <ExpensiveCalculationFixed />
            <CodeBlock code={expensiveCalculationFixedCode} title="Right: With useMemo" />
          </div>
        }
      />

      <ExplanationCard title="When useMemo Actually Helps" type="success">
        <p className="mb-2">Use useMemo in these specific scenarios:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <strong>Expensive calculations:</strong> Operations that take &gt;10ms (profile to confirm!)
          </li>
          <li>
            <strong>Large array operations:</strong> Filtering, sorting, or mapping 1000+ items
          </li>
          <li>
            <strong>Complex transformations:</strong> Deep object processing, recursive algorithms
          </li>
          <li>
            <strong>Reference equality:</strong> Objects/arrays passed to React.memo'd children
          </li>
          <li>
            <strong>As dependencies:</strong> Values used in useEffect or other useMemo hooks
          </li>
        </ol>
        <p className="mt-2">
          <strong>Rule of thumb:</strong> If your calculation doesn't cause noticeable lag when you spam-click a button,
          you probably don't need useMemo.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Premature Memoization"
        description="Wrapping trivial calculations in useMemo adds overhead without benefit. String operations, boolean checks, and simple math are so fast that memoization makes things slower."
        wrong={
          <div>
            <PrematureMemoization />
            <CodeBlock code={prematureMemoizationCode} title="Wrong: Memoizing Everything" />
          </div>
        }
        right={
          <div>
            <PrematureMemoizationFixed />
            <CodeBlock code={prematureMemoizationFixedCode} title="Right: Simple Calculations" />
          </div>
        }
      />

      <ExplanationCard title="The Cost of useMemo" type="warning">
        <p className="mb-2">
          useMemo isn't free! Each use has costs:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            <strong>Memory:</strong> Stores the cached value and dependencies
          </li>
          <li>
            <strong>Comparison:</strong> React checks if dependencies changed on every render
          </li>
          <li>
            <strong>Complexity:</strong> Makes code harder to read and maintain
          </li>
          <li>
            <strong>Bugs:</strong> Stale values if dependencies are wrong
          </li>
        </ul>
        <p>
          For simple operations (string concat, arithmetic, boolean logic), recalculating is faster than memoizing!
          Modern JavaScript engines execute millions of operations per second.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="info">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Default to simple calculations:</strong> Don't use useMemo unless you have a specific reason
          </li>
          <li>
            <strong>Profile first:</strong> Use React DevTools Profiler to find actual performance issues
          </li>
          <li>
            <strong>Measure the calculation:</strong> If it takes &lt;10ms, skip useMemo
          </li>
          <li>
            <strong>Include all dependencies:</strong> Use ESLint's exhaustive-deps rule to avoid stale values
          </li>
          <li>
            <strong>Consider alternatives:</strong> Sometimes moving calculations outside the component or using better data structures is better
          </li>
          <li>
            <strong>Pair with React.memo:</strong> For reference equality when passing objects/arrays to memoized children
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
