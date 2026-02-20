import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PurchaseHistoryPage } from "../PurchaseHistoryPage";
import type { PurchaseHistoryPageProps } from "../types";

const defaultLabels: PurchaseHistoryPageProps["labels"] = {
  title: "Purchase History",
  columnDate: "Date",
  columnCredits: "Credits",
  columnSource: "Source",
  columnProduct: "Product",
  columnAmount: "Amount",
  noRecords: "No purchases yet",
  loadMore: "Load More",
};

const defaultFormatters: PurchaseHistoryPageProps["formatters"] = {
  formatDate: (d) => d,
  formatAmount: (cents, currency) => `${currency} ${(cents / 100).toFixed(2)}`,
  formatSource: (s) => s,
};

const purchases = [
  {
    id: 1,
    credits: 25,
    source: "web",
    transaction_ref_id: "txn_1",
    product_id: "credits_25",
    price_cents: 1999,
    currency: "USD",
    created_at: "2025-01-15",
  },
  {
    id: 2,
    credits: 3,
    source: "free",
    transaction_ref_id: null,
    product_id: null,
    price_cents: null,
    currency: null,
    created_at: "2025-01-01",
  },
];

describe("PurchaseHistoryPage", () => {
  it("should show title", () => {
    render(
      <PurchaseHistoryPage
        purchases={[]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("Purchase History")).toBeInTheDocument();
  });

  it("should show no records message when empty", () => {
    render(
      <PurchaseHistoryPage
        purchases={[]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("No purchases yet")).toBeInTheDocument();
  });

  it("should show loading spinner", () => {
    const { container } = render(
      <PurchaseHistoryPage
        purchases={[]}
        isLoading={true}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should show error message", () => {
    render(
      <PurchaseHistoryPage
        purchases={[]}
        isLoading={false}
        error="Failed to load"
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("should render purchase records", () => {
    render(
      <PurchaseHistoryPage
        purchases={purchases}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    // Credits shown as +25 and +3 (desktop + mobile = 2 each)
    expect(screen.getAllByText("+25")).toHaveLength(2);
    expect(screen.getAllByText("+3")).toHaveLength(2);
    expect(screen.getAllByText("USD 19.99")).toHaveLength(2);
  });

  it("should show dash for purchases without price", () => {
    render(
      <PurchaseHistoryPage
        purchases={purchases}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    // The free purchase (no price_cents/currency) shows "-" in desktop table
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should show load more button when hasMore", () => {
    const onLoadMore = vi.fn();
    render(
      <PurchaseHistoryPage
        purchases={purchases}
        isLoading={false}
        error={null}
        onLoadMore={onLoadMore}
        hasMore={true}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    const button = screen.getByText("Load More");
    fireEvent.click(button);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("should not show load more when hasMore is false", () => {
    render(
      <PurchaseHistoryPage
        purchases={purchases}
        isLoading={false}
        error={null}
        hasMore={false}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.queryByText("Load More")).toBeNull();
  });
});
