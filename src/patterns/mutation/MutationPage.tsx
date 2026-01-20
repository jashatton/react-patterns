import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { ArrayMutation } from './ArrayMutation';
import { ArrayMutationFixed } from './ArrayMutationFixed';
import { ObjectMutation } from './ObjectMutation';
import { ObjectMutationFixed } from './ObjectMutationFixed';

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
  setItems([...items, \`Item \${items.length + 1}\`]);
};

// Also correct:
setItems([...items].sort()); // Copy first, then sort
setItems(items.filter((_, i) => i !== 0)); // filter creates new array
setItems(items.map((item, i) => i === 0 ? 'new value' : item));`;

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

const objectMutationFixedCode = `// FIXED: Create new object with spread
const handleUpdate = () => {
  setUser({
    ...user,
    name: 'Jane Smith',
  });
};

// FIXED: Create new nested object
const handleUpdateCity = () => {
  setUser({
    ...user,
    address: {
      ...user.address,
      city: 'Los Angeles',
    },
  });
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
