import s from "../styles/Main.module.scss";

export const Main = () => {
  return (
    <div className={s.container}>
      <h1 className={s.header}>Rinkedry?</h1>
      <p className={s.text}>
        Out of ETH? We've got you! You can request 0.05 ETH every 24 hours.
      </p>
      <p className={s.text}>
        This dApp needs you! We cannot get by without user donations, so please
        consider donating some ETH, so that others can get it when needed.
      </p>
    </div>
  );
};
