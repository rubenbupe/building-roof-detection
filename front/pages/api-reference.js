import Header from "../src/components/Header/Header"
import Footer from '../src/components/Footer/Footer';
import ApiReference from "../src/components/ApiReference/ApiReference";

function Api() {
  return <div>
    <Header toggleSwitch={false}/>
    <ApiReference/>
    <Footer/>
  </div>
}

export default Api
