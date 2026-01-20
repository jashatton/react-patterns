import { Button } from './Button';

interface CounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label?: string;
}

export function Counter({ count, onIncrement, onDecrement, label = 'Count' }: CounterProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-4xl font-bold">{count}</div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onDecrement} variant="secondary">
          -
        </Button>
        <Button onClick={onIncrement}>+</Button>
      </div>
    </div>
  );
}
