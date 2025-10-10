import { ChainId } from "@dexkit/core/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Search } from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { ChangeEvent, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import CloseCircle from "../../../components/icons/CloseCircle";

import { Asset } from "@dexkit/core/types/nft";
import {
  getNetworkSlugFromChainId,
  isAddressEqual,
} from "@dexkit/core/utils/blockchain";
import Funnel from "../../../components/icons/Filter";
import { AssetCard } from "../../nft/components/AssetCard";
import TableSkeleton from "../../nft/components/tables/TableSkeleton";
import {
  useAccountAssetsBalance,
  useAsset,
  useHiddenAssets,
} from "../../nft/hooks";
import WalletAssetsFilter from "./WalletAssetsFilter";
const EvmTransferNftDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-transfer-nft/components/dialogs/EvmTransferNftDialog"
    )
);
interface Props {
  onOpenFilters?: () => void;
  filters?: {
    myNfts: boolean;
    chainId?: ChainId;
    networks: string[];
    account?: string;
  };
  accounts?: string[];
  setFilters?: any;
  onImport: () => void;
}

function WalletAssetsSection({
  onOpenFilters,
  filters,
  setFilters,
  accounts,
}: Props) {
  const { account, chainId, signer } = useWeb3React();
  const [openFilter, setOpenFilter] = useState(false);
  const [assetTransfer, setAssetTransfer] = useState<Asset | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { accountAssets, accountAssetsQuery } = useAccountAssetsBalance(
    filters?.account ? [filters?.account] : [],
    false
  );
  const assetToTransfer = useAsset(
    assetTransfer?.contractAddress,
    assetTransfer?.id,
    undefined,
    true,
    assetTransfer?.chainId
  );

  const { isHidden, toggleHidden, assets: hiddenAssets } = useHiddenAssets();
  const [search, setSearch] = useState("");
  const assets = useMemo(() => {
    if (accountAssets?.data) {
      return (
        (accountAssets?.data
          .map((a) => a.assets)
          .flat()
          .filter((a) => a) as Asset[]) || []
      );
    }
    return [];
  }, [accountAssets?.data]);

  const filteredAssetList = useMemo(() => {
    return assets
      .filter((asset) => !isHidden(asset))
      .filter((asset) => {
        return (
          asset.collectionName?.toLowerCase().search(search.toLowerCase()) >
          -1 ||
          (asset.metadata !== undefined &&
            asset.metadata?.name !== undefined &&
            asset.metadata?.name.toLowerCase().search(search.toLowerCase()) >
            -1)
        );
      })
      .filter((asset) => {
        if (filters?.myNfts) {
          return isAddressEqual(asset.owner, filters?.account);
        }
        /*if (filters?.chainId) {
          return Number(asset.chainId) === Number(filters.chainId);
        }*/
        if (filters?.networks && filters?.networks.length) {
          return filters.networks.includes(
            getNetworkSlugFromChainId(asset.chainId) || ""
          );
        }

        return true;
      });
  }, [assets, filters, search, hiddenAssets]);

  const totalPages = Math.ceil(filteredAssetList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = filteredAssetList.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredAssetList.length]);

  const { formatMessage } = useIntl();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const onTransfer = (asset: Asset) => {
    setAssetTransfer(asset);
  };

  const renderAssets = () => {
    if (filteredAssetList.length === 0) {
      return (
        <Grid size={12}>
          <Box sx={{ py: 4 }}>
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <CloseCircle color="error" />
              <Typography variant="body1" color="textSecondary">
                <FormattedMessage
                  id="no.nfts.found"
                  defaultMessage="No NFTs Found"
                />
              </Typography>
              <Typography align="center" variant="body1" color="textSecondary">
                <FormattedMessage
                  id="import.or.favorite.nfts"
                  defaultMessage="Import or favorite NFTs"
                />
              </Typography>
            </Stack>
          </Box>
        </Grid>
      );
    }

    return paginatedAssets.map((asset, index) => (
      <Grid size={{ xs: 6, sm: 3 }} key={index}>
        <AssetCard
          asset={asset}
          key={index}
          showControls={true}
          onHide={toggleHidden}
          isHidden={isHidden(asset)}
          onTransfer={onTransfer}
        />
      </Grid>
    ));
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      {assetTransfer !== undefined && (
        <EvmTransferNftDialog
          DialogProps={{
            open: assetTransfer !== undefined,
            onClose: () => {
              setAssetTransfer(undefined);
            },
          }}
          params={{
            chainId: chainId,
            account: account,
            signer: signer,
            contractAddress: assetToTransfer.data?.contractAddress,
            tokenId: assetToTransfer.data?.id,
            isLoadingNft: assetToTransfer.isLoading,
            nft: assetToTransfer?.data || assetTransfer,
            nftMetadata:
              assetToTransfer?.data?.metadata || assetTransfer.metadata,
          }}
        />
      )}
      <Grid container spacing={2}>
        <Grid size={12}>
          {isDesktop ? (
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <IconButton
                onClick={() => {
                  setOpenFilter(!openFilter);
                }}
              >
                <FilterListIcon />
              </IconButton>

              <TextField
                type="search"
                size="small"
                value={search}
                onChange={handleChange}
                placeholder={formatMessage({
                  id: "search.for.a.nft",
                  defaultMessage: "Search for a NFT",
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <Chip
                label={
                  <>
                    {filteredAssetList.length}{" "}
                    <FormattedMessage id="nfts" defaultMessage="NFTs" />
                  </>
                }
                color="secondary"
              />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                alignContent="center"
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  alignContent="center"
                >
                  <Chip
                    label={
                      <>
                        {assets.length}{" "}
                        <FormattedMessage id="nfts" defaultMessage="NFTs" />
                      </>
                    }
                    color="secondary"
                  />
                </Stack>
                <IconButton onClick={onOpenFilters}>
                  <Funnel />
                </IconButton>
              </Stack>
              <TextField
                type="search"
                size="small"
                value={search}
                onChange={handleChange}
                placeholder={formatMessage({
                  id: "search.for.a.nft",
                  defaultMessage: "Search for a NFT",
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          )}
        </Grid>
        {openFilter && (
          <Grid size={3}>
            <WalletAssetsFilter
              setFilters={setFilters}
              filters={filters}
              accounts={accounts}
              onClose={() => setOpenFilter(false)}
            />
          </Grid>
        )}

        <Grid container size={openFilter ? 9 : 12}>
          {accountAssetsQuery.isLoading && <TableSkeleton rows={4} />}
          {!accountAssetsQuery.isLoading && renderAssets()}
        </Grid>

        {!accountAssetsQuery.isLoading && filteredAssetList.length > itemsPerPage && (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="body2" color="textSecondary">
                  <FormattedMessage
                    id="showing.nfts"
                    defaultMessage="Showing {start}-{end} of {total} NFTs"
                    values={{
                      start: startIndex + 1,
                      end: Math.min(endIndex, filteredAssetList.length),
                      total: filteredAssetList.length
                    }}
                  />
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default WalletAssetsSection;
