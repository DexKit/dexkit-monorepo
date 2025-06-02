import { StoreHeader } from '@dexkit/ui/modules/nft/components/StoreHeader';
import { StoreOrderbook } from '@dexkit/ui/modules/nft/components/StoreOrderbook';
import { useAssetsOrderBook } from '@dexkit/ui/modules/nft/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Search from '@mui/icons-material/Search';
import {
    Button,
    Container,
    Divider,
    Grid,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { AssetStoreOptions } from 'src/types/nft';

const CreateAssetOrderDialog = dynamic(
  () =>
    import('@dexkit/ui/modules/nft/components/dialogs/CreateAssetOrderDialog'),
);

export function AssetStoreContainer({
  name,
  title,
  backgroundImageURL,
  profileImageURL,
  storeAccount,

  description,
}: AssetStoreOptions) {
  const { formatMessage } = useIntl();
  const { account } = useWeb3React();
  const [search, setSearch] = useState<string>();
  const [openAssetOrderDialog, setOpenAssetOrderDialog] = useState(false);

  const assetOrderbookQuery = useAssetsOrderBook({
    maker: storeAccount?.toLowerCase(),
  });

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <CreateAssetOrderDialog
        dialogProps={{
          open: openAssetOrderDialog,
          onClose: () => setOpenAssetOrderDialog(false),
        }}
      />

      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StoreHeader
              profileImageURL={profileImageURL}
              backgroundImageURL={backgroundImageURL}
              name={name}
              description={description}
              title={title}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              alignContent="center"
            >
              {/* <Typography variant="body1" sx={{ fontWeight: 600 }}>
                <FormattedMessage
                  id="store"
                  defaultMessage="Store"
                  description="store"
                />
      </Typography>*/}

              {account?.toLowerCase() === storeAccount?.toLowerCase() &&
                account && (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={() => setOpenAssetOrderDialog(true)}
                    >
                      <FormattedMessage
                        id={'create.order'}
                        defaultMessage={'Create Order'}
                      />
                    </Button>
                  </Box>
                )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4} xl={3}>
            <TextField
              fullWidth
              size="small"
              type="search"
              value={search}
              onChange={handleChangeSearch}
              placeholder={formatMessage({
                id: 'search.in.store',
                defaultMessage: 'Search in store',
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <StoreOrderbook
              search={search}
              orderbook={assetOrderbookQuery.data}
              isLoading={assetOrderbookQuery.isLoading}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
