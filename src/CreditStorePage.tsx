/**
 * @fileoverview Credit store page component displaying the user's balance and
 * a responsive grid of purchasable credit packages. Purely presentational --
 * all data and callbacks are passed via props.
 */

import type { CreditStorePageProps } from "./types";

/**
 * Renders a credit store with balance display, purchase packages grid,
 * loading/error states, and a login prompt for unauthenticated users.
 * @param props - See {@link CreditStorePageProps} for full prop documentation.
 */
export function CreditStorePage({
  isAuthenticated,
  balance,
  packages,
  isLoading,
  isPurchasing,
  error,
  onPurchase,
  onLoginClick,
  labels,
  formatters,
  className,
}: CreditStorePageProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-6">{labels.title}</h1>

      {/* Balance display */}
      {isAuthenticated && balance !== null && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">
            {labels.currentBalanceLabel}
          </p>
          <p className="text-3xl font-bold text-blue-900">
            {formatters.formatCredits(balance)}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm font-medium text-red-800">
            {labels.errorTitle}
          </p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">{labels.loginRequired}</p>
          <button
            onClick={onLoginClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Log in
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* No products */}
      {!isLoading && packages.length === 0 && (
        <p className="text-gray-500 text-center py-8">{labels.noProducts}</p>
      )}

      {/* Credit packages grid */}
      {!isLoading && packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.packageId}
              className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {formatters.formatCredits(pkg.credits)}
                </p>
                {formatters.getPackageDescription && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatters.getPackageDescription(pkg.packageId)}
                  </p>
                )}
                <p className="text-xl font-semibold text-blue-600 mt-3">
                  {pkg.priceString}
                </p>
                <button
                  onClick={() => onPurchase(pkg.packageId)}
                  disabled={isPurchasing || !isAuthenticated}
                  className="mt-4 w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPurchasing
                    ? labels.purchasingButton
                    : labels.purchaseButton}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
