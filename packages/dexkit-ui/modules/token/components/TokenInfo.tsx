import {
  formatBigNumber,
  getBlockExplorerUrl,
  getTokenBlockExplorerUrl,
  isAddressEqual,
} from "@dexkit/core/utils";
import { useTokenList } from "@dexkit/ui/hooks";

import { convertTokenToEvmCoin } from "@dexkit/core/utils";
import TransakWidget from "@dexkit/ui/components/Transak";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useTokenBalance } from "@dexkit/widgets/src/hooks";
import Send from "@mui/icons-material/Send";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { Avatar, Box, Button, Grid, Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import Link from "../../../components/AppLink";

const EvmReceiveDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/EvmReceiveDialog")
);

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog"
    )
);

export interface TokenSummaryProps {
  address: string;
  chainId: number;
}

export default function TokenInfo({ address, chainId }: TokenSummaryProps) {
  const { account, ENSName, provider } = useWeb3React();
  const tokens = useTokenList({ chainId, includeNative: true });
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const tokenBalance = useTokenBalance({
    account,
    provider,
    contractAddress: address,
  });

  const token = useMemo(() => {
    if (chainId && address) {
      return tokens.find(
        (tk) => isAddressEqual(address, tk.address) && chainId === tk.chainId
      );
    }
  }, [chainId, address]);

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const [isSendOpen, setIsSendOpen] = useState(false);

  const handleOpenSend = () => {
    setIsSendOpen(true);
  };

  const handleCloseSend = () => {
    setIsSendOpen(false);
  };

  return (
    <>
      {isSendOpen && token && (
        <EvmTransferCoinDialog
          dialogProps={{
            open: isSendOpen,
            maxWidth: "sm",
            fullWidth: true,

            onClose: handleCloseSend,
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            coins: [convertTokenToEvmCoin(token)],
            defaultCoin: convertTokenToEvmCoin(token),
          }}
        />
      )}
      {isReceiveOpen && token && (
        <EvmReceiveDialog
          dialogProps={{
            open: isReceiveOpen,
            onClose: handleCloseReceive,
            maxWidth: "sm",
            fullWidth: true,
          }}
          receiver={account}
          chainId={chainId}
          coins={[convertTokenToEvmCoin(token)]}
          defaultCoin={convertTokenToEvmCoin(token)}
        />
      )}

      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        alignContent={"center"}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="token" defaultMessage="Token" />
        </Typography>*/}
            <Stack
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Avatar
                src={token?.logoURI}
                imgProps={{ sx: { objectFit: "fill" } }}
              ></Avatar>

              <Box
                sx={{ pl: 1 }}
                display={"flex"}
                justifyContent={"center"}
                flexDirection={"column"}
              >
                <Typography variant="h6">{token?.symbol}</Typography>
                {getBlockExplorerUrl(chainId) && (
                  <Link
                    href={getTokenBlockExplorerUrl({ chainId, address }) || " "}
                    target="_blank"
                    underline="hover"
                    variant="caption"
                  >
                    <FormattedMessage id="explorer" defaultMessage="Explorer" />
                  </Link>
                )}
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              justifyContent={"center"}
              justifyItems={"center"}
            >
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage
                    id="your.balance"
                    defaultMessage="Your balance"
                  />
                </Typography>
                <Typography variant="h6">
                  {account
                    ? formatBigNumber(tokenBalance.data, token?.decimals)
                    : "-"}{" "}
                  {token?.symbol}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="actions" defaultMessage="Actions" />
                </Typography>
                <Stack spacing={2} direction="row">
                  <Button
                    fullWidth
                    startIcon={<Send />}
                    color="inherit"
                    variant="outlined"
                    onClick={handleOpenSend}
                  >
                    <FormattedMessage id="send" defaultMessage="Send" />
                  </Button>
                  <Button
                    startIcon={<VerticalAlignBottomIcon />}
                    color="inherit"
                    variant="outlined"
                    fullWidth
                    onClick={handleOpenReceive}
                  >
                    <FormattedMessage id="receive" defaultMessage="Receive" />
                  </Button>
                  <TransakWidget
                    buttonProps={{
                      color: "inherit",
                      variant: "outlined",
                      fullWidth: true,
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
