import Head from "next/head";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { FAUCET_CONTRACT_ADDRESS, abi } from "../constants";
import { Layout } from "../components/Layout";
import { Main } from "../components/Main";
import { Button } from "../components/Button";
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
  const [allowedToWithdraw, setAllowedToWithdraw] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

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
    resetMessages();
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
      setLoading(true);
      resetMessages();
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
      setSuccessMessage("Your donation was successful - thanks so much");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      if (err.code === "INSUFFICIENT_FUNDS") {
        setErrorMessage("You do not have enough Ether");
      }
    }
  };

  const requestEth = async () => {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const faucetContract = new ethers.Contract(
      FAUCET_CONTRACT_ADDRESS,
      abi,
      signer
    );
    const isAllowed = await faucetContract.allowedToRequestPayout(account);
    if (isAllowed) {
      try {
        setLoading(true);
        resetMessages();
        const tx = await faucetContract.sendEth(account);
        await tx.wait();
        await fetchData();
        setSuccessMessage("Success, don't spend it all at once!");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setErrorMessage("Something went wrong");
      }
    } else {
      setAllowedToWithdraw(false);
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

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setAllowedToWithdraw(true);
  };

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
        <title>Shan's Rinkeby Faucet</title>
        <meta
          name="description"
          content="A rinkeby faucet allowing you to request and donate Rinkeby ETH"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#181820" />
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
            {successMessage && <p className={s.success}>{successMessage}</p>}
            {errorMessage && <p className={s.error}>{errorMessage}</p>}
            {!allowedToWithdraw && (
              <p className={s.error}>
                You can only request funds once every 24 hours, come back
                tomorrow!
              </p>
            )}
            <Stats
              loading={loading}
              balance={faucetBalance}
              donators={donators}
              requests={requests}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
