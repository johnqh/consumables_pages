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
bun test             # Run tests
```

## Related Projects

- **consumables_client** (`@sudobility/consumables_client`) — Peer dependency that provides hooks (`useBalance`, `usePurchaseCredits`, etc.) and data types. This package does NOT call those hooks internally; the consuming app calls them and passes data as props.
- **@sudobility/types** — Shared type definitions used across the consumables ecosystem.

Dependency direction: `consumables_pages` depends on `consumables_client` (peer dep for types only, not runtime calls)

## Coding Patterns

- **Props-driven components (no internal state)**: Components receive all data and callbacks via props. They do not call hooks, manage state, or fetch data. This makes them pure presentational components.
- **Customizable labels and formatters for i18n**: All user-facing text is passed in via `labels` props, and numeric/date formatting uses `formatter` props. Never hardcode user-visible strings inside components.
- **Responsive design with Tailwind sm/lg breakpoints**: Components use Tailwind's `sm:` and `lg:` prefixes for responsive layouts (e.g., cards on mobile, tables on desktop). Follow this pattern for any new components.
- **No direct CSS**: All styling uses Tailwind utility classes. Do not introduce CSS files, CSS modules, or styled-components.

## Gotchas

- **Consumer app must provide Tailwind CSS**: This package emits Tailwind class names but does NOT bundle Tailwind itself. If the consuming app does not have Tailwind configured, components will render unstyled. This is by design.
- **Components are purely presentational**: No hooks are called inside components. The parent app is responsible for calling `useBalance()`, `usePurchaseCredits()`, etc. from `consumables_client` and passing the results as props. Breaking this pattern creates tight coupling.
- **No internal state**: Components derive everything from props. If you need loading states or error states, they must be passed in as props, not managed internally with `useState`.
- **Peer dependency on consumables_client**: The package depends on `consumables_client` for TypeScript types (e.g., `CreditPackage`, `CreditBalance`), but it never imports runtime code from it. The peer dependency ensures type compatibility.

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
