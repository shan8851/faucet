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
        <div className={s.headingWrapper}>
          <Spinner />
        </div>
      ) : (
        <div className={s.headingWrapper}>
          <p>{`${Number.parseFloat(userBalance).toPrecision(4)} ETH`}</p>
        </div>
      )}
      <div className={s.headingWrapper}>
        <img
          src={`https://web3-images-api.kibalabs.com/v1/accounts/${account}/image`}
          className={s.avatar}
        />
        <p>{`${account.substring(0, 3)}...${account.substring(39, 46)}`}</p>
      </div>
    </div>
  );
};
