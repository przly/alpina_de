import { useEffect, useRef, useState } from 'react'
import './alpina/css/bundle.css'
import './ActivitiesPage.css'
import './NavigationPage.css'
import { HeroModule } from './HeroModule'

// Content from the `default` variant in `site-header.config.json` (alpina-prenova, feature/menu-update)
const topBar = {
  text: 'Notification row, on adipisicing commodo laborum reprehenderit commodo minim aliqua ex commodo dolore mollit. Dolor aliquip mollit ut.',
  links: [
    { href: '#', text: 'Find a store', icon: 'store' },
    { href: '#', text: 'Help', icon: 'question' },
    { href: '#', text: 'B2B' },
  ],
  language: { text: 'SI-ENG', image: '/header/slo-flag.svg' },
}

const toLinks = (labels) => labels.map((text) => ({ href: '#', text }))

// Realistic Alpina-style categories (footwear-led, outdoor + ski + lifestyle); links are placeholders
const megamenu = (cols) => ({
  backText: 'Nazaj',
  cols: cols.map(([title, labels]) => ({ title, links: toLinks(labels) })),
})

const womenMegamenu = megamenu([
  [
    'Aktivnosti',
    ['Pohodništvo', 'Gorništvo', 'Trail tek', 'Tek na smučeh', 'Alpsko smučanje', 'Turno smučanje', 'Prosti čas', 'Mestni slog'],
  ],
  [
    'Izdelki',
    [
      'Pohodni čevlji', 'Gorniški čevlji', 'Superge', 'Gležnarji', 'Škornji', 'Zimski škornji', 'Sandali', 'Natikači',
      'Balerinke', 'Mokasini', 'Tekaški čevlji', 'Smučarski čevlji', 'Oblačila', 'Nogavice', 'Dodatki',
    ],
  ],
])

const menMegamenu = megamenu([
  [
    'Aktivnosti',
    ['Pohodništvo', 'Gorništvo', 'Trail tek', 'Tek na smučeh', 'Alpsko smučanje', 'Turno smučanje', 'Lov', 'Delo', 'Prosti čas'],
  ],
  [
    'Izdelki',
    [
      'Pohodni čevlji', 'Gorniški čevlji', 'Lovski čevlji', 'Delovna obutev', 'Superge', 'Gležnarji', 'Zimski škornji',
      'Elegantna obutev', 'Sandali', 'Natikači', 'Tekaški čevlji', 'Smučarski čevlji', 'Oblačila', 'Nogavice', 'Dodatki',
    ],
  ],
])

const kidsMegamenu = megamenu([
  ['Po starosti', ['Prvi koraki (19–25)', 'Otroci (26–34)', 'Mladostniki (35–40)']],
  [
    'Izdelki',
    ['Superge', 'Pohodni čevlji', 'Zimski škornji', 'Gumijasti škornji', 'Sandali', 'Copati', 'Tekaški čevlji', 'Smučarski čevlji'],
  ],
])

const menuItems = [
  { text: 'All', href: '#' },
  { text: 'Women', megamenu: womenMegamenu },
  { text: 'Men', megamenu: menMegamenu },
  { text: 'Kids', megamenu: kidsMegamenu },
  { text: 'Activited', href: '#6' },
  { text: 'Explore', href: '#5' },
]

// `breakpointMd` from the repo's 01_default.js
const BREAKPOINT_MD = 1023
// Grace period after the pointer leaves an item, so moving across to a neighbouring item swaps content instead of closing
const CLOSE_DELAY = 150
const isDesktop = () => window.innerWidth > BREAKPOINT_MD

const Icon = ({ name }) => <i data-component="at-icon" className={`icon icon-${name}`} />

