import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { UncontrolledWithEffect } from './UncontrolledWithEffect';
import { ControlledForm } from './ControlledForm';

const uncontrolledCode = `// BUG: Uncontrolled inputs + useEffect to sync values to state
const nameRef = useRef<HTMLInputElement>(null);
const emailRef = useRef<HTMLInputElement>(null);

// State added so we can use values for validation...
const [name, setName] = useState('');
const [email, setEmail] = useState('');

// ...so we need effects to mirror DOM → state
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

// Reset requires clearing both DOM and React state
const handleReset = () => {
  if (nameRef.current) nameRef.current.value = '';
  setName('');
  // ...repeat for every field
};`;

const controlledCode = `// FIXED: Controlled inputs — React state is the single source of truth
const [name, setName] = useState('');
const [email, setEmail] = useState('');

// Derived values computed inline — no effects needed
const emailValid = email.includes('@') && email.includes('.');
const canSubmit = name.length >= 2 && emailValid;

// Reset just clears state — DOM follows automatically
const handleReset = () => {
  setName('');
  setEmail('');
};

// In JSX: bind value and onChange
<input value={name} onChange={(e) => setName(e.target.value)} />
<input value={email} onChange={(e) => setEmail(e.target.value)} />`;

export function FormsPage() {
  return (
    <PatternPage
      title="Controlled vs Uncontrolled Components"
      description="Controlled components keep form values in React state. Uncontrolled components let the DOM own the value via refs. Reaching for useEffect to bridge the two is a signal you want a controlled component."
    >
      <ExplanationCard title="The Two Models">
        <div className="space-y-3">
          <div>
            <strong>Controlled:</strong> React state is the source of truth.{' '}
            <code>value</code> + <code>onChange</code> on every input. The DOM reflects
            whatever state says.
          </div>
          <div>
            <strong>Uncontrolled:</strong> The DOM is the source of truth. You read values
            via a <code>ref</code> when you need them (usually on submit).
          </div>
          <div className="pt-2 border-t border-gray-200">
            <strong>The anti-pattern:</strong> Starting with uncontrolled refs, then adding{' '}
            <code>useEffect</code> to mirror values into state so you can use them for
            validation, character counts, or derived UI. This creates two sources of truth
            and all the synchronization problems that come with it.
          </div>
        </div>
      </ExplanationCard>

      <ComparisonLayout
        title="Uncontrolled + useEffect vs Controlled"
        description="When you need real-time access to input values — for validation, derived UI, or conditional logic — use a controlled component. useEffect is the wrong tool for bridging uncontrolled inputs to state."
        wrong={
          <div>
            <UncontrolledWithEffect />
            <CodeBlock code={uncontrolledCode} title="Wrong: Uncontrolled + useEffect Sync" />
          </div>
        }
        right={
          <div>
            <ControlledForm />
            <CodeBlock code={controlledCode} title="Right: Controlled Component" />
          </div>
        }
      />

      <ExplanationCard title="When Uncontrolled is Fine" type="info">
        <p className="mb-2">
          Uncontrolled inputs are appropriate when you only need values at a single point
          (e.g., form submit) and don't need real-time validation or derived UI:
        </p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-3">
          {`function SimpleSearch() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    search(data.get('query') as string);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" type="text" />
      <button type="submit">Search</button>
    </form>
  );
}`}
        </div>
        <p className="mb-2">
          File inputs are <em>always</em> uncontrolled — you can never set their value
          programmatically. Read them with a ref or from the change event.
        </p>
        <p>
          If you find yourself adding <code>useEffect</code> to read a ref, that's the signal
          to switch to a controlled input.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Default to controlled:</strong> easier to validate, transform, and reason about
          </li>
          <li>
            <strong>Use uncontrolled for submit-only forms:</strong> when you don't need real-time feedback
          </li>
          <li>
            <strong>Never useEffect to sync ref → state:</strong> that's controlled input with extra steps
          </li>
          <li>
            <strong>File inputs are always uncontrolled:</strong> read via ref or event
          </li>
          <li>
            <strong>Third-party widgets:</strong> use a ref to integrate with non-React components
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
