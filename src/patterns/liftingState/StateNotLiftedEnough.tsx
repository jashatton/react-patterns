import { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { RenderCounter } from '../../components/shared/RenderCounter';

// BUG: CartTotal has its own copy of the cart count
function CartTotal() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemCount, setItemCount] = useState(0);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <RenderCounter name="CartTotal" />
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Shopping Cart</div>
          <div className="text-sm text-gray-600">Items: {itemCount}</div>
        </div>
        <div className="text-xs text-gray-500">
          (This component has its own state)
        </div>
      </div>
    </div>
  );
}

// BUG: ProductList has its own copy of the cart count
function ProductList() {
  const [itemCount, setItemCount] = useState(0);

  const addToCart = () => {
    setItemCount(itemCount + 1);
  };

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
            <Button onClick={addToCart} variant="primary">
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
            <Button onClick={addToCart} variant="primary">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        Local item count: {itemCount}
      </div>
    </div>
  );
}

// Another component that needs cart info
function CheckoutButton() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemCount, setItemCount] = useState(0);

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
        <div className="text-xs text-gray-500">
          (Also has its own state copy)
        </div>
      </div>
    </div>
  );
}

export function StateNotLiftedEnough() {
  return (
    <div>
      <RenderCounter name="StateNotLiftedEnough (Parent)" />

      <div className="space-y-4 mt-4">
        <CartTotal />
        <ProductList />
        <CheckoutButton />

        <div className="p-4 bg-red-100 border-2 border-red-400 rounded">
          <div className="text-sm text-red-800 space-y-2">
            <div className="font-bold text-base">🐛 Try This Bug:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add to Cart" on any product 3 times</li>
              <li>
                Look at the <strong>ProductList</strong> - it shows "Local item count: 3"
              </li>
              <li>
                But <strong>CartTotal</strong> still shows "Items: 0"! 🤯
              </li>
              <li>
                And <strong>CheckoutButton</strong> still shows "0 items" and is disabled!
              </li>
              <li>The components are completely out of sync!</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-red-300">
              <strong>Why?</strong> Each component has its own copy of{' '}
              <code className="bg-red-200 px-1 rounded">itemCount</code> state. When ProductList updates
              its local state, CartTotal and CheckoutButton don't know about it. They each have their own
              separate state that never syncs!
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Real-world impact:</strong> This causes major UX bugs! Users add items to cart but the
              cart total doesn't update. The checkout button stays disabled. Features that should work together
              are completely broken because they don't share state.
            </div>
            <div className="mt-2 pt-2 border-t border-red-300 text-xs">
              <strong>Common mistake:</strong> Developers sometimes try to "fix" this with useEffect to sync
              state between components, but that's a code smell. The real solution is to lift state to a
              common parent.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
