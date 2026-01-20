import { useRef } from 'react';

interface RenderCounterProps {
  name?: string;
}

export function RenderCounter({ name = 'Component' }: RenderCounterProps) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="inline-block">
      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-mono">
        {name} renders: {renderCount.current}
      </span>
    </div>
  );
}
