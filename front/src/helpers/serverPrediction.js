export async function predictionRequest(model, inputImage, outputCanvas, segmentationSwitch) {
    //make request || store base64 prediction
    let prediction = inputImage;

    //output on canvas
    let feature_img = new cv.imread(prediction);
    cv.imshow(outputCanvas, feature_img);

    feature_img.delete();
}