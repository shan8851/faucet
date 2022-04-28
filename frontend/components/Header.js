import s from "../styles/Header.module.scss";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

export const Header = ({
  walletConnected,
  userBalance,
  account,
  connectWallet,
  loading,
}) => {
  if (!walletConnected)
    return (
      <div className={s.container}>
        <Button
          handleClick={connectWallet}
          className={s.button}
          buttonText="Connect Wallet"
        />
      </div>
    );
  return (
    <div className={s.container}>
      {loading ? (
        <div className={s.headerItem}>
          <Spinner />
        </div>
      ) : (
        <p className={s.headerItem}>{`${Number.parseFloat(
          userBalance
        ).toPrecision(4)} ETH`}</p>
      )}

      <p className={s.headerItem}>{`${account.substring(
        0,
        3
      )}...${account.substring(39, 46)}`}</p>
    </div>
  );
};
