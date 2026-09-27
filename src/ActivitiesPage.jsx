import './alpina/css/bundle.css'
import './ActivitiesPage.css'
import { ActivitiesModule } from './ActivitiesModule'

const items = [
  { title: 'Innovation', image: '/activities/innovation.webp', alt: 'Close-up of a running shoe on a trail' },
  { title: 'Alpine', image: '/activities/alpine.webp', alt: 'Two hikers resting below a mountain peak' },
  { title: 'Nordic', image: '/activities/nordic.webp', alt: 'Runner stretching on a bridge' },
  { title: 'Outdoor', image: '/activities/outdoor.webp', alt: 'Hiker walking a forest trail' },
  { title: 'Heavy duty', image: '/activities/heavy-duty.webp', alt: 'Two climbers with helmets crossing a scree slope' },
  { title: 'Fashion', image: '/activities/fashion.webp', alt: 'Runner touching the toe of their shoe on a road' },
].map((item) => ({ ...item, buttons: [{ text: `Shop ${item.title}`, href: '#' }] }))

function ActivitiesPage() {
  return (
    <main>
      <ActivitiesModule title="Activities" items={items} />
    </main>
  )
}

export default ActivitiesPage
