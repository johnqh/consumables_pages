import type { CreditPackage } from "@sudobility/consumables_client";
import type {
  ConsumablePurchaseRecord,
  ConsumableUsageRecord,
} from "@sudobility/types";

// === CreditStorePage ===

export interface CreditStorePageLabels {
  title: string;
  currentBalanceLabel: string;
  creditsUnit: string;
  purchaseButton: string;
  purchasingButton: string;
  noProducts: string;
  errorTitle: string;
  loginRequired: string;
}

export interface CreditStorePageFormatters {
  formatCredits: (count: number) => string;
  getPackageDescription?: (packageId: string) => string;
}

export interface CreditStorePageProps {
  isAuthenticated: boolean;
  balance: number | null;
  packages: CreditPackage[];
  isLoading: boolean;
  isPurchasing: boolean;
  error: string | null;
  onPurchase: (packageId: string) => Promise<void>;
  onLoginClick: () => void;
  labels: CreditStorePageLabels;
  formatters: CreditStorePageFormatters;
  className?: string;
}

// === PurchaseHistoryPage ===

export interface PurchaseHistoryPageLabels {
  title: string;
  columnDate: string;
  columnCredits: string;
  columnSource: string;
  columnProduct: string;
  columnAmount: string;
  noRecords: string;
  loadMore: string;
}

export interface PurchaseHistoryPageFormatters {
  formatDate: (dateStr: string) => string;
  formatAmount: (cents: number, currency: string) => string;
  formatSource: (source: string) => string;
}

export interface PurchaseHistoryPageProps {
  purchases: ConsumablePurchaseRecord[];
  isLoading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  labels: PurchaseHistoryPageLabels;
  formatters: PurchaseHistoryPageFormatters;
  className?: string;
}

// === UsageHistoryPage ===

export interface UsageHistoryPageLabels {
  title: string;
  columnDate: string;
  columnFilename: string;
  noRecords: string;
  loadMore: string;
}

export interface UsageHistoryPageFormatters {
  formatDate: (dateStr: string) => string;
}

export interface UsageHistoryPageProps {
  usages: ConsumableUsageRecord[];
  isLoading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  labels: UsageHistoryPageLabels;
  formatters: UsageHistoryPageFormatters;
  className?: string;
}

// === CreditBalanceBadge ===

export interface CreditBalanceBadgeProps {
  balance: number | null;
  isLoading: boolean;
  onClick?: () => void;
  className?: string;
}
