import { useState } from 'react';
import { usePopper } from 'react-popper';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function RefWithThirdPartyFixed() {
  const [showTooltip, setShowTooltip] = useState(false);

  // FIXED: Using state instead of refs for react-popper
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  // Now usePopper receives the actual elements and can track updates
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <RenderCounter />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Hover over the button. The tooltip positions correctly above it!
        </p>

        <div className="flex justify-center py-8">
          <button
            ref={setReferenceElement}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Hover me
          </button>

          {showTooltip && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className="bg-gray-900 text-white px-3 py-2 rounded text-sm shadow-lg z-10"
            >
              Perfectly positioned!
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            <strong>Solution:</strong> react-popper requires <strong>state</strong>, not refs.
            Using <code className="px-1 bg-white rounded">useState</code> allows the popper to
            re-calculate positioning when elements mount or change.
          </p>
        </div>
      </div>
    </div>
  );
}