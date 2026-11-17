import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import './alpina/css/bundle.css'
import './ActivitiesPage.css'
import './SideCartPage.css'

const FREE_SHIPPING_FROM = 500

// Alpina's mobile breakpoint (`$breakpoint-xs-only`)
const mobileQuery = window.matchMedia('(max-width: 767px)')

const subscribeMobile = (onChange) => {
  mobileQuery.addEventListener('change', onChange)
  return () => mobileQuery.removeEventListener('change', onChange)
}

const useIsMobile = () => useSyncExternalStore(subscribeMobile, () => mobileQuery.matches)

const initialItems = [
  {
    id: 'e30-cl',
    title: 'E30 CL',
    image: '/product-card-1.webp',
    details: ['Black', 'EU 42'],
    price: 199.9,
    priceOld: 249.9,
    quantity: 1,
    tag: 'Koda: BLACKFRIDAY',
  },
  {
    id: 'onyx',
    title: 'Onyx',
    image: '/product-card-3.webp',
    details: ['Red', 'EU 43'],
    price: 169.9,
    priceOld: 199.9,
    quantity: 1,
  },
  {
    id: 'cross-country',
    title: 'Cross Country',
    image: '/product-card-4.webp',
    details: ['Blue', 'EU 41'],
    price: 289,
    quantity: 1,
  },
  {
    id: 'e30-cl-gray',
    title: 'E30 CL',
    image: '/product-card-2.webp',
    details: ['Gray', 'EU 44'],
    price: 199.9,
    priceOld: 249.9,
    quantity: 1,
  },
  {
    id: 'onyx-gray',
    title: 'Onyx',
    image: '/product-card-5.webp',
    details: ['Gray', 'EU 42'],
    price: 169.9,
    priceOld: 199.9,
    quantity: 1,
  },
  {
    id: 'onyx-black',
    title: 'Onyx',
    image: '/product-card-6.webp',
    details: ['Black', 'EU 45'],
    price: 169.9,
    priceOld: 199.9,
    quantity: 1,
  },
  {
    id: 'cross-country-gray',
    title: 'Cross Country',
    image: '/product-card-2.webp',
    details: ['Gray', 'EU 40'],
    price: 289,
    quantity: 1,
  },
  {
    id: 'e30-cl-red',
    title: 'E30 CL',
    image: '/product-card-3.webp',
    details: ['Red', 'EU 43'],
    price: 199.9,
    priceOld: 249.9,
    quantity: 1,
  },
]

const formatPrice = (value) => `${value.toFixed(2).replace('.', ',')} €`

// `quantity-counter.twig`
function QuantityCounter({ value, onChange }) {
  return (
    <div data-component="mol-quantity-counter" className="quantity-counter" role="group" aria-label="Quantity">
      <button
        type="button"
        className={`quantity-counter__button d-flex-cc quantity-counter__button--remove${value <= 1 ? ' is-disabled' : ''}`}
        aria-label="Decrease quantity"
        aria-disabled={value <= 1}
        onClick={() => value > 1 && onChange(value - 1)}
      >
        <i data-component="at-icon" className="icon icon-minus" aria-hidden="true" />
      </button>
      <input className="quantity-counter__input" type="text" value={value} aria-label="Quantity" aria-live="polite" readOnly />
      <button
        type="button"
        className="quantity-counter__button d-flex-cc quantity-counter__button--add"
        aria-label="Increase quantity"
        aria-disabled="false"
        onClick={() => onChange(value + 1)}
      >
        <i data-component="at-icon" className="icon icon-plus" aria-hidden="true" />
      </button>
    </div>
  )
}

