import { createContext, useContext, useState, type ReactNode } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// BUG: Everything in one context!
interface AppContextType {
  user: { name: string };
  setUser: (user: { name: string }) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ name: 'John Doe' });
  const [theme, setTheme] = useState('light');

  // BUG: New object created every render!
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

// This component only uses USER data
function UserDisplay() {
  const { user } = useAppContext();

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
  const { theme } = useAppContext();

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

function Controls() {
  const { user, setUser, theme, setTheme } = useAppContext();

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <RenderCounter name="Controls" />
      <div className="mt-2 space-y-3">
        <div>
          <div className="font-semibold mb-2">Update User:</div>
          <Button
            onClick={() => setUser({ name: user.name === 'John Doe' ? 'Jane Smith' : 'John Doe' })}
            size="sm"
          >
            Toggle User
          </Button>
        </div>
        <div>
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
    </div>
  );
}

export function SingleContext() {
  return (
    <div>
      <RenderCounter name="SingleContext" />

      <AppProvider>
        <div className="space-y-4 mt-4">
          <Controls />

          <div className="grid grid-cols-2 gap-4">
            <UserDisplay />
            <ThemeDisplay />
          </div>

          <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
            <div className="text-sm text-red-800 space-y-2">
              <div className="font-bold text-base">🐛 Try This Bug:</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Look at all the RenderCounters - they start at 2 (Strict Mode)</li>
                <li>Click "Toggle Theme" - watch ALL components re-render! 🤯</li>
                <li>UserDisplay re-renders even though it doesn't use theme!</li>
                <li>Click "Toggle User" - again, everything re-renders!</li>
                <li>ThemeDisplay re-renders even though it doesn't use user!</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-red-300">
                <strong>Why?</strong> All state is in one context. When ANY value in the context changes, React
                re-renders ALL components that call <code className="bg-red-200 px-1 rounded">useAppContext()</code>,
                even if they only use a specific part. React can't know which parts each component uses.
              </div>
              <div className="mt-2 pt-2 border-t border-red-300 text-xs">
                <strong>Performance impact:</strong> In a real app with dozens of consumers, changing one value
                re-renders the entire tree. This kills performance!
              </div>
            </div>
          </div>
        </div>
      </AppProvider>
    </div>
  );
}
