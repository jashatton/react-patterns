import { useState, useEffect } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function UnnecessaryState() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [fullName, setFullName] = useState('John Doe'); // BUG: Unnecessary state!
  const [count, setCount] = useState(0);

  // BUG: Need to keep fullName in sync manually
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return (
    <div>
      <RenderCounter name="UnnecessaryState" />

      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="mb-2 font-semibold">Computed Values:</div>
          <div className="text-sm space-y-1">
            <div>
              <strong>Full Name:</strong> {fullName}
            </div>
            <div>
              <strong>Initials:</strong> {firstName[0]}{lastName[0]}
            </div>
            <div>
              <strong>Character Count:</strong> {firstName.length + lastName.length}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setCount(count + 1)}>
            Unrelated State: {count}
          </Button>
        </div>

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the RenderCounter - type a name and watch it increment twice per keystroke</li>
              <li>Check the console - you'll see the useEffect running after every name change</li>
              <li>The "Full Name" could be calculated but is stored as state instead</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> Storing <code className="bg-red-200 px-1 rounded">fullName</code> in state is redundant since
              it can be calculated from <code className="bg-red-200 px-1 rounded">firstName + lastName</code>.
              The useEffect adds complexity, causes extra re-renders (two setState calls), and creates a risk of
              getting out of sync if the effect is modified incorrectly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
