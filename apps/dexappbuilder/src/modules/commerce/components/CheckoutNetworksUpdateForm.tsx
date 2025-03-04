import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useCheckoutNetworks from '../hooks/settings/useCheckoutNetworks';
import useUpdateCheckoutNetworks from '../hooks/settings/useUpdateCheckoutNetworks';

interface CheckoutNetworksBaseProps {
  networks: { chainId: number }[];
}

const commerceSettingsAtomTestnets = atomWithStorage(
  'dexkit.commerce.show.testnets',
  false,
);

function CheckoutNetworksBase({ networks }: CheckoutNetworksBaseProps) {
  const { activeChainIds } = useActiveChainIds();

  const [query, setQuery] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const [showTestnets, setShowTestnets] = useAtom(commerceSettingsAtomTestnets);

  const availNetworks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => ![ChainId.Goerli, ChainId.Mumbai].includes(n.chainId))
      .filter((n) => {
        if (!showTestnets && n.testnet) {
          return false;
        }

        return true;
      })
      .filter((n) => activeChainIds.includes(n.chainId))
      .filter((n) => n.name.toLowerCase().search(query.toLowerCase()) > -1)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeChainIds, query, showTestnets]);

  const value: { [key: string]: boolean } = networks.reduce(
    (prev, curr: { chainId: number }) => {
      prev[curr.chainId.toString()] = true;

      return prev;
    },
    {} as { [key: string]: boolean },
  );

  const [checked, setChecked] = useState<{ [key: string]: boolean }>(value);

  const handleToggle = useCallback((chainId: ChainId) => {
    return () => {
      setChecked((values) => ({
        ...values,
        [chainId]: !Boolean(values[chainId]),
      }));
    };
  }, []);

  const { mutateAsync: update } = useUpdateCheckoutNetworks();

  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage } = useIntl();

  const handleSave = async () => {
    const chainIds = Object.keys(checked)
      .filter((n) => checked[n])
      .map(Number);

    try {
      await update({ chainIds });
      enqueueSnackbar(
        <FormattedMessage
          id="networks.updated"
          defaultMessage="Networks updated"
        />,
        { variant: 'success' },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              variant="standard"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              placeholder={formatMessage({
                id: 'search.networks',
                defaultMessage: 'Search networks',
              })}
              value={query}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showTestnets}
                  onChange={() => setShowTestnets((value) => !value)}
                />
              }
              label={
                <FormattedMessage
                  id="show.testnets"
                  defaultMessage="Show testnets"
                />
              }
            />
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            wrap="wrap"
            sx={{ height: '18rem' }}
          >
            {availNetworks.map((network, key) => (
              <Grid item key={key}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Switch
                      checked={Boolean(checked[network.chainId])}
                      onClick={handleToggle(network.chainId)}
                    />
                    <Typography
                      sx={
                        network.testnet
                          ? { color: (theme) => theme.palette.error.main }
                          : undefined
                      }
                    >
                      {network.name}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Box>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button variant="contained" onClick={handleSave}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}

export default function CheckoutNetworksUpdateForm() {
  const { data: networks, isFetchedAfterMount } = useCheckoutNetworks();

  return (
    networks &&
    isFetchedAfterMount && <CheckoutNetworksBase networks={networks ?? []} />
  );
}
