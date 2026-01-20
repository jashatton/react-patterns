import { Link } from 'react-router-dom';

const patterns = [
  {
    category: 'State Management Fundamentals',
    items: [
      {
        name: 'Object/Array Mutation',
        path: '/mutation',
        description: 'Learn why mutating state directly breaks React and how to use immutable updates.',
        difficulty: 'Beginner',
      },
      {
        name: 'Derived State Anti-pattern',
        path: '/derived-state',
        description: 'Avoid storing computed values in state and learn proper state synchronization.',
        difficulty: 'Beginner',
      },
      {
        name: 'Lifting State Issues',
        path: '/lifting-state',
        description: 'Find the right level to place state in your component tree.',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    category: 'React Hooks',
    items: [
      {
        name: 'useEffect Dependencies',
        path: '/use-effect',
        description: 'Master dependency arrays and avoid common useEffect pitfalls.',
        difficulty: 'Beginner',
      },
      {
        name: 'useCallback Usage',
        path: '/use-callback',
        description: 'Know when to use useCallback and avoid premature optimization.',
        difficulty: 'Intermediate',
      },
      {
        name: 'useMemo Usage',
        path: '/use-memo',
        description: 'Optimize expensive calculations and understand memoization trade-offs.',
        difficulty: 'Intermediate',
      },
      {
        name: 'useRef Misuse',
        path: '/use-ref',
        description: 'Choose correctly between useState and useRef for different scenarios.',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    category: 'Component Patterns',
    items: [
      {
        name: 'Arrow Functions in Components',
        path: '/arrow-functions',
        description: 'Understand how inline functions affect performance and optimization.',
        difficulty: 'Intermediate',
      },
      {
        name: 'React Context Issues',
        path: '/context',
        description: 'Prevent unnecessary re-renders when using Context API.',
        difficulty: 'Advanced',
      },
      {
        name: 'Keys in Lists',
        path: '/keys',
        description: 'Learn why keys matter and how wrong keys cause state bugs.',
        difficulty: 'Beginner',
      },
    ],
  },
];

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">React Patterns</h1>
        <p className="text-xl text-gray-700 mb-8">
          Learn common React state management patterns and anti-patterns through interactive side-by-side examples
        </p>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">10</div>
            <div className="text-sm text-gray-600">Patterns</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">20+</div>
            <div className="text-sm text-gray-600">Examples</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">Interactive</div>
            <div className="text-sm text-gray-600">Demos</div>
          </div>
        </div>
      </div>

      {/* Pattern Categories */}
      {patterns.map((category) => (
        <div key={category.category} className="mb-12">
          <h2 className="text-3xl font-bold mb-6">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((pattern) => (
              <Link
                key={pattern.path}
                to={pattern.path}
                className="block p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{pattern.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      difficultyColors[pattern.difficulty as keyof typeof difficultyColors]
                    }`}
                  >
                    {pattern.difficulty}
                  </span>
                </div>
                <p className="text-gray-600">{pattern.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-16 text-center text-gray-600">
        <p>
          Each pattern includes wrong ❌ and right ✅ examples with interactive demonstrations and code samples.
        </p>
      </div>
    </div>
  );
}
