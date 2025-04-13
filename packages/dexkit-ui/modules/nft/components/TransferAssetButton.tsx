import { Asset } from "@dexkit/core/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import Send from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";

import { useState } from "react";
import { FormattedMessage } from "react-intl";

const EvmTransferNftDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-transfer-nft/components/dialogs/EvmTransferNftDialog"
    )
);

interface Props {
  asset?: Asset;
}

export function TransferAssetButton({ asset }: Props) {
  const { account, signer, chainId } = useWeb3React();
  const [open, setOpen] = useState(false);

  return (
    <>
      <EvmTransferNftDialog
        DialogProps={{
          open: open,
          onClose: () => {
            setOpen(false);
          },
        }}
        params={{
          chainId: chainId,
          account: account,
          signer: signer,
          contractAddress: asset?.contractAddress,
          tokenId: asset?.id,
          nft: asset,
          nftMetadata: asset?.metadata,
        }}
      />
      <Button
        size="large"
        onClick={() => setOpen(true)}
        startIcon={<Send color="primary" />}
        variant="outlined"
      >
        <FormattedMessage id="transfer" defaultMessage="Transfer" />
      </Button>
    </>
  );
}
