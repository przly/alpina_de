# Alpina Animations

## Getting started

```bash
npm install
npm run dev
```

## What changed from the original `product-card` component

Not a 1:1 port — the motion was redesigned. For porting back into
`164-1-alpina-prenova`:

- **Hover zoom/crossfade rebuilt.** Was two independent flat `0.3s` fades
  (background tint + opacity). Now both the base image and hover-image scale
  together via one registered custom property (`--card-zoom`, `1.04 → 1`),
  so they move in exact lockstep instead of just matching durations.
  Asymmetric timing: `320ms` in, `180ms` out. Needs `@property` support
  (Chrome/Edge 85+, Safari 16.4+, Firefox 128+) — older browsers lose the
  zoom easing but keep the fades. Cards with no `hoverImage` get a new
  `rgba(0,0,0,0.06)` dim overlay instead of the background tint.
- **Hover effects gated to `(hover: hover) and (pointer: fine)`.** Prevents
  the zoom/crossfade/dim from firing on mobile taps — press-scale still
  works there.
- **Press feedback added** (`scale(0.98)`, ported from `.btn:active`) on the
  card, wishlist button, and each thumbnail — independently. Fix needed:
  `:active` bubbles to ancestors, so
  `.product-card:has(.product-card__thumbnail:active) { transform: none }`
  (same for wishlist) stops the whole card from also scaling down.
- **Wishlist heart** swapped from a mask-icon (color-only toggle) to
  `lucide-react`'s `Heart`, now actually fills solid when active.
- **Dropped/simplified:** thumbnails only swap the image, not
  title/price/link like the original's `data-*` swap; wishlist is
  local-state only (no API call); no out-of-stock thumbnail state; simpler
  (non-stacking-context-trick) stretched-link z-index setup; no design
  tokens (hardcoded hex matching the SCSS variables 1:1); React, not Twig.

Everything else (typography, spacing, tag variants, DOM structure) matches
the original.
