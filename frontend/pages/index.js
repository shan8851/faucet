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
import { DonatorStats } from "../components/DonatorStats";
import { providerOptions } from "../helpers/providerOptions";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [account, setAccount] = useState();
  const [avatar, setAvatar] = useState("");
  const [userBalance, setUserBalance] = useState();
  const [networkError, setNetworkError] = useState();
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [donators, setDonators] = useState(0);
  const [requests, setRequests] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [allowedToWithdraw, setAllowedToWithdraw] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [donatorList, setDonatorList] = useState([]);

  const connectWallet = async () => {
    setLoading(true);
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const checkForEns = await lookupEnsAddress(address);
    checkForEns !== null ? setAccount(checkForEns) : setAccount(address);
    setWalletConnected(true);
    setAvatar(
      `https://web3-images-api.kibalabs.com/v1/accounts/${address}/image`
    );
    const network = await web3Provider.getNetwork();
    if (network.chainId !== 4) {
      setNetworkError(true);
    }
    await fetchUserData();
    fetchStatsData();

    setLoading(false);
    resetMessages();
  };

  useEffect(() => {
    fetchStatsData();
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
      network: "rinkeby",
      cacheProvider: true,
      providerOptions,
    });
  }

  const lookupEnsAddress = async (walletAddress) => {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const checkForEnsDomain = await web3Provider.lookupAddress(walletAddress);
    return checkForEnsDomain;
  };

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

  const donate = async (amount) => {
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
        value: ethers.utils.parseUnits(amount, "ether"),
      });
      await tx.wait();
      await fetchUserData();
      await fetchStatsData();
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
        await fetchUserData();
        await fetchStatsData();
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
      setStatsLoading(true);
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
      setStatsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalDonators = async () => {
    try {
      setStatsLoading(true);
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
      setStatsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getDonatorData = async () => {
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
      const dArr = await faucetContract.getDonatorAddresses();
      Promise.all(dArr.map((item) => getIndividualDonator(item))).then(
        (data) => {
          setDonatorList(data);
        }
      );

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getIndividualDonator = async (id) => {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const faucetContract = new ethers.Contract(
      FAUCET_CONTRACT_ADDRESS,
      abi,
      signer
    );
    const data = await faucetContract.getIndividualDonator(id);
    return data;
  };

  const getTotalPayouts = async () => {
    try {
      setStatsLoading(true);
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
      setStatsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    await fetchUserBalance();
    await getDonatorData();
  };

  const fetchStatsData = async () => {
    await getFaucetBalance();
    await getTotalDonators();
    await getTotalPayouts();
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
      avatar={avatar}
    >
      <Head>
        <title>Rinkedry?</title>
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

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://rinkedry.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rinkedry?" />
        <meta
          property="og:description"
          content="A rinkeby faucet allowing you to request and donate Rinkeby ETH"
        />
        <meta
          property="og:image"
          content="https://rinkedry.vercel.app/rinkedryOg.png"
        />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="rinkedry.vercel.app" />
        <meta property="twitter:url" content="https://rinkedry.vercel.app/" />
        <meta name="twitter:title" content="Rinkedry?" />
        <meta
          name="twitter:description"
          content="A rinkeby faucet allowing you to request and donate Rinkeby ETH"
        />
        <meta
          name="twitter:image"
          content="https://rinkedry.vercel.app/rinkedryOg.png"
        />

        {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --></meta> */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#181820" />
      </Head>
      <div>
        <Main walletConnected={walletConnected} />
        {loading && (
          <div className={s.container}>
            <div className={s.buttonContainer}>
              <SpinnerLarge />
            </div>
          </div>
        )}

        {!loading && walletConnected && !networkError && (
          <div className={s.container}>
            <div className={s.buttonContainer}>
              <Button
                disabled={requestDisabled}
                buttonText={
                  requestDisabled ? "Not enough ETH" : "Request 0.05 ETH"
                }
                handleClick={requestEth}
              />
            </div>
            <div className={s.donateContainer}>
              <Button
                className={s.button}
                buttonText="Donate 0.1 ETH "
                handleClick={() => donate("0.1")}
                secondary
              />
              <Button
                className={s.button}
                buttonText="Donate 1 ETH "
                handleClick={() => donate("1")}
                secondary
              />
              <Button
                className={s.button}
                buttonText="Donate 10 ETH "
                handleClick={() => donate("10")}
                secondary
              />
            </div>
            {successMessage && <p className={s.success}>{successMessage}</p>}
            {errorMessage && <p className={s.error}>{errorMessage}</p>}
            {!allowedToWithdraw && (
              <p className={s.error}>
                You can only request funds once every 24 hours, come back
                tomorrow!
              </p>
            )}
          </div>
        )}
        <Stats
          loading={statsLoading}
          balance={faucetBalance}
          donators={donators}
          requests={requests}
        />
      </div>
      {donatorList.length > 0 && <DonatorStats donatorList={donatorList} />}
    </Layout>
  );
}
