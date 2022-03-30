import Head from 'next/head'
import Header from '../src/components/Header/Header';
import PhotoUpload from '../src/components/PhotoUpload/PhotoUpload';
import Map from '../src/components/Map/Map';
export default function Home() {
  return 
      null
}

export const getServerSideProps = async (context) => {
  return {
    redirect: {
        destination: '/about',
        permanent: false
    }
}

}
