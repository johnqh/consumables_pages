import type { PurchaseHistoryPageProps } from "./types";

export function PurchaseHistoryPage({
  purchases,
  isLoading,
  error,
  onLoadMore,
  hasMore,
  labels,
  formatters,
  className,
}: PurchaseHistoryPageProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-6">{labels.title}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {!isLoading && purchases.length === 0 && (
        <p className="text-gray-500 text-center py-8">{labels.noRecords}</p>
      )}

      {!isLoading && purchases.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    {labels.columnDate}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">
                    {labels.columnCredits}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    {labels.columnSource}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">
                    {labels.columnAmount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {formatters.formatDate(purchase.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">
                      +{purchase.credits}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatters.formatSource(purchase.source)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
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
                className="p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatters.formatDate(purchase.created_at)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatters.formatSource(purchase.source)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      +{purchase.credits}
                    </p>
                    {purchase.price_cents != null && purchase.currency && (
                      <p className="text-sm text-gray-500">
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
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
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
