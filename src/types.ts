/**
 * @fileoverview Type definitions for all consumables page components.
 * Defines Labels, Formatters, and Props interfaces for CreditStorePage,
 * PurchaseHistoryPage, UsageHistoryPage, and CreditBalanceBadge.
 * All user-facing strings are defined via Labels for i18n support.
 */

import type { CreditPackage } from "@sudobility/consumables_client";
import type {
  ConsumablePurchaseRecord,
  ConsumableSource,
  ConsumableUsageRecord,
} from "@sudobility/types";
import type { ReactNode } from "react";

// === CreditStorePage ===

/** Localizable label strings for the CreditStorePage component. */
export interface CreditStorePageLabels {
  title: string;
  currentBalanceLabel: string;
  creditsUnit: string;
  purchaseButton: string;
  purchasingButton: string;
  noProducts: string;
  errorTitle: string;
  loginRequired: string;
  loginButton?: string;
}

/** Formatting functions for the CreditStorePage component. */
export interface CreditStorePageFormatters {
  formatCredits: (count: number) => string;
  getPackageDescription?: (packageId: string) => string;
}

/** Props for the CreditStorePage component. */
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

/** Localizable label strings for the PurchaseHistoryPage component. */
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

/** Formatting functions for the PurchaseHistoryPage component. */
export interface PurchaseHistoryPageFormatters {
  formatDate: (dateStr: string) => string;
  formatAmount: (cents: number, currency: string) => string;
  formatSource: (source: ConsumableSource) => string;
}

/** Props for the PurchaseHistoryPage component. */
export interface PurchaseHistoryPageProps {
  purchases: ConsumablePurchaseRecord[];
  isLoading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  labels: PurchaseHistoryPageLabels;
  formatters: PurchaseHistoryPageFormatters;
  className?: string;
  /** Optional custom component to render when the purchase list is empty. */
  emptyStateComponent?: ReactNode;
}

// === UsageHistoryPage ===

/** Localizable label strings for the UsageHistoryPage component. */
export interface UsageHistoryPageLabels {
  title: string;
  columnDate: string;
  columnFilename: string;
  noRecords: string;
  loadMore: string;
}

/** Formatting functions for the UsageHistoryPage component. */
export interface UsageHistoryPageFormatters {
  formatDate: (dateStr: string) => string;
}

/** Props for the UsageHistoryPage component. */
export interface UsageHistoryPageProps {
  usages: ConsumableUsageRecord[];
  isLoading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  labels: UsageHistoryPageLabels;
  formatters: UsageHistoryPageFormatters;
  className?: string;
  /** Optional custom component to render when the usage list is empty. */
  emptyStateComponent?: ReactNode;
}

// === CreditBalanceBadge ===

/** Props for the CreditBalanceBadge component. */
export interface CreditBalanceBadgeProps {
  balance: number | null;
  isLoading: boolean;
  onClick?: () => void;
  className?: string;
}
