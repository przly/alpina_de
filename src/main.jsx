import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RouteMenu from './RouteMenu.jsx'

// Lazy so the Alpina site stylesheet only loads on its own route and never touches the product card page
const routes = {
  '/activities-module': { label: 'Activities module', load: () => import('./ActivitiesPage.jsx') },
  '/language-popup': { label: 'Language popup', load: () => import('./LanguagePopupPage.jsx') },
}

const menuRoutes = [
  { path: '/', label: 'Product card' },
  ...Object.entries(routes).map(([path, { label }]) => ({ path, label })),
]

const route = routes[window.location.pathname.replace(/\/+$/, '')]
const Page = route ? (await route.load()).default : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
    <RouteMenu routes={menuRoutes} />
  </StrictMode>,
)
