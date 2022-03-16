import Head from 'next/head'


export default function Map() {
    return (
        <div>
      <Head>
        <title>Proyecto Reconocimiento</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.js"></script>
        <link type="text/css" rel="stylesheet" href="https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.css"/>
        <script type="module" onLoad={'setUp()'} src='/js/map.js' defer></script>
        <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"></script>
        <script
      src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
      integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
      crossorigin=""
    ></script>
      </Head>
      <main  style={{border: '0', margin: '0'}}>

      <div id='container'>
        <div id="leafletMapid" class="mapdiv" style={{height: '70vh', aspectRatio: '1', overflow: 'hidden', borderRadius: '2%'}}  ></div>
       </div> 
       <button id="snapshot-button">
         Hacer captura
    </button>
      </main> 

    </div>
    )
  }