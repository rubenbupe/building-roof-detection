import cv2 as cv
import numpy as np

def watershed(prediction):
    prediction_watershet_gray = np.copy(prediction)
    prediction_watershet = cv.cvtColor(prediction_watershet_gray,cv.COLOR_GRAY2BGR)

    ret, thresh = cv.threshold(prediction_watershet_gray,0,255,cv.THRESH_BINARY+cv.THRESH_OTSU)
    # noise removal
    kernel = np.ones((3,3),np.uint8)
    opening = cv.morphologyEx(thresh,cv.MORPH_OPEN,kernel, iterations = 5)
    # sure background area
    sure_bg = cv.dilate(opening,kernel,iterations=1)
    # Finding sure foreground area
    dist_transform = cv.distanceTransform(opening,cv.DIST_L2,5)
    ret, sure_fg = cv.threshold(dist_transform,0.25*dist_transform.max(),255,0) # Tunear el multiplicador segun el zoom
    # Finding unknown region
    sure_fg = np.uint8(sure_fg)
    unknown = cv.subtract(sure_bg,sure_fg)


    # Marker labelling
    ret, markers = cv.connectedComponents(sure_fg)
    # Add one to all labels so that sure background is not 0, but 1
    markers = markers+1
    # Now, mark the region of unknown with zero
    markers[unknown==255] = 0

    markers = cv.watershed(prediction_watershet,markers)
    prediction_watershet[markers == -1] = [255,0,0]
    
    return markers