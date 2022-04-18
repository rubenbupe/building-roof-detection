import {image} from "@tensorflow/tfjs";

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
            if (segmentationSwitch) {
                let prediction = new cv.imread(i);

                cv.imshow(outputCanvas, prediction);

                prediction.delete();

            } else {
                let feature_img = new cv.imread(inputImage);
                let prediction = new cv.imread(i);
                let prediction_gray = new cv.Mat();
                let inverted_prediction_gray = new cv.Mat();

                cv.cvtColor(prediction, prediction_gray, cv.COLOR_RGBA2GRAY, 0);
                cv.bitwise_not(prediction_gray, inverted_prediction_gray);
                cv.imshow(outputCanvas, inverted_prediction_gray);
                cv.imshow('mask-image', feature_img);

                feature_img.delete();
                prediction.delete();
                prediction_gray.delete();
                inverted_prediction_gray.delete();
            }
        };
        i.src = res_b64;
    });

    console.log(segmentationSwitch)
    socket.emit('image', [img_b64, segmentationSwitch]);
}