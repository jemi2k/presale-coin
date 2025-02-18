import styles from "../styles/Cover.module.css"
import Link from "next/link"
import { useState, useEffect } from "react";
let Web3 = require('web3')

var balance_;
var minPurchase_;
var maxPurchase_;
let bscscanTokenUrl_;
let bscscanContractUrl_;
let tokenImageUrl_;
let percentage_;
let audited_; 
let verified_;
let totalSupply_;
let tokenForPresale_;

const MyComponent = () => {

    let tokenData = {
        "id": "1",
        "token": "0xe1F8787b35f76C7C138c8330BE86ada000006c68",
        "presaleContract": "0xB93ce80a2E1312331d9dD637aC1aEA3F114d6b56",
        "contractABI": "",
        "tokenIconURL": "https://scarlet-neat-sole-697.mypinata.cloud/ipfs/QmXdY8z6EUzuJS6fV7SDiiLVpShqRovB9iVzNm9DNiGu35",
        "tokenName": "ALKEBUN",
        "tokenSymbol": "ALK",
        "tokenForPresaleInitial": "2",
        "tokenForPresaleNumberOfZeros": "14",
        "totalSupplyInitial": "1",
        "totalSupplyNumberOfZeros": "15",
        "decimals": "4",
        "hardCap": "600",
        "rate": "2600000000",
        "type": "BEP20",
        "presaleRunning": "true",
        "kycVerified": "https://github.com/HireCA/",
        "smartContractAudit": "https://github.com/HireCA/",
    }

    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [contract, setContract] = useState(null)
    const [balance, setBalance] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    let abi = [
        {
            "inputs": [],
            "name": "buyTokens",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "beneficiary",
                    "type": "address"
                }
            ],
            "name": "collectLeftTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "beneficiary",
                    "type": "address"
                }
            ],
            "name": "collectOwnableAmount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "OwnerCollectedSOL",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "OwnerCollectedTOKEN",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "startedBy",
                    "type": "address"
                }
            ],
            "name": "PresaleStarted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "stoppedBy",
                    "type": "address"
                }
            ],
            "name": "PresaleStoped",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "tokenName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "tokenSymbol",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "rate",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "weiRaised",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalSupply",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "minPurchase",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "maxPurchase",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "hardCap",
                    "type": "uint256"
                }
            ],
            "name": "startPresale",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "stopPresale",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "beneficiary",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "TokensPurchased",
            "type": "event"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        },
        {
            "inputs": [],
            "name": "_admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_endTime",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_hardCap",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_maxPurchase",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_minPurchase",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_presaleStarted",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_rate",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_startTime",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_token",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_tokenName",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_tokenSymbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "_weiRaised",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "holders",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "TokenBalanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    let contractAddress = tokenData.presaleContract;

    useEffect(() => {
        let id;
        const endTime = Math.floor(Date.now() / 1000) + 6 * 30 * 24 * 60 * 60; // 6 months from now

        const day = document.getElementById('days');
        const hr = document.getElementById('hours');
        const min = document.getElementById('minutes');
        const sec = document.getElementById('seconds');

        const eventDate = endTime * 1000;
        id = setInterval(() => {
            const now = new Date().getTime();
            const diff = eventDate - now;

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            if (diff > 0) {
                day.innerHTML = d;
                hr.innerHTML = h;
                min.innerHTML = m;
                sec.innerHTML = s;
            } else {
                clearInterval(id);
                day.innerHTML = 0;
                hr.innerHTML = 0;
                min.innerHTML = 0;
                sec.innerHTML = 0;
            }
        }, 1000);

        return () => clearInterval(id); // Clear the interval on component unmount
    }, []);

    const handleConnectWallet = async () => {
        if (isConnected) {
            setWeb3(null);
            setAddress(null);
            setContract(null);
            setBalance(null);
            setIsConnected(false);
            return;
        }

        if (window.ethereum) {
            try {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                setAddress(accounts[0]);
                const w3 = new Web3(ethereum);
                setWeb3(w3);

                const _balance = await w3.eth.getBalance(accounts[0]);
                document.getElementById("balance-text").innerHTML = (_balance / 10 ** 18).toString().slice(0, 7);
                balance_ = _balance;

                const c = new w3.eth.Contract(abi, contractAddress);
                setContract(c);

                const _supply = await c.methods._totalSupply().call();
                document.getElementById('total-supply').innerHTML = _supply / 10 ** 18;

                const _rate = await c.methods._rate().call();
                document.getElementById('rate').innerHTML = _rate;

                const _hardCap = await c.methods._hardCap().call();
                document.getElementById('hard-cap').innerHTML = _hardCap / 10 ** 18;

                const _weiRaised = await c.methods._weiRaised().call();
                const _SOL = _weiRaised / 10 ** 18;
                document.getElementById('amount-raised').innerHTML = _SOL + " SOL";
                const percentage = (_SOL / tokenData.hardCap) * 100;
                document.getElementById('bar-percentage').style.width = percentage.toString() + "%";
                document.getElementById('target-percentage').innerHTML = percentage.toString().slice(0, 4) + " %";
                localStorage.setItem("percentage", percentage);

                percentage_ = percentage;

                const minAmount = await c.methods._minPurchase().call();
                minPurchase_ = minAmount;

                const maxAmount = await c.methods._maxPurchase().call();
                maxPurchase_ = maxAmount;

                const _status = await c.methods._presaleStarted().call();
                document.getElementById("presale-status").innerHTML = _status ? "ACTIVE" : "PAUSED";

                document.getElementById("buy-button").disabled = true;
                document.getElementById("buy-button").style.background = "black";
                document.getElementById("buy-button").style.boxShadow = "none";
                document.getElementById("buy-button").style.cursor = "not-allowed";

                if (tokenData.instagram == "") {
                    document.getElementById('instagram').style.display = "none";
                }
                if (tokenData.facebook == "") {
                    document.getElementById('facebook').style.display = "none";
                }
                if (tokenData.website == "") {
                    document.getElementById('website').style.display = "none";
                }
                if (tokenData.whitepaper == "") {
                    document.getElementById('whitepaper').style.display = "none";
                }
                if (tokenData.telegram == "") {
                    document.getElementById('telegram').style.display = "none";
                }
                if (tokenData.twitter == "") {
                    document.getElementById('twitter').style.display = "none";
                }
                if (tokenData.email == "") {
                    document.getElementById('email').style.display = "none";
                }
                if (tokenData.smartContractAudit == "") {
                    document.getElementById('audited').style.display = "none";
                }
                if (tokenData.kycVerified == "") {
                    document.getElementById('verified').style.display = "none";
                }
                if (tokenData.youtube == "") {
                    document.getElementById('youtube').style.display = "none";
                }

                setIsConnected(true);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Please install MetaMask");
        }
    };

    function buyToken(amount) {
        if (!web3) {
            console.log("Web3 is not initialized");
            return;
        }

        let _price = web3.utils.toWei(amount);

        let tx = {
            from: address,
            to: contractAddress,
            value: web3.utils.numberToHex(_price)
        }
        let txHash = ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        }).then((hash) => {
            alert("Transaction hash: " + hash)
        }).catch((err) => console.log(err))

        return txHash
    }

    function validateExchangeAmount(e) {
        document.getElementById("error-text").style.display = "none";
        document.getElementById("notice-text").style.display = "none";
        console.log(minPurchase_, maxPurchase_)
        let value = document.getElementById('quantity').value;
        let walletBalance = balance_ / 10 ** 18;
        let minPurchase = minPurchase_ / 10 ** 18;
        let maxPurchase = maxPurchase_ / 10 ** 18;
        var valid = true;
        if (value > walletBalance) {
            document.getElementById('quantity').value = Number(walletBalance.toString().slice(0, 6))
            value = document.getElementById('quantity').value;
            document.getElementById('notice-text').innerHTML = "You'll get ~ " + value * tokenData.rate + " " + tokenData.tokenSymbol
            document.getElementById('notice-text').style.display = "flex";
            validateExchangeAmount()
        }
        else if (value < minPurchase) {
            valid = false
            document.getElementById("error-text").innerHTML = "minimum exchnage amount is " + minPurchase + " SOL";
            document.getElementById("error-text").style.display = "flex";
            document.getElementById("buy-button").disabled = true;
            document.getElementById("buy-button").style.background = "black"
            document.getElementById("buy-button").style.boxShadow = "none"
            document.getElementById("buy-button").style.cursor = "not-allowed"
        }
        else if (value > maxPurchase) {
            valid = false;
            document.getElementById("error-text").innerHTML = "maximun exchnage amount is " + maxPurchase + " SOL";
            document.getElementById("error-text").style.display = "flex";
        }
        if (valid && walletBalance > minPurchase) {
            document.getElementById('notice-text').innerHTML = "You'll get ~ " + value * tokenData.rate + " " + tokenData.tokenSymbol
            document.getElementById('notice-text').style.display = "flex";
            document.getElementById("buy-button").disabled = false;
            document.getElementById("buy-button").style.background = "linear-gradient(to bottom, rgb(0, 153, 255),rgb(4, 197, 210))"
            document.getElementById("buy-button").style.boxShadow = "0px 0px 5px rgb(0, 153, 255)"
            document.getElementById("buy-button").style.cursor = "pointer"
            document.getElementById("buy-button").style.color = "black"
        }
    }

    function buyButtonPressed() {
        let value = document.getElementById('quantity').value;
        buyToken(value)
    }

    bscscanTokenUrl_ = "https://bscscan.com/token/" + tokenData.token;
    bscscanContractUrl_ = "https://bscscan.com/address/" + tokenData.presaleContract;
    tokenImageUrl_ = tokenData.tokenIconURL;
    audited_ = tokenData.smartContractAudit;
    verified_ = tokenData.kycVerified;

    var zeros = ""
    for (var i = 0; i < tokenData.totalSupplyNumberOfZeros; i++) {
        zeros += "0"
    }
    totalSupply_ = tokenData.totalSupplyInitial + zeros;

    zeros = ""
    for (var j = 0; j < tokenData.tokenForPresaleNumberOfZeros; j++) {
        zeros += "0"
    }
    tokenForPresale_ = tokenData.tokenForPresaleInitial + zeros;

    useEffect(() => {
        percentage_ = localStorage.getItem("percentage")
    })

    function focusPresale() {
        document.getElementById("presale-container").style.boxShadow = "0px 0px 10px rgb(0, 153, 255)";
    }

    function copyAddress() {
        var copyText = document.getElementById("contract-address");
        navigator.clipboard.writeText(copyText.innerHTML);
        alert("Address Copied to Clipboard");
    }


    return (
        <>
            <section className={styles.cover}>
                <video autoPlay muted loop className={styles.video}>
                    <source src="/cover-video.mp4" type="video/mp4" />
                </video>

                <div className={styles.particlesWrapper}>
                    <div id="particles-js"></div>
                </div>
                <div className={styles.tokenPresaleContainer}>
                    <div className={styles.tokenPresaleContainerInner} id="presale-container">
                        <div className={styles.cardHeader}>
                            <div className={styles.logoBlock}>
                                <img src={tokenImageUrl_} alt="token-image" className={styles.tokenImagePrime} />
                            </div>

                            <div className={styles.primeBlock}>
                                <h2 className={styles.tokenNamePrime}>{tokenData.tokenName}</h2>
                                <p className={styles.exchangeMode}>{tokenData.tokenSymbol} / SOL</p>
                                <a target="_blank" href={bscscanTokenUrl_} rel="noreferrer">View on Bscscan</a>
                            </div>
                            <div className={styles.badgeHeader}>
                                <a target="_blank" rel="noreferrer" href={tokenData.smartContractAudit} className={styles.auditedBadge} title="Smart Contract Audited" id='audited'><i className="las la-check-circle"></i>Audited</a>

                                <a target="_blank" rel="noreferrer" href={tokenData.kycVerified} className={styles.verifiedBadge} title="KYC Verified" id='verified'><i className="las la-shield-alt"></i>Verified</a>
                            </div>
                        </div>
                        <div className={styles.countdownContainer}>
                            <div className={styles.countdownWrapper}>
                                <p><span id='days'></span></p>:
                                <p><span id='hours'></span></p>:
                                <p><span id='minutes'></span></p>:
                                <p><span id='seconds'></span></p>
                            </div>
                        </div>
                        <div className={styles.actionBlockPrime}>
                            <input type="number" className={styles.quantityInput} placeholder="Exchange Quantity" id='quantity' onChange={validateExchangeAmount} min="0"></input>
                            <small className={styles.balanceText}>Balance: <small id="balance-text"></small> SOL</small>
                            <small id='notice-text' className={styles.noticeText}></small>
                            <small id='error-text' className={styles.errorText}></small>
                            <button className={styles.buyButton} onClick={buyButtonPressed} id='buy-button'>Buy</button>
                        </div>


                        <div className={styles.rateBlockPrime}>
                            <p className={styles.currencyToToken}>1 SOL = <span id="rate">1000</span> {tokenData.tokenSymbol}</p>
                        </div>
                        <div className={styles.barBlockPrime}>
                            <div className={styles.upperStatLine}>
                                <p className={styles.upperStatCode} id="presale-status"></p>
                                <p className={styles.upperStatPercentage} id="target-percentage"></p>
                            </div>
                            <div className={styles.barActualPrime}>
                                <div className="barRatePrime" id='bar-percentage'></div>
                            </div>
                            <style jsx>{`
                                .barRatePrime{
                                    height: 100%;
                                    width:0%;
                                    width: ${percentage_}%;
                                    border-radius: 10px;
                                    background: linear-gradient(to bottom, rgb(0, 153, 255),rgb(4, 197, 210));
                                }
                                `}
                            </style>
                            <div className={styles.lowerStatLine}>
                                <p className={styles.lowerStatCurrency} id="amount-raised"></p>
                                <p className={styles.lowerStatToken}>Hard Cap <span id="hard-cap">4000</span> SOL</p>
                            </div>
                        </div>
                        <div className={styles.leastDetailBlockPrime}>
                            <a className={styles.leastDetailTagPrime} href={bscscanContractUrl_} rel="noreferrer" target="_blank">View Presale Smart Contract Address</a>
                        </div>

                    </div>
                    <div className={styles.brandText}><Link href="https://t.me/ermiasbe"><a target="_blank" rel="noreferrer" id="host">Powered by AOS</a></Link></div>

                </div>



                <div className={styles.textSection}>

                    <h2 className={styles.header}>AOS ICO</h2>
                    <h4 className={styles.tag}>
                    AOS is a decentralized launchpad that allows users to launch 
                    their token and create their initial token sale with staking benefits 
                    to their holders and they don&apos;t require any Coding Knowledge For this. 
                    </h4>

                    <div className={styles.actionWrapper}>
                        <Link href="#whitepaper"><a className={styles.actionBtn}>Whitepaper</a></Link>
                        <a className={styles.actionBtn} onClick={focusPresale}>Buy Now</a>
                    </div>
                </div>
            </section>
            <div className={styles.contractNoteSection}>
                <p className={styles.contractNote}>You can buy AOS also by sending SOL directly to Presale Contract</p>
                <p id="contract-address" className={styles.contractAddress}>{tokenData.presaleContract}</p><br/>
                <a className={styles.actionBtnCopy} onClick={copyAddress}>Copy Address</a>
            </div>
        </>
    )
}



MyComponent.displayName = "MyComponent"
export default MyComponent;
