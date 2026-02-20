# Consumables Pages

Web-only UI components for consumable credits system.

**npm**: `@sudobility/consumables_pages` (public)

## Tech Stack

- **Language**: TypeScript (strict mode, JSX)
- **Runtime**: Bun
- **Build**: TypeScript compiler (ESM)
- **Styling**: Tailwind CSS classes (consumer provides Tailwind)

## Components

- **CreditStorePage** — Balance display + grid of credit packages with buy buttons
- **PurchaseHistoryPage** — Table of purchase records (responsive: table on desktop, cards on mobile)
- **UsageHistoryPage** — Table of usage records (responsive)
- **CreditBalanceBadge** — Small inline badge for topbar integration

All components are props-driven with labels/formatters for i18n support.

## Commands

```bash
bun run build        # Build ESM
bun run dev          # Watch mode
bun run typecheck    # TypeScript check
```
