import Head from 'next/head'
import Spinner from "../Spinner/Spinner";
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useRef } from "react";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export default function ApiReference({ }) {
  return (
    <div className='container'>
      <Head>
        <title>Proyecto Reconocimiento</title>
        <link rel='icon' href={'/favicon.ico'} />
      </Head>
      <main>
        <div className='container-main-api'>
          <div className='container-api'>
            <div className='api-menu'>
              <div href='#api-prediction-semantic' className='api-button'><span>GET</span> <span className='api-button-text-2'>/predictions/semantic</span></div>
              <div href='#api-prediction-instance' className='api-button'><span>GET</span> <span className='api-button-text-2'>/predictions/instance</span></div>
              <div className='api-separator' />
              <div href='#api-search' className='api-button'><span>POST</span> <span className='api-button-text-2'>/search</span></div>
            </div>
            <div className='api-text'>
              <div id='api-prediction-semantic'>
                <span className='api-text-title'>{API_URI}predictions/semantic</span>
                <span className='api-text-subtitle'>Realiza segmentación semántica de edificios sobre una imagen y devuelve una máscara del mismo tamaño que la imagen de entrada.</span>
                <span className='api-text-params'>Parámetros (form-data):</span>
                <span className='api-text-params-item'>- image: Imagen a segmentar</span>

                <span className='api-text-params'>Devuelve:</span>
                <span className='api-text-params-item'>- Imagen JPEG con la máscara de la predicción</span>
              </div>
              <div className='api-text-separator' />
              <div id='api-prediction-instance'>
                <span className='api-text-title'>{API_URI}predictions/instance</span>
                <span className='api-text-subtitle'>Realiza segmentación por instance de edificios sobre una imagen y devuelve una máscara del mismo tamaño que la imagen de entrada. La máscara tendrá un color distinto por cada edificio.</span>
                <span className='api-text-params'>Parámetros (form-data):</span>
                <span className='api-text-params-item'>- image: Imagen a segmentar</span>

                <span className='api-text-params'>Devuelve:</span>
                <span className='api-text-params-item'>- Imagen JPEG con la máscara de la predicción</span>
              </div>
              <div className='api-text-separator' />
              <div id='api-search'>
                <span className='api-text-title'>{API_URI}search</span>
                <span className='api-text-subtitle'>Realiza una búsqueda de una dirección y devuelve las coordenadas correspondientes.</span>
                <span className='api-text-params'>Parámetros:</span>
                <span className='api-text-params-item'>- query: Texto de la dirección</span>

                <span className='api-text-params'>Devuelve un JSON con:</span>
                <span className='api-text-params-item'>- latitude: latitud</span>
                <span className='api-text-params-item'>- longitude: longitud</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>)
}