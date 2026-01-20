import { PatternPage } from '../../components/layout/PatternPage';
import { ComparisonLayout } from '../../components/layout/ComparisonLayout';
import { ExplanationCard } from '../../components/layout/ExplanationCard';
import { CodeBlock } from '../../components/layout/CodeBlock';
import { SingleContext } from './SingleContext';
import { SingleContextFixed } from './SingleContextFixed';
import { NonMemoizedContext } from './NonMemoizedContext';
import { NonMemoizedContextFixed } from './NonMemoizedContextFixed';

const singleContextCode = `// BUG: Everything in one context
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'John' });
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// BUG: Changes to theme re-render ALL consumers, even if they only use user!`;

const splitContextCode = `// FIXED: Split into separate contexts
const UserContext = createContext();
const ThemeContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'John' });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Now theme changes only re-render theme consumers!`;

const nonMemoizedCode = `// BUG: Creating new object on every render
function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'John' });

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

// Every render creates a new { user, setUser } object!`;

const memoizedCode = `// FIXED: Memoize the context value
function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'John' });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Same object reference until user changes!`;

export function ContextPage() {
  return (
    <PatternPage
      title="React Context Issues"
      description="React Context is powerful but easy to misuse. Common mistakes include putting too much in one context and not memoizing context values, both causing unnecessary re-renders."
    >
      <ExplanationCard title="Common Context Performance Issues">
        <p className="mb-2">
          Context makes it easy to share state, but changes to context values trigger re-renders in ALL components
          that consume that context, even if they don't use the changed value.
        </p>
        <p>
          <strong>Two main problems:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <strong>Single large context:</strong> Putting unrelated state together means updating one piece
            re-renders all consumers
          </li>
          <li>
            <strong>Non-memoized values:</strong> Creating new objects on every render causes all consumers to
            re-render even when nothing changed
          </li>
        </ul>
      </ExplanationCard>

      <ComparisonLayout
        title="Single Context for Everything"
        description="Putting all your app state in one context is convenient but causes performance issues. When any value changes, ALL consumers re-render, even if they only use unrelated values."
        wrong={
          <div>
            <SingleContext />
            <CodeBlock code={singleContextCode} title="Wrong: One Context for Everything" />
          </div>
        }
        right={
          <div>
            <SingleContextFixed />
            <CodeBlock code={splitContextCode} title="Right: Split Contexts by Concern" />
          </div>
        }
      />

      <ExplanationCard title="Why Single Context Hurts Performance" type="warning">
        <p className="mb-2">
          When you put user data and theme in the same context, changing the theme re-renders the UserDisplay
          component even though it doesn't use theme. React can't know which parts of the context value each
          component uses, so it re-renders all consumers.
        </p>
        <p>
          Splitting into separate contexts means each component only subscribes to the data it actually needs.
        </p>
      </ExplanationCard>

      <ComparisonLayout
        title="Non-Memoized Context Value"
        description="Creating a new object or array for the context value on every render causes all consumers to re-render, even when the data hasn't actually changed."
        wrong={
          <div>
            <NonMemoizedContext />
            <CodeBlock code={nonMemoizedCode} title="Wrong: New Object Every Render" />
          </div>
        }
        right={
          <div>
            <NonMemoizedContextFixed />
            <CodeBlock code={memoizedCode} title="Right: Memoized Context Value" />
          </div>
        }
      />

      <ExplanationCard title="Why Non-Memoized Values Cause Re-renders" type="info">
        <p className="mb-2">
          Every time the provider component re-renders, it creates a new object literal for the context value.
          Even if the data inside is the same, it's a different object reference. React compares context values
          by reference, sees a new object, and re-renders all consumers.
        </p>
        <p>
          Using <code>useMemo</code> ensures the same object reference is used until dependencies actually change.
        </p>
      </ExplanationCard>

      <ExplanationCard title="Best Practices" type="success">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Split contexts:</strong> Group related state together, but separate unrelated concerns
          </li>
          <li>
            <strong>Always memoize:</strong> Use <code>useMemo</code> for context values that are objects or arrays
          </li>
          <li>
            <strong>Keep contexts small:</strong> Don't put your entire app state in context
          </li>
          <li>
            <strong>Consider alternatives:</strong> For frequently changing values, consider component composition
            or state management libraries
          </li>
          <li>
            <strong>Use React DevTools:</strong> Profile to see which components re-render when context changes
          </li>
        </ul>
      </ExplanationCard>
    </PatternPage>
  );
}
