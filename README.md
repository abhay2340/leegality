# PulseShop: Product Listing & Detail (Leegality Frontend Assessment)

An Amazon-style product listing and detail app built on the [DummyJSON Products API](https://dummyjson.com/docs/products).

- **Demo:** _add deployed URL here_
- **Repository:** _add GitHub URL here_

| Screen | Route |
| --- | --- |
| Product Listing (filters + grid + pagination) | `/products` |
| Product Detail | `/product/:id` |

---

## Setup

Requires **Node.js 18+** and npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
npm run lint
```

The API base URL is read from `.env` (`VITE_PRODUCTS_API_URL`) and defaults to `https://dummyjson.com/products`, so the app runs with no extra configuration.

**Deploying:** `vercel.json` and `netlify.toml` already rewrite all routes to `index.html`, so deep links like `/product/5` work on refresh. Import the repo into Vercel or Netlify with build command `npm run build` and output directory `dist`.

---

## Requirements coverage

| Requirement | Where / how |
| --- | --- |
| Filters on the left, product grid on the right, pagination at bottom | `pages/ProductListing`. On screens under 900px the sidebar collapses behind a "Filters" toggle |
| Card: image, title, price, rating; click → detail | `features/products/components/ProductCard.tsx` |
| Category filter loaded dynamically | `GET /products/categories` (`CategoryFilter.tsx`) |
| Selecting a category updates the list | `GET /products/category/{slug}` |
| Price range (min / max inputs) | `PriceRangeFilter.tsx`, debounced 350ms, with a warning when min > max |
| Brand filter (multi-select) extracted from fetched products | `BrandFilter.tsx` + `getBrandOptions()`; shows a count per brand |
| Filters combine | Category, search, price and brand combine with AND; multiple brands combine with OR |
| Search | Header search sets `?q=` and calls `GET /products/search?q=` |
| Changing a filter updates the list immediately | No "Apply" button; every change updates the URL and the grid re-renders |
| Pagination resets when filters change | `updateFilters()` in `useListingFilters` always removes `page` |
| Loading state | Skeleton cards for the grid, skeleton lines in the category and brand lists, skeleton on the detail page |
| Error handling | Error panel with retry (grid and detail), inline retry for categories, global error toast from React Query, React error boundary |
| Detail: image, name, price, rating, description, brand, category | `pages/ProductDetails` (`GET /products/{id}`) |
| Back button that keeps filters | "Back to products" button on the detail page (see below) |

---

## Architectural decisions

### 1. Filter state lives in the URL
All listing state is kept in query params, for example:

```
/products?category=smartphones&minPrice=200&maxPrice=1000&brand=Apple&brand=Samsung&page=2
```

`useListingFilters` is the only place that reads and writes these params. This gives:
- **Filters that survive going back.** The Back button calls `navigate(-1)`, which returns to the exact listing URL, filters and page included. If the detail page was opened directly (no in-app history), it goes to `/products` instead.
- Refresh-safe, shareable and bookmarkable filtered views.
- No need for a global store or context just for filters.

Filter changes use `replace` so the browser Back button doesn't step through every keystroke. Page changes push a new history entry so Back goes to the previous page.

### 2. Category and search on the server, price and brand on the client
DummyJSON can filter by category and search by text, but has no price or brand filter (unknown params such as `?brand=` or `?minPrice=` are ignored). So:
- **Category** is fetched from `/products/category/{slug}` (or `/products` for all).
- **Search** uses `/products/search?q=`. That endpoint ignores a category param, so when both are set the search results are narrowed to the category in the browser.
- **Price and brand** are applied in the browser by a pure function, `filterProducts()`.

To keep the combined filters correct, each request uses `limit=0` to fetch the **whole** category (at most 194 products). With server-side `limit`/`skip`, price and brand would only filter the current page. That would give wrong counts and empty pages even when matches exist further on, and the brand list would be incomplete. `select=` trims the response to the fields the grid needs (~80 KB instead of ~300 KB for the full catalogue). Pagination is then a slice of the filtered results, 12 per page.

### 3. Server state in React Query, client state in Redux
- **TanStack Query** handles fetching, caching and loading/error flags. Cached category results make going back to the listing instant. Categories are cached for the whole session.
- **Redux Toolkit** holds the cart and wishlist (extras, see below), saved to `localStorage`.

### 4. Folder structure (feature-based)
```
src/
├── app/            # router, layouts, providers, Redux store
├── features/
│   └── products/
│       ├── api/        # DummyJSON calls
│       ├── queries/    # React Query hooks
│       ├── hooks/      # useListingFilters (URL ⇄ filter state)
│       ├── lib/        # filterProducts / getBrandOptions (pure, easy to unit test)
│       └── components/ # ProductCard, Pagination, filters/*
├── pages/          # ProductListing, ProductDetails (+ extras)
└── shared/         # api client, generic components and hooks
```
Filter components are presentational: they receive values and callbacks and never touch the URL themselves.

### 5. Styling
Plain CSS with CSS custom properties (design tokens in `index.css`). No UI component library; icons come from `lucide-react`.

---

## Assumptions

- **Brands:** about half of DummyJSON's products (e.g. groceries) have no `brand`. They appear when no brand is selected and are excluded once any brand is selected. The detail page shows "Not specified" for them.
- **Brand options depend on category.** The brand list shows only brands in the current category, and changing category clears the selected brands (a "Samsung" selection means nothing under "Groceries").
- **Brand counts** reflect the other active filters (search, price), and brands with 0 matches are disabled. This mirrors typical e-commerce faceted filters.
- **Price range** is inclusive on both ends. An empty input means no limit. If min > max a warning is shown and there are no results.
- **Multiple brands** combine with OR ("Apple or Samsung"). Different filter types combine with AND.
- **Route:** the detail route is `/product/:id` as specified. Old URLs (`/products/:id`, `/products/all`) redirect.
- **Page size** is 12. An out-of-range `?page=` (e.g. from an old link) shows the last page instead of an empty grid.
- **Extras beyond the brief** are kept from an earlier build and are optional to review: a home page (`/`) with hero and categories, header search (`?q=`, which also narrows the listing via the search API), cart and wishlist drawers, recently-viewed products, an image carousel with zoom on the detail page, and a mock login and dashboard (`/auth`, `/dashboard`).

---

## Improvements with more time

1. **Tests.** Unit tests for `filterProducts`, `getBrandOptions` and `useListingFilters` (Vitest), component tests for the sidebar (React Testing Library), and a Playwright end-to-end run of filter → detail → back.
2. **Sorting** (price, rating) as another URL param on the listing.
3. **Price slider** with the category's actual min/max, alongside the inputs.
4. **Active-filter chips** above the grid to remove single filters in one click.
5. **Hybrid pagination.** For a large real catalogue, fetching everything won't scale. Price and brand filtering should move to a backend that supports them, so the client can go back to true `limit`/`skip` pagination.
6. **Scroll restoration** to the exact card when returning from the detail page (via React Router data routers' `<ScrollRestoration />`).
7. **Prefetch on hover:** `queryClient.prefetchQuery` for the detail page when a card is hovered.
8. **Accessibility audit:** focus management when the mobile filter panel opens, and announcing result-count changes.
9. **Trim the extras** (auth, dashboard) into a separate branch to keep the assessment surface small.
# leegality
