import { useEffect, useRef, useState } from 'react'
import Swiper from 'swiper'
import { EffectFade } from 'swiper/modules'
import { PatternAnimation } from './PatternAnimation'
import './ActivitiesModule.css'

// Same breakpoints as the original `01_default.js`
const BREAKPOINT_SM = 767
const BREAKPOINT_MD = 1023
const SLIDE_SPEED = 800
const FADE_SPEED = 400
const FADE_SHIFT = 56
const BUTTON_SHIFT = 24
const FADE_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)'

const isDesktop = () => window.innerWidth > BREAKPOINT_MD
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Moves an element to `toY` (and optionally `toOpacity`). A `fromY` of null starts from wherever it is
// now, so an interrupted hover never jumps. Current values are read before cancelling the running animation.
function shift(el, fromY, toY, toOpacity) {
  if (!el) return
  const { transform, opacity } = getComputedStyle(el)
  el.getAnimations().forEach((animation) => animation.cancel())
  const from = { transform: fromY === null && transform !== 'none' ? transform : `translateY(${fromY ?? 0}px)` }
  const to = { transform: `translateY(${toY}px)` }
  if (toOpacity !== undefined) {
    from.opacity = opacity
    to.opacity = toOpacity
  }
  el.animate([from, to], { duration: FADE_SPEED, easing: FADE_EASING, fill: 'forwards' })
}

// `section-margin` atom — the module's config sets no spacing size, so both resolve to margin--0
function SectionMargin() {
  return (
    <div data-component="at-section-margin" className="section-margin">
      <div data-component="at-margin" className="margin margin--0" />
    </div>
  )
}

