import * as tf from '@tensorflow/tfjs';

export const watershed = (feature, tensor, output_canvas, watershed_toggle) => {
    // TODO: comprobar que ha cargado opencvjs
    const canvas = document.createElement('canvas');
    tf.browser.toPixels(tensor, canvas).then(() => {
        canvas.getContext("2d");

        if (watershed_toggle) {
            let feature_img = new cv.imread(feature);
            let src = new cv.imread(canvas);
            let dst = new cv.Mat();
            let gray = new cv.Mat();
            let opening = new cv.Mat();
            let coinsBg = new cv.Mat();
            let coinsFg = new cv.Mat();
            let distTrans = new cv.Mat();
            let unknown = new cv.Mat();
            let markers = new cv.Mat();

            cv.resize(feature_img, feature_img, new cv.Size(512, 512), 0, 0, cv.INTER_AREA);

            // gray and threshold image
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
            cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

            // get background
            let M = cv.Mat.ones(3, 3, cv.CV_8U);

            cv.erode(gray, gray, M);
            cv.dilate(gray, opening, M);
            cv.dilate(opening, coinsBg, M, new cv.Point(-1, -1), 3);

            // distance transform
            cv.distanceTransform(opening, distTrans, cv.DIST_L2, 5);
            cv.normalize(distTrans, distTrans, 1, 0, cv.NORM_INF);

            // get foreground
            cv.threshold(distTrans, coinsFg, 0.25 * 1, 255, cv.THRESH_BINARY);
            coinsFg.convertTo(coinsFg, cv.CV_8U, 1, 0);
            cv.subtract(coinsBg, coinsFg, unknown);

            // get connected components markers
            cv.connectedComponents(coinsFg, markers);
            for (let i = 0; i < markers.rows; i++) {
                for (let j = 0; j < markers.cols; j++) {
                    markers.intPtr(i, j)[0] = markers.ucharPtr(i, j)[0] + 1;
                    if (unknown.ucharPtr(i, j)[0] === 255) {
                        markers.intPtr(i, j)[0] = 0;
                    }
                }
            }
            cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
            cv.watershed(src, markers);

            // draw barriers
            for (let i = 0; i < markers.rows; i++) {
                for (let j = 0; j < markers.cols; j++) {
                    if (markers.intPtr(i, j)[0] === -1) {
                        feature_img.ucharPtr(i, j)[0] = 134; // R
                        feature_img.ucharPtr(i, j)[1] = 63; // G
                        feature_img.ucharPtr(i, j)[2] = 228; // B
                    }
                }
            }

            /*cv.resize(feature_img, feature_img, new cv.Size(feature.width, feature.height), 0, 0, cv.INTER_AREA);

            const predCanvas = document.getElementById(output_canvas);

            predCanvas.width = feature.width;
            predCanvas.height = feature.height;*/

            cv.resize(feature_img, feature_img, new cv.Size(600, 600), 0, 0, cv.INTER_AREA);

            const predCanvas = document.getElementById(output_canvas);

            predCanvas.width = 600;
            predCanvas.height = 600;

            cv.imshow(output_canvas, feature_img);

            src.delete();
            dst.delete();
            gray.delete();
            opening.delete();
            coinsBg.delete();
            coinsFg.delete();
            distTrans.delete();
            unknown.delete();
            markers.delete();
            M.delete();

        } else {
            let semantic_gray = new cv.Mat();
            let semantic_src = new cv.imread(canvas);
            cv.cvtColor(semantic_src, semantic_gray, cv.COLOR_RGBA2GRAY, 0);
            cv.imshow(output_canvas, semantic_gray);
            semantic_gray.delete();
            semantic_src.delete();
        }
    });
}

export const renderPredictions = (feature, predictions, output_canvas, watershed_toggle) => {
    //predictions.max().print()
    //predictions.min().print()
    const tensor = tf.expandDims(predictions.dataSync().map((x) => {
        //console.log(x)
        if (x >= 0.5) {
            return 1;
        } else {
            return 0;
        }
    }), 1).reshape([512, 512]);
    watershed(feature, tensor, output_canvas, watershed_toggle);
};

export const predictImage = (model, i, output_canvas, watershed_toggle) => {
    if (model == null) {
        return;
    }
    tf.engine().startScope();

    let input = tf.browser.fromPixels(i).toFloat();
    ;let tensor = tf.image.resizeBilinear(input, [512, 512]);

    const offset = tf.scalar(255.);
    const normalised = tensor.div(offset);
    tensor = tf.reshape(normalised, [1, 512, 512, 3]);

    //tensor.min().print()
    //tensor.max().print()

    const predictions = model.predict(tensor);

    requestAnimationFrame(() => {
        renderPredictions(i, predictions, output_canvas, watershed_toggle);
        tf.engine().endScope();
    });
}