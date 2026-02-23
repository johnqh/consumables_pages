/**
 * @fileoverview Inline credit balance badge component for topbar integration.
 * Displays a pill-shaped badge with a coin icon and the current balance.
 * Renders as a button when onClick is provided, otherwise as a span.
 */

import type { CreditBalanceBadgeProps } from "./types";

/**
 * Renders a small inline badge showing the user's credit balance.
 * Blue when balance > 0, red when balance is 0. Returns null when balance is null.
 * @param props - See {@link CreditBalanceBadgeProps} for full prop documentation.
 */
export function CreditBalanceBadge({
  balance,
  isLoading,
  onClick,
  className,
}: CreditBalanceBadgeProps) {
  if (isLoading) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-400 dark:text-gray-500 ${className || ""}`}
        role="status"
        aria-label="Loading balance"
        aria-busy="true"
      >
        <span className="animate-pulse">...</span>
      </span>
    );
  }

  if (balance === null) return null;

  const Wrapper = onClick ? "button" : "span";

  return (
    <Wrapper
      onClick={onClick}
      aria-label={onClick ? `Credit balance: ${balance}` : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        balance > 0
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
          : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
      } ${onClick ? "cursor-pointer hover:opacity-80" : ""} ${className || ""}`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
          clipRule="evenodd"
        />
      </svg>
      {balance}
    </Wrapper>
  );
}
