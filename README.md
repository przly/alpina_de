# Alpina Animations

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` / `npm run build` first compile the Alpina SCSS in
`src/alpina` into `src/alpina/css/bundle.css` (gitignored), mirroring the
repo's gulp CSS task. Routes: `/` (product card), `/hero-module`,
`/activities-module`, `/language-popup`, `/side-cart`, `/navigation`. A route switcher sits in the
top-right corner of every page from `1024px` up (sandbox-only, not part of Alpina).

## product-card animation changes and fixes

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

## hero-module animation changes

Rendered with the original markup (`hero-module.twig`, default variant
content) and the site stylesheet; only the pattern motion differs. For
porting back into `164-1-alpina-prenova`:

- **No fade on the pattern stripes.** Was `opacity: 0 → 1` alongside the
  slide; stripes now stay at 100% and only move.
- **Starts further back on the same diagonal.** Was
  `translate(200px, 200px)`, which runs along the stripes' own 45° angle, so
  without the fade they stayed on screen. Now `translate(400px, 400px)`
  (SVG user units, so it holds at every breakpoint): fully out of frame at
  the start, same direction of travel.
- **easeOutQuart** (`cubic-bezier(0.25, 1, 0.5, 1)`) instead of GSAP's
  `power2.out`. Duration (`600ms`) and stagger (`100ms`) unchanged.
- **Waits for the background image.** Plays once the module is in view
  (same `top 80%` trigger) *and* the image has loaded and decoded; plays
  anyway if the image fails.
- **Not ported:** the video-background variant; Web Animations API instead
  of GSAP.

## activities-module animation changes and fixes

Rendered with the original markup and the site stylesheet; only the motion
and the buttons differ. For porting back into `164-1-alpina-prenova`:

- **Directional image shift on desktop hover.** Was a plain Swiper
  crossfade. Now, hovering a lower title makes the outgoing image drift down
  `56px` while the incoming one drops in from `-56px` above (reversed when
  moving up), on top of the `400ms` crossfade. Done with the Web Animations
  API, starting from the image's current transform so an interrupted hover
  never jumps. Images overscan the frame by `56px` top and bottom
  (`top: -56px; height: calc(100% + 112px)`) so the shift never shows an
  edge. Skipped under `prefers-reduced-motion`.
- **Button moves with the image.** `.activities-module__buttons` gets the
  same shift, same direction and timing, but only `24px`.
- **One curve for the whole module.** Image shift, desktop fade and tablet
  slide all use `cubic-bezier(0.23, 1, 0.32, 1)` (was Swiper's default ease).
- **One button per category.** Was the same "Shop Women" / "Shop Men" pair
  on every card; now a single `Shop <category>` button (e.g. "Shop Alpine").
- **Static pattern on desktop.** The per-slide `pattern-animation` is
  replaced by one pattern over the slider so it stays put while images
  change, at half the repo's desktop sizes (`315 / 200 / 125px`).

## language popup (`language-switch__form`) animation changes

Clone of the language popup on `/language-popup`, opened from a centred
button. The repo only had the SCSS here, so the markup (title, country /
language dropdowns with `dropdown--tertiary`, Confirm button) is rebuilt
from the class names; content is placeholder. For porting back:

- **Open/close motion replaced** with the modal transition from
  `ngen_design`'s `/modal-demo` (`.t-modal` + `.t-modal-backdrop`). Was a
  flat `0.3s ease` fade with the panel scaling `0.9 → 1` over `600ms`. Now
  the panel scales `0.96 → 1`, with the backdrop and panel fading together:
  `250ms` open, `150ms` close, both on `cubic-bezier(0.22, 1, 0.36, 1)`.
  Tokens: `--modal-open-dur`, `--modal-close-dur`, `--modal-scale`,
  `--modal-ease`. Disabled under `prefers-reduced-motion`.
- **Closing:** ✕, backdrop click, Escape and Confirm. The first Escape
  closes an open dropdown before the popup; only one dropdown opens at a
  time; focus returns to the trigger on close.
- **Not ported:** flags load from flagcdn.com (no flag assets in this
  sandbox); Confirm only closes the popup.

## side cart (`cart-popup`)

Clone of the side cart on `/side-cart`, opened from a centred button.
Markup follows `cart-popup.twig`, `cart-popup-content-axios.twig`,
`cart-view.twig`, `free-shipping-indicator.twig` and
`quantity-counter.twig` from `164-1-alpina-prenova` (`develop`, 2026-10-07);
`cart-popup.scss` and `cart-view.scss` were re-synced from the same commit.
Content is placeholder.

- **Open/close motion replaced** with transitions.dev's panel reveal
  (`.t-panel-slide` tokens). Was a flat `0.4s ease` slide with a `0.3s ease`
  overlay fade. Now `400ms` open / `350ms` close on
  `cubic-bezier(0.22, 1, 0.36, 1)`, overlay and panel on the same timing.
  Desktop keeps the full-width slide from the right. Tablet P and down was
  `scaleY(0.95) translateY(-8px)` on `transition: all 330ms`; now the panel
  drops in `100px` from the top with a fade and a `2px` cross-blur, no squash. Tokens:
  `--panel-open-dur`, `--panel-close-dur`, `--panel-translate-y`,
  `--panel-blur`, `--panel-ease`. Disabled under `prefers-reduced-motion`.
- **Footer anchored to the bottom.** Total and buttons sit in a `cart-popup__footer` wrapper pinned to the bottom of the
  panel; the title and free shipping indicator stay fixed at the top and
  only the items scroll between them, in `cart-popup__body` (both wrappers
  are new, not Alpina classes). The panel becomes a flex column with
  `overflow: hidden` to do this.
- **Fades on the scrolling list.** The list has `24px` top and bottom
  padding (`16px` up to `767px`), with white-to-transparent gradients of
  the same height
  over the top and bottom of the item list (`cart-popup__scroll`, also new),
  each visible only while items are hidden behind that edge; `150ms` fade.
- **Buttons stacked on mobile.** Up to `767px` the two buttons stack with
  the red checkout button on top (`column-reverse`, `8px` gap). The
  original only stacks at `390px` and below, with "Go to cart" first and a
  `16px` gap.
- **No divider under the last item** in the list (`border-bottom: 0`).
- **Tighter panel padding on mobile.** Up to `767px` the panel has `16px`
  top and bottom padding (was `40px`); close button moved to `top: 16px`.
- **Indicator scrolls on mobile.** Up to `767px` the free shipping
  indicator sits inside the scrolling list and scrolls away with the items;
  above that it stays fixed under the title.
- **White Safari bars.** `theme-color` is `#ffffff` (in `index.html`, so
  every route), and where the panel is full screen (up to `1022px`) the
  overlay behind it is white, not 50% black, so iOS Safari's status bar
  and the area under its bottom bar stay white.
