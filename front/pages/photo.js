import PhotoUpload from "../src/components/PhotoUpload/PhotoUpload"
import Header from "../src/components/Header/Header"
import Footer from '../src/components/Footer/Footer';
import {useState} from "react";

function Photo() {
    const [segmentationSwitch, setSegmentationSwitch] = useState(false);
    const [serverSwitch, setServerSwitch] = useState(false);
    return (
        <div>
            <script src="https://docs.opencv.org/master/opencv.js" type="text/javascript" defer/>
            <Header segmentationSwitch={segmentationSwitch} setSegmentationSwitch={setSegmentationSwitch}
                    serverSwitch={serverSwitch} setServerSwitch={setServerSwitch}/>
            <PhotoUpload segmentationSwitch={segmentationSwitch} serverSwitch={serverSwitch}/>
            <Footer/>
        </div>)
}

export default Photo