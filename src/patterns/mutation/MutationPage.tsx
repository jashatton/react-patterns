import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { ArrayMutation } from './ArrayMutation';
import { ArrayMutationFixed } from './ArrayMutationFixed';
import { ObjectMutation } from './ObjectMutation';
import { ObjectMutationFixed } from './ObjectMutationFixed';
import { StaleSetState } from './StaleSetState';
import { StaleSetStateFixed } from './StaleSetStateFixed';

const arrayMutationCode = `// BUG: Mutating the array directly
const handleAddItem = () => {
  items.push(\`Item \${items.length + 1}\`);
  setItems(items); // Same reference, no re-render!
};

// Also wrong:
items.sort(); // Mutates in place
items.splice(0, 1); // Mutates in place
items[0] = 'new value'; // Mutates in place`;

const arrayMutationFixedCode = `// FIXED: Create new array with spread
const handleAddItem = () => {
    setItems((current) => [...current, \`Item \${current.length + 1}\`]);
};

// Also correct:
setItems((current) => [...current].sort()); // Copy first, then sort
setItems((current) => current.filter((_, i) => i !== 0)); // filter creates new array
setItems((current) => current.map((item, i) => i === 0 ? 'new value' : item));`

const objectMutationCode = `// BUG: Mutating object directly
const handleUpdate = () => {
  user.name = 'Jane Smith';
  setUser(user); // Same reference, no re-render!
};

// BUG: Mutating nested object
const handleUpdateCity = () => {
  user.address.city = 'Los Angeles';
  setUser(user); // Still the same reference!
};`;

const staleSetStateCode = `// BUG: All three calls read the same stale \`count\` from the closure
const handleAddThree = () => {
  setCount(count + 1); // count = 0 → schedules 1
  setCount(count + 1); // count = 0 (stale!) → schedules 1 again
  setCount(count + 1); // count = 0 (stale!) → schedules 1 again
  // Result: count becomes 1, not 3
};`;

const staleSetStateFixedCode = `// FIXED: Functional updates chain off the latest queued value
const handleAddThree = () => {
  setCount((prev) => prev + 1); // 0 → 1
  setCount((prev) => prev + 1); // 1 → 2
  setCount((prev) => prev + 1); // 2 → 3
  // Result: count correctly becomes 3
};`;

const objectMutationFixedCode = `// FIXED: Create new object with spread
const handleUpdateName = () => {
  // FIXED: Create new object with spread operator
  setUser((current) => ({
    ...current,
    name: 'Jane Smith',
  }));
};

// FIXED: Create new nested object
const handleUpdateCity = () => {
  // FIXED: Create new nested object
  setUser((current) => ({
    ...current,
    address: {
      ...current.address,
      city: 'Los Angeles',
    },
  }));
};`;

export function MutationPage() {
  return (
    <PatternPage
      title="Object/Array Mutation in State"
      description="One of the most fundamental React rules: never mutate state directly. React uses reference equality to detect changes, so mutations to the same object/array won't trigger re-renders."
    >
      <ExplanationCard title="Why Mutation Breaks React">
        <p className="mb-2">
          React compares state values using <code>Object.is()</code> to determine if a re-render is needed. When
          you mutate an object or array, you're changing its contents but keeping the same reference.
        </p>
        <p className="mb-2">
          <strong>Result:</strong> React thinks nothing changed (same reference) and doesn't re-render, even though
          the data is different in memory.
        </p>
        <p>
          <strong>Solution:</strong> Always create new objects/arrays when updating state. This gives React a new
          reference to compare against.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Array Mutation"
        description="Methods like push(), pop(), splice(), and sort() mutate arrays in place. React won't detect these changes."
        wrong={
          <div>
            <ArrayMutation />
            <CodeBlock code={arrayMutationCode} title="Wrong: Mutating Array" />
          </div>
        }
        right={
          <div>
            <ArrayMutationFixed />
            <CodeBlock code={arrayMutationFixedCode} title="Right: Creating New Array" />
          </div>
        }
      />

      <ExplanationCard title="Common Array Mutations to Avoid" type="warning">
        <div className="space-y-2">
          <div>
            <strong>Mutating methods (DON'T use directly on state):</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>
                <code>push()</code>, <code>pop()</code>, <code>shift()</code>, <code>unshift()</code>
              </li>
              <li>
                <code>splice()</code>, <code>sort()</code>, <code>reverse()</code>
              </li>
              <li>Direct index assignment: <code>arr[0] = newValue</code></li>
            </ul>
          </div>
          <div>
            <strong>Safe alternatives (create new arrays):</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>
                <code>[...arr, newItem]</code> or <code>arr.concat(newItem)</code>
              </li>
              <li>
                <code>arr.filter()</code>, <code>arr.map()</code>, <code>arr.slice()</code>
              </li>
              <li>
                <code>[...arr].sort()</code> - copy first, then mutate the copy
              </li>
            </ul>
          </div>
        </div>
      </ExplanationCard>

      <ComparisonLayout
        title="Object Mutation"
        description="Directly modifying object properties, especially nested ones, is a common mistake that breaks React's change detection."
        wrong={
          <div>
            <ObjectMutation />
            <CodeBlock code={objectMutationCode} title="Wrong: Mutating Object" />
          </div>
        }
        right={
          <div>
            <ObjectMutationFixed />
            <CodeBlock code={objectMutationFixedCode} title="Right: Creating New Object" />
          </div>
        }
      />

      <ExplanationCard title="Handling Nested Objects" type="info">
        <p className="mb-2">Nested objects require extra care. You must create new objects at every level:</p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
          {`setUser({
  ...user,              // Copy top level
  address: {
    ...user.address,    // Copy nested level
    city: 'New City',   // Update the field
  },
});`}
        </div>
        <p>
          For deeply nested updates, consider using libraries like Immer that simplify immutable updates, or
          restructure your state to be flatter.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Stale State in Back-to-Back setState Calls"
        description="Calling setState multiple times in one handler using the current state value reads a stale snapshot — all calls see the same value, so only the last one takes effect."
        wrong={
          <div>
            <StaleSetState />
            <CodeBlock code={staleSetStateCode} title="Wrong: Reading Stale State" />
          </div>
        }
        right={
          <div>
            <StaleSetStateFixed />
            <CodeBlock code={staleSetStateFixedCode} title="Right: Functional Updates" />
          </div>
        }
      />

      <ExplanationCard title="When to Always Use Functional Updates" type="info">
        <p className="mb-2">
          Use the functional form <code>setState(prev =&gt; ...)</code> any time the new state depends on the
          previous state — especially when:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>You call <code>setState</code> more than once in the same handler</li>
          <li>You call <code>setState</code> inside <code>setTimeout</code>, <code>setInterval</code>, or async callbacks</li>
          <li>Multiple event handlers might update the same state concurrently</li>
        </ul>
        <p className="mt-2">
          React guarantees that the <code>prev</code> argument is always the latest committed (or queued) value,
          never a stale closure snapshot.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Arrays:</strong> Use spread <code>[...arr]</code>, <code>.map()</code>,{' '}
            <code>.filter()</code>, <code>.slice()</code>
          </li>
          <li>
            <strong>Objects:</strong> Use spread <code>{'{ ...obj }'}</code> or <code>Object.assign()</code>
          </li>
          <li>
            <strong>Nested structures:</strong> Copy at every level or use Immer for complex updates
          </li>
          <li>
            <strong>Testing:</strong> If "Force Re-render" shows different data, you have a mutation bug
          </li>
          <li>
            <strong>ESLint:</strong> Use <code>eslint-plugin-react</code> to catch common mutation patterns
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
