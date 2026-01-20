import { createContext, useContext, useState, type ReactNode } from 'react';
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

  // BUG: Creating new object on EVERY render!
  // Even when user hasn't changed, this is a new object reference
  return (
    <UserContext.Provider value={{ user, setUser }}>
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

export function NonMemoizedContext() {
  return (
    <div>
      <RenderCounter name="NonMemoizedContext" />

      <UserProvider>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <UserControls />
            <UserDisplay />
          </div>

          <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
            <div className="text-sm text-red-800 space-y-2">
              <div className="font-bold text-base">🐛 Try This Bug:</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Look at the RenderCounters - they start at 2 (Strict Mode)</li>
                <li>Click "Increment Unrelated Count" in the yellow box</li>
                <li>Watch UserControls and UserDisplay BOTH re-render! 🤯</li>
                <li>The user data didn't change at all!</li>
                <li>Keep clicking - every click re-renders all context consumers!</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-red-300">
                <strong>Why?</strong> The provider component re-renders when{' '}
                <code className="bg-red-200 px-1 rounded">unrelatedCount</code> changes. Each re-render creates a
                new object literal <code className="bg-red-200 px-1 rounded">{`{ user, setUser }`}</code>. Even
                though user and setUser are the same, it's a NEW object reference. React compares context values
                by reference, sees it changed, and re-renders all consumers!
              </div>
              <div className="mt-2 pt-2 border-t border-red-300 text-xs">
                <strong>Real-world impact:</strong> Any state change in your provider (loading states, error
                messages, etc.) re-renders ALL consumers, even if the main data didn't change. This is extremely
                common and kills performance!
              </div>
            </div>
          </div>
        </div>
      </UserProvider>
    </div>
  );
}
