import Head from "next/head";
import Script from "next/script";
import React, { useEffect, useState, useRef } from "react";
import * as L from "leaflet";
// import script after leaflet
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import * as tf from '@tensorflow/tfjs';
import cv from "@techstark/opencv-js";


tf.setBackend('webgl');

const pascalvoc = [[ 0,0,0 ],[ 128,0,0 ],[ 0,128,0 ],
                    [ 128,128,0 ],[ 0,0,128 ],[ 128,0,128 ],
                    [ 0,128,128 ],[ 128,128,128 ],[ 64,0,0 ],
                    [ 192,0,0 ],[ 64,128,0 ],[ 192,128,0 ],
                    [ 64,0,128 ],[ 192,0,128 ],[ 64,128,128 ],
                    [ 192,128,128 ],[ 0,64,0 ],[ 128,64,0 ],
                    [ 0,192,0 ],[ 128,192,0 ],[ 0,64,128 ],
                    [ 128,64,128 ],[ 0,192,128 ],[ 128,192,128 ],
                    [ 64,64,0 ],[ 192,64,0 ],[ 64,192,0 ],
                    [ 192,192,0 ],[ 64,64,128 ],[ 192,64,128 ],
                    [ 64,192,128 ],[ 192,192,128 ],[ 0,0,64 ],
                    [ 128,0,64 ],[ 0,128,64 ],[ 128,128,64 ],
                    [ 0,0,192 ],[ 128,0,192 ],[ 0,128,192 ],
                    [ 128,128,192 ],[ 64,0,64 ]];

async function load_model() {
  const model = await tf.loadLayersModel("http://127.0.0.1:8080/model.json");
  return model;
}


export default function Map() {
  const [screenshotter, setScreenshotter] = useState(new SimpleMapScreenshoter({ hidden: true }));
  const [model, setModel] = useState(null);
  const predictionRef = useRef();

  const watershed = (tensor) => {
    let src = new cv.Mat(tensor.arraySync(), cv.CV_8UC4);
    let dst = new cv.Mat();
    let gray = new cv.Mat();
    let opening = new cv.Mat();
    let coinsBg = new cv.Mat();
    let coinsFg = new cv.Mat();
    let distTrans = new cv.Mat();
    let unknown = new cv.Mat();
    let markers = new cv.Mat();

    document.getElementById('status').innerHTML = "OpenCV loading";

    // gray and threshold image
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    // get background
    let M = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.erode(gray, gray, M);
    cv.dilate(gray, opening, M);
    cv.dilate(opening, coinsBg, M, new cv.Point(-1, -1), 3);

    // distance transform
    cv.distanceTransform(opening, distTrans, cv.DIST_L2, 5);
    cv.normalize(distTrans, distTrans, 1, 0, cv.NORM_INF);

    // get foreground
    cv.threshold(distTrans, coinsFg, 0.7 * 1, 255, cv.THRESH_BINARY);
    coinsFg.convertTo(coinsFg, cv.CV_8U, 1, 0);
    cv.subtract(coinsBg, coinsFg, unknown);

    // get connected components markers
    cv.connectedComponents(coinsFg, markers);
    for (let i = 0; i < markers.rows; i++) {
        for (let j = 0; j < markers.cols; j++) {
            markers.intPtr(i, j)[0] = markers.ucharPtr(i, j)[0] + 1;
            if (unknown.ucharPtr(i, j)[0] === 255) {
                markers.intPtr(i, j)[0] = 0;
            }
        }
    }
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
    cv.watershed(src, markers);

    // draw barriers
    for (let i = 0; i < markers.rows; i++) {
        for (let j = 0; j < markers.cols; j++) {
            if (markers.intPtr(i, j)[0] === -1) {
                src.ucharPtr(i, j)[0] = 255; // R
                src.ucharPtr(i, j)[1] = 0; // G
                src.ucharPtr(i, j)[2] = 0; // B
            }
        }
    }

    cv.imshow('prediction', src);
    src.delete();
    dst.delete();
    gray.delete();
    opening.delete();
    coinsBg.delete();
    coinsFg.delete();
    distTrans.delete();
    unknown.delete();
    markers.delete();
    M.delete();

  }

  const renderPredictions = async (predictions) => {
    predictions.max().print()
    predictions.min().print()
    const tensor = 
      tf.expandDims(predictions.dataSync().map((x) => {
        //console.log(x)
              if (x >= 0.5) {
                  return 1;
              } else {
                  return 0;
              }
          }),
          1).reshape([512, 512]);

    watershed(tensor);
  };

  const predictImage = async (image_b64) => {
    if(model == null){return;}
    tf.engine().startScope();

    var i = new Image(); 

    i.onload = async function(){
      let tensor = tf.browser.fromPixels(i).toFloat();;
      tensor = tf.image.resizeBilinear(tensor, [512,512]);

      const offset = tf.scalar(255.);
      const normalised = tensor.div(offset);
      tensor = tf.reshape(normalised, [1, 512, 512, 3]);

      tensor.min().print()
      tensor.max().print()

      const predictions = model.predict(tensor);

      requestAnimationFrame(async () => {
        renderPredictions(predictions);
        tf.engine().endScope();
      });
     
    };
    i.src = image_b64;
    
  }

  const onButtonClick = (image) => {
    screenshotter.takeScreen('image', {})
    .then(image => {
      predictImage(image)
    }).catch(e => {
      console.error(e.toString())
    })
  };


  useEffect(() => {
    const map = L.map("map").setView([37.390480, -5.981702], 13);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20,
      minZoom: 17,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    /* 
    Este funciona bien
    https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}

    Poco zoom
    https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}

    http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}   ->    ['mt0', 'mt1', 'mt2', 'mt3']
    */

    screenshotter.addTo(map);

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
          crossorigin=""
        ></link>
        <title>Proyecto Reconocimiento</title>
      </Head>
      <main style={{ border: "0", margin: "0" }}>
        <button id="button" onClick={onButtonClick}>  Show screenshot</button>
        <div id="map" style={{ width: "600px", height: "600px" }}></div>
        <img id='test-img'></img>
        <canvas id='prediction' ref={predictionRef} style={{ width: "600px", height: "600px" }}/>
      </main>
    </div>
  );
}
