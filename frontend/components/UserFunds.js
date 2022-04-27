import React from "react";

export default function UserFunds({ balance }) {
  return (
    <div>Wallet Balance: {Number.parseFloat(balance).toPrecision(4)}ETH</div>
  );
}
