import Header from "../src/components/Header/Header"
import dynamic from 'next/dynamic'
import Footer from '../src/components/Footer/Footer';

function MapScreen() {
  const Map = dynamic(
    () => import('../src/components/Map/Map'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  )
  return (
    <div>
      <Header/>
      <Map/>
      <Footer/>
    </div>
  )
}

export default MapScreen
