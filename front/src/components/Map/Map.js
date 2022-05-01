import Head from "next/head";
import Spinner from "../Spinner/Spinner";
import Script from "next/script";
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useRef } from "react";
//import * as L from "leaflet";
//import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import * as tf from '@tensorflow/tfjs';
import * as toggleStrategy from '../../helpers/toggleStrategy.js';
import * as search_helpers from '../../helpers/search';
import * as location_helper from '../../helpers/location'
import { map } from "leaflet";
import { fetchPlace } from './fetchPlace';
import { SearchOutline, CloseOutline } from 'react-ionicons'

const API_URI = process.env.NEXT_PUBLIC_API_URI;

async function load_model() {
  const model = await tf.loadLayersModel("models/model.json");
  return model;
}

export default function Map({ serverSwitch, segmentationSwitch }) {
  const [screenshotter, setScreenshotter] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentLatitude, setLat] = useState(40.419215);
  const [currentLongitude, setLon] = useState(-3.693358);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState([]);
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState([]);
  const [map, setMap] = useState(null);
  const [searchToggle, setSearchToggle] = useState(true);

  const maskImageOpacityRef = useRef();

  useEffect(()=>{
    map?.setView([currentLatitude,currentLongitude ], 13);
  },[currentLatitude,currentLongitude])

  const onButtonClick = () => {
    setIsLoading(true);
    screenshotter?.takeScreen('image', {})
      .then(image => {
        if (model == null) { return; }

        let i = new Image();

        i.onload = async function () {
          await toggleStrategy.toggleStrategy(model, i, 'prediction', segmentationSwitch, serverSwitch, socket, setIsLoading);
        };
        i.src = image;
      }).catch(e => {
        console.error(e.toString());
        setIsLoading(false);
      })
  };

  useEffect(async () => {
    tf.setBackend('webgl');
    const { io } = await import("socket.io-client");
    const L = await import('leaflet');
    const { SimpleMapScreenshoter } = await import('leaflet-simple-map-screenshoter');

    const mysocket = io(API_URI, {withCredentials: true});

    mysocket.on('connect', function () {
      console.log('Se ha extablecido la conexión con el servidor');
    })

    mysocket.on("disconnect", (razón) => {
      console.log('Se ha cortado la conexión con el servidor', razón);
    });

    setSocket(mysocket);


    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((currentLocation)=>{
        console.log(currentLocation)
        setLat(currentLocation.coords.latitude)
        setLon(currentLocation.coords.longitude)
        location_helper.registerLocation(API_URI,currentLocation.coords.latitude,currentLocation.coords.longitude);

      }, ()=>{
        console.error("ubicacion no encontrada")
      }, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    }


    const c_map = L.map("map").setView([currentLatitude,currentLongitude ], 13);
    setMap(c_map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      minZoom: 17,
      subdomains: []
    }).addTo(c_map);

    const cur_screenshoter = new SimpleMapScreenshoter({ hidden: true });
    setScreenshotter(cur_screenshoter);
    /* 
    Este funciona bien
    https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}

    Poco zoom
    https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}

    http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}   ->    ['mt0', 'mt1', 'mt2', 'mt3']
    */

    cur_screenshoter.addTo(c_map);

    load_model().then(model => {
      setModel(model);
    });

  }, []);

  const handleCityChange = async (e) => {
    setCity(e.target.value);
    if (!city) return;

    const res = await fetchPlace(city);
    !autocompleteCities.includes(e.target.value) &&
      res.features &&
      setAutocompleteCities(res.features.map((place) => place.place_name));
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  const handleClick = () => {
    let override;
    if (searchToggle) {
      const query = document.getElementById("city").value;
      console.log(query)

      const regex = /^[\s]*([-]?[\d]+[[\.]\d+]?)\s*\,\s*(-?\d+[[\.][\d]+]?)/mi;

      let coords;
      if ((coords = regex.exec(query)) !== null) {

        const lat = coords[1];
        const lon = coords[2];
        search_helpers.registerSearch(API_URI, lat, lon, query);
        map?.setView([lat, lon], 13);
      } else {
        search_helpers.search(API_URI, query, (lat, lon) => {
          map?.setView([lat, lon], 13);
        });
      }
    } else {
      document.getElementById("city").value = "";
      override = true;
    }
    handleToggle(override);
  }

  function handleToggle(override){
    if (document.getElementById('city').value || override)
      setSearchToggle(!searchToggle);
  }

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href={"https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"}
          integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
          crossOrigin=""
        />
        <title>Proyecto Reconocimiento</title>
      </Head>
      <main>
        <div className="main-container-map">
          <div>
            <div className="places-autocomplete">
              <div className="shadow-container custom-search-container">
                <input
                  placeholder="Escribe aquí para buscar"
                  list="places"
                  type="text"
                  id="city"
                  className="custom-button"
                  onChange={handleCityChange}
                />
              </div>
              <datalist id="places">
                {autocompleteCities.map((city, i) => (
                  <option key={i}>{city}</option>
                ))}
              </datalist>
              <button
                  className="custom-button" id="search-button" onClick={handleClick}>
                {searchToggle ? <SearchOutline/> : <CloseOutline/>}
              </button>
            </div>
            <div className="map-container">
              <div className="map" id="map" />
            </div>
          </div>

          {isLoading ? <Spinner className="map-spinner" /> :
            <span className="map-screenshot-button custom-button" id="button" onClick={onButtonClick}>Procesar imagen →</span>}
          <div className="map-container">

            {segmentationSwitch === false && (<>
              <div className="map-slider-container">
                <input type="range" min="0" max="1" className="custom-slider" step="0.1"
                  onInput={(e) => {
                    maskImageOpacityRef && (maskImageOpacityRef.current.style.opacity = e.target.value);
                  }} />
              </div>
              <canvas id='mask-image' className="map" />
            </>)}
            <canvas ref={maskImageOpacityRef} id='prediction' className="map" style={{mixBlendMode: segmentationSwitch ? 'normal' : 'screen'}}/>
          </div>
        </div>
      </main>
    </div>);
}