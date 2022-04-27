import s from "../styles/Header.module.scss";
import { Button } from "./Button";

export const Header = ({
  walletConnected,
  userBalance,
  account,
  connectWallet,
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
      <Button
        secondary
        buttonText={`${Number.parseFloat(userBalance).toPrecision(4)} ETH`}
      />
      <Button
        secondary
        buttonText={`${account.substring(0, 3)}...${account.substring(39, 46)}`}
      />
    </div>
  );
};
