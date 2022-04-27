import React from "react";

export default function ConnectWalletButton({ connectWallet }) {
  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}
