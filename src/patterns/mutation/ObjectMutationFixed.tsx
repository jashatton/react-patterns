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

export function ObjectMutationFixed() {
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
    },
  });

  const handleUpdateName = () => {
    // FIXED: Create new object with spread operator
    setUser((current) => ({
      ...current,
      name: 'Jane Smith',
    }));
  };

  const handleUpdateCity = () => {
    // FIXED: Create new nested object
    setUser((current) => ({
      ...current,
      address: {
        ...current.address,
        city: 'Los Angeles',
      },
    }));
  };

  const handleUpdateMultiple = () => {
    // Can update multiple fields at once
    setUser((current) => ({
      ...current,
      name: 'Bob Johnson',
      email: 'bob@example.com',
    }));
  };

  return (
    <div>
      <RenderCounter name="ObjectMutationFixed" />

      <div className="space-y-4 mt-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleUpdateName}>Update Name</Button>
          <Button onClick={handleUpdateCity}>Update City</Button>
          <Button onClick={handleUpdateMultiple} variant="secondary">
            Update Multiple
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

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Update Name" - it changes immediately to Jane Smith! 🎉</li>
              <li>Click "Update City" - instantly shows Los Angeles</li>
              <li>Try "Update Multiple" - both name and email update at once</li>
              <li>No force re-render needed - everything just works</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Using spread syntax <code className="bg-green-200 px-1 rounded">{`{...user, name: 'Jane'}`}</code> creates
              a NEW object with a different reference. For nested objects, we spread both levels:
              <code className="bg-green-200 px-1 rounded">{`{...user, address: {...user.address, city: 'LA'}}`}</code>.
              React sees the new reference and re-renders.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
