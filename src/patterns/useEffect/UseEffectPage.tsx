import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { MissingDependencies } from './MissingDependencies';
import { MissingDependenciesFixed } from './MissingDependenciesFixed';
import { UnnecessaryDependencies } from './UnnecessaryDependencies';
import { UnnecessaryDependenciesFixed } from './UnnecessaryDependenciesFixed';

const missingDepsCode = `// BUG: userId is used but not in dependency array
useEffect(() => {
  setLoading(true);
  fetchUser(userId).then((data) => {
    setUser(data);
    setLoading(false);
  });
}, []); // Missing userId!`;

const missingDepsFixedCode = `// FIXED: userId included in dependency array
useEffect(() => {
  setLoading(true);
  fetchUser(userId).then((data) => {
    setUser(data);
    setLoading(false);
  });
}, [userId]); // userId is now a dependency`;

const unnecessaryDepsCode = `// BUG: setResults doesn't need to be in dependencies
useEffect(() => {
  if (query) {
    const results = search(query);
    setResults(results);
  }
}, [query, setResults]); // setResults is unnecessary!`;

const unnecessaryDepsFixedCode = `// FIXED: Only query in dependencies
useEffect(() => {
  if (query) {
    const results = search(query);
    setResults(results);
  }
}, [query]); // setState functions are stable`;

export function UseEffectPage() {
  return (
    <PatternPage
      title="useEffect Dependencies"
      description="Understanding how to specify dependencies correctly is crucial for useEffect to work as expected. Missing or unnecessary dependencies can lead to bugs and performance issues."
    >
      <ExplanationCard title="Why Dependencies Matter">
        <p className="mb-2">
          The dependency array in useEffect tells React when to re-run your effect. React compares each
          dependency to its previous value using Object.is comparison.
        </p>
        <p>
          <strong>Key Rules:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Include all values from the component scope that are used inside the effect</li>
          <li>Don't include setState functions - they're stable and never change</li>
          <li>Don't include ref values - they're mutable and don't trigger re-renders</li>
          <li>Empty array [] means the effect runs only once on mount</li>
        </ul>
      </ExplanationCard>

      <ComparisonLayout
        title="Missing Dependencies"
        description="When you use a value inside useEffect but don't include it in the dependency array, your effect will use stale data and won't update when that value changes."
        wrong={
          <div>
            <MissingDependencies />
            <CodeBlock code={missingDepsCode} title="Wrong: Missing Dependency" />
          </div>
        }
        right={
          <div>
            <MissingDependenciesFixed />
            <CodeBlock code={missingDepsFixedCode} title="Right: All Dependencies Included" />
          </div>
        }
      />

      <ExplanationCard title="The Problem with Missing Dependencies" type="warning">
        <p>
          When userId changes, the wrong example doesn't re-fetch because useEffect only runs on mount. The
          component displays stale data even though userId has changed. This is one of the most common bugs in
          React applications.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Unnecessary Dependencies"
        description="Including setState functions or other stable values in dependencies is unnecessary and can cause confusion. React's setState functions are guaranteed to be stable."
        wrong={
          <div>
            <UnnecessaryDependencies />
            <CodeBlock code={unnecessaryDepsCode} title="Wrong: Unnecessary Dependency" />
          </div>
        }
        right={
          <div>
            <UnnecessaryDependenciesFixed />
            <CodeBlock code={unnecessaryDepsFixedCode} title="Right: Only Necessary Dependencies" />
          </div>
        }
      />

      <ExplanationCard title="Why Unnecessary Dependencies Are Bad" type="info">
        <p className="mb-2">
          While including setState functions doesn't cause bugs (they're stable), it:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Makes the dependency array harder to read</li>
          <li>Suggests to other developers that the function might change</li>
          <li>Can trigger unnecessary ESLint warnings or suppressions</li>
          <li>May cause issues with custom hooks or more complex scenarios</li>
        </ul>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>Always include props, state, and other reactive values used in the effect</li>
          <li>Use the ESLint rule `react-hooks/exhaustive-deps` to catch missing dependencies</li>
          <li>If you need to exclude a value, use useRef to make it non-reactive</li>
          <li>Consider extracting functions into the effect or using useCallback</li>
          <li>For complex dependencies, consider splitting into multiple effects</li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
