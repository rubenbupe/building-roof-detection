import { image } from "@tensorflow/tfjs";

export async function predictRequest(model, inputImage, outputCanvas, segmentationSwitch, socket) {
    //make request || store base64 prediction

    const img_b64 = inputImage.src.split(',')[1];
    console.log('Realizando predicción en servidor');
    socket.on("image_response", (res_b64) => {
        console.log('Predicción recibida')
        //output on canvas

        let i = new Image();

        i.onload = async () => {
          // TODO: fixear imagenes muy grandes (falla con 10k x 10k)
          let feature_img = new cv.imread(i);
          cv.imshow('prediction', feature_img);
      
          feature_img.delete();
        };
        i.src = res_b64;
    });

    console.log(segmentationSwitch)
    socket.emit('image', [img_b64, segmentationSwitch]);
}