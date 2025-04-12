import { Button, type ButtonProps } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWalletConnect } from "../hooks/wallet";
import Wallet from "./icons/Wallet";

export const ConnectButton = (p: ButtonProps) => {
  const { connectWallet, isConnecting } = useWalletConnect();

  const testHandleClick = async () => {
    try {
      if (isConnecting) {
        return;
      }
      await connectWallet();
    } catch (e) {
      console.error("Error connecting wallet", e);
    }
  };

  return (
    <Button
      variant={p.variant || "outlined"}
      color={p.color || "inherit"}
      size={p.size}
      disabled={isConnecting}
      onClick={testHandleClick}
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
