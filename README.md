# Leegality Frontend Assessment: Product Listing

A small Amazon-style shop built on the [DummyJSON products API](https://dummyjson.com/docs/products): a listing page with filters, and a product detail page.

- **Demo:** https://animated-bienenstitch-81f90b.netlify.app/products
- **Repo:** https://github.com/abhay2340/leegality

## Setup

You'll need Node 20.19+ (Vite 8 requires it).

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173. No env setup is needed, because the API URL falls back to `https://dummyjson.com/products`.

`npm run build` creates a production build in `dist/`.

## How it works

- `/products` is the listing: filters on the left, product grid on the right, pagination at the bottom.
- `/product/:id` is the detail page, with a Back button.
- The **category** list comes from `/products/categories`. Picking a category loads `/products/category/{slug}`.
- **Search** in the header uses `/products/search?q=`.
- **Price** (min/max) and **brand** (multi-select) are filtered in the browser. DummyJSON has no API for either, and it silently ignores params like `?brand=` or `?minPrice=`.

## Architectural decisions

**Filters live in the URL**, e.g. `/products?category=smartphones&brand=Apple&minPrice=200&page=2`. That's what keeps them applied when you come back from a product page: the Back button just goes back in history. It also means a filtered view survives a refresh and can be shared as a link. Changing any filter resets the page to 1.

**The whole category is fetched at once** (`limit=0`, with `select` to keep only the fields the grid needs). I first considered paginating on the API with `limit`/`skip`, but then the price and brand filters would only work on the 12 products of the current page. Result counts would be wrong, and the brand list would be incomplete. The full catalogue is only 194 products (about 80 KB), so fetching it once and paginating in the browser is simpler and always correct.

**React Query** handles fetching, caching and loading/error states, so going back to the listing is instant. **Redux Toolkit** is only used for the cart and wishlist.

The code is grouped by feature. Everything for the listing is in `src/features/products`: API calls, query hooks, the `useListingFilters` hook, filter logic as plain functions, and the components.

Styling is plain CSS with CSS variables. There's no UI library; icons come from `lucide-react`.

## Assumptions

- Around half of the products (groceries, for example) have no brand. They show up when no brand is selected and drop out once one is. The detail page shows "Not specified" for them.
- The brand list only shows brands from the current category, so switching category clears the selected brands.
- Selected brands match any of them (Apple *or* Samsung). Different filters must all match.
- The price range includes both ends, and an empty box means no limit.
- 12 products per page.
- The cart, wishlist, home page and mock login/dashboard are extras from an earlier version I built. They're not part of the brief.

## If I had more time

- Tests: unit tests for the filter logic and the URL hook, plus one Playwright test for filter → product → back.
- Sorting by price and rating.
- Removable "active filter" chips above the grid.
- Restoring the scroll position when coming back from a product.
- For a real, much larger catalogue, filtering by price and brand would have to happen on the server so the app could go back to proper API pagination.
