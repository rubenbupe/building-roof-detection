import Head from 'next/head'
import React, { useEffect, useState, useRef } from "react";
import Header from '../Header/Header';
import * as ImageHelper from '../../helpers/images';
import * as tf from '@tensorflow/tfjs';
import * as Predictor from '../../helpers/predictions';

tf.setBackend('webgl');

async function load_model() {
  const model = await tf.loadLayersModel("http://127.0.0.1:8080/model.json");
  return model;
}



export default function PhotoUpload() {
  const [model, setModel] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      const image_blob = i;
      ImageHelper.blobToBase64(image_blob).then(image_b64 => {
        let i = new Image();

        i.onload = async function () {
          // TODO: fixear imagenes muy grandes (falla con 10k x 10k)
          await Predictor.predictImage(model, i, 'prediction');
        };
        i.src = image_b64;
      })
    }
  };

  useEffect(() => {
    load_model().then(model => {
      setModel(model);
    });
  }, []);


  return (

    <div className="container">
      <Head>
        <title>Proyecto Reconocimiento</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://docs.opencv.org/master/opencv.js" type="text/javascript" defer></script>
      </Head>
      <main>

      <h4>Subir Imagen</h4>
      <input type="file" name="myImage" onChange={uploadToClient} />
      <br/>
      <canvas id='prediction'/>

      </main>
    </div>
  )
}
