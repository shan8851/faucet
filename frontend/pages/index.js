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

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState();
  const [userBalance, setUserBalance] = useState();
  const [networkError, setNetworkError] = useState();
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [donators, setDonators] = useState(0);
  const [requests, setRequests] = useState(0);

  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    setWalletConnected(true);
    const balance = await signer.getBalance();
    const balanceInEth = ethers.utils.formatEther(balance);
    setUserBalance(balanceInEth);
    getFaucetBalance();
    const network = await web3Provider.getNetwork();
    if (network.chainId !== 4) {
      setNetworkError(true);
    }
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

  const donate = async () => {
    try {
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
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const requestEth = async () => {
    try {
      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const faucetContract = new ethers.Contract(
        FAUCET_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await faucetContract.sendTokensToAddress(account);
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch (err) {
      console.error(err);
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
  //     const tx = await faucetContract.rescueETH();
  //     setLoading(true);
  //     await tx.wait();
  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const requestDisabled = faucetBalance < ethers.utils.parseEther("0.05");

  return (
    <Layout
      networkError={networkError}
      walletConnected={walletConnected}
      connectWallet={connectWallet}
      account={account}
      userBalance={userBalance}
    >
      <Head>
        <title>Faucet</title>
        <meta name="description" content="Faucet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Main />

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
                  requestDisabled ? "No more ETH" : "Request 0.05 ETH"
                }
                handleClick={requestEth}
              />
            </div>
          </div>
          <Stats
            balance={faucetBalance}
            donators={donators}
            requests={requests}
          />
          {/* <Button buttonText="Withdraw" handleClick={withdraw} /> */}
        </div>
      </div>
    </Layout>
  );
}
