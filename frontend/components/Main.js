import s from "../styles/Main.module.scss";

export const Main = () => {
  return (
    <div className={s.container}>
      <h1 className={s.header}>Shan's Rinkeby Faucet</h1>
      <p className={s.text}>A rinkeby faucet that gives you 0.05 test ETH!</p>
      <p className={s.text}>
        This dApp needs you! We cannot get by without user donations, so please
        consider donating some ETH, so that others can get it when needed.
      </p>
    </div>
  );
};
