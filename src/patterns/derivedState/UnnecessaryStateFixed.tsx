import {useState} from 'react';
import {Button} from '../../components/shared/Button';
import {RenderCounter} from '../../components/shared/RenderCounter';

export function UnnecessaryStateFixed() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [count, setCount] = useState(0);

  // FIXED: Calculate during render - no state needed!
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0]}${lastName[0]}`;
  const characterCount = firstName.length + lastName.length;

  return (
    <div>
      <RenderCounter name="UnnecessaryStateFixed"/>

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
              <strong>Initials:</strong> {initials}
            </div>
            <div>
              <strong>Character Count:</strong> {characterCount}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setCount(count + 1)}>
            Unrelated State: {count}
          </Button>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the RenderCounter - type a name and it only increments once per keystroke! 🎉</li>
              <li>The code is simpler - no useEffect needed</li>
              <li>All computed values (fullName, initials, characterCount) are calculated during render</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Instead of storing <code
              className="bg-green-200 px-1 rounded">fullName</code> in state,
              we calculate it: <code className="bg-green-200 px-1 rounded">
              {`const fullName = \`\${firstName} \${lastName}\``}
            </code>.
              This is always in sync, causes fewer re-renders (only one setState), and eliminates the useEffect
              entirely.
              Simple calculations like this are fast enough that there's no performance concern.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
