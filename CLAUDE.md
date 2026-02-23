# Consumables Pages

Web-only UI components for consumable credits system.

**npm**: `@sudobility/consumables_pages` (public)
**Version**: 0.0.7
**License**: BUSL-1.1

## Tech Stack

- **Language**: TypeScript 5.9.3 (strict mode, JSX)
- **Runtime**: Bun
- **Package Manager**: Bun (never npm/yarn/pnpm)
- **Build**: TypeScript compiler via `tsconfig.build.json` (ESM only)
- **Test**: Vitest 4.x with jsdom environment, React Testing Library
- **Styling**: Tailwind CSS classes (consumer provides Tailwind)
- **JSX**: react-jsx (React 18/19)

## Project Structure

```
src/
├── index.ts                   # Barrel exports (components + types)
├── types.ts                   # All prop/label/formatter interfaces
├── LoadingSpinner.tsx         # Shared internal loading spinner with ARIA attributes
├── CreditStorePage.tsx        # Balance display + grid of credit packages with buy buttons
├── PurchaseHistoryPage.tsx    # Responsive table/cards of purchase records
├── UsageHistoryPage.tsx       # Responsive table/cards of usage records
├── CreditBalanceBadge.tsx     # Small inline badge for topbar integration
└── __tests__/
    ├── setup.ts                      # Vitest setup (jsdom config)
    ├── CreditBalanceBadge.test.tsx
    ├── CreditStorePage.test.tsx
    ├── PurchaseHistoryPage.test.tsx
    └── UsageHistoryPage.test.tsx
```

## Commands

```bash
bun run build        # Build ESM via tsc -p tsconfig.build.json
bun run dev          # Watch mode (tsc --watch)
bun run clean        # Remove dist/
bun run typecheck    # TypeScript check (bunx tsc --noEmit)
bun test             # Run tests (vitest run)
bun run test:watch   # Watch tests
bun run lint         # ESLint
bun run lint:fix     # ESLint with auto-fix
bun run format       # Prettier format
```

## Components

### CreditStorePage
- Balance display panel (blue box) when authenticated
- Error display, login prompt for unauthenticated users
- Loading spinner
- Responsive grid of credit packages (1 col -> 2 col sm -> 3 col lg)
- Buy buttons with purchasing state
- Props: `CreditStorePageProps` (isAuthenticated, balance, packages, labels, formatters, callbacks)

### PurchaseHistoryPage
- Desktop: `<table>` with columns (date, credits, source, amount)
- Mobile: card layout (sm:hidden / hidden sm:block pattern)
- "Load more" pagination button
- Props: `PurchaseHistoryPageProps` (purchases, labels, formatters, onLoadMore, hasMore)

### UsageHistoryPage
- Desktop: `<table>` with columns (date, filename)
- Mobile: card layout
- "Load more" pagination button
- Props: `UsageHistoryPageProps` (usages, labels, formatters, onLoadMore, hasMore)

### CreditBalanceBadge
- Inline pill badge showing credit count with coin SVG icon
- Blue when balance > 0, red when balance is 0
- Optional `onClick` makes it a `<button>` instead of `<span>`
- Loading state shows animated "..."
- Returns `null` when balance is null and not loading

## Dependencies

### Peer Dependencies
- `@sudobility/consumables_client` ^0.0.6 -- TypeScript types only (CreditPackage)
- `@sudobility/types` ^1.9.53 -- shared types (ConsumablePurchaseRecord, ConsumableUsageRecord)
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

### Dev Dependencies
- TypeScript ~5.9.3, Vitest ^4.0.4, @testing-library/react ^16.x, @testing-library/jest-dom ^6.x
- jsdom ^28.x, Vite ^7.x, ESLint ^9.x, Prettier ^3.x

## Build Configuration

- **tsconfig.json**: Used for type checking (`noEmit: true`), includes `allowImportingTsExtensions`
- **tsconfig.build.json**: Extends tsconfig.json, sets `noEmit: false`, `allowImportingTsExtensions: false`, `rootDir: ./src`
- **vitest.config.ts**: jsdom environment, globals enabled, setup file at `./src/__tests__/setup.ts`

