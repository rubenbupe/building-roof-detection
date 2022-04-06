import cv2
import numpy as np
from keras.models import load_model


model = load_model("models/model.h5")

def predict(img):
    img=cv2.resize(img,(512,512))
    img=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    img=np.expand_dims(img,axis=0)
    img = img.astype(np.float32)
    img=img/255.

    
    prediction = model.predict(img)
    
    prediction = prediction[0]
    prediction[prediction>0.5]=255
    prediction[prediction<=0.5]=0

    prediction=prediction.astype(np.uint8)

    return prediction