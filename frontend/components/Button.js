import s from "../styles/Button.module.scss";

export const Button = ({ buttonText, handleClick, secondary }) => {
  return (
    <button
      onClick={handleClick}
      className={secondary ? s.secondary : s.button}
    >
      {buttonText}
    </button>
  );
};
