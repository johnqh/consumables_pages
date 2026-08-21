import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreditPaywallDialog } from '../CreditPaywallDialog';
import type { CreditPaywallDialogProps } from '../types';

const labels: CreditPaywallDialogProps['labels'] = {
  paywallTitle: 'Out of credits',
  paywallMessage: 'Top up to carry on.',
  closeLabel: 'Close',
  title: 'Credit Store',
  currentBalanceLabel: 'Current Balance',
  creditsUnit: 'credits',
  purchaseButton: 'Buy',
  purchasingButton: 'Purchasing...',
  noProducts: 'No products available',
  errorTitle: 'Error',
  loginRequired: 'Please log in to purchase credits',
};

const formatters: CreditPaywallDialogProps['formatters'] = {
  formatCredits: count => `${count} credits`,
};

const packages = [
  {
    packageId: 'pkg_5',
    productId: 'credits_5',
    title: '5 Credits',
    description: null,
    credits: 5,
    price: 4.99,
    priceString: '$4.99',
    currencyCode: 'USD',
  },
];

function renderDialog(overrides: Partial<CreditPaywallDialogProps> = {}) {
  const props: CreditPaywallDialogProps = {
    isOpen: true,
    onClose: vi.fn(),
    isAuthenticated: true,
    balance: 0,
    packages,
    isLoading: false,
    isPurchasing: false,
    error: null,
    onPurchase: vi.fn(),
    onLoginClick: vi.fn(),
    labels,
    formatters,
    ...overrides,
  };
  return { ...render(<CreditPaywallDialog {...props} />), props };
}

describe('CreditPaywallDialog', () => {
  it('renders nothing when closed', () => {
    renderDialog({ isOpen: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('names itself by its heading, so it is findable and announced', () => {
    renderDialog();
    expect(
      screen.getByRole('dialog', { name: 'Out of credits' })
    ).toBeInTheDocument();
    expect(screen.getByText('Top up to carry on.')).toBeInTheDocument();
  });

  it('shows the packages it was given', () => {
    renderDialog();
    expect(screen.getByText('$4.99')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buy' })).toBeInTheDocument();
  });

  it('prints one heading, not the store’s as well', () => {
    // The store renders its own <h1>; inside the dialog that would be a
    // second title saying the same thing.
    renderDialog();
    expect(screen.queryByText('Credit Store')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });

  it('buys the package that was pressed', () => {
    const { props } = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Buy' }));
    expect(props.onPurchase).toHaveBeenCalledWith('pkg_5');
  });

  it('closes on the close control', () => {
    const { props } = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const { props } = renderDialog();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on a press on the backdrop', () => {
    const { props, container } = renderDialog();
    fireEvent.mouseDown(container.firstChild as Element);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('stays open when the press started inside the panel', () => {
    // Selecting text or dragging off a button ends with the pointer over the
    // backdrop; that must not dismiss what the user is reading.
    const { props } = renderDialog();
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('shows an error rather than an empty store', () => {
    renderDialog({ error: 'Purchase failed' });
    expect(screen.getByText('Purchase failed')).toBeInTheDocument();
  });

  it('offers login instead of purchase when signed out', () => {
    const { props } = renderDialog({ isAuthenticated: false });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(props.onLoginClick).toHaveBeenCalledTimes(1);
  });
});
