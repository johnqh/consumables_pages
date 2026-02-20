import type { UsageHistoryPageProps } from "./types";

export function UsageHistoryPage({
  usages,
  isLoading,
  error,
  onLoadMore,
  hasMore,
  labels,
  formatters,
  className,
}: UsageHistoryPageProps) {
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

      {!isLoading && usages.length === 0 && (
        <p className="text-gray-500 text-center py-8">{labels.noRecords}</p>
      )}

      {!isLoading && usages.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    {labels.columnDate}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    {labels.columnFilename}
                  </th>
                </tr>
              </thead>
              <tbody>
                {usages.map((usage) => (
                  <tr
                    key={usage.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {formatters.formatDate(usage.created_at)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
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
                className="p-4 bg-white rounded-lg border border-gray-200"
              >
                <p className="text-sm text-gray-500">
                  {formatters.formatDate(usage.created_at)}
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  {usage.filename || "-"}
                </p>
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
