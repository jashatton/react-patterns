import { useState, useEffect } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

interface User {
  id: number;
  name: string;
  email: string;
}

// Simulate API call
const fetchUser = (userId: number): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
      });
    }, 500);
  });
};

export function MissingDependencies() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // BUG: Missing userId in dependency array
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []); // Bug: userId is missing!

  return (
    <div>
      <RenderCounter name="MissingDeps" />

      <div className="space-y-4 mt-4">
        <div className="flex gap-2">
          <Button onClick={() => setUserId(1)} variant={userId === 1 ? 'primary' : 'secondary'}>
            User 1
          </Button>
          <Button onClick={() => setUserId(2)} variant={userId === 2 ? 'primary' : 'secondary'}>
            User 2
          </Button>
          <Button onClick={() => setUserId(3)} variant={userId === 3 ? 'primary' : 'secondary'}>
            User 3
          </Button>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <div>
              <div>
                <strong>Current User ID:</strong> {userId}
              </div>
              <div>
                <strong>Displayed User:</strong> {user.name}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
            </div>
          ) : (
            <div>No user data</div>
          )}
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Wait for User 1 data to load</li>
              <li>Click on User 2 or User 3 button</li>
              <li>Notice the displayed data doesn't update! 🤯</li>
              <li>User 1's data is still shown even though you selected a different user</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> The useEffect has an empty dependency array <code className="bg-red-200 px-1 rounded">[]</code>,
              so it only runs once on mount. When userId changes, the effect doesn't re-run to fetch new data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