export function ActivitiesModule({ title, items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperElRef = useRef(null)
  const swiperRef = useRef(null)
  // z-index handed to the most recently hovered slide, so slides stack in hover order, not DOM order
  const stackRef = useRef(1)

  useEffect(() => {
    const el = swiperElRef.current

    const initSlider = () => {
      swiperRef.current = new Swiper(el, {
        modules: [EffectFade],
        slidesPerView: 1,
        speed: SLIDE_SPEED,
        spaceBetween: 0,
        effect: isDesktop() ? 'fade' : 'slide',
        breakpoints: {
          767: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1023: {
            speed: FADE_SPEED,
            spaceBetween: 0,
            allowTouchMove: false,
            simulateTouch: false,
            // Desktop: crossfade between images on title hover
            fadeEffect: {
              crossFade: true,
            },
          },
        },
      })
    }

    // Port of `setupResponsiveSliders`: slider only above the mobile breakpoint
    const handleSlider = () => {
      if (window.innerWidth > BREAKPOINT_SM) {
        if (!swiperRef.current) initSlider()
      } else if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }

    handleSlider()

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleSlider, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      swiperRef.current?.destroy(true, true)
      swiperRef.current = null
    }
  }, [])

  const activate = (index) => {
    const swiper = swiperRef.current
    if (!isDesktop() || !swiper || index === swiper.activeIndex) return

    const outgoing = swiper.slides[swiper.activeIndex]
    const incoming = swiper.slides[index]
    const opacities = swiper.slides.map((slide) => parseFloat(getComputedStyle(slide).opacity))
    // How much of the incoming slide actually shows: its opacity times what the slides above let through.
    // Fading in from there means a slide brought back from under another one never pops to the top.
    const z = (slide) => Number(slide.style.zIndex) || 0
    const startOpacity = swiper.slides.reduce((share, slide, i) => {
      const above = z(slide) > z(incoming) || (z(slide) === z(incoming) && i > index)
      return above ? share * (1 - opacities[i]) : share
    }, opacities[index])
    // Fast hovering can bring back a slide that is still on screen: continue it from where it is
    const incomingVisible = startOpacity > 0.01

    // Crossfade with no white gap and no stale images: the newest slide goes on top of everything and
    // fades in, while every other slide is frozen as it is now. Once the new slide is fully opaque the
    // rest are hidden behind it. Overrides Swiper's own crossfade, which fades both slides at once.
    incoming.style.zIndex = ++stackRef.current
    swiper.slides.forEach((slide, i) => {
      slide.getAnimations().forEach((animation) => animation.cancel())
      if (slide !== incoming) slide.animate({ opacity: [opacities[i], opacities[i]] }, { duration: 0, fill: 'forwards' })
    })
    const fadeIn = incoming.animate({ opacity: [startOpacity, 1] }, { duration: FADE_SPEED, easing: FADE_EASING, fill: 'forwards' })
    fadeIn.onfinish = () => {
      swiper.slides.forEach((slide) => {
        if (slide === incoming) return
        slide.getAnimations().forEach((animation) => animation.cancel())
        slide.animate({ opacity: [0, 0] }, { duration: 0, fill: 'forwards' })
      })
    }

    // Hovering a lower link: old image and button drift down, new ones drop in from above. Reverse going up.
    if (!prefersReducedMotion()) {
      const direction = index > swiper.activeIndex ? 1 : -1
      shift(outgoing.querySelector('img'), null, FADE_SHIFT * direction)
      shift(incoming.querySelector('img'), incomingVisible ? null : -FADE_SHIFT * direction, 0)
      // The outgoing slide stays opaque under the incoming one, so its buttons fade out on their own
      // to avoid ghosted buttons, and fade back in if the slide returns while still visible
      shift(outgoing.querySelector('.activities-module__buttons'), null, BUTTON_SHIFT * direction, 0)
      shift(
        incoming.querySelector('.activities-module__buttons'),
        incomingVisible ? null : -BUTTON_SHIFT * direction,
        0,
        incomingVisible ? 1 : undefined,
      )
    }

    setActiveIndex(index)
    swiper.slideTo(index, FADE_SPEED)
  }

  const titleClass = (index) => `activities-module__title title title--h1${index === activeIndex ? ' is-active' : ''}`

  return (
    <section data-component="mod-activities-module" className="sc-general sc-activities-module" tabIndex={-1}>
      <SectionMargin />

      <div className="activities-module">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <div className="activities-module__left">
                {title && (
                  <div className="activities-module__main-title text--14 text--md">
                    <h2>{title}</h2>
                  </div>
                )}

                <div className="activities-module__left-inner">
                  {items.map((item, index) => (
                    <div key={item.title} className={titleClass(index)} onMouseEnter={() => activate(index)}>
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xs-12">
              <div className="activities-module__right" data-slider-parent>
                <div className="activities-module__right-inner">
                  <div className="swiper" ref={swiperElRef}>
                    <div className="swiper-wrapper">
                      {items.map((item, index) => (
                        <div key={item.title} className="swiper-slide">
                          <div className="activities-module__item">
                            <div
                              className={`activities-module__image bg-image covered-pointer overflow-h${
                                index === activeIndex ? ' is-active' : ''
                              }`}
                            >
                              <img src={item.image} alt={item.alt} width="686" height="704" className="no-lazy" />

                              <div className={titleClass(index)}>{item.title}</div>

                              {item.buttons?.length > 0 && (
                                <div className="activities-module__buttons">
                                  {item.buttons.map((button) => (
                                    <a
                                      key={button.text}
                                      data-component="at-button"
                                      className="btn btn--default btn--with-icon"
                                      href={button.href}
                                    >
                                      <span className="btn__text">{button.text}</span>
                                      <span className="btn__icon btn__icon--default d-flex-cc">
                                        <i data-component="at-icon" className="icon icon-chevron-right" />
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              )}

                              <div className="activities-module__pattern">
                                <PatternAnimation />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop: one static pattern over the slider, so it stays put while the images change */}
                <div className="activities-module__pattern activities-module__pattern--static">
                  <PatternAnimation />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionMargin />
    </section>
  )
}
