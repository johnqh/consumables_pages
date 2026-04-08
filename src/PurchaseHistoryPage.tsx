/**
 * @fileoverview Purchase history page component with responsive table (desktop)
 * and card (mobile) layouts. Supports load-more pagination.
 */

import { colors, ui } from "@sudobility/design";
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
          className={`mb-4 p-3 rounded-lg border ${colors.component.alert.error.base} ${colors.component.alert.error.dark}`}
          role="alert"
        >
          <p className={`text-sm ${colors.component.alert.error.icon}`}>{error}</p>
        </div>
      )}

      {isLoading && <LoadingSpinner />}

      {!isLoading && purchases.length === 0 && (
        <>
          {emptyStateComponent ?? (
            <p className={`${ui.text.muted} text-center py-8`}>
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
                <tr className={`border-b ${ui.border.default}`}>
                  <th className={`text-left py-3 px-4 font-medium ${ui.text.muted}`}>
                    {labels.columnDate}
                  </th>
                  <th className={`text-right py-3 px-4 font-medium ${ui.text.muted}`}>
                    {labels.columnCredits}
                  </th>
                  <th className={`text-left py-3 px-4 font-medium ${ui.text.muted}`}>
                    {labels.columnSource}
                  </th>
                  <th className={`text-right py-3 px-4 font-medium ${ui.text.muted}`}>
                    {labels.columnAmount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className={`border-b ${ui.border.subtle} hover:bg-gray-50 dark:hover:bg-gray-800/50`}
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
                className={`p-4 rounded-lg border ${colors.component.card.default.base} ${colors.component.card.default.dark}`}
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
                className={`px-4 py-2 text-sm font-medium ${ui.text.link}`}
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
