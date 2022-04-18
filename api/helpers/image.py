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


# Cooling effect
# Source: https://github.com/Py-geeks/Cooling-Filter/blob/main/Cooling%20effect.py
class CoolingFilter():
    def __init__(self):
        """Initialize look-up table for curve filter"""
        # create look-up tables for increasing and decreasing a channel
        self.incr_ch_lut = self._create_LUT_8UC1([0, 64, 128, 192, 256],
                                                 [0, 70, 140, 210, 256])
        self.decr_ch_lut = self._create_LUT_8UC1([0, 64, 128, 192, 256],
                                                 [0, 50, 110, 170, 230])

    def render(self, img_rgb):
        c_r, c_g, c_b = cv2.split(img_rgb)
        #c_r = cv2.LUT(c_r, self.incr_ch_lut).astype(np.uint8)
        c_b = cv2.LUT(c_b, self.decr_ch_lut).astype(np.uint8)
        img_rgb = cv2.merge((c_r, c_g, c_b))


       
        c_h, c_s, c_v = cv2.split(cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV))
        c_s = cv2.LUT(c_s, self.incr_ch_lut).astype(np.uint8)

        return cv2.cvtColor(cv2.merge((c_h, c_s, c_v)), cv2.COLOR_HSV2RGB)

    def _create_LUT_8UC1(self, x, y):
        """Creates a look-up table using scipy's spline interpolation"""
        spl = UnivariateSpline(x, y)
        return spl(range(256))