import { useState } from 'react';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function PrematureMemoizationFixed() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [age, setAge] = useState(25);
  const [email, setEmail] = useState('john@example.com');

  // FIXED: Just calculate during render - it's fast!
  // No useMemo needed for simple operations

  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const emailDomain = email.split('@')[1] || '';
  const isAdult = age >= 18;
  const greeting = `Hello, ${fullName}!`;
  const userInfo = {
    name: fullName,
    age,
    email,
    isAdult,
  };

  return (
    <div>
      <RenderCounter name="PrematureMemoizationFixed" />

      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <div className="font-semibold mb-2">Computed Values:</div>
          <div className="text-sm space-y-1">
            <div>Full Name: {fullName}</div>
            <div>Initials: {initials}</div>
            <div>Email Domain: {emailDomain}</div>
            <div>Status: {isAdult ? 'Adult' : 'Minor'}</div>
            <div>Greeting: {greeting}</div>
            <div>User Info: {JSON.stringify(userInfo, null, 2)}</div>
          </div>
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at the clean, simple code - no useMemo clutter!</li>
              <li>Type in the form fields - everything works perfectly</li>
              <li>The calculations are instant (microseconds)</li>
              <li>Code is easier to read and maintain</li>
              <li>Actually performs better because there's no memoization overhead!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Modern JavaScript engines are incredibly fast at simple operations.
              String concatenation, array splits, boolean checks, and object creation take nanoseconds to microseconds.
              The overhead of <code className="bg-green-200 px-1 rounded">useMemo</code> (dependency checks, memory storage)
              is actually slower than just recalculating! Only use useMemo for genuinely expensive operations.
            </div>
            <div className="mt-2 pt-2 border-t border-green-300">
              <strong>When to use useMemo:</strong> Calculations that take &gt;10ms, filtering/sorting large arrays (1000+ items),
              complex transformations, or reference equality for React.memo'd children.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
