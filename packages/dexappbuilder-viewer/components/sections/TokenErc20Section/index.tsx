import { CoinTypes, TOKEN_ICON_URL } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { EvmCoin } from "@dexkit/core/types";
import { convertTokenToEvmCoin } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import { Box, Button, Container, Grid, Paper, Stack } from "@mui/material";
import { useContract } from "@thirdweb-dev/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { getChainIdFromSlug } from "@dexkit/core/utils/blockchain";
import { useTokenList } from "@dexkit/ui/hooks/blockchain";
import { TokenErc20PageSection } from "@dexkit/ui/modules/wizard/types/section";
import TokenSummary from "./TokenSummary";

export interface TokenErc20SectionProps {
  section: TokenErc20PageSection;
}

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog"
    )
);

const EvmBurnTokenDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-burn-token/components/dialogs/EvmBurnTokenDialog"
    )
);

const EvmMintTokenDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-mint-token/components/dialogs/EvmMintTokenDialog"
    )
);

export default function TokenErc20Section({ section }: TokenErc20SectionProps) {
  const {
    address,
    network,
    disableBurn,
    disableInfo,
    disableTransfer,
    disableMint,
  } = section.settings;

  const { data: contract } = useContract(address, "token");

  const { account, provider, ENSName, chainId } = useWeb3React();

  const tokens = useTokenList({ chainId, includeNative: true });

  const [showTransfer, setShowTransfer] = useState(false);
  const [showBurn, setShowBurn] = useState(false);
  const [showMint, setShowMint] = useState(false);

  const handleOpenTransfer = () => {
    setShowTransfer(true);
  };

  const handleOpenBurn = () => {
    setShowBurn(true);
  };

  const handleOpenMint = () => {
    setShowMint(true);
  };

  const handleCloseTransfer = () => {
    setShowTransfer(false);
  };

  const handeCloseBurnToken = () => {
    setShowBurn(false);
  };

  const handeCloseMintToken = () => {
    setShowMint(false);
  };

  const token = useAsyncMemo(
    async () => {
      return await contract?.get();
    },
    undefined,
    [contract]
  );

  const net = useMemo(() => {
    let chain = getChainIdFromSlug(network);

    const net = chain ? NETWORKS[chain.chainId] : undefined;

    return net;
  }, [network]);

  const defaultToken: EvmCoin = useMemo(() => {
    return {
      coinType: CoinTypes.EVM_ERC20,
      contractAddress: address,
      decimals: token?.decimals || 0,
      name: token?.name || "",
      symbol: token?.symbol || "",
      network: {
        id: net?.slug || "",
        name: net?.name || "",
        chainId: net?.chainId,
        coingeckoPlatformId: net?.coingeckoPlatformId,
        icon: net?.imageUrl,
      },
    };
  }, [token, net]);

  return (
    <>
      {showTransfer && (
        <EvmTransferCoinDialog
          dialogProps={{
            open: showTransfer,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleCloseTransfer,
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            coins: tokens.map(convertTokenToEvmCoin),
            defaultCoin: defaultToken,
          }}
        />
      )}

      {showBurn && net && token && (
        <EvmBurnTokenDialog
          DialogProps={{
            open: showBurn,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handeCloseBurnToken,
          }}
          chainId={chainId}
          account={account}
          token={{
            address: address,
            chainId: net.chainId,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
            logoURI: TOKEN_ICON_URL(address, net.chainId),
          }}
        />
      )}
      {showMint && net && token && (
        <EvmMintTokenDialog
          DialogProps={{
            open: showMint,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handeCloseMintToken,
          }}
          chainId={chainId}
          account={account}
          token={{
            address: address,
            chainId: net.chainId,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
            logoURI: TOKEN_ICON_URL(address, net.chainId),
          }}
        />
      )}

      <Container>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {!disableInfo && (
              <Grid size={12}>
                <TokenSummary address={address} />
              </Grid>
            )}
            <Grid size={12}>
              <Box>
                <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                  {false && (
                    <Button onClick={handleOpenMint} variant="contained">
                      <FormattedMessage id="mint" defaultMessage="MInt" />
                    </Button>
                  )}
                  {!disableTransfer && (
                    <Button variant="contained" onClick={handleOpenTransfer}>
                      <FormattedMessage
                        id="transfer"
                        defaultMessage="Transfer"
                      />
                    </Button>
                  )}
                  {!disableBurn && (
                    <Button onClick={handleOpenBurn} variant="outlined">
                      <FormattedMessage id="burn" defaultMessage="Burn" />
                    </Button>
                  )}
                </Stack>
              </Box>
            </Grid>
            <Grid size={12}></Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
