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
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import CloseCircle from "../../../components/icons/CloseCircle";

import { Asset } from "@dexkit/core/types/nft";
import { getNetworkSlugFromChainId } from "@dexkit/core/utils/blockchain";
import Funnel from "../../../components/icons/Filter";
import { AssetCard } from "../../nft/components/AssetCard";
import { useAccountAssetsBalance, useHiddenAssets } from "../../nft/hooks";
import WalletAssetsFilter from "./WalletAssetsFilter";

interface Props {
  onOpenFilters?: () => void;
  filters?: {
    myNfts: boolean;
    chainId?: ChainId;
    networks: string[];
    account?: string;
  };
  setFilters?: any;
}

function HiddenAssetsSection({ onOpenFilters, filters, setFilters }: Props) {
  const [openFilter, setOpenFilter] = useState(false);
  const { account } = useWeb3React();
  const [search, setSearch] = useState("");
  const { accountAssets } = useAccountAssetsBalance(account ? [account] : []);

  const { formatMessage } = useIntl();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const { isHidden, toggleHidden, assets: hiddenAssets } = useHiddenAssets();
  const assetList = useMemo(() => {
    if (accountAssets?.data && accountAssets?.data.length) {
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
    return assetList
      .filter(isHidden)
      .filter((asset) => {
        return (
          asset?.collectionName?.toLowerCase().search(search.toLowerCase()) >
            -1 ||
          (asset?.metadata !== undefined &&
            asset?.metadata?.name?.toLowerCase().search(search.toLowerCase()) >
              -1)
        );
      })
      .filter((asset) => {
        if (filters?.networks && filters?.networks.length) {
          return filters.networks.includes(
            getNetworkSlugFromChainId(asset?.chainId) || "",
          );
        }

        return true;
      });
  }, [assetList, filters, search, hiddenAssets]);

  const renderAssets = () => {
    if (filteredAssetList.length === 0) {
      return (
        <Grid item xs={12}>
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
                  id="no.hidden.nfts.found"
                  defaultMessage="No hidden NFTs Found"
                />
              </Typography>
            </Stack>
          </Box>
        </Grid>
      );
    }

    return filteredAssetList.map((asset, index) => (
      <Grid item xs={6} sm={3} key={index}>
        <AssetCard
          asset={asset}
          key={index}
          onHide={toggleHidden}
          showControls={true}
          isHidden={true}
        />
      </Grid>
    ));
  };
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
                  spacing={1}
                  alignItems="center"
                  alignContent="center"
                >
                  <Chip
                    label={
                      <>
                        {assetList.length}{" "}
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
          <Grid item xs={3}>
            <WalletAssetsFilter
              setFilters={setFilters}
              filters={filters}
              onClose={() => setOpenFilter(false)}
            />
          </Grid>
        )}

        <Grid container item xs={openFilter ? 9 : 12}>
          {renderAssets()}
        </Grid>
      </Grid>
    </>
  );
}

export default HiddenAssetsSection;
