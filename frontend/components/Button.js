import s from "../styles/Button.module.scss";

export const Button = ({
  buttonText,
  handleClick,
  secondary,
  disabled,
  full,
}) => {
  const handleButtonType = secondary ? s.secondary : s.button;
  const handleWidth = full ? s.fullWidth : "";
  console.log("FULL", full, "w", handleWidth);
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={handleButtonType + " " + handleWidth}
    >
      {buttonText}
    </button>
  );
};
