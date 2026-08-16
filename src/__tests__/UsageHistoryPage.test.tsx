import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UsageHistoryPage } from '../UsageHistoryPage.js';
import type { UsageHistoryPageProps } from '../types.js';

const defaultLabels: UsageHistoryPageProps['labels'] = {
  title: 'Usage History',
  columnDate: 'Date',
  columnFilename: 'File',
  noRecords: 'No usage yet',
  loadMore: 'Load More',
};

const defaultFormatters: UsageHistoryPageProps['formatters'] = {
  formatDate: d => d,
};

const usages = [
  { id: 1, filename: 'logo.svg', created_at: '2025-01-15' },
  { id: 2, filename: null, created_at: '2025-01-14' },
];

describe('UsageHistoryPage', () => {
  it('should show title', () => {
    render(
      <UsageHistoryPage
        usages={[]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(screen.getByText('Usage History')).toBeInTheDocument();
  });

  it('should show no records message when empty', () => {
    render(
      <UsageHistoryPage
        usages={[]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(screen.getByText('No usage yet')).toBeInTheDocument();
  });

  it('should show loading spinner', () => {
    const { container } = render(
      <UsageHistoryPage
        usages={[]}
        isLoading={true}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show error message', () => {
    render(
      <UsageHistoryPage
        usages={[]}
        isLoading={false}
        error='Failed to load'
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('should render usage records with filenames', () => {
    render(
      <UsageHistoryPage
        usages={usages}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    // desktop + mobile = 2 each
    expect(screen.getAllByText('logo.svg')).toHaveLength(2);
  });

  it('should show dash for null filenames', () => {
    render(
      <UsageHistoryPage
        usages={usages}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    // desktop + mobile dashes for null filename
    expect(screen.getAllByText('-')).toHaveLength(2);
  });

  it('should show load more button when hasMore', () => {
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
      />
    );
    const button = screen.getByText('Load More');
    fireEvent.click(button);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should not show load more when hasMore is false', () => {
    render(
      <UsageHistoryPage
        usages={usages}
        isLoading={false}
        error={null}
        hasMore={false}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(screen.queryByText('Load More')).toBeNull();
  });
});

describe('UsageHistoryPage: credits and reference', () => {
  // A product whose unit of work is not a file spends several credits at a
  // time on something it can describe. `filename` could express neither.

  it('prefers a reference over a filename', () => {
    render(
      <UsageHistoryPage
        usages={[
          {
            id: 1,
            credits: 4,
            reference: 'generate-track — 4 track-measures',
            filename: null,
            created_at: '2026-08-16',
          },
        ]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(
      screen.getAllByText('generate-track — 4 track-measures').length
    ).toBeGreaterThan(0);
  });

  it('still shows a filename when that is what the product sets', () => {
    render(
      <UsageHistoryPage
        usages={usages}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(screen.getAllByText('logo.svg').length).toBeGreaterThan(0);
  });

  it('shows a credits column only when its label is given', () => {
    // Opt-in, so a consumer that spends exactly one credit per use — and has
    // no column for it today — gains no empty column on upgrade.
    const { rerender } = render(
      <UsageHistoryPage
        usages={[
          {
            id: 1,
            credits: 4,
            reference: 'x',
            filename: null,
            created_at: 'd',
          },
        ]}
        isLoading={false}
        error={null}
        labels={defaultLabels}
        formatters={defaultFormatters}
      />
    );
    expect(screen.queryByText('Credits')).not.toBeInTheDocument();

    rerender(
      <UsageHistoryPage
        usages={[
          {
            id: 1,
            credits: 4,
            reference: 'x',
            filename: null,
            created_at: 'd',
          },
        ]}
        isLoading={false}
        error={null}
        labels={{ ...defaultLabels, columnCredits: 'Credits' }}
        formatters={defaultFormatters}
      />
    );
    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
  });

  it('reads a missing credits count as one, never as free', () => {
    render(
      <UsageHistoryPage
        usages={[{ id: 1, filename: 'logo.svg', created_at: 'd' }]}
        isLoading={false}
        error={null}
        labels={{ ...defaultLabels, columnCredits: 'Credits' }}
        formatters={defaultFormatters}
      />
    );
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });
});
