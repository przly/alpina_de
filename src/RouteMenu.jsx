import { useEffect, useRef, useState } from 'react'
import './RouteMenu.css'

export default function RouteMenu({ routes }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = window.location.pathname.replace(/\/+$/, '') || '/'
  const currentLabel = routes.find((route) => route.path === current)?.label ?? 'Routes'

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <nav className="route-menu" ref={rootRef}>
      <button
        type="button"
        className="route-menu__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {currentLabel}
        <svg className="route-menu__chevron" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ul className="route-menu__list" data-open={open}>
        {routes.map((route) => (
          <li key={route.path}>
            <a
              className="route-menu__item"
              href={route.path}
              aria-current={route.path === current ? 'page' : undefined}
              tabIndex={open ? 0 : -1}
            >
              <span>{route.label}</span>
              <span className="route-menu__path">{route.path}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
