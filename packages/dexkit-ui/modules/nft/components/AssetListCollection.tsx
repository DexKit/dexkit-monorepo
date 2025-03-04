import Link from "@dexkit/ui/components/AppLink";
import { Button, Grid, Pagination, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useAssetListFromCollection } from "../hooks/collection";
import { BaseAssetCard } from "./BaseAssetCard";

interface Props {
  contractAddress: string;
  network: string;
  search?: string;
}

export function AssetListCollection({
  contractAddress,
  search,
  network,
}: Props) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(50);

  const { data } = useAssetListFromCollection({
    network,
    address: contractAddress,
    skip: page * perPage,
    take: perPage,
    traitsFilter: router.query["traitsFilter"] as string | undefined,
  });
  const assets = data?.assets;

  const filteredAssets = useMemo(() => {
    if (assets && search) {
      return assets.filter(
        (a) =>
          a.collectionName.indexOf(search) !== -1 ||
          a.metadata?.name.indexOf(search) !== -1
      );
    }

    return assets;
  }, [search, assets]);

  return (
    <Grid container spacing={2}>
      {filteredAssets?.map((asset, index) => (
        <Grid item xs={6} sm={2} key={index}>
          <BaseAssetCard asset={asset} />
        </Grid>
      ))}
      {filteredAssets?.length === 0 && (
        <Grid item xs={12} sm={12}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h6">
              <FormattedMessage
                id="nfts.not.found"
                defaultMessage="NFT's not found"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="clear.filters"
                defaultMessage="Clear filters to see nft's"
              />
            </Typography>
            <Button
              LinkComponent={Link}
              href="/order/create"
              color="primary"
              variant="contained"
            >
              <FormattedMessage
                id="post.offers"
                defaultMessage="Post offers"
                description="Post offers"
              />
            </Button>
          </Stack>
        </Grid>
      )}
      <Grid item xs={12} sm={12} container justifyContent={"flex-end"}>
        <Pagination
          page={page + 1}
          onChange={(_ev, _page) => setPage(_page - 1)}
          count={Math.floor((data?.total || 0) / perPage) + 1}
        />
      </Grid>
    </Grid>
  );
}
