import Head from 'next/head'
import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';
import PhotoUpload from '../src/components/PhotoUpload/PhotoUpload';
export default function Home() {
  
  return (

    <div className="container">
      <Head>
        <title>Proyecto Reconocimiento</title>
        <link rel="icon" href="/favicon.ico" />
      
      </Head>
      <Header/>
    </div>
  )
}
