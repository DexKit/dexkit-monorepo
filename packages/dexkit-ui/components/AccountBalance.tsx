import { NETWORK_COIN_SYMBOL } from "@dexkit/core/constants/networks";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Typography } from "@mui/material";
import { useMemo } from "react";

import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { defineChain } from "thirdweb";
import { useWalletBalance } from "thirdweb/react";


export interface AccountBalanceProps {
  isBalancesVisible: boolean;
}

export function AccountBalance({ isBalancesVisible }: AccountBalanceProps) {
  const { account, chainId } = useWeb3React();

  const { data } = useWalletBalance({
    chain: chainId ? defineChain(chainId) : undefined,
    address: account,
    client,
  });



  const formattedBalance = useMemo(() => {
    if (data?.displayValue) {
      return Number(data?.displayValue).toFixed(3);
    }
    return "0.00";
  }, [data]);
  return (
    <Typography
      color="text.primary"
      variant="caption"
      align="left"
      component="div"
    >
      {isBalancesVisible ? formattedBalance : "*.**"}{" "}
      {NETWORK_COIN_SYMBOL(chainId)}
    </Typography>
  );
}
