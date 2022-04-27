import React from "react";

export default function Account({ account }) {
  return (
    <div>
      Address:{`${account.substring(0, 3)}...${account.substring(39, 46)}`}
    </div>
  );
}
