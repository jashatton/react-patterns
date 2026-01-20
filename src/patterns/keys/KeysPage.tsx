import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { IndexAsKey } from './IndexAsKey';
import { IndexAsKeyFixed } from './IndexAsKeyFixed';

const indexAsKeyCode = `// BUG: Using array index as key
function PeopleList({ people }) {
  return (
    <div>
      {people.map((person, index) => (
        <PersonItem key={index} person={person} />
        // When list reorders, React thinks index 0 is the same
        // component, even though it's a different person!
      ))}
    </div>
  );
}`;

const indexAsKeyFixedCode = `// FIXED: Using stable ID as key
function PeopleList({ people }) {
  return (
    <div>
      {people.map((person) => (
        <PersonItem key={person.id} person={person} />
        // React tracks each person by ID, so state stays
        // with the correct person when the list reorders
      ))}
    </div>
  );
}`;

export function KeysPage() {
  return (
    <PatternPage
      title="Keys in Lists"
      description="Keys tell React which items are which, allowing it to preserve component state and DOM elements when lists change. Using wrong keys causes state to stick to the wrong items."
    >
      <ExplanationCard title="Why Keys Matter">
        <p className="mb-2">
          When you render a list in React, keys help React identify which items have changed, been added, or removed.
          Without proper keys, React can't track component identity across re-renders.
        </p>
        <p>
          <strong>What happens with bad keys:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Component state gets attached to the wrong items when the list reorders</li>
          <li>Form inputs show values for different items after sorting/filtering</li>
          <li>Animations and focus states jump to wrong elements</li>
          <li>Performance suffers as React unmounts/remounts unnecessarily</li>
        </ul>
      </ExplanationCard>

      <ComparisonLayout
        title="Index as Key Anti-pattern"
        description="Using array index as a key seems convenient but causes serious bugs when your list can reorder, filter, or have items added/removed. State and DOM elements get attached to positions, not items."
        wrong={
          <div>
            <IndexAsKey />
            <CodeBlock code={indexAsKeyCode} title="Wrong: Index as Key" />
          </div>
        }
        right={
          <div>
            <IndexAsKeyFixed />
            <CodeBlock code={indexAsKeyFixedCode} title="Right: Stable ID as Key" />
          </div>
        }
      />

      <ExplanationCard title="The Index Key Problem" type="warning">
        <p className="mb-2">
          When you use <code>key={`{index}`}</code>, React identifies components by their position in the array, not by
          the actual data. Here's what happens:
        </p>
        <ol className="list-decimal list-inside space-y-1 mb-2">
          <li>You add a note to the item at index 0 (Alice)</li>
          <li>React stores that state in "the component at position 0"</li>
          <li>You sort the list - now Bob is at index 0</li>
          <li>React thinks position 0 is the same component (because key=0), just with new props</li>
          <li>It keeps the old state (Alice's note) but shows new data (Bob's name)</li>
        </ol>
        <p>
          <strong>Result:</strong> State and data become mismatched! Your notes and favorites appear on the wrong people.
        </p>
      </ExplanationCard>

      <ExplanationCard title="When Can You Use Index as Key?" type="info">
        <p className="mb-2">Index keys are ONLY safe when ALL of these are true:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>The list is completely static (never reordered, filtered, or modified)</li>
          <li>Items have no local state (no form inputs, toggles, etc.)</li>
          <li>Items are never removed or added</li>
          <li>You're just displaying read-only data</li>
        </ul>
        <p className="mt-2">
          <strong>General rule:</strong> If your data has IDs, use them as keys. Don't use index unless you're 100%
          certain the list will never change order.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Use stable IDs:</strong> Database IDs, UUIDs, or any unique identifier from your data
          </li>
          <li>
            <strong>Don't use random keys:</strong> Never use <code>Math.random()</code> or <code>Date.now()</code> - this
            breaks React's reconciliation
          </li>
          <li>
            <strong>Keys must be unique among siblings:</strong> They don't need to be globally unique
          </li>
          <li>
            <strong>Don't change keys:</strong> If an item's key changes, React treats it as a different item
          </li>
          <li>
            <strong>Generating IDs:</strong> If data has no ID, generate stable ones when fetching/creating data, not during
            render
          </li>
          <li>
            <strong>Compound keys:</strong> Can combine multiple values like <code>{`key={\`\${userId}-\${postId}\`}`}</code>
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
