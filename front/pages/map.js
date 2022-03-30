import Header from "../src/components/Header/Header"
import dynamic from 'next/dynamic'
import Footer from '../src/components/Footer/Footer';
import {useState} from "react";

function MapScreen() {
    const [segmentationSwitch, setSegmentationSwitch] = useState(false);
    const [serverSwitch, setServerSwitch] = useState(false);
    const Map = dynamic(() => import('../src/components/Map/Map'), // replace '@components/map' with your component's location
        {ssr: false} // This line is important. It's what prevents server-side render
    )

    return (
        <div>
            <script src="https://docs.opencv.org/master/opencv.js" type="text/javascript" defer/>
            <Header segmentationSwitch={segmentationSwitch} setSegmentationSwitch={setSegmentationSwitch}
                    serverSwitch={serverSwitch} setServerSwitch={setServerSwitch}/>
            <Map segmentationSwitch={segmentationSwitch} serverSwitch={serverSwitch}/>
            <Footer/>
        </div>)
}

export default MapScreen