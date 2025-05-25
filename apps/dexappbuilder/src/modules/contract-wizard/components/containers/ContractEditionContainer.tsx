import Search from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import NoSsr from '@mui/material/NoSsr';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { AppErrorBoundary } from '@dexkit/ui/components/AppErrorBoundary';
import { AssetListContractEdition } from '../AssetListContractEdition';
import CreateAssetFormDialog from '../dialogs/CreateAssetFormDialog';

interface Props {
  address: string;
  network: string;
}

export default function ContractEditionContainer({ address, network }: Props) {
  const [openMintDialog, setOpenMintDialog] = useState(false);

  const [search, setSearch] = useState<string>();

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const { formatMessage } = useIntl();

  return (
    <>
      <CreateAssetFormDialog
        dialogProps={{
          open: openMintDialog,
          onClose: () => setOpenMintDialog(false),
          fullWidth: true,
          maxWidth: 'xl',
        }}
        network={network}
        address={address}
        isERC1155={true}
        isLazyMint={false}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant={'outlined'} onClick={() => setOpenMintDialog(true)}>
            <FormattedMessage defaultMessage={'Mint NFT'} id={'mint.nft'} />
          </Button>
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            size="small"
            type="search"
            value={search}
            onChange={handleChangeSearch}
            placeholder={formatMessage({
              id: 'search.in.collection',
              defaultMessage: 'Search in collection',
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
          <NoSsr>
            <AppErrorBoundary
              fallbackRender={({ resetErrorBoundary, error }) => (
                <Stack justifyContent="center" alignItems="center">
                  <Typography variant="h6">
                    <FormattedMessage
                      id="something.went.wrong"
                      defaultMessage="Oops, something went wrong"
                      description="Something went wrong error message"
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
              <AssetListContractEdition
                contractAddress={address as string}
                network={network as string}
                search={search}
                showClaimConditions={false}
              />
            </AppErrorBoundary>
          </NoSsr>
        </Grid>
      </Grid>
    </>
  );
}
