import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

interface Person {
  id: number;
  name: string;
  role: string;
}

// Individual list item component with local state
function PersonItem({ person }: { person: Person }) {
  const [note, setNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={`p-3 border-2 rounded ${isFavorite ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'}`}>
      <RenderCounter name={`PersonItem-${person.name}`} />
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-semibold">{person.name}</div>
          <div className="text-sm text-gray-600">{person.role}</div>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="text-2xl"
          title="Toggle favorite"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note..."
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
      />
    </div>
  );
}

export function IndexAsKeyFixed() {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Charlie', role: 'Manager' },
    { id: 4, name: 'Diana', role: 'Product Manager' },
  ]);

  const handleSort = () => {
    setPeople([...people].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleReverse = () => {
    setPeople([...people].reverse());
  };

  const handleShuffle = () => {
    const shuffled = [...people];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPeople(shuffled);
  };

  return (
    <div>
      <RenderCounter name="IndexAsKeyFixed" />

      <div className="space-y-4 mt-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleSort} size="sm">
            Sort A-Z
          </Button>
          <Button onClick={handleReverse} size="sm" variant="secondary">
            Reverse
          </Button>
          <Button onClick={handleShuffle} size="sm" variant="secondary">
            Shuffle
          </Button>
        </div>

        <div className="space-y-2">
          {/* FIXED: Using stable ID as key! */}
          {people.map((person) => (
            <PersonItem key={person.id} person={person} />
          ))}
        </div>

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Add a note to Alice (like "Great engineer!")</li>
              <li>Mark Bob as favorite (click the star)</li>
              <li>Click "Sort A-Z" to alphabetize the list</li>
              <li>🎉 Your note stays with Alice!</li>
              <li>Bob's star stays with Bob!</li>
              <li>Try "Reverse" or "Shuffle" - state follows the person perfectly!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> Using <code className="bg-green-200 px-1 rounded">key={`{person.id}`}</code> gives
              each component a stable identity. When you sort, React knows that the component for Alice (id: 1) is the same
              component, just in a different position. It preserves the state (your note, favorite status) with the correct
              person no matter where they appear in the list.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
