import { Grid, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import StoreIcon from "@mui/icons-material/Store";
import { OrderbookAPI } from "../types";
import { parseAssetApi } from "../utils";
import { BaseAssetCard } from "./BaseAssetCard";
import { BaseAssetCardSkeleton } from "./BaseAssetCardSkeleton";

interface Props {
  orderbook?: OrderbookAPI;
  isLoading?: boolean;
  search?: string;
  context?: "store" | "collection";
}

export function StoreOrderbook({
  orderbook,
  search,
  isLoading,
  context,
}: Props) {
  const filteredOrderbook = useMemo(() => {
    let data = orderbook?.data;
    if (data && search) {
      return data?.filter((n) => {
        let hasFoundInDescription = false;
        let hasFoundInCollectionName = false;
        let hasFoundInCollectionTokenId = false;

        if (n?.asset?.description && search) {
          hasFoundInDescription =
            n.asset?.description.toLowerCase().search(search.toLowerCase()) >
            -1;
        }

        if (n?.asset?.collectionName && search) {
          hasFoundInCollectionName =
            n?.asset?.collectionName
              .toLowerCase()
              .search(search?.toLowerCase()) > -1;
        }

        if (n?.asset?.tokenId && search) {
          hasFoundInCollectionTokenId =
            n?.asset?.tokenId.toLowerCase().search(search?.toLowerCase()) > -1;
        }

        return (
          hasFoundInDescription ||
          hasFoundInCollectionName ||
          hasFoundInCollectionTokenId
        );
      });
    }

    return data;
  }, [search, orderbook?.data]);

  return (
    <Grid container spacing={2}>
      {isLoading &&
        [1, 2, 3, 4, 5].map((_, index) => (
          <Grid size={{ xs: 6, sm: 3 }} key={index}>
            <BaseAssetCardSkeleton />
          </Grid>
        ))}

      {filteredOrderbook?.map((orderBookItem, index) => (
        <Grid size={{ xs: 6, sm: context === "collection" ? 2 : 3 }} key={index}>
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
              {context === "collection" ? (
                <FormattedMessage
                  id="store.without.order"
                  defaultMessage="Store without offers. Came back later!"
                />
              ) : (
                <FormattedMessage
                  id="collection.without.orders"
                  defaultMessage="Collection without listings. Came back later!"
                />
              )}
            </Typography>
          </Stack>
        </Grid>
      )}
      {filteredOrderbook?.length === 0 && !isLoading && search && (
        <Grid size={12}>
          <Stack justifyContent="center" alignItems="center">
            <SearchOffIcon fontSize="large" />
            <Typography variant="h6">
              <FormattedMessage
                id="no.results"
                defaultMessage="No results"
                description="No Available offers message"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="search.not.returned.results"
                defaultMessage="Search not returned results. Try other search words. "
              />
            </Typography>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
