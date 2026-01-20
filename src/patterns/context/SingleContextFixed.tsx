import { createContext, useContext, useState, type ReactNode, useMemo } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// FIXED: Split into separate contexts!
interface UserContextType {
  user: { name: string };
  setUser: (user: { name: string }) => void;
}

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);
const ThemeContext = createContext<ThemeContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ name: 'John Doe' });

  // FIXED: Memoize the value
  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');

  // FIXED: Memoize the value
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// This component only uses USER data
function UserDisplay() {
  const { user } = useUser();

  return (
    <div className="p-4 bg-white border border-gray-300 rounded">
      <RenderCounter name="UserDisplay" />
      <div className="mt-2">
        <div className="font-semibold">User Info:</div>
        <div className="text-sm">{user.name}</div>
      </div>
    </div>
  );
}

// This component only uses THEME data
function ThemeDisplay() {
  const { theme } = useTheme();

  return (
    <div className="p-4 bg-white border border-gray-300 rounded">
      <RenderCounter name="ThemeDisplay" />
      <div className="mt-2">
        <div className="font-semibold">Current Theme:</div>
        <div className="text-sm capitalize">{theme}</div>
      </div>
    </div>
  );
}

function UserControls() {
  const { user, setUser } = useUser();

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <RenderCounter name="UserControls" />
      <div className="mt-2">
        <div className="font-semibold mb-2">Update User:</div>
        <Button
          onClick={() => setUser({ name: user.name === 'John Doe' ? 'Jane Smith' : 'John Doe' })}
          size="sm"
        >
          Toggle User
        </Button>
      </div>
    </div>
  );
}

function ThemeControls() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <RenderCounter name="ThemeControls" />
      <div className="mt-2">
        <div className="font-semibold mb-2">Update Theme:</div>
        <Button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          variant="secondary"
          size="sm"
        >
          Toggle Theme
        </Button>
      </div>
    </div>
  );
}

export function SingleContextFixed() {
  return (
    <div>
      <RenderCounter name="SingleContextFixed" />

      <UserProvider>
        <ThemeProvider>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <UserControls />
              <ThemeControls />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <UserDisplay />
              <ThemeDisplay />
            </div>

            <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
              <div className="text-sm text-green-800 space-y-2">
                <div className="font-bold text-base">✅ Try This Fix:</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Look at all the RenderCounters - they start at 2 (Strict Mode)</li>
                  <li>Click "Toggle Theme" - only ThemeControls and ThemeDisplay re-render! ✨</li>
                  <li>UserDisplay and UserControls stay at 2 - no unnecessary re-renders!</li>
                  <li>Click "Toggle User" - only user-related components re-render!</li>
                  <li>ThemeDisplay and ThemeControls stay unchanged!</li>
                </ol>
                <div className="mt-3 pt-3 border-t border-green-300">
                  <strong>Why it works:</strong> By splitting into separate contexts (
                  <code className="bg-green-200 px-1 rounded">UserContext</code> and{' '}
                  <code className="bg-green-200 px-1 rounded">ThemeContext</code>), each component only
                  subscribes to the data it needs. Theme changes don't affect user consumers and vice versa!
                </div>
                <div className="mt-2 pt-2 border-t border-green-300 text-xs">
                  <strong>Bonus:</strong> We also memoized the context values with{' '}
                  <code className="bg-green-200 px-1 rounded">useMemo</code> to prevent creating new objects on
                  every render.
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </UserProvider>
    </div>
  );
}
