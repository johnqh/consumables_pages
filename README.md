# @sudobility/consumables_pages

Web-only presentational UI components for the consumable credits system. Styled with Tailwind CSS.

## Installation

```bash
bun add @sudobility/consumables_pages
```

Consumers must include this package in their Tailwind content configuration:

```css
/* Tailwind v4 */
@import "tailwindcss";
@source "../node_modules/@sudobility/consumables_pages/dist";
```

## Usage

```tsx
import {
  CreditStorePage,
  PurchaseHistoryPage,
  UsageHistoryPage,
  CreditBalanceBadge,
} from '@sudobility/consumables_pages';

<CreditStorePage
  isAuthenticated={true}
  balance={balance}
  packages={packages}
  labels={labels}
  formatters={formatters}
  onPurchase={handlePurchase}
/>
```

## API

### Components

| Component | Description |
|-----------|-------------|
| `CreditStorePage` | Balance display + grid of credit packages with buy buttons |
| `PurchaseHistoryPage` | Responsive table/cards of purchase records with pagination |
| `UsageHistoryPage` | Responsive table/cards of usage records with pagination |
| `CreditBalanceBadge` | Inline pill badge showing credit count (for topbar) |

### Types

All prop interfaces are exported from `src/types.ts`:

| Type | Description |
|------|-------------|
| `CreditStorePageProps` | Data, labels, formatters, and callbacks for store page |
| `PurchaseHistoryPageProps` | Purchase records, labels, formatters, pagination |
| `UsageHistoryPageProps` | Usage records, labels, formatters, pagination |
| `CreditBalanceBadgeProps` | Balance value, loading state, onClick |
| `*Labels` / `*Formatters` | Customizable i18n strings and formatting functions |

Components are purely presentational -- they receive all data and callbacks via props.

## Development

```bash
bun run build        # Build ESM via tsc
bun run dev          # Watch mode
bun test             # Run tests (vitest + jsdom + React Testing Library)
bun run typecheck    # TypeScript check
bun run lint         # ESLint
bun run format       # Prettier format
```

## License

BUSL-1.1
