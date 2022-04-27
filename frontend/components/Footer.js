import s from "../styles/Footer.module.scss";

export const Footer = () => {
  const TWITTER_HANDLE = "shan8851";
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
  return (
    <div className={s.footer}>
      <p className={s.footerText}>
        Made with ❤️ by
        <a
          target="_blank"
          rel="noreferrer"
          className={s.footerLink}
          href={TWITTER_LINK}
        >
          {"  "} @Shan8851
        </a>
      </p>
    </div>
  );
};
