import s from "../styles/Spinner.module.scss";

export const Spinner = () => {
  return (
    <div className={s.spinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
