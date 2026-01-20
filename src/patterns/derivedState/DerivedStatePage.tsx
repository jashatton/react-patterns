import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { UnnecessaryState } from './UnnecessaryState';
import { UnnecessaryStateFixed } from './UnnecessaryStateFixed';
import { SyncingPropsToState } from './SyncingPropsToState';
import { SyncingPropsToStateFixed } from './SyncingPropsToStateFixed';

const unnecessaryStateCode = `// BUG: Storing computed value in state
const [firstName, setFirstName] = useState('John');
const [lastName, setLastName] = useState('Doe');
const [fullName, setFullName] = useState('John Doe'); // Redundant!

// Need to keep them synchronized
useEffect(() => {
  setFullName(\`\${firstName} \${lastName}\`);
}, [firstName, lastName]);

// Causes extra re-renders and complexity`;

const unnecessaryStateFixedCode = `// FIXED: Calculate during render
const [firstName, setFirstName] = useState('John');
const [lastName, setLastName] = useState('Doe');

// Just compute it - no state needed!
const fullName = \`\${firstName} \${lastName}\`;
const initials = \`\${firstName[0]}\${lastName[0]}\`;

// Always in sync, no useEffect needed`;

const syncingPropsCode = `// BUG: Local state doesn't reset when prop changes
function UserActivityCounter({ userId }: { userId: number }) {
  const [activityCount, setActivityCount] = useState(0);

  // Problem: When userId changes, activityCount stays the same!
  // User 1's count shows up for User 2
  return <div>User {userId} - Count: {activityCount}</div>;
}

// In parent - NO key prop
<UserActivityCounter userId={selectedUserId} />
// React reuses the same component instance`;

const syncingPropsFixedCode = `// FIXED Option 1: Use prop directly (no local state)
function UserInfo({ userId }: { userId: number }) {
  // Just calculate from props - no state needed
  const userData = getUserData(userId);
  return <div>{userData}</div>;
}

// FIXED Option 2: Reset state with key prop
function Parent() {
  return <UserActivityCounter key={userId} userId={userId} />;
  // When key changes, React creates a NEW component
  // The old one is unmounted (with its state)
  // The new one is mounted with fresh initial state
}`;

export function DerivedStatePage() {
  return (
    <PatternPage
      title="Derived State Anti-pattern"
      description="Derived state is any data that can be calculated from existing state or props. Storing it in separate state variables leads to synchronization bugs and unnecessary complexity."
    >
      <ExplanationCard title="What is Derived State?">
        <p className="mb-2">
          Derived state is data that can be computed from other data. Examples include:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            <code>fullName</code> from <code>firstName</code> + <code>lastName</code>
          </li>
          <li>
            <code>totalPrice</code> from <code>items.reduce((sum, item) =&gt; sum + item.price, 0)</code>
          </li>
          <li>
            <code>isValid</code> from checking form field values
          </li>
          <li>Filtered or sorted lists from base arrays</li>
        </ul>
        <p>
          <strong>Rule:</strong> If you can calculate it from existing state/props, don't store it in state!
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Unnecessary State"
        description="Storing computed values in state creates synchronization problems and adds unnecessary complexity. Calculate them during render instead."
        wrong={
          <div>
            <UnnecessaryState />
            <CodeBlock code={unnecessaryStateCode} title="Wrong: Storing Derived Values" />
          </div>
        }
        right={
          <div>
            <UnnecessaryStateFixed />
            <CodeBlock code={unnecessaryStateFixedCode} title="Right: Calculate During Render" />
          </div>
        }
      />

      <ExplanationCard title="Why Unnecessary State is Bad" type="warning">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Extra re-renders:</strong> Setting derived state triggers an additional render cycle
          </li>
          <li>
            <strong>Synchronization bugs:</strong> Easy to forget updating the derived state
          </li>
          <li>
            <strong>More code:</strong> Need useEffect to keep values in sync
          </li>
          <li>
            <strong>Complexity:</strong> More state means more mental overhead
          </li>
          <li>
            <strong>Source of truth:</strong> Unclear which state is authoritative
          </li>
        </ul>
      </ExplanationCard>

      <ComparisonLayout
        title="Local State That Doesn't Reset"
        description="When a component has local state that should reset when props change, but doesn't have a key prop, the state persists across different prop values. This creates confusing bugs where User A's data appears for User B."
        wrong={
          <div>
            <SyncingPropsToState />
            <CodeBlock code={syncingPropsCode} title="Wrong: No Key Prop" />
          </div>
        }
        right={
          <div>
            <SyncingPropsToStateFixed />
            <CodeBlock code={syncingPropsFixedCode} title="Right: Use Props or Key" />
          </div>
        }
      />

      <ExplanationCard title="When Do You Actually Need Local State?" type="info">
        <p className="mb-2">You need local state when:</p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            <strong>User input:</strong> Form fields that the user can edit
          </li>
          <li>
            <strong>Toggles:</strong> Open/closed, expanded/collapsed states
          </li>
          <li>
            <strong>Initialization only:</strong> When prop is just an initial value, not a source of truth
          </li>
        </ul>
        <p>
          For initialization-only cases, use the <code>key</code> prop to reset state when the initializing value
          changes. This recreates the component with fresh state.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Default to calculation:</strong> Compute values during render unless there's a performance issue
          </li>
          <li>
            <strong>Use useMemo for expensive calculations:</strong> Only if profiling shows it's actually slow
          </li>
          <li>
            <strong>Props as source of truth:</strong> If parent passes data, use it directly
          </li>
          <li>
            <strong>Key prop for resets:</strong> When you need to reset state based on prop changes
          </li>
          <li>
            <strong>Lift state up:</strong> If multiple components need the same data, manage it in parent
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
