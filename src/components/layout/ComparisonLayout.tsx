import { type ReactNode } from 'react';

interface ComparisonLayoutProps {
  wrong: ReactNode;
  right: ReactNode;
  title: string;
  description: string;
}

export function ComparisonLayout({ wrong, right, title, description }: ComparisonLayoutProps) {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wrong Example */}
        <div className="flex flex-col">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              Wrong ❌
            </span>
          </div>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 flex-1">
            {wrong}
          </div>
        </div>

        {/* Right Example */}
        <div className="flex flex-col">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Right ✅
            </span>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 flex-1">
            {right}
          </div>
        </div>
      </div>
    </div>
  );
}
