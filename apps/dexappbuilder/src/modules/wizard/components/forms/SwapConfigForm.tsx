import { SwapConfig } from '@/modules/swap/types';
import { useIsMobile } from '@dexkit/core';
import { useActiveChainIds } from '@dexkit/ui/hooks';
import { SwapVariant } from '@dexkit/ui/modules/wizard/types';
import { SUPPORTED_SWAP_CHAIN_IDS } from '@dexkit/widgets/src/widgets/swap/constants/supportedChainIds';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';
import {
  Alert,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
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
  const isMobile = useIsMobile();

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
    <Container sx={{ pt: isMobile ? 1 : 2, px: isMobile ? 1 : 2 }}>
      <Grid container spacing={isMobile ? 2 : 2}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ py: isMobile ? 0.5 : 1 }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              <FormattedMessage
                id="default.network.info.swap.form"
                defaultMessage="Default network when wallet is not connected"
              />
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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
              <MenuItem value={SwapVariant.Minimal}>
                <FormattedMessage id="minimal" defaultMessage="Minimal - Ultra-clean interface" />
              </MenuItem>
              <MenuItem value={SwapVariant.Compact}>
                <FormattedMessage id="compact" defaultMessage="Compact - Space-efficient for small areas" />
              </MenuItem>
              <MenuItem value={SwapVariant.Mobile}>
                <FormattedMessage id="mobile" defaultMessage="Mobile - Touch-optimized with gestures" />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant={isMobile ? "caption" : "body2"} sx={{ mb: 0.5 }}>
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
              size={isMobile ? "small" : "medium"}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ py: isMobile ? 0.5 : 1 }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              <FormattedMessage
                id="network.swap.options.info"
                defaultMessage="Choose the default tokens and slippage for each network."
              />
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant={isMobile ? "caption" : "body2"} sx={{ mb: 0.5 }}>
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
              size={isMobile ? "small" : "medium"}
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
            size={isMobile ? "small" : "medium"}
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
            size={isMobile ? "small" : "medium"}
            onChange={(tk: any) => {
              if (selectedChainId) {
                let oldFormData: ChainConfig = { slippage: 0 };

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
                }));
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            inputProps={{ type: 'number', min: 0, max: 50, step: 0.01 }}
            InputLabelProps={{ shrink: true }}
            label={
              <FormattedMessage
                id="default.slippage.percentage"
                defaultMessage="Default slippage (0-50%)"
              />
            }
            value={slippage}
            size={isMobile ? "small" : "medium"}
            onChange={(event: any) => {
              if (event.target.value !== undefined && selectedChainId) {
                let value = event.target.value;
                if (value < 0) {
                  value = 0;
                }
                if (value > 50) {
                  value = 50;
                }

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
                      slippage: parseFloat(value),
                    },
                  },
                }));
              }
            }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
}