// `megamenu` molecule
function Megamenu({ megamenu, state, instant, swappingOut, onBack, onMouseOver }) {
  // Columns with more than 7 links split into two lists
  const cols = megamenu.cols.map((col) => {
    const splitAt = Math.ceil(col.links.length / 2)
    return { ...col, lists: col.links.length > 7 ? [col.links.slice(0, splitAt), col.links.slice(splitAt)] : [col.links] }
  })

  return (
    <div
      className={`megamenu t-dropdown${state ? ` is-${state}` : ''}${instant ? ' t-dropdown--instant' : ''}${
        swappingOut ? ' is-swapping-out' : ''
      }`}
      data-origin="top-center"
      onMouseOver={onMouseOver}
    >
      <div className="container">
        <div className="megamenu__inner">
          {/* Alpina `button` atom: default size, gray, left icon */}
          <button
            type="button"
            data-component="at-button"
            className="megamenu__back btn btn--gray btn--with-icon btn--left-icon"
            onClick={onBack}
          >
            <span className="btn__text megamenu__back-text">{megamenu.backText}</span>
            <span className="btn__icon d-flex-cc">
              <i className="icon icon-chevron-left" aria-hidden="true" />
            </span>
          </button>
          <div className="megamenu__left">
            {cols.map(({ title, lists }) => {
              const renderList = (links, i) => (
                <ul key={i} className="megamenu__list">
                  {links.map((link) => (
                    <li key={link.text} className="megamenu__item">
                      <a href={link.href} className="megamenu__link">{link.text}</a>
                    </li>
                  ))}
                </ul>
              )

              return (
                <div key={title} className="megamenu__col">
                  {title && <div className="megamenu__title title">{title}</div>}
                  {lists.length > 1 ? (
                    <div className="megamenu__lists megamenu__lists--two-col">{lists.map(renderList)}</div>
                  ) : (
                    renderList(lists[0], 0)
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// `menu` molecule, with the hover/focus behaviour from menu.js ("refactor: open megamenu on hover")
function Menu({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  // The panel that just closed keeps `.is-closing` for --megamenu-exit-dur so its fade-out isn't cut short
  const [closingPanel, setClosingPanel] = useState(null)
  // Moving straight from one item to another swaps panels without animating, so only the content changes
  const [instant, setInstant] = useState(false)
  const openRef = useRef(null)
  const closingRef = useRef(null)
  const panelTimer = useRef(null)
  // Item the pointer just left: its panel lingers for CLOSE_DELAY, but its button drops back to default right away
  const [leavingIndex, setLeavingIndex] = useState(null)
  const itemRefs = useRef([])
  const closeTimer = useRef(null)
  // Panels whose content is still sliding out (several when hovering fast across items), each with its cleanup timer
  const [swappingOut, setSwappingOut] = useState([])
  const swapOuts = useRef(new Map())

  const cancelClose = () => clearTimeout(closeTimer.current)

  const panelAt = (index) => itemRefs.current[index]?.querySelector('.megamenu')
  const contentAt = (index) => panelAt(index)?.querySelector(':scope > .container')
  const resetContent = (index) => {
    contentAt(index)?.getAnimations().forEach((animation) => animation.cancel())
    const panel = panelAt(index)
    if (panel) panel.style.clipPath = ''
  }
  const endSwapOut = (index) => {
    clearTimeout(swapOuts.current.get(index))
    swapOuts.current.delete(index)
    setSwappingOut([...swapOuts.current.keys()])
  }
  // Stop any running swap animation on `el` and return where it currently is, so the next animation starts from there
  const freeze = (el) => {
    const style = getComputedStyle(el)
    const from = {
      opacity: style.opacity,
      transform: style.transform === 'none' ? 'translateX(0px)' : style.transform,
      filter: style.filter === 'none' ? 'blur(0px)' : style.filter,
    }
    el.getAnimations().forEach((animation) => animation.cancel())
    return from
  }

  // Switching items: old content slides away and fades out while the new content slides in from the other side.
  // Direction follows the pointer: moving right (Women → Men) pushes content right, moving back left pushes it left.
  // The outgoing panel sits on top with a transparent background, so the new panel's background shows throughout.
  const swapContent = (prev, next) => {
    const oldContent = contentAt(prev)
    const newContent = contentAt(next)
    if (!oldContent || !newContent) return

    const css = getComputedStyle(document.documentElement)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const direction = next > prev ? 1 : -1
    const num = (name, fallback) => parseFloat(css.getPropertyValue(name)) || fallback
    const distance = reduceMotion ? 0 : num('--megamenu-swap-x', 16) * direction
    const blur = `blur(${reduceMotion ? 0 : num('--megamenu-swap-blur', 2)}px)`
    const outMs = num('--megamenu-swap-out-dur', 175)
    const inMs = num('--megamenu-swap-in-dur', 300)
    const fadeInMs = num('--megamenu-swap-fade-in-dur', 225)
    const fadeDelay = num('--megamenu-swap-fade-delay', 30)
    const moveEase = css.getPropertyValue('--megamenu-swap-ease').trim() || 'cubic-bezier(0.32, 0.72, 0, 1)'
    const fadeEase = css.getPropertyValue('--megamenu-ease').trim() || 'cubic-bezier(0.23, 1, 0.32, 1)'

    // The incoming content may be mid swap-out (quick back-and-forth): continue from where it is, with no fade delay
    const resuming = newContent.getAnimations().length > 0
    const inFrom = resuming
      ? freeze(newContent)
      : { opacity: 0, transform: `translateX(${-distance}px)`, filter: blur }
    const outFrom = freeze(oldContent)

    // The incoming panel may itself be finishing a swap-out: take it back and drop its clip
    if (swapOuts.current.has(next)) endSwapOut(next)
    const newPanel = panelAt(next)
    newPanel.style.clipPath = ''

    // Incoming: the slide starts at once on a gentle decelerating curve; the fade waits a beat so the old text
    // is mostly gone before the new text becomes legible (no double-exposed lines), and blur softens the overlap
    newContent.animate([{ transform: inFrom.transform }, { transform: 'translateX(0px)' }], {
      duration: inMs,
      easing: moveEase,
    })
    newContent.animate([{ opacity: inFrom.opacity, filter: inFrom.filter }, { opacity: 1, filter: 'blur(0px)' }], {
      duration: fadeInMs,
      delay: resuming ? 0 : fadeDelay,
      easing: fadeEase,
      fill: 'backwards',
    })
    // Outgoing: quicker than the entrance, and its fade front-loads so it clears out of the way early
    oldContent.animate([{ transform: outFrom.transform }, { transform: `translateX(${distance}px)` }], {
      duration: outMs,
      easing: moveEase,
      fill: 'forwards',
    })
    oldContent.animate([{ opacity: outFrom.opacity, filter: outFrom.filter }, { opacity: 0, filter: blur }], {
      duration: outMs,
      easing: fadeEase,
      fill: 'forwards',
    })

    // Old content taller than the new panel would hang below its background: clip it at the new panel's bottom edge
    const oldPanel = panelAt(prev)
    const overhang = Math.max(0, oldPanel.offsetHeight - newPanel.offsetHeight)
    oldPanel.style.clipPath = overhang ? `inset(0 0 ${overhang}px 0)` : ''

    clearTimeout(swapOuts.current.get(prev))
    swapOuts.current.set(
      prev,
      setTimeout(() => {
        resetContent(prev)
        endSwapOut(prev)
      }, outMs),
    )
    setSwappingOut([...swapOuts.current.keys()])
  }

  const setOpen = (next) => {
    const prev = openRef.current
    if (prev === next) return

    // Re-hovering the item whose panel is still fading out retargets the transition instead of snapping
    const switching = next !== null && (prev !== null || (closingRef.current !== null && closingRef.current !== next))
    openRef.current = next
    closingRef.current = prev !== null && next === null ? prev : null
    clearTimeout(panelTimer.current)

    if (isDesktop() && prev !== null && next !== null) {
      swapContent(prev, next)
    } else if (next !== null) {
      // Fresh open: make sure no leftover swap animation is holding the content hidden
      if (swapOuts.current.has(next)) endSwapOut(next)
      resetContent(next)
    }

    setInstant(switching)
    setOpenIndex(next)
    setClosingPanel(closingRef.current)

    if (closingRef.current !== null) {
      const closeMs =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--megamenu-exit-dur')) || 150
      panelTimer.current = setTimeout(() => {
        closingRef.current = null
        setClosingPanel(null)
      }, closeMs)
    }
  }
  const hoverOpen = (index) => {
    if (!isDesktop()) return
    cancelClose()
    setLeavingIndex(null)
    setOpen(index)
  }

  useEffect(
    () => () => {
      cancelClose()
      clearTimeout(panelTimer.current)
      swapOuts.current.forEach((timer) => clearTimeout(timer))
    },
    [],
  )

  const hasFocus = (index) => itemRefs.current[index]?.contains(document.activeElement)
  const toggle = (index) => setOpen(openRef.current === index ? null : index)
  const closeUnlessFocused = (index) => {
    if (!hasFocus(index) && openRef.current === index) setOpen(null)
  }

  useEffect(() => {
    if (openIndex === null) return

    const onClick = (event) => {
      if (isDesktop() && !event.target.closest('.menu__item.has-megamenu') && !hasFocus(openIndex)) setOpen(null)
    }
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      itemRefs.current[openIndex]?.querySelector('.menu__link')?.focus()
      setOpen(null)
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
    // setOpen only reads refs, so the copy captured when openIndex changes is never stale
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex])

  return (
    <div data-component="mol-menu" className="menu">
      <nav aria-label="Primary navigation">
        <ul>
          {items.map((item, index) => {
            if (!item.megamenu) {
              return (
                <li key={item.text} className="menu__item level-1">
                  <a href={item.href} className="menu__link menu__link--href level-1">{item.text}</a>
                </li>
              )
            }

            const isOpen = openIndex === index

            return (
              <li
                key={item.text}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`menu__item level-1 has-megamenu${isOpen ? ' is-open-megamenu' : ''}${
                  leavingIndex === index ? ' is-leaving' : ''
                }`}
                onMouseOut={(event) => {
                  if (!isDesktop() || event.currentTarget.contains(event.relatedTarget) || hasFocus(index)) return
                  cancelClose()
                  setLeavingIndex(index)
                  closeTimer.current = setTimeout(() => {
                    setLeavingIndex(null)
                    closeUnlessFocused(index)
                  }, CLOSE_DELAY)
                }}
                onFocus={() => hoverOpen(index)}
                onBlur={() => {
                  if (isDesktop()) requestAnimationFrame(() => closeUnlessFocused(index))
                }}
              >
                <button
                  type="button"
                  className="menu__link menu__link--nohref level-1"
                  aria-expanded={isOpen}
                  onMouseOver={() => hoverOpen(index)}
                  onKeyDown={(event) => {
                    if (isDesktop() && event.key === ' ') event.preventDefault()
                  }}
                  onClick={(event) => {
                    if (!isDesktop()) {
                      event.stopPropagation()
                      toggle(index)
                    } else if (event.detail === 0) {
                      // Keyboard activation on desktop; mouse clicks are handled by hover
                      event.preventDefault()
                      toggle(index)
                    }
                  }}
                >
                  {item.text}
                  <Icon name="chevron-right" />
                </button>

                <Megamenu
                  megamenu={item.megamenu}
                  state={isOpen ? 'open' : closingPanel === index ? 'closing' : null}
                  instant={instant}
                  swappingOut={swappingOut.includes(index) && !isOpen}
                  onBack={() => setOpen(null)}
                  onMouseOver={() => hoverOpen(index)}
                />
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="menu__extra">
        <a className="btn btn--gray btn--large" href="#">
          <span className="btn__text">Wishlist</span>
          <span className="btn__icon"><Icon name="heart" /></span>
          <div className="header-main__right-link__number">10</div>
        </a>
        <a className="btn btn--gray btn--large" href="#">
          <span className="btn__text">Profile</span>
          <span className="btn__icon"><Icon name="user" /></span>
        </a>
      </div>

      <div className="menu__bottom-bar">
        {topBar.links.map((link) => (
          <a key={link.text} href={link.href} className="header-main__top-bar__link">
            {link.icon && <Icon name={link.icon} />}
            {link.text}
          </a>
        ))}
        <LanguageSwitch />
      </div>
    </div>
  )
}

function LanguageSwitch() {
  return (
    <div className="language-switch">
      <button type="button" className="language-switch__button d-flex-cc">
        <span className="p-none text--uppercase">{topBar.language.text}</span>
        <img src={topBar.language.image} alt={topBar.language.text} width="18" height="12" />
        <i data-component="at-icon" className="icon icon-chevron-down p-none" />
      </button>
    </div>
  )
}

// `site-header` module
function SiteHeader() {
  const headerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // site-header.js + 01_default.js: full-header / scroll classes and the --header-height variable
  useEffect(() => {
    const { body } = document
    body.classList.add('full-header')

    const header = headerRef.current
    const updateHeaderHeight = () => body.style.setProperty('--header-height', `${header.offsetHeight}px`)
    updateHeaderHeight()
    const observer = new ResizeObserver(updateHeaderHeight)
    observer.observe(header)

    let lastTop = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const top = window.scrollY
        body.classList.toggle('is-scrolled', top > 80)
        body.classList.toggle('is-scrolled-up', top > 80 && top < lastTop)
        lastTop = top
        ticking = false
      })
    }
    document.addEventListener('scroll', onScroll)

    return () => {
      observer.disconnect()
      document.removeEventListener('scroll', onScroll)
      body.classList.remove('full-header', 'is-scrolled', 'is-scrolled-up', 'is-open-menu')
      body.style.removeProperty('--header-height')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-open-menu', menuOpen)
  }, [menuOpen])

  return (
    <header data-component="mod-site-header" className="header-main" id="header-main" ref={headerRef}>
      <div className="header-main__top-bar">
        <div className="container">
          <div className="header-main__top-bar__inner">
            <div className="header-main__top-bar__text">
              <span>{topBar.text}</span>
            </div>
            <div className="header-main__top-bar__right">
              {topBar.links.map((link) => (
                <a key={link.text} href={link.href} className="header-main__top-bar__link">
                  {link.icon && <Icon name={link.icon} />}
                  {link.text}
                </a>
              ))}
              <LanguageSwitch />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="header-main__inner">
          <a href="#" aria-label="Logo" className="header-main__logo">
            <img className="no-lazzy" src="/header/logo.svg" alt="Logo" width="135" height="28" />
            <img className="logo-dark no-lazzy" src="/header/logo-dark.svg" alt="Logo" width="135" height="28" />
          </a>

          {/* `header-search` molecule: form only, the results dropdown isn't part of this sandbox */}
          <div className="header-search">
            <form className="header-search__form" onSubmit={(event) => event.preventDefault()}>
              <Icon name="search" />
              <div className="mod-input">
                <label htmlFor="headerSearch" className="sr-only">search</label>
                <input
                  id="headerSearch"
                  name="term"
                  type="text"
                  className="mod-input__field header-search__input"
                  placeholder="Search for products, blogs, FAQ..."
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="header-search__submit btn btn--default">
                <div className="btn__text">Search</div>
                <span className="btn__icon d-flex-cc"><i className="icon icon-chevron-right" aria-hidden="true" /></span>
              </button>
            </form>
          </div>

          <div className="header-main__right">
            <a className="header-main__right-link" href="#" aria-label="Wishlist">
              <Icon name="heart" />
              <div className="header-main__icon-items header-main__right-link__number d-flex-cc"><p>10</p></div>
            </a>
            <a className="header-main__right-link header-main__cart" href="#" aria-label="view cart">
              <Icon name="cart" />
              <div className="header-main__icon-items header-main__right-link__number d-flex-cc"><p>12</p></div>
            </a>
            <a className="header-main__right-link" href="#" aria-label="Profile">
              <Icon name="user" />
            </a>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="header-main__menu-wrapper">
          <button
            type="button"
            aria-expanded={menuOpen}
            className={`mobile-hamburger d-md-none${menuOpen ? ' is-open' : ''}`}
            aria-label="open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="bars" aria-hidden="true" />
            <span className="bars" aria-hidden="true" />
            <span className="bars" aria-hidden="true" />
          </button>

          <Menu items={menuItems} />
        </div>
      </div>
    </header>
  )
}

function NavigationPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Same content as the /hero-module page, so the megamenu opens over a real page */}
        <HeroModule
          title="Aliqua nisi magna incididunt eiusmod"
          text="Malesuada proin ullamcorper senectus lobortis eros quam dui elit."
          image="/hero/hero-image.webp"
          imageAlt="Image"
          buttons={[
            { text: 'Shop Women', href: '#' },
            { text: 'Shop Men', href: '#' },
          ]}
        />
      </main>
      {/* Rendered from footer.twig in the repo; dims the page while a megamenu is open */}
      <div className="header-main__overlay" />
    </>
  )
}

export default NavigationPage
