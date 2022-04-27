import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "3ca7342481924a97a708c6e315c50e93",
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "My Awesome App",
      infuraId: "3ca7342481924a97a708c6e315c50e93",
      chainId: 4,
      darkMode: false,
    },
  },
};