// `free-shipping-indicator.twig`
function FreeShippingIndicator({ total }) {
  const remaining = Math.max(FREE_SHIPPING_FROM - total, 0)
  const progress = Math.min((total / FREE_SHIPPING_FROM) * 100, 100)

  return (
    <div data-component="mol-free-shipping-indicator" className="free-shipping-indicator bg-gray-50 border-gray-200 rounded-16">
      <div className="free-shipping-indicator__text text--gray-950 text--16 z-top">
        <p>
          {remaining > 0 ? (
            <>
              Add <strong>{formatPrice(remaining)} for free shipping!</strong>
            </>
          ) : (
            <>
              You have unlocked <strong>free shipping!</strong>
            </>
          )}
        </p>
      </div>

      <div className="free-shipping-indicator__inner z-top">
        <div className="free-shipping-indicator__progress-bar border-gray-200">
          {/* `is-small` below 15%, as in free-shipping-indicator.js */}
          <div
            className={`free-shipping-indicator__progress-bar-inner${progress < 15 ? ' is-small' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="free-shipping-indicator__texts text--10 text--gray-500">
          <div className="free-shipping-indicator__amount free-shipping-indicator__amount--start">
            <span>0 €</span>
            <span>= Shipping: 9,99 €</span>
          </div>
          <div className="free-shipping-indicator__amount free-shipping-indicator__amount--end">
            +{FREE_SHIPPING_FROM} €<span>= Free shipping</span>
            <i data-component="at-icon" className="icon icon-party" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}

// `cart-view.twig`
function CartView({ items, onQuantity, onRemove }) {
  return (
    <div data-component="mol-cart-view" className="cart-view">
      <div className="cart-view__inner">
        {items.map((item) => (
          <div key={item.id} className="cart-view__item">
            <div className="cart-view__item-inner text--12 p-relative">
              <div className="cart-view__image overflow-h rounded-8 bg-gray-100 border-gray-200 full-image">
                <img src={item.image} alt={item.title} width="109" height="154" />
              </div>

              <div className="cart-view__content">
                <div className="cart-view__content-left">
                  <div className="cart-view__heading title text--sb">{item.title}</div>

                  <div className="cart-view__info info-list">
                    {item.details.map((detail) => (
                      <div key={detail} className="info-list__item">
                        {detail}
                      </div>
                    ))}
                  </div>

                  <div className="cart-view__counter">
                    <QuantityCounter value={item.quantity} onChange={(quantity) => onQuantity(item.id, quantity)} />
                  </div>
                </div>

                <div className="cart-view__footer">
                  {item.tag && <span className="tag blue">{item.tag}</span>}

                  <div className="cart-view__amount">
                    <div className="cart-view__amount-left">
                      {item.priceOld && (
                        <span className="cart-view__old-price text--12 text--gray-400">
                          <del>{formatPrice(item.priceOld * item.quantity)}</del>
                        </span>
                      )}
                      <span className="cart-view__price text--16 text--sb">{formatPrice(item.price * item.quantity)}</span>
                    </div>

                    <button type="button" className="cart-view__delete bg-gray-100 d-flex-cc" aria-label="Delete Item" onClick={() => onRemove(item.id)}>
                      <i data-component="at-icon" className="icon icon-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <a href="#" aria-label={item.title} className="cart-view__link stretched-link" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Sandbox-only: scrolling list with a fade at whichever edge still has items hidden behind it
function ScrollFade({ children }) {
  const scrollRef = useRef(null)
  const [fade, setFade] = useState({ top: false, bottom: false })

  useEffect(() => {
    const el = scrollRef.current

    const update = () => {
      const top = el.scrollTop > 0
      const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1
      setFade((current) => (current.top === top && current.bottom === bottom ? current : { top, bottom }))
    }

    // Fires once on observe, then whenever the list or its items change size
    const observer = new ResizeObserver(update)
    observer.observe(el)
    observer.observe(el.firstElementChild)
    el.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <div className="cart-popup__scroll" data-fade-top={fade.top} data-fade-bottom={fade.bottom}>
      <div ref={scrollRef} className="cart-popup__body">
        <div className="cart-popup__body-inner">{children}</div>
      </div>
    </div>
  )
}

// `cart-popup.twig` + `cart-popup-content-axios.twig`
function SideCart({ open, onClose }) {
  const [items, setItems] = useState(initialItems)
  const closeRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!open) return

    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    // Keep the page behind the cart from scrolling while it is open
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const setQuantity = (id, quantity) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)))

  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id))

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const empty = items.length === 0

  const header = (
    <div className="cart-popup__header">
      <div className="cart-popup__title">
        <h2 id={empty ? undefined : 'side-cart-title'} data-component="at-title" className="title title--h4">
          Your bag ({count})
        </h2>
      </div>
    </div>
  )

  return (
    <div
      data-component="mol-cart-popup"
      className={`cart-popup${empty ? ' cart-popup--empty' : ''}${open ? ' is-cart-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Your bag"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="cart-popup__overlay covered" onClick={onClose} />

      <div className="cart-popup__inner">
        <button ref={closeRef} type="button" className="cart-popup__close d-flex-cc bg-gray-100" aria-label="Close Popup" onClick={onClose}>
          <i data-component="at-icon" className="icon icon-close" aria-hidden="true" />
        </button>

        <div className="cart-popup__content">
          {header}

          {/* Fixed under the title on desktop and tablet; on mobile it scrolls away with the items */}
          {!isMobile && <FreeShippingIndicator total={total} />}

          {/* Sandbox-only wrappers: the items scroll in `__body`, `__footer` stays anchored to the bottom */}
          <ScrollFade>
            {isMobile && <FreeShippingIndicator total={total} />}
            <CartView items={items} onQuantity={setQuantity} onRemove={remove} />
          </ScrollFade>

          <div className="cart-popup__footer">
            <div className="cart-popup__total text--sb text--18">
              <div className="cart-popup__total-row">
                <div className="cart-popup__total-left">Total</div>
                <div className="cart-popup__total-right">{formatPrice(total)}</div>
              </div>
            </div>

            <div className="cart-popup__button-group">
              <a href="#" data-component="at-button" className="btn btn--gray btn--large btn--with-icon btn--left-icon">
                <span className="btn__text">Go to cart</span>
                <span className="btn__icon d-flex-cc">
                  <i className="icon icon-shopping-basket" aria-hidden="true" />
                </span>
              </a>
              <a href="#" data-component="at-button" className="btn btn--default btn--large btn--with-icon">
                <span className="btn__text">Proceed to checkout</span>
                <span className="btn__icon btn__icon--default d-flex-cc">
                  <i data-component="at-icon" className="icon icon-chevron-right" aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="cart-popup__empty">
          {header}

          <div className="cart-popup__empty-body text-center d-flex-cc">
            <div className="cart-popup__empty-image">
              <img src="/side-cart/empty-cart.svg" alt="" width="282" height="138" />
            </div>
            <div className="cart-popup__empty-title">
              <h2 data-component="at-title" className="title title--h5">
                Your bag is currently empty.
              </h2>
            </div>
            <div className="cart-popup__empty-text text--14 text--md text--gray-500">
              Find something you like and add it to the cart.
            </div>
            {/* Sandbox-only: the original links to the shop */}
            <button type="button" data-component="at-button" className="btn btn--default btn--with-icon" onClick={() => setItems(initialItems)}>
              <span className="btn__text">Refill cart</span>
              <span className="btn__icon btn__icon--default d-flex-cc">
                <i data-component="at-icon" className="icon icon-chevron-right" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SideCartPage() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <main className="side-cart-page">
      <button
        ref={triggerRef}
        type="button"
        data-component="at-button"
        className="btn btn--default btn--left-icon"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="btn__text">Open cart</span>
        <span className="btn__icon btn__icon--default d-flex-cc">
          <i data-component="at-icon" className="icon icon-cart" />
        </span>
      </button>

      <SideCart open={open} onClose={close} />
    </main>
  )
}

export default SideCartPage
