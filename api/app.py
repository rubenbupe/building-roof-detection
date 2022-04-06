from flask import Flask, request, make_response
from flask_socketio import SocketIO, emit  # !pip install flask-socketio
import cv2
import numpy as np
import base64
import os

from helpers import image as image_helper
from helpers import watershed as watershed_helper
from helpers import predictions as prediction_helper
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/predictions/instance', methods=['GET'])
def prediction_instance():
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

    return response


@app.route('/predictions/semantic', methods=['GET'])
def prediction_semantic():

    img = cv2.imdecode(np.fromstring(
        request.files['image'].read(), np.uint8), cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    original_shape = img.shape

    prediction = prediction_helper.predict(img)

    prediction = cv2.resize(prediction, (original_shape[1], original_shape[0])) # Devuelve la imagen al tamaño original
    retval, buffer = cv2.imencode('.jpg', prediction)
    response = make_response(buffer.tobytes())
    response.headers['Content-Type'] = 'image/jpeg; charset=UTF-8'

    return response


@socketio.on('image')
def image(params):
    (data_image, watershed) = params
    img = image_helper.base64_to_numpy(data_image)
    original_shape = img.shape

    prediction = prediction_helper.predict(img)
    if watershed:
        markers = watershed_helper.watershed(prediction)
        markers[markers == -1] = 255
        markers = cv2.resize(markers, (original_shape[1], original_shape[0])) # Devuelve la imagen al tamaño original
        stringData = image_helper.numpy_to_base64(markers)
    else:
        prediction = cv2.resize(prediction,(original_shape[1], original_shape[0])) # Devuelve la imagen al tamaño original
        stringData = image_helper.numpy_to_base64(prediction)

    emit('image_response', stringData)

if __name__ == '__main__':
    if os.environ.get('FLASK_ENV') == 'production':
        socketio.run(app, debug=False, host='0.0.0.0') 
    else:
        socketio.run(app, port=3000) 
