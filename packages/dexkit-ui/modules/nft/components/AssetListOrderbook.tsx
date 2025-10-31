import StoreIcon from "@mui/icons-material/Store";
import { Grid, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useAssetsOrderBook } from "../hooks";
import { parseAssetApi } from "../utils";
import { BaseAssetCard } from "./BaseAssetCard";
import { BaseAssetCardSkeleton } from "./BaseAssetCardSkeleton";

interface Props {
  contractAddress?: string;
  chainId?: number;
}

export function AssetList({ contractAddress, chainId }: Props) {
  const assetOrderbookQuery = useAssetsOrderBook({
    chainId,
    nftToken: contractAddress?.toLowerCase(),
  });

  const orderbook = assetOrderbookQuery.data;
  const isLoading = assetOrderbookQuery.isLoading;

  const filteredOrderbook = useMemo(() => {
    return orderbook?.data || [];
  }, [orderbook?.data]);

  return (
    <Grid container spacing={2}>
      {isLoading &&
        [1, 2, 3, 4, 5].map((_, index) => (
          <Grid size={{ xs: 6, sm: 3 }} key={index}>
            <BaseAssetCardSkeleton />
          </Grid>
        ))}

      {filteredOrderbook?.map((orderBookItem, index) => (
        <Grid size={{ xs: 6, sm: 3 }} key={index}>
          <BaseAssetCard
            showAssetDetailsInDialog={true}
            asset={parseAssetApi(orderBookItem.asset)}
            orderBookItem={orderBookItem.order}
            assetMetadata={parseAssetApi(orderBookItem.asset)?.metadata}
          />
        </Grid>
      ))}
      {orderbook?.data?.length === 0 && !isLoading && (
        <Grid size={12}>
          <Stack justifyContent="center" alignItems="center">
            <StoreIcon fontSize="large" />
            <Typography variant="h6">
              <FormattedMessage
                id="no.available.offers"
                defaultMessage="No Available offers"
                description="No Available offers message"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="collection.without.orders"
                defaultMessage="Collection without listings. Came back later!"
              />
            </Typography>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}