import { useEffect } from 'react'
import './alpina/css/bundle.css'
import './ActivitiesPage.css'
import './ProductPage2.css'
import markup from './pdp/body-2.html?raw'
import localDataSource from './pdp/local-data.js.txt?raw'

// Second product detail layout: same rebuilt Alpina markup as /product, but the gallery is one
// horizontal row of 1:1 slides that runs behind the buy box instead of a vertical thumbnail rail.
let scriptsLoaded = false

function loadScript(src) {
  return new Promise((resolve) => {
    const el = document.createElement('script')
    el.src = src
    el.onload = el.onerror = resolve
    document.body.appendChild(el)
  })
}

function ProductPage2() {
  useEffect(() => {
    if (scriptsLoaded) return
    scriptsLoaded = true
    // Sandbox: skip the first-visit region picker the site opens when this cookie is missing
    document.cookie = 'region_selected=true; path=/; max-age=31536000'
    new Function(`${localDataSource}; window.localData = localData;`)()
    loadScript('/pdp/js/vendor.js')
      .then(() => loadScript('/pdp/js/bundle.js'))
      .then(() => {
        // The bundle initialises on DOMContentLoaded/load, which already fired
        document.dispatchEvent(new Event('DOMContentLoaded'))
        window.dispatchEvent(new Event('load'))

        // The site only knows a vertical-thumbs + fading gallery, so this slider is initialised here
        const slider = document.querySelector('[data-slider-v2="product-showcase"]')
        if (slider && window.Swiper && !slider.swiper) {
          new window.Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 4,
            loop: true,
            grabCursor: true,
            mousewheel: { forceToAxis: true },
            pagination: { el: '.pdp-controls__pagination', clickable: true },
            navigation: { prevEl: '.pdp-controls__prev', nextEl: '.pdp-controls__next' },
          })
        }
      })
  }, [])

  // The class scopes this page's CSS so it beats the Alpina bundle, which loads after it in production
  return <div className="pdp-v2" style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: markup }} />
}

export default ProductPage2
