import * as L from 'leaflet'
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter'


function renderMap() {
  
    var map = L.mapquest.map('leafletMapid', {
      center: [37.7749, -122.4194],
      layers: L.mapquest.tileLayer('satellite'),
      zoom: 18,
      maxZoom:19,
      minZoom:15
      
    });


// Create some custom panes
map.createPane("snapshot-pane");
map.createPane("dont-include");




// Set up snapshotter
const snapshotOptions = {
  hideElementsWithSelectors: [
    ".leaflet-control-container",
    ".leaflet-dont-include-pane",
    "#snapshot-button"
  ],
  hidden: true
};

// Add screenshotter to map
const screenshotter = new SimpleMapScreenshoter(snapshotOptions);
screenshotter.addTo(map);

// What happens when you clikc the "Snapshot Greek Border" button:
const takeScreenShot = () => {
  // Get bounds of feature, pad ot a but too
  const featureBounds = greekborder.getBounds().pad(0.1);

  // Get pixel position on screen of top left and bottom right
  // of the bounds of the feature
  const nw = featureBounds.getNorthWest();
  const se = featureBounds.getSouthEast();
  const topLeft = map.latLngToContainerPoint(nw);
  const bottomRight = map.latLngToContainerPoint(se);

  // Get the resulting image size that contains the feature
  const imageSize = bottomRight.subtract(topLeft);

  // Set up screenshot function
  screenshotter
    .takeScreen("image")
    .then((image) => {
      // Create <img> element to render img data
      var img = new Image();

      // once the image loads, do the following:
      img.onload = () => {
        // Create canvas to process image data
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to the size of your resultant image
        canvas.width = imageSize.x;
        canvas.height = imageSize.y;

        // Draw just the portion of the whole map image that contains
        // your feature to the canvas
        // from https://stackoverflow.com/questions/26015497/how-to-resize-then-crop-an-image-with-canvas
        ctx.drawImage(
          img,
          topLeft.x,
          topLeft.y,
          imageSize.x,
          imageSize.y,
          0,
          0,
          imageSize.x,
          imageSize.y
        );

        // Create URL for resultant png
        var imageurl = canvas.toDataURL("image/png");
        console.log(imageurl);

        const resultantImage = new Image();
        resultantImage.style = "border: 1px solid black";
        resultantImage.src = imageurl;

        document.body.appendChild(canvas);

        canvas.toBlob(function (blob) {
          // saveAs function installed as part of leaflet snapshot package
          saveAs(blob, "greek_border.png");
        });
      };

      // set the image source to what the snapshotter captured
      // img.onload will fire AFTER this
      img.src = image;
    })
    .catch((e) => {
      alert(e.toString());
    });
};

// Add takescreenshot function to button
const button = document.getElementById("snapshot-button");
button.addEventListener("click", takeScreenShot);

    
  
  }



  function setUp(){
    renderMap();
  }