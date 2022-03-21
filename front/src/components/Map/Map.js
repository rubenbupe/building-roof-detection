import Head from "next/head";
import Script from "next/script";
import React, { useEffect, useState, useRef } from "react";
import * as L from "leaflet";
// import script after leaflet
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";


export default function Map() {
const [screenshotter, setScreenshotter] = useState(new SimpleMapScreenshoter({hidden:true}));

  useEffect(() => {
    
    var map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map);
    screenshotter.addTo(map);
  }, []);

  const onButtonClick =(image)=>{
  
    screenshotter.takeScreen('image', {
        
    }).then(image => {
        document.getElementById('screens').src=image

    }).catch(e => {
        alert(e.toString())
    })

};

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
          integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
          crossorigin=""
        ></link>
        <title>Proyecto Reconocimiento</title>
      </Head>
      <main style={{ border: "0", margin: "0" }}>
        <div id="map" style={{ width: "600px", height: "600px" }}></div>
        <button id="button" onClick={onButtonClick}>  Show screenshot</button>
        <img id="screens" style={{ width: "600px", height: "600px" }}></img>
      </main>
    </div>
  );
}
