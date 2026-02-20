import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UsageHistoryPage } from "../UsageHistoryPage";
import type { UsageHistoryPageProps } from "../types";

const defaultLabels: UsageHistoryPageProps["labels"] = {
  title: "Usage History",
  columnDate: "Date",
  columnFilename: "File",
  noRecords: "No usage yet",
  loadMore: "Load More",
};

const defaultFormatters: UsageHistoryPageProps["formatters"] = {
  formatDate: (d) => d,
};

const usages = [
  { id: 1, filename: "logo.svg", created_at: "2025-01-15" },
  { id: 2, filename: null, created_at: "2025-01-14" },
];

describe("UsageHistoryPage", () => {
  it("should show title", () => {
    render(
      <UsageHistoryPage
        usages={[]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("Usage History")).toBeInTheDocument();
  });

  it("should show no records message when empty", () => {
    render(
      <UsageHistoryPage
        usages={[]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("No usage yet")).toBeInTheDocument();
  });

  it("should show loading spinner", () => {
    const { container } = render(
      <UsageHistoryPage
        usages={[]}
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
      <UsageHistoryPage
        usages={[]}
        isLoading={false}
        error="Failed to load"
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("should render usage records with filenames", () => {
    render(
      <UsageHistoryPage
        usages={usages}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    // desktop + mobile = 2 each
    expect(screen.getAllByText("logo.svg")).toHaveLength(2);
  });

  it("should show dash for null filenames", () => {
    render(
      <UsageHistoryPage
        usages={usages}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    // desktop + mobile dashes for null filename
    expect(screen.getAllByText("-")).toHaveLength(2);
  });

  it("should show load more button when hasMore", () => {
    const onLoadMore = vi.fn();
    render(
      <UsageHistoryPage
        usages={usages}
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
      <UsageHistoryPage
        usages={usages}
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
