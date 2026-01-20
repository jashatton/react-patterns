import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { UseStateForNonRendering } from './UseStateForNonRendering';
import { UseStateForNonRenderingFixed } from './UseStateForNonRenderingFixed';
import { UseRefForRendering } from './UseRefForRendering';
import { UseRefForRenderingFixed } from './UseRefForRenderingFixed';

const useStateCode = `// BUG: Using useState for values that don't affect rendering
const [renderCount, setRenderCount] = useState(0);

useEffect(() => {
  setRenderCount(prev => prev + 1); // Causes infinite loop!
});

// This triggers a re-render every time, creating an infinite loop`;

const useRefCode = `// FIXED: Using useRef for values that don't affect rendering
const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1; // No re-render, just tracking
});

// Updates the value without triggering a re-render`;

const useRefForRenderingCode = `// BUG: Using useRef for values that should trigger re-renders
const count = useRef(0);

const increment = () => {
  count.current += 1; // Updates but doesn't re-render!
  // UI shows stale value
};

return <div>Count: {count.current}</div>;`;

const useStateForRenderingCode = `// FIXED: Using useState for values that should trigger re-renders
const [count, setCount] = useState(0);

const increment = () => {
  setCount(prev => prev + 1); // Updates and re-renders
  // UI shows current value
};

return <div>Count: {count}</div>;`;

export function UseRefPage() {
  return (
    <PatternPage
      title="useRef vs useState"
      description="Understanding when to use useRef vs useState is crucial. useRef is for values that persist between renders but don't trigger re-renders, while useState is for values that should update the UI."
    >
      <ExplanationCard title="When to Use Each Hook">
        <p className="mb-2">
          <strong>useState:</strong> Use when the value changes should trigger a re-render and update the UI.
        </p>
        <p className="mb-2">
          <strong>useRef:</strong> Use when you need to persist a value between renders but changes shouldn't
          trigger re-renders.
        </p>
        <p>
          <strong>Key Difference:</strong> Updating useState causes a re-render; updating useRef.current does not.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Using useState for Non-Rendering Values"
        description="Using useState for values that don't affect the UI wastes performance and can cause infinite loops. Use useRef instead for tracking metadata like render counts, timers, or previous values."
        wrong={
          <div>
            <UseStateForNonRendering />
            <CodeBlock code={useStateCode} title="Wrong: useState for Non-Rendering Value" />
          </div>
        }
        right={
          <div>
            <UseStateForNonRenderingFixed />
            <CodeBlock code={useRefCode} title="Right: useRef for Non-Rendering Value" />
          </div>
        }
      />

      <ExplanationCard title="The Problem with useState for Non-Rendering Values" type="warning">
        <p className="mb-2">
          When you use useState to track a render count inside useEffect, updating the count triggers a
          re-render, which runs the effect again, which updates the count, which triggers another re-render...
          creating an infinite loop.
        </p>
        <p>
          useRef solves this because updating <code>ref.current</code> doesn't trigger a re-render. The value
          persists between renders but stays "invisible" to React's rendering system.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Using useRef for Rendering Values"
        description="Using useRef for values that should display in the UI is a common mistake. Changes to ref.current don't trigger re-renders, so the UI shows stale data."
        wrong={
          <div>
            <UseRefForRendering />
            <CodeBlock code={useRefForRenderingCode} title="Wrong: useRef for Rendering Value" />
          </div>
        }
        right={
          <div>
            <UseRefForRenderingFixed />
            <CodeBlock code={useStateForRenderingCode} title="Right: useState for Rendering Value" />
          </div>
        }
      />

      <ExplanationCard title="Why useRef Doesn't Update the UI" type="info">
        <p className="mb-2">
          React only re-renders when state changes or props change. Updating a ref's <code>.current</code>{' '}
          property is just a regular JavaScript mutation—React has no way to know it happened.
        </p>
        <p>
          Think of refs as a "side pocket" where you can store values that React doesn't track. Great for DOM
          elements, timers, and previous values, but not for data you want to display.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Common Use Cases" type="success">
        <div className="space-y-3">
          <div>
            <strong>Use useRef for:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>DOM element references</li>
              <li>Storing timeout/interval IDs</li>
              <li>Tracking previous values (without triggering re-renders)</li>
              <li>Tracking render count or component lifecycle metadata</li>
              <li>Storing mutable values that don't affect rendering</li>
            </ul>
          </div>
          <div>
            <strong>Use useState for:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Any value displayed in the UI</li>
              <li>Form inputs and controlled components</li>
              <li>Conditional rendering logic</li>
              <li>Data that changes based on user interaction</li>
            </ul>
          </div>
        </div>
      </ExplanationCard>

      <ExplanationCard title="Best Practices">
        <ul className="list-disc list-inside space-y-1">
          <li>Ask yourself: "Does changing this value need to update what the user sees?"</li>
          <li>If yes, use useState. If no, use useRef.</li>
          <li>Never read ref.current during render—it may cause inconsistencies</li>
          <li>Remember: refs are for "escape hatches" outside React's rendering cycle</li>
          <li>Use the RenderCounter component to verify re-render behavior</li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
