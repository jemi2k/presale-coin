import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useState } from "react";
const Web3 = require("web3");

function Navbar() {
    const [isConnected, setIsConnected] = useState(false);

    const handleConnectWallet = async () => {
        if (isConnected) {
            // Disconnect wallet
            setIsConnected(false);
            document.getElementById("connect-wallet-btn").innerHTML = "Connect Wallet";
            document.getElementById("connect-wallet-btn").style.background = "";
            document.getElementById("connect-wallet-btn").style.borderRadius = "";
            document.getElementById("connect-wallet-btn").style.boxShadow = "";
            document.getElementById("connect-wallet-btn").style.color = "";
            localStorage.removeItem("address");
            return;
        }

        if (window.ethereum) {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
            document.getElementById("connect-wallet-btn").innerHTML = accounts[0].slice(0, 6) + "..." + accounts[0].slice(-6, -1) + accounts[0].slice(-1);
            document.getElementById("connect-wallet-btn").style.background = "rgb(25,25,10)";
            document.getElementById("connect-wallet-btn").style.borderRadius = "10px";
            document.getElementById("connect-wallet-btn").style.boxShadow = "none";
            document.getElementById("connect-wallet-btn").style.color = "rgb(0, 153, 255)";
            localStorage.setItem("address", accounts[0]);
            setIsConnected(true);
        } else {
            document.getElementById("notice-box").style.display = "flex";
        }
    };

    return (
        <>
            <nav className={styles.navWrapper}>
                <div className={styles.navbar}>
                    <div className={styles.logoSection}>
                        <Link href=""><a>
                            {/* <h1 className={styles.logoText}>AOS Coin</h1> */}
                            <img src="/kredict-white.png" alt="Globus Logo" className={styles.logoImage} />
                        </a></Link>
                    </div>
                    <div className={styles.menuSection}>
                        <ul className={styles.menu}>
                            <li><Link href="#about"><a className={styles.menuItem}>About</a></Link></li>
                            <li><Link href="#token"><a className={styles.menuItem}>Token</a></Link></li>
                            <li><Link href="#team"><a className={styles.menuItem}>Team</a></Link></li>
                            <li><Link href="#roadmap"><a className={styles.menuItem}>Roadmap</a></Link></li>
                            <li><Link href="#contact"><a className={styles.menuItem}>Contact</a></Link></li>
                        </ul>
                        <a className={styles.connectBtn} id="connect-wallet-btn" onClick={handleConnectWallet}>Connect Wallet</a>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;