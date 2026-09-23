# Alpina Animations

## Getting started

```bash
npm install
npm run dev
```

## What changed from the original `product-card` component

This is **not** a 1:1 port — it's a redesign of the card's motion, built and
iterated on in isolation. If you're porting this back into
`164-1-alpina-prenova`, here's every place behavior diverges from the original
Twig/SCSS/vanilla-JS component, so nothing gets missed.

### Hover motion — rebuilt from scratch

**Original:** `product-card.scss` used `:has(.stretched-link:hover)` to flip
two independent, flat `0.3s ease` transitions — the main image background
tinted to `$cgp_gray_200`, and `.product-card__hover-image` faded its opacity
`0 → 1`. No scale/zoom of any kind.

**Here:** the whole image area now zooms as one unit, driven by a single
registered custom property instead of two separate transitions guessing at
the same timing:

```css
@property --card-zoom {
  inherits: true;
  initial-value: 1;
  syntax: '<number>';
}
```

`--card-zoom` lives on `.product-card__main-img` (rest `1.04`, hover `1`), and
every image inside — the base slide **and** the hover-image overlay — just
reads `transform: scale(var(--card-zoom))` with no transition of its own.
That's what makes both layers move in exact lockstep (not just "the same
duration") rather than two coincidentally-matched transitions. Needs
`@property` support: Chrome/Edge 85+, Safari 16.4+, Firefox 128+. Older
browsers keep the opacity crossfade and background tint but lose the zoom
(it snaps instead of easing) — no hard break.

- Timing is now asymmetric: `320ms` entering hover, `180ms` leaving (quicker
  to relax than to reveal). The original was a flat `0.3s` both ways.
- **Cards with no `hoverImage`** (i.e. no alternate lifestyle shot to
  crossfade to) get a different treatment that doesn't exist in the original
  at all: the same `--card-zoom` zoom, plus a new `rgba(0,0,0,0.06)` dim
  overlay (`::after` on `.product-card__main-img[data-hover-image='false']`)
  fading in on hover, since there's no background-tint cue to fall back on
  without a real second image.
- The background-tint-on-hover behavior was kept, but only fires for cards
  that *do* have a `hoverImage` (`[data-hover-image='true']`) — in the
  original every card tinted on hover regardless.

### Press/click feedback — entirely new, ported from `.btn`

The original `product-card.scss` has no `:active` state at all — the card
doesn't react to being pressed. This recreation ports the exact press pattern
from the design system's own button (`01-atoms/button/button.scss`:
`.btn:active { transform: scale(0.98); transition-duration: 100ms; }` on a
`140ms` resting transition) onto:

- `.product-card` itself (currently `scale(0.98)`, `160ms` in / `220ms` out —
  lengthened once from the button's original 100/140ms during review, see
  git history if you want the original 1:1 numbers),
- the wishlist button, and
- each thumbnail button — independently.

**Important fix if you port this:** because CSS `:active` bubbles from a
pressed descendant up to every ancestor, pressing a thumbnail or the wishlist
button would *also* trigger the whole-card press animation. That's blocked
with:

```css
.product-card:has(.product-card__thumbnail:active),
.product-card:has(.product-card__wishlist:active) {
  transform: none;
}
```

Needs `:has()` support (broadly available, but worth knowing if the target
browser matrix is older). Without it, pressing a thumbnail would visibly
scale the whole card down too.

### Wishlist icon — swapped to Lucide, now fills on active

**Original:** a custom `<i class="icon icon-heart">` using a CSS
`mask-image` data-URI (`$icon_heart` in `_icon_variables.scss`), same shape
whether active or not — only the icon *color* changed (via
`background-color: currentColor` on the mask) when `.is-active`.

**Here:** uses `lucide-react`'s `Heart` component, and now actually fills
solid (`fill: currentColor` when active, `fill: none` at rest) instead of
just recoloring an outline. If the production icon system stays mask-based,
this fill behavior needs an equivalent (e.g. swap to a filled heart glyph, or
add a `fill` variant to the existing mask icon).

### Functionality that's simplified or dropped in this sandbox

These weren't rebuilt because they're out of scope for an animation demo —
flagging so they don't get lost on the way back into production:

- **Thumbnail click only swaps the image.** The original's `product-card.js`
  also rewrites the title, description, price, slashed price, discount tag,
  and the card's link `href`/`aria-label` from each thumbnail's
  `data-*` attributes, so thumbnails can represent entirely different
  variant products. In this recreation, thumbnails are purely a visual image
  switcher — text/price stay fixed regardless of which thumbnail is active.
- **Wishlist is local-only.** No `toggleItemOnLikedList` API call, no
  wishlist-count sync elsewhere on the page, no reload-on-empty behavior on
  a wishlist page — it's just `useState` toggling a class.
- **No out-of-stock thumbnail state.** The original dims
  out-of-stock thumbnails (`.is-out-of-stock { img { opacity: 0.2 } }`) and
  disables their click handler. Not present here.
- **Stretched-link mechanism is simplified.** The original relies on a
  Bootstrap-style `.stretched-link::before { z-index: 6 }` inside an
  `opacity: 0` anchor (the `opacity: 0` creates a new stacking context, which
  is the only reason `z-index: 6` doesn't bury the `z-index: 1/2` thumbnails
  and wishlist button). This recreation just gives the link `z-index: 0` and
  lets the thumbnails (`z-index: 1`) and wishlist (`z-index: 2`) naturally
  stack above it — same result, but it's a different, more obvious mechanism
  than the original's stacking-context trick.
- **No design tokens.** All colors/spacing are hardcoded hex/px values
  matching the current SCSS variables 1:1 (e.g. `$cgp_gray_100` → `#f5f5f5`,
  `$cgp_red_500` → `#ed1c24`), not pulled from a shared token system, since
  this app isn't wired into the theme's SCSS.
- **Markup is React, not Twig.** Obvious, but worth saying explicitly: this
  is a component with props and `useState`, not server-rendered Twig with
  ACF field bindings and `attachEvent`-based vanilla JS. Porting means
  translating the *behavior*, not copying markup.

### Everything else is unchanged

Typography scale, spacing, tag colors/variants, price/discount layout, the
`title--h6` sizing (20px / 18px on mobile), and the overall DOM structure all
match the original 1:1.
