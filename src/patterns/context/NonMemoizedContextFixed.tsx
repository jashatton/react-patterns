import { createContext, useContext, useState, type ReactNode, useMemo } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

interface UserContextType {
  user: { name: string };
  setUser: (user: { name: string }) => void;
}

const UserContext = createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ name: 'John Doe' });
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  // FIXED: Memoize the context value!
  // Only creates a new object when 'user' actually changes
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={value}>
      <div>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <div className="text-sm">
            <strong>Provider State:</strong> Unrelated count = {unrelatedCount}
          </div>
          <Button onClick={() => setUnrelatedCount(unrelatedCount + 1)} size="sm" variant="secondary">
            Increment Unrelated Count
          </Button>
          <div className="text-xs text-yellow-800 mt-2">
            This state has nothing to do with user, but it's in the same provider component
          </div>
        </div>
        {children}
      </div>
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

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

export function NonMemoizedContextFixed() {
  return (
    <div>
      <RenderCounter name="NonMemoizedContextFixed" />

      <UserProvider>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <UserControls />
            <UserDisplay />
          </div>

          <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
            <div className="text-sm text-green-800 space-y-2">
              <div className="font-bold text-base">✅ Try This Fix:</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Look at the RenderCounters - they start at 2 (Strict Mode)</li>
                <li>Click "Increment Unrelated Count" in the yellow box multiple times</li>
                <li>UserControls and UserDisplay stay at 2 - no re-renders! ✨</li>
                <li>Now click "Toggle User" - both components re-render as expected</li>
                <li>Only actual user changes trigger re-renders, not unrelated state!</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-green-300">
                <strong>Why it works:</strong> Using{' '}
                <code className="bg-green-200 px-1 rounded">useMemo</code> with{' '}
                <code className="bg-green-200 px-1 rounded">user</code> in the dependency array means the same
                object reference is returned until user actually changes. When unrelatedCount updates, the
                provider re-renders but useMemo returns the SAME memoized object, so context consumers don't
                re-render!
              </div>
              <div className="mt-2 pt-2 border-t border-green-300 text-xs">
                <strong>Rule:</strong> Always memoize context values that are objects or arrays. Only recreate
                them when their dependencies actually change.
              </div>
            </div>
          </div>
        </div>
      </UserProvider>
    </div>
  );
}
