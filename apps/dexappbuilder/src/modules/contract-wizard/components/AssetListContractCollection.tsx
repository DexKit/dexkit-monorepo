import { Button, Grid, Pagination, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Link from '@dexkit/ui/components/AppLink';
import { BaseAssetCard } from '@dexkit/ui/modules/nft/components/BaseAssetCard';
import { useAssetListFromCollection } from '../../../hooks/collection';

interface Props {
  contractAddress: string;
  network: string;
  search?: string;
  showButtonEmpty?: boolean;
  showAssetDetailsInDialog?: boolean;
}

export function AssetListContractCollection({
  contractAddress,
  search,
  network,
  showButtonEmpty = true,
  showAssetDetailsInDialog = false,
}: Props) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(50);

  // TODO: remove this hook to a component above.
  const { data } = useAssetListFromCollection({
    network,
    address: contractAddress,
    skip: page * perPage,
    take: perPage,
    traitsFilter: router.query['traitsFilter'] as string | undefined,
  });

  const assets = data?.assets;

  const filteredAssets = useMemo(() => {
    if (assets && search) {
      return assets.filter(
        (a: any) =>
          a.collectionName.indexOf(search) !== -1 ||
          a.metadata?.name.indexOf(search) !== -1,
      );
    }

    return assets;
  }, [search, assets]);

  return (
    <Grid container spacing={2}>
      {filteredAssets?.map((asset: any, index: any) => (
        <Grid
          key={index}
          size={{
            xs: 6,
            sm: 2
          }}>
          <BaseAssetCard
            asset={asset}
            showAssetDetailsInDialog={showAssetDetailsInDialog}
          />
        </Grid>
      ))}
      {filteredAssets?.length === 0 && (
        <Grid
          size={{
            xs: 12,
            sm: 12
          }}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h6">
              <FormattedMessage
                id="nfts.not.found"
                defaultMessage="NFTs not found"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="clear.filters"
                defaultMessage="Clear filters to see NFTs"
              />
            </Typography>
            {showButtonEmpty && (
              <Button
                LinkComponent={Link}
                href={`/contract-wizard/collection/${network}/${contractAddress}/create-nfts`}
                color="primary"
                variant="contained"
              >
                <FormattedMessage
                  id="create.nfts"
                  defaultMessage="Create NFTs"
                />
              </Button>
            )}
          </Stack>
        </Grid>
      )}
      <Grid
        container
        justifyContent={'flex-end'}
        size={{
          xs: 12,
          sm: 12
        }}>
        <Pagination
          page={page + 1}
          onChange={(_ev: any, _page: any) => setPage(_page - 1)}
          count={Math.floor((data?.total || 0) / perPage) + 1}
        />
      </Grid>
    </Grid>
  );
}
