import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { StaleClosures } from './StaleClosures';
import { StaleClosuresFixed } from './StaleClosuresFixed';

const staleClosureCode = `// BUG: Closure captures old state value
function Counter() {
  const [count, setCount] = useState(0);

  const handleDelayedLog = () => {
    setTimeout(() => {
      // Uses captured count, not current!
      console.log('Count:', count);
    }, 3000);
  };

  const handleDelayedIncrement = () => {
    setTimeout(() => {
      setCount(count + 1); // Always adds 1 to captured value!
    }, 2000);
  };

  // If you click twice, both set count to (captured + 1)
  // instead of incrementing twice
}`;

const staleClosureFixedCode = `// FIXED: Use ref or functional update
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  countRef.current = count; // Always latest

  const handleDelayedLog = () => {
    setTimeout(() => {
      // Read current value from ref!
      console.log('Count:', countRef.current);
    }, 3000);
  };

  const handleDelayedIncrement = () => {
    setTimeout(() => {
      // Functional update gets current state!
      setCount(current => current + 1);
    }, 2000);
  };

  // Now clicking twice correctly increments twice
}`;

export function ArrowFunctionsPage() {
  return (
    <PatternPage
      title="Arrow Functions in Components"
      description="Arrow functions are convenient but can cause performance issues when passed to memoized components, and closure issues when used in async operations. Learn when they're fine and when to use alternatives."
    >
      <ExplanationCard title="Arrow Functions and Closures">
        <p className="mb-2">
          Arrow functions create closures that capture variables from their surrounding scope. This is usually helpful,
          but causes two common problems in React:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            <strong>Performance:</strong> Inline arrow functions in JSX create new references on every render, breaking
            React.memo optimization
          </li>
          <li>
            <strong>Stale closures:</strong> Arrow functions in setTimeout/setInterval capture old state values, causing
            bugs in async operations
          </li>
        </ul>
        <p>
          <strong>Key point:</strong> Inline arrow functions are fine for simple event handlers. Only optimize when
          passing to memoized components or dealing with async operations.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Stale Closures in Async Operations"
        description="Arrow functions in setTimeout, setInterval, or other async operations capture state values when created. When they execute later, they use old (stale) values, not current state."
        wrong={
          <div>
            <StaleClosures />
            <CodeBlock code={staleClosureCode} title="Wrong: Stale Closure" />
          </div>
        }
        right={
          <div>
            <StaleClosuresFixed />
            <CodeBlock code={staleClosureFixedCode} title="Right: Ref or Functional Update" />
          </div>
        }
      />

      <ExplanationCard title="The Stale Closure Problem" type="warning">
        <p className="mb-2">
          When arrow functions capture state values, they create a "snapshot" of those values. This causes bugs in:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            <strong>setTimeout/setInterval:</strong> Uses old state when timer fires
          </li>
          <li>
            <strong>Event listeners:</strong> Captures state at time of adding listener
          </li>
          <li>
            <strong>Async functions:</strong> Old values after await
          </li>
          <li>
            <strong>Debounced/throttled functions:</strong> Stale values when finally called
          </li>
        </ul>
        <p>
          <strong>Solution:</strong> Use refs for reading latest values, or functional setState updates for modifying state
          based on current values.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>For memoized children:</strong> Use useCallback to prevent unnecessary re-renders
          </li>
          <li>
            <strong>For async operations:</strong> Use functional setState: <code>{`setState(prev => prev + 1)`}</code>
          </li>
          <li>
            <strong>For reading current values:</strong> Use a ref and keep it updated on every render
          </li>
          <li>
            <strong>For simple handlers:</strong> Inline functions are perfectly fine!
          </li>
          <li>
            <strong>Profile first:</strong> Don't optimize until you measure a problem
          </li>
          <li>
            <strong>Event listeners:</strong> Clean up in useEffect return to avoid memory leaks
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
