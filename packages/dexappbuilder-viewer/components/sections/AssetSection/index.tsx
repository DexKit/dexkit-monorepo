import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import AssetLeftSection from "@dexkit/ui/modules/nft/components/AssetLeftSection";
import AssetOptionsProvider from "@dexkit/ui/modules/nft/components/AssetOptionsProvider";
import AssetRightSection from "@dexkit/ui/modules/nft/components/AssetRightSection";
import { fetchAssetForQueryClient } from "@dexkit/ui/modules/nft/services/query";
import DarkblockWrapper from "@dexkit/ui/modules/wizard/components/DarkblockWrapper";
import { AssetPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { hexToString } from "@dexkit/ui/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import {
  Alert,
  Box,
  Button,
  Grid,
  NoSsr,
  Stack,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ThirdwebSDKProvider, useContract } from "@thirdweb-dev/react";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormattedMessage } from "react-intl";
import EditionDropSection from "../EditionDropSection";

interface DropWrapperProps {
  tokenId: string;
  address: string;
  network: string;
}

function DropWrapper({ tokenId, address, network }: DropWrapperProps) {
  const { data: contract } = useContract(address);

  const isDrop = useAsyncMemo(
    async () => {
      if (!contract) {
        return false;
      }
      try {
        const contractType = hexToString(await contract?.call("contractType"));

        return contractType === "DropERC1155";
      } catch (err) {
        return false;
      }
    },
    false,
    [contract]
  );

  if (isDrop) {
    return (
      <EditionDropSection
        section={{
          type: "edition-drop-section",
          config: {
            network,
            tokenId: tokenId as string,
            address: address as string,
          },
        }}
      />
    );
  }

  return (
    <Box>
      <Alert severity="warning">
        <Typography>
          <FormattedMessage
            id="drops.are.not.available.for.this.contract"
            defaultMessage="Drops are not available for this contract"
          />
        </Typography>
      </Alert>
    </Box>
  );
}

export interface AssetSectionProps {
  section: AssetPageSection;
}

export default function AssetSection({ section }: AssetSectionProps) {
  const { address, tokenId, network, enableDrops, enableDarkblock } =
    section.config;

  const queryClient = useQueryClient();

  useEffect(() => {
    const chainId = NETWORK_FROM_SLUG(network)?.chainId;

    if (chainId) {
      fetchAssetForQueryClient({
        item: { chainId, contractAddress: address, tokenId },
        queryClient,
      });
    }
  }, [address, tokenId, network, queryClient]);

  const { signer } = useWeb3React();

  return (
    <AssetOptionsProvider
      key={`${network}-${address}-${tokenId}`}
      options={{ options: {} }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <AssetLeftSection address={address} id={tokenId} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <AssetRightSection address={address} id={tokenId} />
          {enableDarkblock && (
            <ErrorBoundary
              key={"darkblock-error-boundary"}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <Stack justifyContent="center" alignItems="center">
                  <Typography variant="h6">
                    <FormattedMessage
                      id="something.went.wrong.with.darkblock.contact.support"
                      defaultMessage="Oops, something went wrong with darkblock. Contact support"
                    />
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {String(error)}
                  </Typography>
                  <Button color="primary" onClick={resetErrorBoundary}>
                    <FormattedMessage
                      id="try.again"
                      defaultMessage="Try again"
                      description="Try again"
                    />
                  </Button>
                </Stack>
              )}
            >
              <NoSsr>
                <Suspense>
                  <DarkblockWrapper
                    address={address as string}
                    tokenId={tokenId}
                    network={network}
                  />
                </Suspense>
              </NoSsr>
            </ErrorBoundary>
          )}
        </Grid>
        {enableDrops && (
          <Grid item xs={12}>
            <ThirdwebSDKProvider
              activeChain={NETWORK_FROM_SLUG(network)?.chainId}
              signer={signer}
            >
              <DropWrapper
                address={address}
                tokenId={tokenId}
                network={network}
              />
            </ThirdwebSDKProvider>
          </Grid>
        )}
      </Grid>
    </AssetOptionsProvider>
  );
}
