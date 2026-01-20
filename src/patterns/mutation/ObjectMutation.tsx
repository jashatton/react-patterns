import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

interface User {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
  };
}

export function ObjectMutation() {
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
    },
  });
  const [_forceUpdate, setForceUpdate] = useState(0);

  const handleUpdateName = () => {
    // BUG: Mutating the object directly!
    user.name = 'Jane Smith';
    setUser(user); // Same reference, no re-render
    console.log('User after mutation:', user);
  };

  const handleUpdateCity = () => {
    // BUG: Mutating nested object!
    user.address.city = 'Los Angeles';
    setUser(user); // Same reference, no re-render
    console.log('User after nested mutation:', user);
  };

  const handleForceRerender = () => {
    setForceUpdate(prev => prev + 1);
  };

  return (
    <div>
      <RenderCounter name="ObjectMutation" />

      <div className="space-y-4 mt-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleUpdateName}>Update Name</Button>
          <Button onClick={handleUpdateCity}>Update City</Button>
          <Button onClick={handleForceRerender} variant="secondary">
            Force Re-render
          </Button>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="mb-2 font-semibold">User Info:</div>
          <div className="space-y-1 text-sm">
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Street:</strong> {user.address.street}
            </div>
            <div>
              <strong>City:</strong> {user.address.city}
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Update Name" - the name stays "John Doe" 🤯</li>
              <li>Click "Update City" - the city stays "New York"</li>
              <li>Check the console - the object IS being modified</li>
              <li>Click "Force Re-render" to reveal the actual values</li>
              <li>Suddenly Jane Smith lives in Los Angeles!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> The code directly mutates the object with <code className="bg-red-200 px-1 rounded">user.name = ...</code>,
              then calls <code className="bg-red-200 px-1 rounded">setUser(user)</code> with the same object reference.
              React uses reference equality to detect changes. Same reference = no re-render, even though the data changed!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
