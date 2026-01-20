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

export function MissingDependenciesFixed() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // FIXED: userId included in dependency array
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]); // Fixed: userId is now in dependencies!

  return (
    <div>
      <RenderCounter name="MissingDepsFixed" />

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

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Wait for User 1 data to load</li>
              <li>Click on User 2 or User 3 button</li>
              <li>Watch it fetch new data! 🎉</li>
              <li>The displayed user information now matches the selected user</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> By including <code className="bg-green-200 px-1 rounded">[userId]</code> in the dependency array,
              the effect re-runs whenever userId changes. React fetches the correct user data each time.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
