import s from "../styles/Stats.module.scss";
import { FaPiggyBank, FaServer, FaUsers } from "react-icons/fa";
import { ethers } from "ethers";

export const Stats = ({ donators, requests, balance }) => {
  return (
    <div className={s.statWrapper}>
      <div className={s.statContainer}>
        <FaPiggyBank className={s.statIcon} />
        <div className={s.statContent}>
          <p className={s.value}>{ethers.utils.formatEther(balance)}</p>
          <p className={s.label}>ETH Available</p>
        </div>
      </div>
      <div className={s.statContainer}>
        <FaUsers className={s.statIcon} />
        <div className={s.statContent}>
          <p className={s.value}>{donators}</p>
          <p className={s.label}>Donators</p>
        </div>
      </div>
      <div className={s.statContainer}>
        <FaServer className={s.statIcon} />
        <div className={s.statContent}>
          <p className={s.value}>{requests}</p>
          <p className={s.label}>Total Requests</p>
        </div>
      </div>
    </div>
  );
};
