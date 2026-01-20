import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Child component - same as wrong version but will be used WITH key prop
function UserActivityCounter({ userId }: { userId: number }) {
  // Local state that WILL reset when userId changes (thanks to key prop!)
  const [activityCount, setActivityCount] = useState(0);
  const [lastAction, setLastAction] = useState('None');

  const handleActivity = (action: string) => {
    setActivityCount((prev) => prev + 1);
    setLastAction(action);
  };

  return (
    <div className="p-4 border-2 border-green-300 rounded bg-green-50">
      <RenderCounter name="UserActivityCounter" />
      <div className="mt-2 space-y-2">
        <div className="text-lg font-bold">
          Viewing User {userId}
        </div>
        <div className="text-3xl font-bold text-blue-600">
          Activity Count: {activityCount}
        </div>
        <div className="text-sm text-gray-600">
          Last Action: {lastAction}
        </div>
        <div className="flex gap-2 mt-3">
          <Button onClick={() => handleActivity('Liked')} size="sm">
            👍 Like
          </Button>
          <Button onClick={() => handleActivity('Commented')} size="sm">
            💬 Comment
          </Button>
          <Button onClick={() => handleActivity('Shared')} size="sm">
            🔄 Share
          </Button>
        </div>
      </div>
    </div>
  );
}

// Alternative: Component that doesn't need state reset (uses props directly)
function UserInfoDisplay({ userId }: { userId: number }) {
  // FIXED: Just use the prop directly - calculate everything during render
  const userData = `User ${userId} data`;
  const userColor = ['bg-blue-100', 'bg-purple-100', 'bg-pink-100'][userId - 1] || 'bg-gray-100';

  return (
    <div className={`p-4 border-2 border-gray-300 rounded ${userColor}`}>
      <RenderCounter name="UserInfoDisplay" />
      <div className="mt-2 space-y-1 text-sm">
        <div className="text-lg font-bold">
          User {userId}
        </div>
        <div>
          <strong>User Data:</strong> {userData}
        </div>
        <div className="text-xs text-gray-600 mt-2">
          No local state needed - everything is derived from props!
        </div>
      </div>
    </div>
  );
}

export function SyncingPropsToStateFixed() {
  const [selectedUserId, setSelectedUserId] = useState(1);

  return (
    <div>
      <RenderCounter name="SyncingPropsToStateFixed" />

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select User:</label>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedUserId(1)} variant={selectedUserId === 1 ? 'primary' : 'secondary'}>
              User 1
            </Button>
            <Button onClick={() => setSelectedUserId(2)} variant={selectedUserId === 2 ? 'primary' : 'secondary'}>
              User 2
            </Button>
            <Button onClick={() => setSelectedUserId(3)} variant={selectedUserId === 3 ? 'primary' : 'secondary'}>
              User 3
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium">Component with no local state (works fine):</div>
          <UserInfoDisplay userId={selectedUserId} />
        </div>

        <div>
          <div className="mb-2 text-sm font-medium">Component with local state (WITH key prop - FIXED!):</div>
          <UserActivityCounter key={selectedUserId} userId={selectedUserId} />
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click some activity buttons for User 1</li>
              <li>Switch to User 2</li>
              <li>Counter resets to 0! 🎉</li>
              <li>Each user has their own fresh state</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> The <code className="bg-green-200 px-1 rounded">key={selectedUserId}</code> prop tells React
              to create a NEW component instance when userId changes. The old instance is unmounted with its state,
              and a new instance is mounted with fresh initial state.
            </div>
            <div className="mt-2 pt-2 border-t border-green-300">
              <strong>When to use key:</strong> When you have local state that should be reset when a prop changes.
              If you don't need local state, use Option 1 instead (derive everything from props).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
