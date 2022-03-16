import Head from 'next/head'
import Header from '../src/components/Header/Header';
import PhotoUpload from '../src/components/PhotoUpload/PhotoUpload';
import Map from '../src/components/Map/Map';
export default function Home() {
  
  return (

    <div className="container">
      <Head>
        <title>Proyecto Reconocimiento</title>
        <link rel="icon" href="/favicon.ico" />
      
      </Head>
      <Header/>
      <main>

        <h1 className="title">
          Compiladores de Dani
        </h1>

        <p className="description">
          Proyectos IV Reconocimiento de Edificios
        </p>

      </main>
    </div>
  )
}
