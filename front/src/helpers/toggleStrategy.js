import * as clientPredictor from './clientPrediction';
import * as serverPredictor from './serverPrediction';

export async function toggleStrategy(model, i, outputCanvas, segmentationSwitch, serverSwitch, socket=null) {
    switch (serverSwitch) {
        case true:
            await serverPredictor.predictRequest(model, i, outputCanvas, segmentationSwitch, socket);
            break;
        case false:
            console.log('que esta pasando', segmentationSwitch);
            clientPredictor.predictImage(model, i, outputCanvas, segmentationSwitch);
            break;
        default:
            console.log('Server switch not initialized');
            break;
    }
}