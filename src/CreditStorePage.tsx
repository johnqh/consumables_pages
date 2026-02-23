/**
 * @fileoverview Credit store page component displaying the user's balance and
 * a responsive grid of purchasable credit packages. Purely presentational --
 * all data and callbacks are passed via props.
 */

import { LoadingSpinner } from "./LoadingSpinner";
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
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        {labels.title}
      </h1>

      {/* Balance display */}
      {isAuthenticated && balance !== null && (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {labels.currentBalanceLabel}
          </p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {formatters.formatCredits(balance)}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800"
          role="alert"
        >
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {labels.errorTitle}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            {labels.loginRequired}
          </p>
          <button
            onClick={onLoginClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            {labels.loginButton ?? "Log in"}
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingSpinner />}

      {/* No products */}
      {!isLoading && packages.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          {labels.noProducts}
        </p>
      )}

      {/* Credit packages grid */}
      {!isLoading && packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.packageId}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatters.formatCredits(pkg.credits)}
                </p>
                {formatters.getPackageDescription && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatters.getPackageDescription(pkg.packageId)}
                  </p>
                )}
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mt-3">
                  {pkg.priceString}
                </p>
                <button
                  onClick={() => onPurchase(pkg.packageId)}
                  disabled={isPurchasing || !isAuthenticated}
                  className="mt-4 w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
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
