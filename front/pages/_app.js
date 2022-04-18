import '../styles/globals.scss'
import '../styles/input-styling.scss';

import '../src/components/Header/Header.scss';
import '../src/components/Footer/Footer.scss';
import '../src/components/Map/Map.scss';
import '../src/components/PhotoUpload/PhotoUpload.scss';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp