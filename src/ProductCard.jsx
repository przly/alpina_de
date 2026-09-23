import { Heart } from 'lucide-react'
import { useState } from 'react'
import './ProductCard.css'

function Tag({ text, color }) {
  if (!text) return null
  return <span className={`product-card__tag tag ${color ?? ''}`}>{text}</span>
}

export function ProductCard({
  variants,
  topTag,
  bottomTag,
  title,
  text,
  price,
  priceSlashed,
  discount,
  lowestPrice,
  hoverImage,
  wishlistActive: initialWishlistActive = false,
  href = '#',
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [wishlistActive, setWishlistActive] = useState(initialWishlistActive)

  function handleWishlistClick(event) {
    event.preventDefault()
    event.stopPropagation()
    setWishlistActive((value) => !value)
  }

  return (
    <article className="product-card">
      <div className="product-card__main-img" data-hover-image={Boolean(hoverImage)}>
        {topTag && (
          <div className="product-card__top-tag">
            <Tag color={topTag.color} text={topTag.text} />
          </div>
        )}

        {bottomTag && (
          <div className="product-card__bottom-tag">
            <Tag color={bottomTag.color} text={bottomTag.text} />
          </div>
        )}

        <div className="product-card__slides">
          {variants.map((variant, index) => (
            <div
              className={`product-card__slide${index === activeIndex ? ' is-active' : ''}`}
              key={variant.image}
            >
              <img alt={variant.alt} height="450" src={variant.image} width="450" />
            </div>
          ))}
        </div>

        {hoverImage && (
          <div className="product-card__hover-image">
            <img alt="" height="450" src={hoverImage} width="450" />
          </div>
        )}

        <button
          aria-label={wishlistActive ? 'Odstrani z želja' : 'Dodaj med želje'}
          className={`product-card__wishlist${wishlistActive ? ' is-active' : ''}`}
          onClick={handleWishlistClick}
          type="button"
        >
          <Heart
            className="product-card__wishlist-icon"
            fill={wishlistActive ? 'currentColor' : 'none'}
            size={16}
            strokeWidth={1.75}
          />
        </button>
      </div>

      {variants.length > 1 && (
        <div className="product-card__thumbnails">
          {variants.map((variant, index) => (
            <button
              className={`product-card__thumbnail${index === activeIndex ? ' is-active' : ''}`}
              key={variant.image}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <img alt={variant.alt} height="35" src={variant.image} width="35" />
            </button>
          ))}
        </div>
      )}

      <div className="product-card__title">{title}</div>
      <div className="product-card__text">{text}</div>

      <div className="product-card__footer">
        {priceSlashed && (
          <div className="product-card__price-slashed">
            <s>{priceSlashed}</s>
          </div>
        )}

        <div className="product-card__footer-bottom">
          <div className="product-card__price">{price}</div>
          {discount && <span className="product-card__tag tag blue">{discount}</span>}
          {lowestPrice && <div className="product-card__lowest-price">{lowestPrice}</div>}
        </div>
      </div>

      <a aria-label={title} className="product-card__link" href={href} />
    </article>
  )
}
