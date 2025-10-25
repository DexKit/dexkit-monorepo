import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import AssetLeftSection from "@dexkit/ui/modules/nft/components/AssetLeftSection";
import AssetOptionsProvider from "@dexkit/ui/modules/nft/components/AssetOptionsProvider";
import { AssetPageActions } from "@dexkit/ui/modules/nft/components/AssetPageActions";
import { AssetPageTitle } from "@dexkit/ui/modules/nft/components/AssetPageTitle";
import { AssetPricePaper } from "@dexkit/ui/modules/nft/components/AssetPricePaper";
import AssetRightSection from "@dexkit/ui/modules/nft/components/AssetRightSection";
import { AssetTabs } from "@dexkit/ui/modules/nft/components/AssetTabs";
import { fetchAssetForQueryClient } from "@dexkit/ui/modules/nft/services/query";
import { AssetPageSection } from "@dexkit/ui/modules/wizard/types/section";
import ThirdwebV4Provider from "@dexkit/ui/providers/ThirdwebV4Provider";
import { hexToString } from "@dexkit/ui/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import {
  Alert,
  Box,
  Grid,
  NoSsr,
  Typography
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useContract } from "@thirdweb-dev/react";
import { useEffect } from "react";
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
  const { address, tokenId, network, enableDrops } =
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
      <Box sx={{
        px: { xs: 3, sm: 3, md: 4 },
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Grid container spacing={3}>
            <Grid size={12} sx={{ mb: 2 }}>
              <AssetLeftSection address={address} id={tokenId} />
            </Grid>

            <Grid size={12}>
              <AssetPageTitle address={address} id={tokenId} />
            </Grid>
            <Grid size={12}>
              <NoSsr>
                <AssetPageActions address={address} id={tokenId} />
              </NoSsr>
            </Grid>

            <Grid size={12}>
              <AssetPricePaper address={address} id={tokenId} />
            </Grid>

            <Grid size={12}>
              <AssetTabs address={address} id={tokenId} />
            </Grid>

            {enableDrops && (
              <Grid size={12}>
                <ThirdwebV4Provider chainId={NETWORK_FROM_SLUG(network)?.chainId}>
                  <DropWrapper
                    address={address}
                    tokenId={tokenId}
                    network={network}
                  />
                </ThirdwebV4Provider>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AssetLeftSection address={address} id={tokenId} />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <AssetRightSection address={address} id={tokenId} />
            </Grid>
            {enableDrops && (
              <Grid size={12}>
                <ThirdwebV4Provider chainId={NETWORK_FROM_SLUG(network)?.chainId}>
                  <DropWrapper
                    address={address}
                    tokenId={tokenId}
                    network={network}
                  />
                </ThirdwebV4Provider>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </AssetOptionsProvider>
  );
}

