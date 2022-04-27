import Header from "../src/components/Header/Header"
import dynamic from 'next/dynamic'
import Footer from '../src/components/Footer/Footer';
import {useState, useEffect} from "react";

function MapScreen() {
    const [segmentationSwitch, setSegmentationSwitch] = useState(false);
    const [serverSwitch, setServerSwitch] = useState(false);
    const Map = dynamic(() => import('../src/components/Map/Map'), // replace '@components/map' with your component's location
        {ssr: false} // This line is important. It's what prevents server-side render
    )

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
            <Map segmentationSwitch={segmentationSwitch} serverSwitch={serverSwitch}/>
            <Footer/>
        </div>)
}

export default MapScreen