import './alpina/css/bundle.css'
import './ActivitiesPage.css'
import { HeroModule } from './HeroModule'

// Content from the `default` variant in `hero-module.config.json`
function HeroPage() {
  return (
    <main>
      <HeroModule
        title="Aliqua nisi magna incididunt eiusmod"
        text="Malesuada proin ullamcorper senectus lobortis eros quam dui elit."
        image="/hero/hero-image.webp"
        imageAlt="Image"
        buttons={[
          { text: 'Shop Women', href: '#' },
          { text: 'Shop Men', href: '#' },
        ]}
      />
    </main>
  )
}

export default HeroPage
