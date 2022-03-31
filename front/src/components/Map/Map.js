import Head from "next/head";
import Script from "next/script";
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useRef } from "react";
//import * as L from "leaflet";
//import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import * as tf from '@tensorflow/tfjs';
import * as Predictor from '../../helpers/predictions';
import { ArrowForwardCircle } from 'react-ionicons'



async function load_model() {
  const model = await tf.loadLayersModel("models/model.json");
  return model;
}


export default function Map() {
  const [screenshotter, setScreenshotter] = useState(null);
  const [model, setModel] = useState(null);

  const onButtonClick = () => {
    screenshotter?.takeScreen('image', {})
      .then(image => {
        if (model == null) { return; }

        let i = new Image();

        i.onload = async function () {
          Predictor.predictImage(model, i, 'prediction');
        };
        i.src = image;
      }).catch(e => {
        console.error(e.toString())
      })
  };


  useEffect(async () => {
    tf.setBackend('webgl');
    const L = await import('leaflet');
    const {SimpleMapScreenshoter} = await import('leaflet-simple-map-screenshoter');

    const map = L.map("map").setView([40.419215, -3.693358], 13);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      minZoom: 17,
      subdomains: []
    }).addTo(map);

    const cur_screenshoter = new SimpleMapScreenshoter({ hidden: true });
    setScreenshotter(cur_screenshoter);
    /* 
    Este funciona bien
    https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}

    Poco zoom
    https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}

    http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}   ->    ['mt0', 'mt1', 'mt2', 'mt3']
    */

    cur_screenshoter.addTo(map);

    load_model().then(model => {
      setModel(model);
    });

  }, []);

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
          integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
          crossOrigin=""
        ></link>
        <script src="https://docs.opencv.org/master/opencv.js" type="text/javascript" defer></script>
        <title>Proyecto Reconocimiento</title>
      </Head>
      <main>
        <div className="main-container-map">
          <div className="map-container">
            <div className="map" id="map" style={{ width: "600px", height: "600px" }} />
          </div>
          <span className="map-screenshot-button custom-button" id="button" onClick={onButtonClick}>Procesar imagen →</span>
          <div className="map-container">
            <canvas id='prediction' className="map" style={{ width: "600px", height: "600px" }} />
          </div>
        </div>
      </main>
    </div>
  );
}
