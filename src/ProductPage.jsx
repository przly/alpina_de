import { useEffect } from 'react'
import './alpina/css/bundle.css'
import './ActivitiesPage.css'
import './ProductPage.css'
import markup from './pdp/body.html?raw'
import localDataSource from './pdp/local-data.js.txt?raw'

// Product detail page reconstructed from the Alpina preview (components/detail/product-detail.html).
// The markup is the real rendered output; the site's own vendor/bundle scripts are loaded after it
// mounts so the Swiper galleries, dropdowns, modals and size selector behave like the original.
let scriptsLoaded = false

function loadScript(src) {
  return new Promise((resolve) => {
    const el = document.createElement('script')
    el.src = src
    el.onload = el.onerror = resolve
    document.body.appendChild(el)
  })
}

function ProductPage() {
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
      })
  }, [])

  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: markup }} />
}

export default ProductPage
