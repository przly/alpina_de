import './App.css'
import { ProductCard } from './ProductCard'

const productCardVariants = [
  { image: '/product-card-1.webp', alt: 'E30 CL - črna' },
  { image: '/product-card-2.webp', alt: 'E30 CL - siva' },
  { image: '/product-card-3.webp', alt: 'E30 CL - rdeča' },
  { image: '/product-card-4.webp', alt: 'E30 CL - modra' },
]

const productCards = [
  {
    id: 'product-card-1',
    variants: productCardVariants,
    hoverImage: '/product-card-hover.webp',
    topTag: { text: 'Novo', color: 'red' },
    bottomTag: { text: 'Koda: BLACKFRIDAY', color: 'blue' },
    title: 'E30 CL',
    text: 'Obutev za tek na smučeh',
    price: '199,90 €',
    priceSlashed: '249,90 €',
    discount: '- 20 €',
    lowestPrice: 'Najnižja cena zadnjih 30 dni: 219,90 €',
    href: '#',
  },
  {
    id: 'product-card-2',
    variants: [
      { image: '/product-card-3.webp', alt: 'Onyx - rdeča' },
      { image: '/product-card-5.webp', alt: 'Onyx - siva' },
      { image: '/product-card-6.webp', alt: 'Onyx - črna' },
    ],
    hoverImage: '/product-card-hover.webp',
    topTag: { text: '-15 %' },
    title: 'Onyx',
    text: 'Tekaški čevlji za rekreativce',
    price: '169,90 €',
    priceSlashed: '199,90 €',
    wishlistActive: true,
    href: '#',
  },
  {
    id: 'product-card-3',
    variants: [
      { image: '/product-card-2.webp', alt: 'Cross Country - siva' },
      { image: '/product-card-4.webp', alt: 'Cross Country - modra' },
    ],
    title: 'Cross Country',
    text: 'Tekmovalna obutev za tek na smučeh',
    price: '289,00 €',
    href: '#',
  },
]

function App() {
  return (
    <main className="product-card-page">
      <div className="product-card-grid">
        {productCards.map((card) => (
          <ProductCard key={card.id} {...card} />
        ))}
      </div>
    </main>
  )
}

export default App
