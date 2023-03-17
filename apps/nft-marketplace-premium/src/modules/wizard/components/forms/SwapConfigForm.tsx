import { SwapConfig } from '@/modules/swap/types';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';
import {
  Alert,
  Container,
  Divider,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NetworkSelectDropdown } from 'src/components/NetworkSelectDropdown';
import { SearchTokenAutocomplete } from '../pageEditor/components/SearchTokenAutocomplete';

interface Props {
  data?: SwapConfig;
  onChange?: (data: SwapConfig) => void;
}

export function SwapConfigForm({ onChange, data }: Props) {
  const [formData, setFormData] = useState<SwapConfig | undefined>(data);

  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
    data?.defaultChainId
  );

  const sellToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      return formData.configByChain[selectedChainId]?.sellToken;
    }
  }, [selectedChainId, formData]);

  const buyToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      return formData.configByChain[selectedChainId]?.buyToken;
    }
  }, [selectedChainId, formData]);

  const slippage = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      return formData.configByChain[selectedChainId]?.slippage;
    }

    return 0;
  }, [selectedChainId, formData]);

  useEffect(() => {
    if (onChange && formData) {
      onChange(formData);
    }
  }, [formData, onChange]);

  return (
    <Container sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id="default.network.info.swap.form"
              defaultMessage="Default network when wallet is not connected"
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant="caption">
              <FormattedMessage
                id="default.network"
                defaultMessage="Default network"
              />
            </Typography>
            <NetworkSelectDropdown
              chainId={formData?.defaultChainId}
              onChange={(chainId) => {
                setFormData((formData) => ({
                  ...formData,
                  defaultChainId: chainId,
                }));
              }}
              labelId="default-network"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id="network.swap.options.info"
              defaultMessage="Choose the default tokens and slippage for each network."
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant="caption">
              <FormattedMessage id="network" defaultMessage="Network" />
            </Typography>
            <NetworkSelectDropdown
              onChange={(chainId) => {
                setSelectedChainId(chainId);
                setFormData((formData) => ({
                  ...formData,
                  defaultEditChainId: chainId,
                }));
              }}
              labelId={'config-per-network'}
              chainId={selectedChainId}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <SearchTokenAutocomplete
            label={
              <FormattedMessage
                id="search.default.input.token"
                defaultMessage="Search default input token"
              />
            }
            disabled={selectedChainId === undefined}
            data={sellToken}
            chainId={selectedChainId}
            onChange={(tk: any) => {
              if (selectedChainId) {
                let oldFormData: ChainConfig = {
                  slippage: 0,
                };

                if (
                  formData?.configByChain &&
                  formData?.configByChain[selectedChainId]
                ) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }

                setFormData((formData) => ({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      sellToken: {
                        chainId: tk.chainId as number,
                        contractAddress: tk.address,
                        decimals: tk.decimals,
                        name: tk.name,
                        symbol: tk.symbol,
                        logoURI: tk.logoURI,
                      },
                    },
                  },
                }));
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <SearchTokenAutocomplete
            chainId={selectedChainId}
            disabled={selectedChainId === undefined}
            label={
              <FormattedMessage
                id="search.default.output.token"
                defaultMessage="Search default output token"
              />
            }
            data={buyToken}
            onChange={(tk: any) => {
              if (selectedChainId) {
                let oldFormData: ChainConfig = { slippage: 0 };

                if (
                  formData?.configByChain &&
                  formData?.configByChain[selectedChainId]
                ) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }

                setFormData((formData) => {
                  if (formData) {
                    return {
                      ...formData,
                      configByChain: {
                        ...formData.configByChain,
                        [selectedChainId]: {
                          ...oldFormData,
                          buyToken: {
                            chainId: tk.chainId as number,
                            contractAddress: tk.address,
                            decimals: tk.decimals,
                            name: tk.name,
                            symbol: tk.symbol,
                            logoURI: tk.logoURI,
                          },
                        },
                      },
                    };
                  }

                  return formData;
                });
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            inputProps={{ type: 'number', min: 0, max: 50, step: 0.01 }}
            InputLabelProps={{ shrink: true }}
            disabled={selectedChainId === undefined}
            label={
              <FormattedMessage
                id="default.slippage.percentage"
                defaultMessage="Default slippage (0-50%)"
              />
            }
            value={slippage}
            onChange={(event: any) => {
              if (selectedChainId) {
                let value = event.target.value;
                if (value < 0) {
                  value = 0;
                }
                if (value > 50) {
                  value = 50;
                }

                let oldFormData;
                if (formData?.configByChain) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }
                setFormData({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      slippage: parseInt(value),
                    },
                  },
                });
              }
            }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
}
