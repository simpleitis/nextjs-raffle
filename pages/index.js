import Head from "next/head"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"
import Footer from "../components/Footer"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Raffle</title>
                <meta name="description" content="ETH Raffle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <ManualHeader /> */}
            <Header />
            <LotteryEntrance />
            <Footer />
        </div>
    )
}
