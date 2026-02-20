import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CreditBalanceBadge } from "../CreditBalanceBadge";

describe("CreditBalanceBadge", () => {
  it("should show loading state", () => {
    render(<CreditBalanceBadge balance={null} isLoading={true} />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("should return null when balance is null and not loading", () => {
    const { container } = render(
      <CreditBalanceBadge balance={null} isLoading={false} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("should display balance", () => {
    render(<CreditBalanceBadge balance={10} isLoading={false} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should display zero balance", () => {
    render(<CreditBalanceBadge balance={0} isLoading={false} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should render as button when onClick is provided", () => {
    const onClick = vi.fn();
    render(
      <CreditBalanceBadge balance={5} isLoading={false} onClick={onClick} />,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should render as span when no onClick", () => {
    render(<CreditBalanceBadge balance={5} isLoading={false} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <CreditBalanceBadge
        balance={5}
        isLoading={false}
        className="my-class"
      />,
    );
    expect(container.firstChild).toHaveClass("my-class");
  });
});
