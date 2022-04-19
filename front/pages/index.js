export default function Home() {
    return null
}

export const getServerSideProps = async (context) => {
    return {
        redirect: {
            destination: '/map', permanent: false
        }
    }
}