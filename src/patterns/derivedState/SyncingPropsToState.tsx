import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// Component that doesn't need state reset (works fine without key prop)
function UserInfoDisplay({ userId }: { userId: number }) {
  // Just use the prop directly - calculate everything during render
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
          ✅ This works fine - no local state, so no key needed
        </div>
      </div>
    </div>
  );
}

// Child component WITHOUT key prop - BUG: State persists across prop changes!
function UserActivityCounter({ userId }: { userId: number }) {
  // Local state that should reset when userId changes, but it doesn't!
  const [activityCount, setActivityCount] = useState(0);
  const [lastAction, setLastAction] = useState('None');

  const handleActivity = (action: string) => {
    setActivityCount((prev) => prev + 1);
    setLastAction(action);
  };

  return (
    <div className="p-4 border-2 border-red-300 rounded bg-red-50">
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

export function SyncingPropsToState() {
  const [selectedUserId, setSelectedUserId] = useState(1);

  return (
    <div>
      <RenderCounter name="SyncingPropsToState" />

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
          <div className="mb-2 text-sm font-medium">Component with local state (WITHOUT key prop - BUG!):</div>
          <UserActivityCounter userId={selectedUserId} />
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>The top component works fine (no local state)</li>
              <li>Click some activity buttons for User 1 in the bottom component</li>
              <li>Switch to User 2</li>
              <li>Notice the counter doesn't reset! 🤯</li>
              <li>The activity count from User 1 is shown for User 2</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> React reuses the same component instance when you don't change the key.
              The local state persists even though the userId prop changed!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
