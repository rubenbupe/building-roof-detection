import { image } from "@tensorflow/tfjs";

export async function predictRequest(model, inputImage, outputCanvas, segmentationSwitch, socket) {
    //make request || store base64 prediction

    const img_b64 = inputImage.src.split(',')[1];
    console.log('cosas');
    socket.on("image_response", (res_b64) => {
        console.log('nsdjknc')
        let prediction = res_b64;

        //output on canvas
        let feature_img = new cv.imread(prediction);
        cv.imshow(outputCanvas, feature_img);
    
        feature_img.delete();
    });

    console.log(socket);
    //console.log(img_b64)
    socket.emit('image', [img_b64, false]);
}