- **Same row spacing on mobile.** Cart rows keep the desktop `7px` top and
  bottom padding up to `767px` (the original uses `16px` there).
- **Scrollbar in the gutter.** The list extends into the panel's side
  padding so its scrollbar sits at the panel edge, not over the items;
  styled like the panel's own `scrollbar` mixin (`4px`, gray-400 at 50%).
- **No gap around the list.** Removed the indicator's `16px` bottom margin
  and the total's `20px` top margin, so the list runs flush between them.
- **Closing:** ✕, overlay click and Escape; focus returns to the trigger.
- **Not ported:** quantity, remove and totals are local state only; no
  `promotion-card`, reward row, product recommendations, button loaders or animated
  total price; the empty state has a sandbox-only "Refill cart" button
  instead of the shop link.

## navigation (`site-header` + `menu` + `megamenu`)

Clone of the site header on `/navigation`, from `164-1-alpina-prenova`'s
`feature/menu-update` (hover-to-open megamenu), with the `site-header`,
`menu`, `megamenu`, `header-search` and `language-switch` SCSS re-synced and
the hero module underneath for context. On desktop the megamenu opens on hover
and keeps a `150ms` grace period on hover-out. It slides down `8px` and fades in over `220ms`
(`150ms` out, `cubic-bezier(0.23, 1, 0.32, 1)`) with the page overlay fading
alongside, and moving between Women, Men and Kids keeps the panel open while
only the content swaps: the old columns slide `16px` away and blur out as the
new ones slide in from the other side, following the pointer's direction.
Link content is placeholder Alpina-style categories, distinct per item.

On mobile the dropdown pushes in from the right over the menu list (`320ms`,
`cubic-bezier(0.2, 0.17, 0.36, 0.9)`, fitted to a no-overshoot spring) and
leaves with an accelerating `240ms` `cubic-bezier(0.4, 0, 1, 1)`, while a 30%
black backdrop dims the list underneath on the same timing. "Nazaj" is the gray
`btn` atom, Wishlist and Profile are large buttons sharing the row, the red
bottom bar stays visible over the dropdown, rows fill gray-100 edge to edge on
press, and links sit `12px` apart. Not ported: the search results dropdown,
the language popup trigger and real link targets.
