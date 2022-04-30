import s from "../styles/Layout.module.scss";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { NetworkError } from "./NetworkError";

export const Layout = ({
  children,
  networkError,
  walletConnected,
  connectWallet,
  account,
  userBalance,
  loading,
  avatar,
}) => {
  return (
    <div className={s.container}>
      {walletConnected && networkError && <NetworkError />}
      <Header
        walletConnected={walletConnected}
        connectWallet={connectWallet}
        account={account}
        userBalance={userBalance}
        loading={loading}
        avatar={avatar}
      />
      <div className={s.content}>{children}</div>
      <Footer />
    </div>
  );
};
