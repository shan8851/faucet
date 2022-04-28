import Head from "next/head";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { FAUCET_CONTRACT_ADDRESS, abi } from "../constants";
import { Layout } from "../components/Layout";
import { Main } from "../components/Main";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import s from "../styles/Home.module.scss";
import { Stats } from "../components/Stats";
import { SpinnerLarge } from "../components/SpinnerLarge";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState();
  const [userBalance, setUserBalance] = useState();
  const [networkError, setNetworkError] = useState();
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [donators, setDonators] = useState(0);
  const [requests, setRequests] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const connectWallet = async () => {
    setLoading(true);
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    setWalletConnected(true);
    const network = await web3Provider.getNetwork();
    if (network.chainId !== 4) {
      setNetworkError(true);
    }
    await fetchData();
    setLoading(false);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  let web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true,
    });
  }

  const fetchUserBalance = async () => {
    setLoading(true);
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const balance = await signer.getBalance();
    const balanceInEth = ethers.utils.formatEther(balance);
    setUserBalance(balanceInEth);
    setLoading(false);
  };

  const donate = async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const faucetContract = new ethers.Contract(
        FAUCET_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await faucetContract.deposit({
        value: ethers.utils.parseUnits("0.1", "ether"),
      });
      await tx.wait();
      await fetchData();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMessage("Something went wrong");
    }
  };

  const requestEth = async () => {
    try {
      setErrorMessage("");
      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const faucetContract = new ethers.Contract(
        FAUCET_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await faucetContract.sendEth(account);
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMessage("Something went wrong");
    }
  };

  const getFaucetBalance = async () => {
    try {
      setLoading(true);
      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const faucetContract = new ethers.Contract(
        FAUCET_CONTRACT_ADDRESS,
        abi,
        signer
      );
      setFaucetBalance(
        ethers.utils.formatUnits(await faucetContract.getTotalFaucetFunds(), 0)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalDonators = async () => {
    try {
      setLoading(true);
      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const faucetContract = new ethers.Contract(
        FAUCET_CONTRACT_ADDRESS,
        abi,
        signer
      );
      setDonators(
        ethers.utils.formatUnits(await faucetContract.getTotalDonators(), 0)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalPayouts = async () => {
    try {
      setLoading(true);
      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const faucetContract = new ethers.Contract(
        FAUCET_CONTRACT_ADDRESS,
        abi,
        signer
      );
      setRequests(
        ethers.utils.formatUnits(await faucetContract.getTotalPayouts(), 0)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    await getFaucetBalance();
    await getTotalDonators();
    await getTotalPayouts();
    await fetchUserBalance();
  };

  // const withdraw = async () => {
  //   try {
  //     const provider = await web3Modal.connect();
  //     const web3Provider = new ethers.providers.Web3Provider(provider);
  //     const signer = web3Provider.getSigner();
  //     const faucetContract = new ethers.Contract(
  //       FAUCET_CONTRACT_ADDRESS,
  //       abi,
  //       signer
  //     );
  //     const tx = await faucetContract.withdrawEth();
  //     setLoading(true);
  //     await tx.wait();
  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const requestDisabled = faucetBalance < 50000000000000000;

  return (
    <Layout
      networkError={networkError}
      walletConnected={walletConnected}
      connectWallet={connectWallet}
      account={account}
      userBalance={userBalance}
      loading={loading}
    >
      <Head>
        <title>Faucet</title>
        <meta name="description" content="Faucet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Main />
        {loading && (
          <div className={s.container}>
            <div className={s.buttonContainer}>
              <SpinnerLarge />
            </div>
          </div>
        )}

        {!loading && (
          <div className={s.container}>
            <div className={s.buttonContainer}>
              <div className={s.buttonLeft}>
                <Button buttonText="Donate 0.1 ETH " handleClick={donate} />
              </div>
              <div className={s.buttonRight}>
                <Button
                  disabled={requestDisabled}
                  secondary
                  buttonText={
                    requestDisabled ? "Not enough ETH" : "Request 0.05 ETH"
                  }
                  handleClick={requestEth}
                />
              </div>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <Stats
              loading={loading}
              balance={faucetBalance}
              donators={donators}
              requests={requests}
            />

            {/* <Button buttonText="Withdraw" handleClick={withdraw} /> */}
          </div>
        )}
      </div>
    </Layout>
  );
}
