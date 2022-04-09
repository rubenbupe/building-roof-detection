import Head from 'next/head'
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useRef } from "react";
import Header from '../Header/Header';
import * as ImageHelper from '../../helpers/images';
import * as tf from '@tensorflow/tfjs';
import { CloudUploadOutline, } from 'react-ionicons'
import * as toggleStrategy from '../../helpers/toggleStrategy.js';


async function load_model() {
  const model = await tf.loadLayersModel("models/model.json");
  return model;
}



export default function PhotoUpload({serverSwitch, segmentationSwitch}) {
  const [model, setModel] = useState(null);
  const [socket, setSocket] = useState(null);
  const maskImageOpacityRef = useRef();

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const image_blob = event.target.files[0];

      ImageHelper.blobToBase64(image_blob).then(image_b64 => {
        let i = new Image();

        i.onload = async () => {
          // TODO: fixear imagenes muy grandes (falla con 10k x 10k)
          await toggleStrategy.toggleStrategy(model, i, 'prediction', segmentationSwitch, serverSwitch, socket);
        };
        i.src = image_b64;
      })
    }
  };

  const onUploadClick = () => {
    document.getElementById('file-input').click();
  }

  useEffect(async () => {
    tf.setBackend('webgl');
    const { io } = await import("socket.io-client");

    const mysocket = io("https://api.reconocimientodelmedio.es");

    mysocket.on('connect', function () {
      console.log('conectau');
    })
    setSocket(mysocket);

    load_model().then(model => {
      setModel(model);
    });
  }, []);


  return (
    <div className='container'>
        <Head>
            <title>Proyecto Reconocimiento</title>
            <link rel='icon' href='/favicon.ico'/>
        </Head>
        <main>
            <div className='main-container-photo'>
                <div className='shadow-container'>
                    <div className='photo-upload-container'>
                        <CloudUploadOutline height={'175px'} width={'175px'} className='photo-upload-icon'
                                            onClick={onUploadClick}/>
                        <span className='photo-upload-text text-no-select'>Sube una imagen para procesar</span>
                        <input id='file-input' type='file' name='name' style={{display: 'none'}}
                               onChange={uploadToClient}/>
                    </div>
                </div>
                <div className='prediction-container'>
                    <canvas ref={maskImageOpacityRef} id='prediction' className='map'/>
                    {segmentationSwitch === false && (<>
                        <canvas id='mask-image' className='map'/>

                        <div className='photo-slider-container'>
                            <input type='range' min='0' max='1' className='custom-slider' step='0.1'
                                   onInput={(e) => {
                                       maskImageOpacityRef && (maskImageOpacityRef.current.style.opacity = e.target.value);
                                   }}/>
                        </div>
                    </>)}
                </div>
            </div>
        </main>
    </div>)
}
