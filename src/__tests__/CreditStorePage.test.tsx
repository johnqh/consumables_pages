import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CreditStorePage } from "../CreditStorePage";
import type { CreditStorePageProps } from "../types";

const defaultLabels: CreditStorePageProps["labels"] = {
  title: "Credit Store",
  currentBalanceLabel: "Current Balance",
  creditsUnit: "credits",
  purchaseButton: "Buy",
  purchasingButton: "Purchasing...",
  noProducts: "No products available",
  errorTitle: "Error",
  loginRequired: "Please log in to purchase credits",
};

const defaultFormatters: CreditStorePageProps["formatters"] = {
  formatCredits: (count) => `${count} credits`,
};

const packages = [
  {
    packageId: "pkg_5",
    productId: "credits_5",
    title: "5 Credits",
    description: null,
    credits: 5,
    price: 4.99,
    priceString: "$4.99",
    currencyCode: "USD",
  },
  {
    packageId: "pkg_25",
    productId: "credits_25",
    title: "25 Credits",
    description: null,
    credits: 25,
    price: 19.99,
    priceString: "$19.99",
    currencyCode: "USD",
  },
];

describe("CreditStorePage", () => {
  it("should show balance when authenticated", () => {
    render(
      <CreditStorePage
        isAuthenticated={true}
        balance={10}
        packages={[]}
        isLoading={false}
        isPurchasing={false}
        error={null}
        onPurchase={vi.fn()}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("10 credits")).toBeInTheDocument();
    expect(screen.getByText("Current Balance")).toBeInTheDocument();
  });

  it("should show login prompt when not authenticated", () => {
    render(
      <CreditStorePage
        isAuthenticated={false}
        balance={null}
        packages={[]}
        isLoading={false}
        isPurchasing={false}
        error={null}
        onPurchase={vi.fn()}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(
      screen.getByText("Please log in to purchase credits"),
    ).toBeInTheDocument();
  });

  it("should show loading spinner", () => {
    const { container } = render(
      <CreditStorePage
        isAuthenticated={true}
        balance={10}
        packages={[]}
        isLoading={true}
        isPurchasing={false}
        error={null}
        onPurchase={vi.fn()}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should show error message", () => {
    render(
      <CreditStorePage
        isAuthenticated={true}
        balance={10}
        packages={[]}
        isLoading={false}
        isPurchasing={false}
        error="Something went wrong"
        onPurchase={vi.fn()}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should render packages with buy buttons", () => {
    render(
      <CreditStorePage
        isAuthenticated={true}
        balance={10}
        packages={packages}
        isLoading={false}
        isPurchasing={false}
        error={null}
        onPurchase={vi.fn()}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("5 credits")).toBeInTheDocument();
    expect(screen.getByText("25 credits")).toBeInTheDocument();
    expect(screen.getByText("$4.99")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getAllByText("Buy")).toHaveLength(2);
  });

  it("should call onPurchase when buy button clicked", () => {
    const onPurchase = vi.fn();
    render(
      <CreditStorePage
        isAuthenticated={true}
        balance={10}
        packages={packages}
        isLoading={false}
        isPurchasing={false}
        error={null}
        onPurchase={onPurchase}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    const buyButtons = screen.getAllByText("Buy");
    fireEvent.click(buyButtons[0]);
    expect(onPurchase).toHaveBeenCalledWith("pkg_5");
  });

  it("should disable buttons when purchasing", () => {
    render(
      <CreditStorePage
        isAuthenticated={true}
        balance={10}
        packages={packages}
        isLoading={false}
        isPurchasing={true}
        error={null}
        onPurchase={vi.fn()}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    const buttons = screen.getAllByText("Purchasing...");
    expect(buttons[0]).toBeDisabled();
  });

  it("should show no products message", () => {
    render(
      <CreditStorePage
        isAuthenticated={true}
        balance={10}
        packages={[]}
        isLoading={false}
        isPurchasing={false}
        error={null}
        onPurchase={vi.fn()}
        onLoginClick={vi.fn()}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />,
    );
    expect(screen.getByText("No products available")).toBeInTheDocument();
  });
});
