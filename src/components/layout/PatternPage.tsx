import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PatternPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function PatternPage({ title, description, children }: PatternPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{title}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-700">{description}</p>
      </div>

      {/* Pattern Examples */}
      <div>{children}</div>
    </div>
  );
}
