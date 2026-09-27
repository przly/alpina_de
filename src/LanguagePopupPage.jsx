import { useEffect, useRef, useState } from 'react'
import './alpina/css/bundle.css'
import './ActivitiesPage.css'
import './LanguagePopupPage.css'

const flag = (code) => `https://flagcdn.com/w40/${code}.png`

const countries = [
  { value: 'si', label: 'Slovenia', image: flag('si') },
  { value: 'hr', label: 'Croatia', image: flag('hr') },
  { value: 'at', label: 'Austria', image: flag('at') },
  { value: 'de', label: 'Germany', image: flag('de') },
  { value: 'it', label: 'Italy', image: flag('it') },
  { value: 'rs', label: 'Serbia', image: flag('rs') },
  { value: 'ba', label: 'Bosnia and Herzegovina', image: flag('ba') },
]

const languages = [
  { value: 'sl', label: 'Slovenščina' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'hr', label: 'Hrvatski' },
  { value: 'it', label: 'Italiano' },
]

// `dropdown dropdown--tertiary` atom, as used inside `language-form`
function Dropdown({ label, options, value, onChange, open, onToggle }) {
  const selected = options.find((option) => option.value === value)

  return (
    <div className={`dropdown dropdown--tertiary is-selected${open ? ' is-open' : ''}`}>
      <span className="dropdown__label">{label}</span>

      <button type="button" className="dropdown__placeholder" aria-haspopup="listbox" aria-expanded={open} onClick={onToggle}>
        <span className="dropdown__placeholder-text">
          {selected.image && (
            <span className="dropdown__placeholder-image">
              <img src={selected.image} alt="" width="18" height="12" />
            </span>
          )}
          {selected.label}
        </span>
        <i data-component="at-icon" className="icon icon-chevron-down" />
      </button>

      <div className="dropdown__list">
        <div className="dropdown__list-inner" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              tabIndex={open ? 0 : -1}
              className={`dropdown__list-option${option.value === value ? ' is-active' : ''}`}
              onClick={() => onChange(option.value)}
            >
              {option.image && (
                <span className="dropdown__list-image">
                  <img src={option.image} alt="" width="18" height="12" />
                </span>
              )}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LanguagePopup({ open, onClose }) {
  const [country, setCountry] = useState('si')
  const [language, setLanguage] = useState('sl')
  const [openDropdown, setOpenDropdown] = useState(null)

  // Reset any open dropdown so the popup never reopens with a list already expanded
  const close = () => {
    setOpenDropdown(null)
    onClose()
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      // First Escape closes an open dropdown, the next one closes the popup
      if (openDropdown) setOpenDropdown(null)
      else close()
    }
    const onPointerDown = (event) => {
      if (!event.target.closest('.dropdown')) setOpenDropdown(null)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  })

  const toggle = (name) => setOpenDropdown((current) => (current === name ? null : name))

  const select = (setter) => (value) => {
    setter(value)
    setOpenDropdown(null)
  }

  return (
    <div
      className={`language-switch__form${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-popup-title"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="language-switch__form-overlay" onClick={close} />

      <div className="language-switch__form-inner">
        <div className="language-switch__form-top">
          <div id="language-popup-title" className="language-switch__form-title">
            Select country and language
          </div>
          <button type="button" className="language-switch__form-close" aria-label="Close" onClick={close}>
            <i data-component="at-icon" className="icon icon-close" />
          </button>
        </div>

        <form
          data-component="mol-language-form"
          className="language-form"
          onSubmit={(event) => {
            event.preventDefault()
            close()
          }}
        >
          <Dropdown
            label="Country"
            options={countries}
            value={country}
            onChange={select(setCountry)}
            open={openDropdown === 'country'}
            onToggle={() => toggle('country')}
          />
          <Dropdown
            label="Language"
            options={languages}
            value={language}
            onChange={select(setLanguage)}
            open={openDropdown === 'language'}
            onToggle={() => toggle('language')}
          />

          <button type="submit" data-component="at-button" className="language-form__button btn btn--default btn--with-icon">
            <span className="btn__text">Confirm</span>
            <span className="btn__icon btn__icon--default d-flex-cc">
              <i data-component="at-icon" className="icon icon-chevron-right" />
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

function LanguagePopupPage() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <main className="language-popup-page">
      <button
        ref={triggerRef}
        type="button"
        data-component="at-button"
        className="btn btn--default btn--with-icon"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="btn__text">Change language</span>
        <span className="btn__icon btn__icon--default d-flex-cc">
          <i data-component="at-icon" className="icon icon-chevron-right" />
        </span>
      </button>

      <LanguagePopup open={open} onClose={close} />
    </main>
  )
}

export default LanguagePopupPage
