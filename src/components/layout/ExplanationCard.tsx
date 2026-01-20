import { type ReactNode } from 'react';

interface ExplanationCardProps {
  title: string;
  children: ReactNode;
  type?: 'info' | 'warning' | 'success';
}

export function ExplanationCard({ title, children, type = 'info' }: ExplanationCardProps) {
  const bgColors = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    success: 'bg-green-50 border-green-200',
  };

  const titleColors = {
    info: 'text-blue-900',
    warning: 'text-yellow-900',
    success: 'text-green-900',
  };

  const textColors = {
    info: 'text-blue-800',
    warning: 'text-yellow-800',
    success: 'text-green-800',
  };

  return (
    <div className={`${bgColors[type]} border-2 rounded-lg p-6 mb-6`}>
      <h4 className={`${titleColors[type]} text-lg font-semibold mb-2`}>{title}</h4>
      <div className={`${textColors[type]}`}>{children}</div>
    </div>
  );
}
