import { convertTokenToEvmCoin } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import Send from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useTokenList } from "../../../hooks/blockchain";

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog"
    )
);

export function TransferCoinButton() {
  const [open, setOpen] = useState<boolean>(false);
  const { account, chainId, provider, ENSName } = useWeb3React();
  const tokens = useTokenList({ chainId, includeNative: true });

  return (
    <>
      {open && (
        <EvmTransferCoinDialog
          dialogProps={{
            open,
            onClose: () => {
              setOpen(false);
            },
            fullWidth: true,
            maxWidth: "sm",
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            coins: tokens.map(convertTokenToEvmCoin),
          }}
        />
      )}

      <Button
        onClick={() => setOpen(true)}
        startIcon={<Send />}
        variant="outlined"
        color="primary"
        disabled={!account}
      >
        <FormattedMessage id="send" defaultMessage="send" />
      </Button>
    </>
  );
}
