# Consumables Pages - Improvement Plans

## Priority 1: Critical / High-Impact

### 1.1 Fix Hardcoded "Log in" Button Text
**File**: `src/CreditStorePage.tsx`
**Issue**: The login button text `"Log in"` on line 50 is hardcoded instead of using the `labels` prop. This breaks the i18n pattern that all other strings follow.
**Suggestion**: Add a `loginButton` field to `CreditStorePageLabels` and use it in the JSX.

### 1.2 Add `verify` Script
**File**: `package.json`
**Issue**: There is no `verify` script that runs typecheck + lint + test + build in sequence, unlike `consumables_service`.
**Suggestion**: Add `"verify": "bun run typecheck && bun run lint && bun run test && bun run build"` to scripts for pre-commit validation.

### 1.3 Add Accessibility Attributes
**Files**: `src/CreditStorePage.tsx`, `src/PurchaseHistoryPage.tsx`, `src/UsageHistoryPage.tsx`, `src/CreditBalanceBadge.tsx`
**Issue**: Components lack ARIA attributes. The loading spinner has no `aria-label`, tables have no `aria-describedby`, and the badge button has no accessible label.
**Suggestion**: Add `role`, `aria-label`, `aria-busy`, and `aria-live` attributes to improve screen reader experience.

## Priority 2: Moderate / Quality

### 2.1 Add Empty State Illustration/Customization
**Files**: `src/PurchaseHistoryPage.tsx`, `src/UsageHistoryPage.tsx`
**Issue**: Empty states show a simple text paragraph. There is no way for consumers to provide a custom empty state component.
**Suggestion**: Add an optional `emptyStateComponent` prop to allow consumers to render custom empty states (illustrations, call-to-action buttons, etc.).

### 2.2 Add Loading Skeleton Components
**Files**: All page components
**Issue**: Loading states show a simple spinner. Skeleton loading (placeholder shapes) would provide a better user experience.
**Suggestion**: Add optional skeleton loading via a `showSkeleton` prop or a separate `<CreditStorePageSkeleton>` component.

### 2.3 Type-Safe formatSource Mapping
**File**: `src/types.ts`
**Issue**: `PurchaseHistoryPageFormatters.formatSource` takes `string` but the actual source values are a known set (`"web"`, `"apple"`, `"google"`, `"free"`).
**Suggestion**: Use a union type (`ConsumableSource` from `@sudobility/types` if available) for better type safety.

### 2.4 Add Tailwind Content Path Documentation
**Issue**: Consumers must add this package's source files to their Tailwind `content` config for classes to be included in the final CSS build. This is not documented.
**Suggestion**: Add a "Setup" section in CLAUDE.md and package README explaining the required Tailwind content path: `"./node_modules/@sudobility/consumables_pages/dist/**/*.js"`.

### 2.5 Support Dark Mode
**Files**: All component files
**Issue**: All Tailwind classes use light-mode colors only (e.g., `bg-blue-50`, `text-gray-700`). Apps with dark mode will need to override styles.
**Suggestion**: Add `dark:` variants to Tailwind classes for dark mode support (e.g., `dark:bg-blue-900`, `dark:text-gray-300`).

## Priority 3: Low / Nice-to-Have

### 3.1 Add Storybook for Component Development
**Issue**: No visual development or documentation tool exists for iterating on components in isolation.
**Suggestion**: Add Storybook with stories for each component, showing different prop combinations (loading, empty, error, populated).

### 3.2 Add CSS Class Override Props
**Files**: All component files
**Issue**: While a top-level `className` prop exists, internal element styles cannot be overridden.
**Suggestion**: Add a `classNames` prop (object with keys for internal elements) for deep style customization without forking.

### 3.3 Add Animation/Transition for Purchase Button
**File**: `src/CreditStorePage.tsx`
**Issue**: The purchase button transitions to "purchasing" state instantly. A subtle animation would improve perceived UX.
**Suggestion**: Add Tailwind transition classes and consider an optional success animation after purchase completion.

### 3.4 Extract Shared Loading Spinner Component
**Files**: All page components
**Issue**: The loading spinner markup (`animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600`) is duplicated across all page components.
**Suggestion**: Extract to a shared internal `<LoadingSpinner>` component to reduce duplication.
