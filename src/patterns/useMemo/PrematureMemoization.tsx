import { useState, useMemo } from 'react';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function PrematureMemoization() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [age, setAge] = useState(25);
  const [email, setEmail] = useState('john@example.com');

  // BUG: Memoizing trivial calculations!
  // These are so fast that the memoization overhead is worse than just recalculating

  const fullName = useMemo(() => {
    // This is nearly instant - no need to memoize!
    return `${firstName} ${lastName}`;
  }, [firstName, lastName]);

  const initials = useMemo(() => {
    // String operations are extremely fast
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }, [firstName, lastName]);

  const emailDomain = useMemo(() => {
    // String split is fast - memoization adds overhead for no benefit
    return email.split('@')[1] || '';
  }, [email]);

  const isAdult = useMemo(() => {
    // Boolean comparison is instant
    return age >= 18;
  }, [age]);

  const greeting = useMemo(() => {
    // Simple string concatenation
    return `Hello, ${fullName}!`;
  }, [fullName]);

  const userInfo = useMemo(() => {
    // Creating an object is cheap
    return {
      name: fullName,
      age,
      email,
      isAdult,
    };
  }, [fullName, age, email, isAdult]);

  return (
    <div>
      <RenderCounter name="PrematureMemoization" />

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

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Look at all the <code className="bg-red-200 px-1 rounded">useMemo</code> calls in the code</li>
              <li>Notice they're memoizing trivial operations (string concat, boolean checks)</li>
              <li>Type in the form fields - everything works fine</li>
              <li>But the code is cluttered with unnecessary optimization</li>
              <li>Each useMemo adds overhead: dependency checking, memory storage, complexity</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why it's bad:</strong> String operations, boolean checks, and simple object creation are
              <em> extremely fast</em> in JavaScript (nanoseconds). The overhead of <code className="bg-red-200 px-1 rounded">useMemo</code>
              (storing values, checking dependencies) is actually <em>slower</em> than just recalculating!
              This makes code harder to read and maintain for zero performance benefit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
