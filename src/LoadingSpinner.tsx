/**
 * @fileoverview Shared internal loading spinner component used across all page
 * components. Extracted to reduce markup duplication and centralize accessibility
 * attributes.
 */

/**
 * Renders a centered spinning loading indicator with appropriate ARIA attributes.
 * Internal component -- not exported from the package barrel.
 */
export function LoadingSpinner() {
  return (
    <div
      className="flex justify-center py-12"
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400" />
    </div>
  );
}
