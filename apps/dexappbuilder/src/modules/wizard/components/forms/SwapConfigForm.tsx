import { SwapConfig } from '@/modules/swap/types';
import { useActiveChainIds } from '@dexkit/ui/hooks';
import { SwapVariant } from '@dexkit/ui/modules/wizard/types';
import { SUPPORTED_SWAP_CHAIN_IDS } from '@dexkit/widgets/src/widgets/swap/constants/supportedChainIds';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';
import Info from '@mui/icons-material/Info';
import {
  Alert,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NetworkSelectDropdown } from 'src/components/NetworkSelectDropdown';
import { Token } from 'src/types/blockchain';
import { SearchTokenAutocomplete } from '../pageEditor/components/SearchTokenAutocomplete';

interface Props {
  data?: SwapConfig;
  onChange?: (data: SwapConfig) => void;
  featuredTokens?: Token[];
}

export function SwapConfigForm({ onChange, data, featuredTokens }: Props) {
  const { activeChainIds } = useActiveChainIds();
  const [formData, setFormData] = useState<SwapConfig | undefined>(data);

  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
    data?.defaultChainId,
  );

  const sellToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      const sellToken = formData.configByChain[selectedChainId]?.sellToken;
      //@dev Remove this on future
      //@ts-ignore
      if (sellToken && sellToken?.contractAddress) {
        //@ts-ignore
        sellToken.address = sellToken?.contractAddress;
      }
      return sellToken;
    }
  }, [selectedChainId, formData]);

  const buyToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      const buyToken = formData.configByChain[selectedChainId]?.buyToken;
      //@dev Remove this on future
      //@ts-ignore
      if (buyToken && buyToken?.contractAddress) {
        //@ts-ignore
        buyToken.address = buyToken?.contractAddress;
      }
      return buyToken;
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
            <InputLabel shrink>
              <FormattedMessage id="variant" defaultMessage="Variant" />
            </InputLabel>
            <Select
              fullWidth
              label={<FormattedMessage id="variant" defaultMessage="Variant" />}
              value={formData?.variant === undefined ? '' : formData?.variant}
              displayEmpty
              notched
              onChange={(e) => {
                setFormData((form) => ({
                  ...form,
                  variant:
                    e.target.value !== ''
                      ? (e.target.value as SwapVariant)
                      : undefined,
                }));
              }}
            >
              <MenuItem value="">
                <FormattedMessage id="classic" defaultMessage="Classic" />
              </MenuItem>
              <MenuItem value={SwapVariant.MatchaLike}>
                <FormattedMessage id="pro" defaultMessage="Pro" />
              </MenuItem>
              <MenuItem value={SwapVariant.UniswapLike}>
                <FormattedMessage id="modern" defaultMessage="Modern" />
              </MenuItem>
            </Select>
          </FormControl>
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
              activeChainIds={activeChainIds}
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
              activeChainIds={
                activeChainIds.filter((ch) =>
                  SUPPORTED_SWAP_CHAIN_IDS.includes(ch),
                ) || []
              }
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
            featuredTokens={featuredTokens}
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
                      sellToken: tk
                        ? {
                            chainId: tk.chainId as number,
                            address: tk.address,
                            decimals: tk.decimals,
                            name: tk.name,
                            symbol: tk.symbol,
                            logoURI: tk.logoURI,
                          }
                        : undefined,
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
            featuredTokens={featuredTokens}
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
                          buyToken: tk
                            ? {
                                chainId: tk.chainId as number,
                                address: tk.address,
                                decimals: tk.decimals,
                                name: tk.name,
                                symbol: tk.symbol,
                                logoURI: tk.logoURI,
                              }
                            : undefined,
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
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData?.myTokensOnlyOnSearch}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({
                        ...formData,
                        myTokensOnlyOnSearch: event.target.checked,
                      });
                    }}
                  />
                }
                label={
                  <FormattedMessage
                    id={'Show.only.my.tokens.on.search'}
                    defaultMessage={'Show only my tokens on search'}
                  />
                }
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData?.useGasless}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({
                        ...formData,
                        useGasless: event.target.checked,
                      });
                    }}
                  />
                }
                label={
                  <FormattedMessage
                    id={'gasless.swaps'}
                    defaultMessage={'Gasless swaps'}
                  />
                }
              />
            </Grid>
            <Grid item>
              <Grid container spacing={0} alignItems="center">
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData?.enableUrlParams)}
                        onChange={(e) =>
                          setFormData((value) => ({
                            ...value,
                            enableUrlParams: e.target.checked,
                          }))
                        }
                      />
                    }
                    label={
                      <FormattedMessage
                        id="enable.url.params"
                        defaultMessage="Enable url params"
                      />
                    }
                  />
                </Grid>
                <Grid item>
                  <IconButton>
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="url.parameters.Explanation"
                          defaultMessage="By selecting this checkbox, the URL parameters will be used to set the token and network for the swap."
                        />
                      }
                    >
                      <Info fontSize="small" color="inherit" />
                    </Tooltip>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={0} alignItems="center">
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData?.enableImportExternTokens)}
                        onChange={(e) =>
                          setFormData((value) => ({
                            ...value,
                            enableImportExternTokens: e.target.checked,
                          }))
                        }
                      />
                    }
                    label={
                      <FormattedMessage
                        id="enable.extern.tokens"
                        defaultMessage="Enable extern tokens"
                      />
                    }
                  />
                </Grid>
                <Grid item>
                  <IconButton>
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="enable.import.extern.tokens"
                          defaultMessage="Enable import external tokens"
                        />
                      }
                    >
                      <Info fontSize="small" color="inherit" />
                    </Tooltip>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
