import Head from 'next/head'
import { useState  } from "react";
import Header from '../Header/Header';

export default function PhotoUpload() {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  

  return (

    <div className="container">
      <Head>
        <title>Proyecto Reconocimiento</title>
        <link rel="icon" href="/favicon.ico" />
      
      </Head>
      <main>

        <div>
        <img src={createObjectURL} />
        <h4>Subir Imagen</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />       
      </div>


      </main>
    </div>
  )
}