## Type Architecture

All component prop types are defined in `src/types.ts`:
- **Labels interfaces** (`CreditStorePageLabels`, etc.) -- all user-facing strings for i18n
- **Formatters interfaces** (`CreditStorePageFormatters`, etc.) -- functions for formatting credits, dates, amounts, sources
- **Props interfaces** (`CreditStorePageProps`, etc.) -- combine data, labels, formatters, and callbacks

## Related Projects

- **consumables_client** (`@sudobility/consumables_client`) -- Peer dependency that provides hooks (`useBalance`, `usePurchaseCredits`, etc.) and data types. This package does NOT call those hooks internally; the consuming app calls them and passes data as props.
- **@sudobility/types** -- Shared type definitions used across the consumables ecosystem.

Dependency direction: `consumables_pages` depends on `consumables_client` (peer dep for types only, not runtime calls)

## Coding Patterns

- **Props-driven components (no internal state)**: Components receive all data and callbacks via props. They do not call hooks, manage state, or fetch data. This makes them pure presentational components.
- **Customizable labels and formatters for i18n**: All user-facing text is passed in via `labels` props, and numeric/date formatting uses `formatter` props. Never hardcode user-visible strings inside components.
- **Responsive design with Tailwind sm breakpoint**: Components use `hidden sm:block` for desktop tables and `sm:hidden` for mobile cards. CreditStorePage uses `sm:grid-cols-2 lg:grid-cols-3` for its grid.
- **No direct CSS**: All styling uses Tailwind utility classes. Do not introduce CSS files, CSS modules, or styled-components.
- **Conditional wrapper element**: CreditBalanceBadge uses `const Wrapper = onClick ? "button" : "span"` for semantic HTML.

## Tailwind CSS Setup

Consumer apps must include this package's output files in their Tailwind `content` configuration so that Tailwind classes used by these components are included in the final CSS build. Components also support dark mode via `dark:` variant classes -- enable dark mode in the consuming app's Tailwind config to use them.

**Tailwind v3 (`tailwind.config.js`)**:
```js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@sudobility/consumables_pages/dist/**/*.js",
  ],
  // ...
};
```

**Tailwind v4 (CSS-based config)**:
```css
@import "tailwindcss";
@source "../node_modules/@sudobility/consumables_pages/dist";
```

## Gotchas

- **Consumer app must provide Tailwind CSS**: This package emits Tailwind class names but does NOT bundle Tailwind itself. If the consuming app does not have Tailwind configured, components will render unstyled. This is by design. See the "Tailwind CSS Setup" section above for required content path configuration.
- **Components are purely presentational**: No hooks are called inside components. The parent app is responsible for calling `useBalance()`, `usePurchaseCredits()`, etc. from `consumables_client` and passing the results as props. Breaking this pattern creates tight coupling.
- **No internal state**: Components derive everything from props. If you need loading states or error states, they must be passed in as props, not managed internally with `useState`.
- **Peer dependency on consumables_client**: The package depends on `consumables_client` for TypeScript types (e.g., `CreditPackage`, `CreditBalance`), but it never imports runtime code from it. The peer dependency ensures type compatibility.
- **`tsconfig.json` has `noEmit: true`**: The main tsconfig is for checking only. Building requires `tsconfig.build.json` (via `bun run build`).

## Testing

- Run tests: `bun test` (uses vitest)
- Tests use **React Testing Library** with **jsdom** environment.
- Test that components render correctly given various prop combinations (empty lists, loading states, different label overrides).
- Test responsive behavior by verifying correct CSS classes are applied.
- Do not test hook behavior here -- hooks belong to `consumables_client`.

## Publishing

- Package: `@sudobility/consumables_pages` (public on npm)
- Build before publish: `bun run build` produces ESM output in `dist/`
- Bump version in `package.json`, then `npm publish --access public`
- Ensure `consumables_client` peer dependency version range is correct in `package.json` before publishing
