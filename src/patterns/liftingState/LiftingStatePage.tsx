import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { StateTooHigh } from './StateTooHigh';
import { StateTooHighFixed } from './StateTooHighFixed';
import { StateNotLiftedEnough } from './StateNotLiftedEnough';
import { StateNotLiftedEnoughFixed } from './StateNotLiftedEnoughFixed';

const stateTooHighCode = `// BUG: All state at the top level
function App() {
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');

  return (
    <>
      <CounterSection count={count} onIncrement={() => setCount(count + 1)} />
      <SearchSection query={query} onQueryChange={setQuery} />
      <StaticSection />
    </>
  );
}

// All children re-render when ANY state changes!`;

const stateTooHighFixedCode = `// FIXED: State local to each component
function CounterSection() {
  const [count, setCount] = useState(0);
  // ... only this re-renders when count changes
}

function SearchSection() {
  const [query, setQuery] = useState('');
  // ... only this re-renders when query changes
}

function App() {
  return (
    <>
      <CounterSection />
      <SearchSection />
      <StaticSection />
    </>
  );
}`;

const stateNotLiftedCode = `// BUG: Duplicate state in siblings
function CartTotal() {
  const [itemCount, setItemCount] = useState(0);
  return <div>Items: {itemCount}</div>;
}

function ProductList() {
  const [itemCount, setItemCount] = useState(0);
  const addToCart = () => setItemCount(itemCount + 1);
  return <button onClick={addToCart}>Add to Cart</button>;
}

// CartTotal and ProductList have separate state - they never sync!`;

const stateNotLiftedFixedCode = `// FIXED: State lifted to common parent
function ShoppingApp() {
  const [itemCount, setItemCount] = useState(0);

  return (
    <>
      <CartTotal itemCount={itemCount} />
      <ProductList itemCount={itemCount} onAddToCart={() => setItemCount(itemCount + 1)} />
    </>
  );
}

// Both components share the same state - always in sync!`;

export function LiftingStatePage() {
  return (
    <PatternPage
      title="Lifting State"
      description="Finding the right level for state is crucial. State that's too high causes unnecessary re-renders. State that's not lifted enough causes sync bugs. Learn to find the sweet spot."
    >
      <ExplanationCard title="The Goldilocks Principle of State">
        <p className="mb-2">
          <strong>Too High:</strong> State lives above components that use it → Causes unnecessary re-renders
        </p>
        <p className="mb-2">
          <strong>Too Low:</strong> State duplicated across siblings → Causes sync bugs
        </p>
        <p>
          <strong>Just Right:</strong> State lives at the lowest common ancestor of all components that need it
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="State Lifted Too High"
        description="When state is lifted too high in the component tree, components re-render unnecessarily. Keep state as local as possible - only lift it when multiple components need to share it."
        wrong={
          <div>
            <StateTooHigh />
            <CodeBlock code={stateTooHighCode} title="Wrong: All State at Top Level" />
          </div>
        }
        right={
          <div>
            <StateTooHighFixed />
            <CodeBlock code={stateTooHighFixedCode} title="Right: Local State Where Needed" />
          </div>
        }
      />

      <ExplanationCard title="Why State Too High Is a Problem" type="warning">
        <p className="mb-2">
          When you put all state at the top level (sometimes called "prop drilling"), every state change
          causes the entire tree to re-render. This wastes performance because components that don't use
          the changed state still have to re-render.
        </p>
        <p className="mb-2">
          <strong>Common causes:</strong> Premature optimization, overuse of global state, not understanding
          React's rendering model, or copying examples that lift state higher than necessary.
        </p>
        <p>
          <strong>The fix:</strong> Start with state in the component that needs it. Only lift state when
          you discover multiple components need to share it. This is "lift state on demand" rather than
          "lift everything just in case."
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="State Not Lifted Enough"
        description="When siblings need to share state but each has their own copy, they get out of sync. The classic sign is trying to synchronize state with useEffect - that's a code smell! Instead, lift state to the common parent."
        wrong={
          <div>
            <StateNotLiftedEnough />
            <CodeBlock code={stateNotLiftedCode} title="Wrong: Duplicate State in Siblings" />
          </div>
        }
        right={
          <div>
            <StateNotLiftedEnoughFixed />
            <CodeBlock code={stateNotLiftedFixedCode} title="Right: State Lifted to Common Parent" />
          </div>
        }
      />

      <ExplanationCard title="Why Not Lifting Enough Causes Bugs" type="warning">
        <p className="mb-2">
          When sibling components each have their own copy of state, they're completely independent. Updating
          one doesn't affect the other. This causes sync bugs where features that should work together are
          broken.
        </p>
        <p className="mb-2">
          <strong>Warning sign:</strong> If you're using useEffect to sync state between components, you're
          doing it wrong! That's a code smell that indicates state should be lifted instead.
        </p>
        <p>
          <strong>The fix:</strong> Identify the lowest common ancestor of all components that need the state,
          and move the state there. Pass it down as props. This is "single source of truth."
        </p>
      </ExplanationCard>

      <ExplanationCard title="Decision Framework" type="info">
        <div className="space-y-3">
          <div>
            <strong>Ask yourself these questions:</strong>
            <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
              <li>Does more than one component need this state?</li>
              <li>If yes, what's their lowest common ancestor?</li>
              <li>If no, keep the state local to the component that needs it</li>
            </ol>
          </div>
          <div className="pt-3 border-t border-blue-200">
            <strong>Red flags:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Using useEffect to sync state between components (lift state instead!)</li>
              <li>Passing state through many layers of components that don't use it (consider Context)</li>
              <li>All state living in App.tsx (keep state local when possible)</li>
              <li>Duplicate useState calls for the same data in different components (lift state!)</li>
            </ul>
          </div>
        </div>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>Start with state in the component that needs it</li>
          <li>Only lift state when you discover multiple components need to share it</li>
          <li>Lift to the lowest common ancestor - no higher!</li>
          <li>Use RenderCounter components to verify your optimization is working</li>
          <li>Consider Context API or state management libraries for deeply nested shared state</li>
          <li>
            Remember: It's better to lift state "just in time" than "just in case"
          </li>
        </ul>
      </ExplanationCard>

      <ExplanationCard title="When to Use Context Instead">
        <p className="mb-2">
          If you're passing state through many layers of components (prop drilling), consider using React
          Context instead:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Theme data (dark/light mode)</li>
          <li>User authentication state</li>
          <li>Language/localization settings</li>
          <li>Shopping cart in an e-commerce app</li>
        </ul>
        <p className="mt-2">
          But for state shared between 2-3 components, lifting state is simpler than Context!
        </p>
      </ExplanationCard>
    </PatternPage>
  );
}
