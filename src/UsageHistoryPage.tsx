/**
 * @fileoverview Usage history page component with responsive table (desktop)
 * and card (mobile) layouts. Supports load-more pagination.
 */

import { LoadingSpinner } from "./LoadingSpinner";
import type { UsageHistoryPageProps } from "./types";

/**
 * Renders a paginated list of usage records.
 * Desktop: table with date and filename columns.
 * Mobile: compact card layout.
 * @param props - See {@link UsageHistoryPageProps} for full prop documentation.
 */
export function UsageHistoryPage({
  usages,
  isLoading,
  error,
  onLoadMore,
  hasMore,
  labels,
  formatters,
  className,
  emptyStateComponent,
}: UsageHistoryPageProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        {labels.title}
      </h1>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800"
          role="alert"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {isLoading && <LoadingSpinner />}

      {!isLoading && usages.length === 0 && (
        <>
          {emptyStateComponent ?? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {labels.noRecords}
            </p>
          )}
        </>
      )}

      {!isLoading && usages.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm" aria-label={labels.title}>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    {labels.columnDate}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    {labels.columnFilename}
                  </th>
                </tr>
              </thead>
              <tbody>
                {usages.map((usage) => (
                  <tr
                    key={usage.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {formatters.formatDate(usage.created_at)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {usage.filename || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {usages.map((usage) => (
              <div
                key={usage.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatters.formatDate(usage.created_at)}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {usage.filename || "-"}
                </p>
              </div>
            ))}
          </div>

          {hasMore && onLoadMore && (
            <div className="mt-4 text-center">
              <button
                onClick={onLoadMore}
                className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                {labels.loadMore}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
