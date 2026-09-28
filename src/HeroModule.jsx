import { useEffect, useRef } from 'react'
import { PatternAnimation } from './PatternAnimation'
import './HeroModule.css'

// Port of `playPatternAnimation` in the original `01_default.js`. Duration and stagger match the
// repo; its GSAP power2.out (easeOutCubic) is swapped for easeOutQuart.
const PATTERN_DURATION = 600
const PATTERN_STAGGER = 100
const PATTERN_EASING = 'cubic-bezier(0.25, 1, 0.5, 1)'

function playPatternAnimation(pattern) {
  const groups = [
    [...pattern.querySelectorAll('.pattern-animation__group-center')],
    [...pattern.querySelectorAll('.pattern-animation__group-left')],
    [...pattern.querySelectorAll('.pattern-animation__group-right')],
  ]

  groups.forEach((group) =>
    group.forEach((el, index) =>
      el.animate([{ transform: 'translate(0px, 0px)' }], {
        duration: PATTERN_DURATION,
        delay: index * PATTERN_STAGGER,
        easing: PATTERN_EASING,
        fill: 'forwards',
      }),
    ),
  )
}

// `section-margin` atom — the module's config sets no spacing size, so both resolve to margin--0
function SectionMargin() {
  return (
    <div data-component="at-section-margin" className="section-margin">
      <div data-component="at-margin" className="margin margin--0" />
    </div>
  )
}

export function HeroModule({ title, text, image, imageAlt, buttons = [] }) {
  const heroRef = useRef(null)

  // ScrollTrigger `start: 'top 80%'`: play once when the module's top crosses 80% of the viewport,
  // but not before the background image has loaded and decoded
  useEffect(() => {
    const hero = heroRef.current
    const pattern = hero.querySelector('.pattern-animation')
    const image = hero.querySelector('.hero-module__bg img')
    const imageReady = image ? image.decode().catch(() => {}) : Promise.resolve()
    let cancelled = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        imageReady.then(() => {
          if (!cancelled) playPatternAnimation(pattern)
        })
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    observer.observe(hero)

    return () => {
      cancelled = true
      observer.disconnect()
      pattern.querySelectorAll('.pattern-animation__group').forEach((el) => el.getAnimations().forEach((a) => a.cancel()))
    }
  }, [])

  return (
    <section data-component="mod-hero-module" className="sc-hero-module sc-general" tabIndex={-1} role="contentinfo">
      <SectionMargin />

      <div className="hero-module overflow-h" data-animated-pattern ref={heroRef}>
        {image && (
          <div className="hero-module__bg covered bg-image">
            <img src={image} alt={imageAlt} width="1440" height="740" />
          </div>
        )}

        {(title || text || buttons.length > 0) && (
          <div className="container">
            <div className="row">
              <div className="col-md-5 col-sm-8 col-xs-12">
                <div className="hero-module__content">
                  {title && (
                    <div data-component="at-title" className="title title--h2">
                      <h1>{title}</h1>
                    </div>
                  )}

                  {text && (
                    <div className="hero-module__text text--18 font-secondary">
                      <p>{text}</p>
                    </div>
                  )}

                  {buttons.length > 0 && (
                    <div className="hero-module__button-group">
                      {buttons.map((button) => (
                        <a key={button.text} data-component="at-button" className="btn btn--default btn--with-icon" href={button.href}>
                          <span className="btn__text">{button.text}</span>
                          <span className="btn__icon d-flex-cc">
                            <i className="icon icon-chevron-right" aria-hidden="true" />
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="hero-module__pattern">
          <PatternAnimation />
        </div>
      </div>

      <SectionMargin />
    </section>
  )
}
