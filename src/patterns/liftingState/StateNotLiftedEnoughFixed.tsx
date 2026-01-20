import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// FIXED: Components receive shared state as props
function CartTotal({ itemCount }: { itemCount: number }) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <RenderCounter name="CartTotal" />
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Shopping Cart</div>
          <div className="text-sm text-gray-600">Items: {itemCount}</div>
        </div>
        <div className="text-xs text-green-700 font-medium">
          ✓ Synced with shared state
        </div>
      </div>
    </div>
  );
}

function ProductList({ itemCount, onAddToCart }: { itemCount: number; onAddToCart: () => void }) {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <RenderCounter name="ProductList" />
      <div className="font-semibold mb-3">Products</div>

      <div className="space-y-3">
        <div className="p-3 bg-white rounded border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Cool Product</div>
              <div className="text-sm text-gray-600">$29.99</div>
            </div>
            <Button onClick={onAddToCart} variant="primary">
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="p-3 bg-white rounded border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Awesome Gadget</div>
              <div className="text-sm text-gray-600">$49.99</div>
            </div>
            <Button onClick={onAddToCart} variant="primary">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-green-700 font-medium">
        ✓ Shared item count: {itemCount}
      </div>
    </div>
  );
}

function CheckoutButton({ itemCount }: { itemCount: number }) {
  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded">
      <RenderCounter name="CheckoutButton" />
      <div className="flex items-center justify-between">
        <Button
          variant={itemCount > 0 ? "primary" : "secondary"}
          disabled={itemCount === 0}
        >
          Checkout ({itemCount} items)
        </Button>
        <div className="text-xs text-green-700 font-medium">
          ✓ Synced with shared state
        </div>
      </div>
    </div>
  );
}

export function StateNotLiftedEnoughFixed() {
  // FIXED: State lives in the parent, shared by all children
  const [itemCount, setItemCount] = useState(0);

  const addToCart = () => {
    setItemCount(itemCount + 1);
  };

  return (
    <div>
      <RenderCounter name="StateNotLiftedEnoughFixed (Parent)" />

      <div className="space-y-4 mt-4">
        <CartTotal itemCount={itemCount} />
        <ProductList itemCount={itemCount} onAddToCart={addToCart} />
        <CheckoutButton itemCount={itemCount} />

        <div className="p-4 bg-green-100 border-2 border-green-400 rounded">
          <div className="text-sm text-green-800 space-y-2">
            <div className="font-bold text-base">✅ Try This Fix:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add to Cart" on any product 3 times</li>
              <li>Watch <strong>all three components</strong> update together! ✨</li>
              <li>
                <strong>CartTotal</strong> shows "Items: 3"
              </li>
              <li>
                <strong>ProductList</strong> shows "Shared item count: 3"
              </li>
              <li>
                <strong>CheckoutButton</strong> shows "Checkout (3 items)" and is enabled!
              </li>
              <li>Everything stays perfectly in sync!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-green-300">
              <strong>Why it works:</strong> The <code className="bg-green-200 px-1 rounded">itemCount</code>{' '}
              state is lifted to the parent component{' '}
              <code className="bg-green-200 px-1 rounded">StateNotLiftedEnoughFixed</code>. All child
              components receive it as props, so they all see the same value. When the state updates, React
              automatically re-renders all components with the new value.
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Performance note:</strong> Yes, all three components re-render when the cart updates.
              But this is correct behavior! They all need to know about the change. This is different from
              the "State Too High" anti-pattern because here, all components actually use the shared state.
            </div>
            <div className="mt-2 pt-2 border-t border-green-300 text-xs">
              <strong>Best practice:</strong> Lift state to the lowest common ancestor of all components that
              need it. Don't lift higher than necessary, but don't keep state separate when it needs to be
              shared.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
