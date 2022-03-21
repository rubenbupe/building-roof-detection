import Header from "../src/components/Header/Header"
import dynamic from 'next/dynamic'

function MapScreen() {
  const Map = dynamic(
    () => import('../src/components/Map/Map'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  )
  return (
    <div>
      <Header/>
      <Map/>
    </div>
  )
}

export default MapScreen
