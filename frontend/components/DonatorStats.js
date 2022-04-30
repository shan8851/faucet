import { ethers } from "ethers";
import s from "../styles/DonatorStats.module.scss";

export const DonatorStats = ({ donatorList }) => {
  const sortedArray = donatorList.sort(
    (a, b) => b.amountDonated - a.amountDonated
  );
  return (
    <div className={s.container}>
      <h1>Top Donators 🔥</h1>
      <div className={s.wrapper}>
        {sortedArray.map((donator) => {
          const amount = ethers.utils.formatEther(donator.amountDonated);
          return (
            <div key={donator.walletAddress} className={s.donator}>
              <img
                src={`https://web3-images-api.kibalabs.com/v1/accounts/${donator.walletAddress}/image`}
                className={s.avatar}
              />
              <p className={s.address}>{donator.walletAddress}</p>
              <p className={s.amount}>{amount} ETH</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
