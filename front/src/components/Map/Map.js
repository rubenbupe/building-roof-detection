import Head from 'next/head';
import Script from 'next/script';
import React, { useEffect, useState, useRef } from 'react';

import {
  interaction, layer, custom, control, //name spaces
  Interactions, Overlays, Controls,     //group
  Map as MapContainer, Layers, Overlay, Util    //objects
} from "react-openlayers";


export default function Map() {

  return (
    <div>
      <Head>
        <title>Proyecto Reconocimiento</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ border: '0', margin: '0' }} >

        <div id='container'>
          {/*  <MapContainer id="leafletMapid" className="mapdiv" style={{ height: '70vh', aspectRatio: '1', overflow: 'hidden', borderRadius: '2%' }}
            center={[37.7749, -122.4194]} zoom={18} scrollWheelZoom={false}>
            <TileLayer
              url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
              maxZoom={20}
              subdomains={['mt1', 'mt2', 'mt3']}
            />
            <PrintControl ref={printControl} position="topleft" sizeModes={['Current']} hideControlContainer={false} />

          </MapContainer> */}
          <MapContainer style={{ height: '70vh', aspectRatio: '1', overflow: 'hidden', borderRadius: '2%' }}
           view={{ center: [0, 0], zoom: 2 }} onClick={() => {}}>
            <Layers>
              <layer.Tile
                  url='https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                  subdomains={['mt1', 'mt2', 'mt3']}
                  />
              <layer.Vector zIndex="1" />
            </Layers>
          </MapContainer>
        </div>
      </main>
    </div>
  )
}