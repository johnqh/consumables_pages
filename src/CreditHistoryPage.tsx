import {
  usePurchaseHistory,
  useUsageHistory,
} from '@sudobility/consumables_client';
import type {
  PurchaseHistoryPageFormatters,
  PurchaseHistoryPageLabels,
  UsageHistoryPageFormatters,
  UsageHistoryPageLabels,
} from './types';
import { PurchaseHistoryPage } from './PurchaseHistoryPage';
import { UsageHistoryPage } from './UsageHistoryPage';

export interface CreditHistoryPageProps {
  purchaseLabels: PurchaseHistoryPageLabels;
  purchaseFormatters: PurchaseHistoryPageFormatters;
  usageLabels: UsageHistoryPageLabels;
  usageFormatters: UsageHistoryPageFormatters;
  pageSize?: number;
  onPurchaseCredits?: () => void;
  purchaseButtonLabel?: string;
  className?: string;
}

/** Shared credit ledger view, including loading and pagination state for both history feeds. */
export function CreditHistoryPage({
  purchaseLabels,
  purchaseFormatters,
  usageLabels,
  usageFormatters,
  pageSize = 50,
  onPurchaseCredits,
  purchaseButtonLabel,
  className,
}: CreditHistoryPageProps) {
  const purchases = usePurchaseHistory(pageSize);
  const usages = useUsageHistory(pageSize);
  const hasMore = (count: number) => count > 0 && count % pageSize === 0;
  const isLoading = purchases.isLoading || usages.isLoading;

  return (
    <div className={className ?? 'space-y-8'}>
      {onPurchaseCredits && (
        <div className='flex justify-end'>
          <button
            type='button'
            className='rounded-md bg-theme-primary px-4 py-2 font-medium text-white'
            onClick={onPurchaseCredits}
          >
            {purchaseButtonLabel ?? 'Purchase credits'}
          </button>
        </div>
      )}
      <PurchaseHistoryPage
        purchases={purchases.purchases}
        isLoading={isLoading}
        error={purchases.error?.message ?? usages.error?.message ?? null}
        onLoadMore={() => void purchases.loadMore()}
        hasMore={hasMore(purchases.purchases.length)}
        labels={purchaseLabels}
        formatters={purchaseFormatters}
      />
      <UsageHistoryPage
        usages={usages.usages}
        isLoading={isLoading}
        error={purchases.error?.message ?? usages.error?.message ?? null}
        onLoadMore={() => void usages.loadMore()}
        hasMore={hasMore(usages.usages.length)}
        labels={usageLabels}
        formatters={usageFormatters}
      />
    </div>
  );
}
