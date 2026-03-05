import { useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { RenderCounter } from '../../components/shared/RenderCounter';

export function RefWithThirdParty() {
  const [showTooltip, setShowTooltip] = useState(false);

  // BUG: Trying to use refs with react-popper
  const referenceRef = useRef<HTMLButtonElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  // This won't work! usePopper expects state setters, not refs
  const { styles, attributes } = usePopper(
    referenceRef.current, // TypeScript error - expects element, not ref
    popperRef.current,    // TypeScript error - expects element, not ref
    {
      placement: 'top',
    }
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <RenderCounter />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Hover over the button. The tooltip won't position correctly!
        </p>

        <div className="flex justify-center py-8">
          <button
            ref={referenceRef}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Hover me
          </button>

          {showTooltip && (
            <div
              ref={popperRef}
              style={styles.popper}
              {...attributes.popper}
              className="bg-gray-900 text-white px-3 py-2 rounded text-sm"
            >
              I won't position correctly!
              <div style={styles.arrow} {...attributes.arrow} />
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <strong>Problem:</strong> react-popper's <code className="px-1 bg-white rounded">usePopper</code> hook
            expects DOM elements, not refs. Passing <code className="px-1 bg-white rounded">ref.current</code> causes
            issues because the popper doesn't update when elements mount.
          </p>
        </div>
      </div>
    </div>
  );
}