import { Button, type ButtonProps } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWalletConnect } from "../hooks/wallet";
import Wallet from "./icons/Wallet";

export const ConnectButton = (p: ButtonProps) => {
  const { connectWallet } = useWalletConnect();

  return (
    <Button
      variant={p.variant || "outlined"}
      color={p.color || "inherit"}
      size={p.size}
      onClick={connectWallet}
      startIcon={<Wallet />}
      {...p}
    >
      <FormattedMessage
        id="connect.wallet"
        defaultMessage="Connect Wallet"
        description="Connect wallet button"
      />
    </Button>
  );
};
