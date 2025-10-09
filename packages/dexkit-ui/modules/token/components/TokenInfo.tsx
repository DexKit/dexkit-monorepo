import {
  formatBigNumber,
  getBlockExplorerUrl,
  getTokenBlockExplorerUrl,
  isAddressEqual,
} from "@dexkit/core/utils";
import { useDexKitContext, useTokenList } from "@dexkit/ui/hooks";

import { convertTokenToEvmCoin } from "@dexkit/core/utils";
import TransakWidget from "@dexkit/ui/components/Transak";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useTokenBalance } from "@dexkit/widgets/src/hooks";
import Send from "@mui/icons-material/Send";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { Avatar, Box, Button, Link as MuiLink, Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

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

  const { tokens: importedTokens } = useDexKitContext();

  const token = useMemo(() => {
    if (chainId && address) {
      const nativeToken = tokens.find(
        (tk) => isAddressEqual(address, tk.address) && chainId === tk.chainId
      );

      if (nativeToken) {
        return nativeToken;
      }

      const importedToken = importedTokens.find(
        (tk: any) => isAddressEqual(address, tk.address) && chainId === tk.chainId
      );

      if (importedToken) {
        return {
          address: importedToken.address,
          chainId: importedToken.chainId,
          decimals: importedToken.decimals,
          logoURI: importedToken.logoURI || "",
          name: importedToken.name,
          symbol: importedToken.symbol,
        };
      }
    }
  }, [chainId, address, tokens, importedTokens]);

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
        <Stack spacing={3} alignItems="center">
          <Stack
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={1}
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
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  fontSize: '1.5rem'
                }}
              >
                {token?.symbol}
              </Typography>
              {getBlockExplorerUrl(chainId) && (
                <MuiLink
                  href={getTokenBlockExplorerUrl({ chainId, address }) || " "}
                  target="_blank"
                  underline="hover"
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      color: 'primary.dark',
                    }
                  }}
                >
                  <FormattedMessage id="explorer" defaultMessage="Explorer" />
                </MuiLink>
              )}
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 4 }}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ width: '100%', px: { xs: 1, sm: 3 } }}
          >
            <Box
              textAlign="center"
              sx={{
                minWidth: 0,
                flex: 1,
                maxWidth: { xs: '100%', sm: '200px' },
                px: { xs: 1, sm: 0 }
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                <FormattedMessage
                  id="your.balance"
                  defaultMessage="Your balance"
                />
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  mt: 0.5,
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={`${account ? formatBigNumber(tokenBalance.data, token?.decimals) : "-"} ${token?.symbol}`}
              >
                {account
                  ? formatBigNumber(tokenBalance.data, token?.decimals)
                  : "-"}{" "}
                {token?.symbol}
              </Typography>
            </Box>

            <Box
              sx={{
                minWidth: 0,
                flex: 1,
                maxWidth: { xs: '100%', sm: '200px' },
                px: { xs: 1, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  mb: 1,
                  display: 'block',
                  alignSelf: 'center'
                }}
              >
                <FormattedMessage id="actions" defaultMessage="Actions" />
              </Typography>
              <Stack
                spacing={{ xs: 1, sm: 1.5 }}
                direction="row"
                sx={{
                  mt: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                  width: 'fit-content',
                  px: { xs: 0, sm: 0 }
                }}
              >
                <Button
                  startIcon={<Send />}
                  color="primary"
                  variant="outlined"
                  onClick={handleOpenSend}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderWidth: 2,
                    minWidth: { xs: '70px', sm: '80px' },
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 0.75, sm: 0.5 },
                    maxWidth: { xs: '90px', sm: '85px' },
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  <FormattedMessage id="send" defaultMessage="Send" />
                </Button>
                <Button
                  startIcon={<VerticalAlignBottomIcon />}
                  color="primary"
                  variant="outlined"
                  onClick={handleOpenReceive}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderWidth: 2,
                    minWidth: { xs: '70px', sm: '80px' },
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 0.75, sm: 0.5 },
                    maxWidth: { xs: '90px', sm: '85px' },
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  <FormattedMessage id="receive" defaultMessage="Receive" />
                </Button>
                {/* TODO: As a workaround for https://github.com/DexKit/dexkit-monorepo/issues/462#event-17351363710 buy button is hidden */}
                {false && (
                  <TransakWidget
                    buttonProps={{
                      color: "inherit",
                      variant: "outlined",
                      fullWidth: true,
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
