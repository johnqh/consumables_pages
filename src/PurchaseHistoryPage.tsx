/**
 * @fileoverview Purchase history page component with responsive table (desktop)
 * and card (mobile) layouts. Supports load-more pagination.
 */

import type { ConsumableSource } from "@sudobility/types";
import { LoadingSpinner } from "./LoadingSpinner";
import type { PurchaseHistoryPageProps } from "./types";

/**
 * Renders a paginated list of purchase records.
 * Desktop: table with date, credits, source, and amount columns.
 * Mobile: compact card layout.
 * @param props - See {@link PurchaseHistoryPageProps} for full prop documentation.
 */
export function PurchaseHistoryPage({
  purchases,
  isLoading,
  error,
  onLoadMore,
  hasMore,
  labels,
  formatters,
  className,
  emptyStateComponent,
}: PurchaseHistoryPageProps) {
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

      {!isLoading && purchases.length === 0 && (
        <>
          {emptyStateComponent ?? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {labels.noRecords}
            </p>
          )}
        </>
      )}

      {!isLoading && purchases.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm" aria-label={labels.title}>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    {labels.columnDate}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    {labels.columnCredits}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    {labels.columnSource}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    {labels.columnAmount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {formatters.formatDate(purchase.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600 dark:text-green-400">
                      +{purchase.credits}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {formatters.formatSource(purchase.source as ConsumableSource)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {purchase.price_cents != null && purchase.currency
                        ? formatters.formatAmount(
                            purchase.price_cents,
                            purchase.currency,
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatters.formatDate(purchase.created_at)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatters.formatSource(purchase.source as ConsumableSource)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      +{purchase.credits}
                    </p>
                    {purchase.price_cents != null && purchase.currency && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatters.formatAmount(
                          purchase.price_cents,
                          purchase.currency,
                        )}
                      </p>
                    )}
                  </div>
                </div>
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
