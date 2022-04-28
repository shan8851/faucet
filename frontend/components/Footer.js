import s from "../styles/Footer.module.scss";
import { FaHeart, FaCoffee } from "react-icons/fa";

export const Footer = () => {
  const TWITTER_HANDLE = "shan8851";
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
  return (
    <footer className={s.footer}>
      <p className={s.footerText}>
        Built with <FaHeart className={s.altColor} /> and{" "}
        <FaCoffee className={s.altColor} /> by{" "}
        <a
          target="_blank"
          rel="noreferrer"
          className={s.footerLink}
          href={TWITTER_LINK}
        >
          {"  "} @Shan8851
        </a>
      </p>
    </footer>
  );
};
