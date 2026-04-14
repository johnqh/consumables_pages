/**
 * @fileoverview Credit store page component displaying the user's balance and
 * a responsive grid of purchasable credit packages. Purely presentational --
 * all data and callbacks are passed via props.
 */

import { colors, ui } from '@sudobility/design';
import { LoadingSpinner } from './LoadingSpinner';
import type { CreditStorePageProps } from './types';

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
      <h1 className='text-2xl font-bold mb-6 dark:text-white'>
        {labels.title}
      </h1>

      {/* Balance display */}
      {isAuthenticated && balance !== null && (
        <div
          className={`mb-8 p-4 rounded-lg border ${colors.component.alert.info.base} ${colors.component.alert.info.dark}`}
        >
          <p
            className={`text-sm font-medium ${colors.component.alert.info.icon}`}
          >
            {labels.currentBalanceLabel}
          </p>
          <p className='text-3xl font-bold'>
            {formatters.formatCredits(balance)}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className={`mb-6 p-4 rounded-lg border ${colors.component.alert.error.base} ${colors.component.alert.error.dark}`}
          role='alert'
        >
          <p className='text-sm font-medium'>{labels.errorTitle}</p>
          <p className={`text-sm ${colors.component.alert.error.icon}`}>
            {error}
          </p>
        </div>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div
          className={`mb-6 p-4 rounded-lg border ${colors.component.alert.warning.base} ${colors.component.alert.warning.dark}`}
        >
          <p className='text-sm'>{labels.loginRequired}</p>
          <button
            onClick={onLoginClick}
            className={`mt-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${colors.component.button.primary.base} ${colors.component.button.primary.dark}`}
          >
            {labels.loginButton ?? 'Log in'}
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingSpinner />}

      {/* No products */}
      {!isLoading && packages.length === 0 && (
        <p className={`${ui.text.muted} text-center py-8`}>
          {labels.noProducts}
        </p>
      )}

      {/* Credit packages grid */}
      {!isLoading && packages.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {packages.map(pkg => (
            <div
              key={pkg.packageId}
              className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${colors.component.card.default.base} ${colors.component.card.default.dark}`}
            >
              <div className='text-center'>
                <p className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                  {formatters.formatCredits(pkg.credits)}
                </p>
                {formatters.getPackageDescription && (
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    {formatters.getPackageDescription(pkg.packageId)}
                  </p>
                )}
                <p
                  className={`text-xl font-semibold mt-3 ${colors.component.alert.info.icon}`}
                >
                  {pkg.priceString}
                </p>
                <button
                  onClick={() => onPurchase(pkg.packageId)}
                  disabled={isPurchasing || !isAuthenticated}
                  className={`mt-4 w-full px-4 py-2.5 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${colors.component.button.primary.base} ${colors.component.button.primary.dark}`}
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
