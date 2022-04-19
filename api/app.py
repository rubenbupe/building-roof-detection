from flask import Flask, request, make_response, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

import cv2
import numpy as np
import base64
import os
import time
import requests

from helpers import image as image_helper
from helpers import watershed as watershed_helper
from helpers import predictions as prediction_helper

from helpers import publisher as publisher_helper

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=1e8)#, async_handlers=True, engineio_logger=True)

message_publisher = publisher_helper.Publisher()


@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    res = requests.get('http://api.positionstack.com/v1/forward', params=[('access_key', '3f7755a8072884f2e602f8b9086e2038'), ('query', query)])
    res = res.json()

    lat, lon = None, None

    if(len(res.get('data', [])) > 0):
        lat = res.get('data')[0].get('latitude')
        lon = res.get('data')[0].get('longitude')
        message_publisher.publish_map_search(lat, lon, query)

    return make_response(jsonify({'latitude': lat, 'longitude': lon}), 200)


@app.route('/search', methods=['POST'])
def register_search():
    latitude = request.json.get('latitude'),
    longitude = request.json.get('longitude'),
    query = request.json.get('query'),

    message_publisher.publish_map_search(latitude, longitude, query)

    response = make_response()
    return response


@app.route('/predictions/instance', methods=['GET'])
def prediction_instance():
    start_time = time.time()
    img = cv2.imdecode(np.fromstring(
        request.files['image'].read(), np.uint8), cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    original_shape = img.shape
    # img=image_helper.cooling_effect(img)

    prediction = prediction_helper.predict(img)

    markers = watershed_helper.watershed(prediction)
    markers[markers == -1] = 255

    print(original_shape)
    markers = cv2.resize(markers.astype(np.float32), (original_shape[1], original_shape[0])) # Devuelve la imagen al tamaño original
    retval, buffer = cv2.imencode('.jpg', markers)
    response = make_response(buffer.tobytes())
    response.headers['Content-Type'] = 'image/jpeg; charset=UTF-8'

    exec_time = (time.time() - start_time) * 1000

    message_publisher.publish_segmentation_metrics(
        exec_time, 
        publisher_helper.SEGMENTATION_TYPE.get('instance'), 
        publisher_helper.SEGMENTATION_API_TYPE.get('api'))
    return response


@app.route('/predictions/semantic', methods=['GET'])
def prediction_semantic():
    start_time = time.time()

    img = cv2.imdecode(np.fromstring(
        request.files['image'].read(), np.uint8), cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    #image_cooler = image_helper.CoolingFilter()
    #img = image_cooler.render(img)

    original_shape = img.shape

    prediction = prediction_helper.predict(img)

    prediction = cv2.resize(prediction, (original_shape[1], original_shape[0])) # Devuelve la imagen al tamaño original
    retval, buffer = cv2.imencode('.jpg', prediction)
    response = make_response(buffer.tobytes())
    response.headers['Content-Type'] = 'image/jpeg; charset=UTF-8'

    exec_time = (time.time() - start_time) * 1000

    message_publisher.publish_segmentation_metrics(
        exec_time, 
        publisher_helper.SEGMENTATION_TYPE.get('semantic'), 
        publisher_helper.SEGMENTATION_API_TYPE.get('api'))
    return response


@socketio.on('image')
def image(params):
    start_time = time.time()
    (data_image, watershed) = params
    img = image_helper.base64_to_numpy(data_image)
    original_shape = img.shape

    prediction = prediction_helper.predict(img)
    if watershed:
        markers = watershed_helper.watershed(prediction)
        markers[markers == -1] = 255
        markers = markers.astype(np.uint8)
        markers = cv2.resize(markers, (original_shape[1], original_shape[0])) # Devuelve la imagen al tamaño original
        stringData = image_helper.numpy_to_base64(markers)
    else:
        prediction = cv2.resize(prediction,(original_shape[1], original_shape[0])) # Devuelve la imagen al tamaño original
        stringData = image_helper.numpy_to_base64(prediction)

    exec_time = (time.time() - start_time) * 1000

    message_publisher.publish_segmentation_metrics(
        exec_time, 
        publisher_helper.SEGMENTATION_TYPE.get('instance' if watershed == True else 'semantic'), 
        publisher_helper.SEGMENTATION_API_TYPE.get('socket'))

    emit('image_response', stringData)

if __name__ == '__main__':
    if os.environ.get('FLASK_ENV') == 'production':
        socketio.run(app, debug=False, host='0.0.0.0', port=3000) 
    else:
        socketio.run(app, host='0.0.0.0', port=5000) 
