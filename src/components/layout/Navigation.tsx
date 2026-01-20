import { Link, useLocation } from 'react-router-dom';

const patterns = [
  { name: 'useEffect', path: '/use-effect', label: 'useEffect Dependencies' },
  { name: 'mutation', path: '/mutation', label: 'Object/Array Mutation' },
  { name: 'derived-state', path: '/derived-state', label: 'Derived State' },
  { name: 'keys', path: '/keys', label: 'Keys in Lists' },
  { name: 'useCallback', path: '/use-callback', label: 'useCallback' },
  { name: 'useMemo', path: '/use-memo', label: 'useMemo' },
  { name: 'arrow-functions', path: '/arrow-functions', label: 'Arrow Functions' },
  { name: 'context', path: '/context', label: 'React Context' },
  { name: 'useRef', path: '/use-ref', label: 'useRef' },
  { name: 'lifting-state', path: '/lifting-state', label: 'Lifting State' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
            React Patterns
          </Link>

          <div className="hidden md:flex space-x-1">
            {patterns.map((pattern) => (
              <Link
                key={pattern.path}
                to={pattern.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === pattern.path
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {pattern.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Simple version for now */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {patterns.map((pattern) => (
            <Link
              key={pattern.path}
              to={pattern.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === pattern.path
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {pattern.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
