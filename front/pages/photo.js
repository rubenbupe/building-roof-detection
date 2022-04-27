import PhotoUpload from "../src/components/PhotoUpload/PhotoUpload"
import Header from "../src/components/Header/Header"
import Footer from '../src/components/Footer/Footer';
import {useState, useEffect} from "react";

function Photo() {
    const [segmentationSwitch, setSegmentationSwitch] = useState(false);
    const [serverSwitch, setServerSwitch] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('segmentationSwitch')) {
            setSegmentationSwitch((localStorage.getItem('segmentationSwitch') === 'true'));
        } else {
            localStorage.setItem('segmentationSwitch', segmentationSwitch.toString());
        }

        if (localStorage.getItem('serverSwitch')) {
            setServerSwitch((localStorage.getItem('serverSwitch') === 'true'));
        } else {
            localStorage.setItem('serverSwitch', serverSwitch.toString());
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('segmentationSwitch', segmentationSwitch.toString());
    }, [segmentationSwitch]);

    useEffect(() => {
        localStorage.setItem('serverSwitch', serverSwitch.toString());
    }, [serverSwitch]);

    return (
        <div>
            <script src="https://docs.opencv.org/master/opencv.js" type="text/javascript" defer/>
            <Header segmentationSwitch={segmentationSwitch} setSegmentationSwitch={setSegmentationSwitch}
                    serverSwitch={serverSwitch} setServerSwitch={setServerSwitch} toggleSwitch={true}/>
            <PhotoUpload segmentationSwitch={segmentationSwitch} serverSwitch={serverSwitch}/>
            <Footer/>
        </div>)
}

export default Photo