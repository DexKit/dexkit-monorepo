import { useIsMobile } from '@dexkit/core';
import { OrderMarketType } from '@dexkit/exchange/constants';
import { useActiveChainIds } from '@dexkit/ui/hooks';
import { MarketTradeConfig } from '@dexkit/ui/modules/token/types';
import { SUPPORTED_SWAP_CHAIN_IDS } from '@dexkit/widgets/src/widgets/swap/constants/supportedChainIds';
import {
  Alert,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NetworkSelectDropdown } from 'src/components/NetworkSelectDropdown';
import { Token } from 'src/types/blockchain';
import { SearchTokenAutocomplete } from '../pageEditor/components/SearchTokenAutocomplete';

interface Props {
  data?: MarketTradeConfig;
  onChange?: (data: MarketTradeConfig) => void;
  featuredTokens?: Token[];
}

export function TokenTradeConfigForm({
  onChange,
  data,
  featuredTokens,
}: Props) {
  const { activeChainIds } = useActiveChainIds();
  const [formData, setFormData] = useState<MarketTradeConfig | undefined>(data);
  const isMobile = useIsMobile();

  const sellToken = useMemo(() => {
    if (
      formData?.baseTokenConfig?.chainId &&
      formData?.baseTokenConfig?.address
    ) {
      return {
        chainId: formData?.baseTokenConfig?.chainId,
        address: formData?.baseTokenConfig?.address,
      };
    }
  }, [formData]);

  useEffect(() => {
    if (onChange && formData) {
      onChange(formData);
    }
  }, [formData, onChange]);

  return (
    <Container sx={{ pt: isMobile ? 1 : 2, px: isMobile ? 1 : 2, pb: 2 }}>
      <Grid container spacing={isMobile ? 1.5 : 3}>
        <Grid size={12}>
          {isMobile ? (
            // Versión móvil: Checkboxes en columna
            (<Stack spacing={0.5} direction="column">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData?.showTokenDetails}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({
                          ...(formData || {}),
                          showTokenDetails: event.target.checked,
                        });
                      }}
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label={
                    <Typography variant={isMobile ? "body2" : "body1"}>
                      <FormattedMessage
                        id={'show.token.details'}
                        defaultMessage={'Show token details'}
                      />
                    </Typography>
                  }
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData?.useGasless}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({
                          ...(formData || {}),
                          useGasless: event.target.checked,
                        });
                      }}
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label={
                    <Typography variant={isMobile ? "body2" : "body1"}>
                      <FormattedMessage
                        id={'use.gasless'}
                        defaultMessage={'Use gasless'}
                      />
                    </Typography>
                  }
                />
              </FormGroup>
            </Stack>)
          ) : (
            // Versión desktop: Checkboxes en fila
            (<Stack spacing={1} direction={'row'}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData?.showTokenDetails}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({
                          ...(formData || {}),
                          showTokenDetails: event.target.checked,
                        });
                      }}
                    />
                  }
                  label={
                    <FormattedMessage
                      id={'show.token.details'}
                      defaultMessage={'Show token details'}
                    />
                  }
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData?.useGasless}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({
                          ...(formData || {}),
                          useGasless: event.target.checked,
                        });
                      }}
                    />
                  }
                  label={
                    <FormattedMessage
                      id={'use.gasless'}
                      defaultMessage={'Use gasless'}
                    />
                  }
                />
              </FormGroup>
            </Stack>)
          )}
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel id="trade-type">
              <FormattedMessage
                id={'trade.type'}
                defaultMessage={'Trade type'}
              />
            </InputLabel>
            <Select
              labelId="trade-type"
              id="trade-type-select"
              label={
                <FormattedMessage
                  id={'trade.type'}
                  defaultMessage={'Trade type'}
                />
              }
              value={formData?.show}
              onChange={(ev: any) =>
                setFormData({
                  ...formData,
                  show: ev.target.value as OrderMarketType,
                })
              }
            >
              <MenuItem value={OrderMarketType.buyAndSell}>
                <FormattedMessage
                  id={'buy.and.sell'}
                  defaultMessage={'Buy and sell'}
                />
              </MenuItem>
              <MenuItem value={OrderMarketType.buy}>
                <FormattedMessage id={'buy'} defaultMessage={'Buy'} />
              </MenuItem>
              <MenuItem value={OrderMarketType.sell}>
                <FormattedMessage id={'sell'} defaultMessage={'Sell'} />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Alert severity="info" sx={{ py: isMobile ? 0.5 : 1 }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              <FormattedMessage
                id="network.swap.options.info"
                defaultMessage="Choose the default token and slippage"
              />
            </Typography>
          </Alert>
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <Typography variant={isMobile ? "caption" : "body2"} sx={{ mb: 0.5 }}>
              <FormattedMessage id="network" defaultMessage="Network" />
            </Typography>
            <NetworkSelectDropdown
              onChange={(chainId) => {
                setFormData((formData: any) => ({
                  ...formData,
                  baseTokenConfig: {
                    address: formData?.baseTokenConfig?.address,
                    chainId: chainId,
                  },
                }));
              }}
              activeChainIds={
                activeChainIds.filter((ch: any) =>
                  SUPPORTED_SWAP_CHAIN_IDS.includes(ch),
                ) || []
              }
              labelId={'config-per-network'}
              chainId={formData?.baseTokenConfig?.chainId}
              size={isMobile ? "small" : "medium"}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <SearchTokenAutocomplete
            label={
              <FormattedMessage
                id="search.default.base.token"
                defaultMessage="Search default base token"
              />
            }
            featuredTokens={featuredTokens}
            disabled={formData?.baseTokenConfig?.chainId === undefined}
            data={sellToken}
            chainId={formData?.baseTokenConfig?.chainId}
            onChange={(tk: any) => {
              setFormData((formData: any) => ({
                ...formData,
                baseTokenConfig: {
                  address: tk.address,
                  chainId: formData?.baseTokenConfig?.chainId,
                },
              }));
            }}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            label={<FormattedMessage id="slippage" defaultMessage="Slippage (%)" />}
            type="number"
            fullWidth
            value={formData?.slippage}
            onChange={(ev: any) =>
              setFormData({
                ...formData,
                slippage: Number(ev.target.value),
              })
            }
            InputProps={{
              inputProps: {
                min: 0.1,
                max: 50,
                step: 0.1,
              },
            }}
            size={isMobile ? "small" : "medium"}
            sx={{ marginBottom: isMobile ? 1 : 2 }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
