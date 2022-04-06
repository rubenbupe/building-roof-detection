import cv2
import base64
import io
from PIL import Image
import numpy as np
from scipy.interpolate import UnivariateSpline

def numpy_to_base64(img):
    imgencode = cv2.imencode('.jpg', img)[1]
    stringData = base64.b64encode(imgencode).decode('utf-8')
    b64_src = 'data:image/jpg;base64,'
    stringData = b64_src + stringData
    
    return stringData

def base64_to_numpy(data_image):
    b = io.BytesIO(base64.b64decode(data_image))
    img = Image.open(b)
    
    return np.array(img)

def create_LUT_8UC1(x, y):
    spl = UnivariateSpline(x, y)
    return spl(range(256))
    
def cooling_effect(img_rgb_in):
    incr_ch_lut = create_LUT_8UC1([0, 64, 128, 192, 256],
    [0, 70, 140, 210, 256])
    decr_ch_lut = create_LUT_8UC1([0, 64, 128, 192, 256],
        [0, 30, 80, 120, 192])
    
    img_bgr_in=cv2.cvtColor(img_rgb_in,cv2.COLOR_RGB2BGR)
    c_b, c_g, c_r = cv2.split(img_bgr_in)
    c_r = cv2.LUT(c_r, decr_ch_lut).astype(np.uint8)
    c_b = cv2.LUT(c_b, incr_ch_lut).astype(np.uint8)
    img_bgr_cold = cv2.merge((c_b, c_g, c_r))

    # decrease color saturation
    c_h, c_s, c_v = cv2.split(cv2.cvtColor(img_bgr_cold,
        cv2.COLOR_BGR2HSV))
    c_s = cv2.LUT(c_s, decr_ch_lut).astype(np.uint8)
    img_bgr_cold = cv2.cvtColor(cv2.merge((c_h, c_s, c_v)),cv2.COLOR_HSV2BGR)
    
    cv2.cvtColor(img_bgr_cold,cv2.COLOR_BGR2RGB)