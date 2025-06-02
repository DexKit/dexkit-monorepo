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
    <Container sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack spacing={1} direction={'row'}>
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
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
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
              onChange={(ev) =>
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
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id="network.swap.options.info"
              defaultMessage="Choose the default token and slippage"
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
                setFormData((formData) => ({
                  ...formData,
                  baseTokenConfig: {
                    address: formData?.baseTokenConfig?.address,
                    chainId: chainId,
                  },
                }));
              }}
              activeChainIds={
                activeChainIds.filter((ch) =>
                  SUPPORTED_SWAP_CHAIN_IDS.includes(ch),
                ) || []
              }
              labelId={'config-per-network'}
              chainId={formData?.baseTokenConfig?.chainId}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
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
              setFormData((formData) => ({
                ...formData,
                baseTokenConfig: {
                  address: tk.address,
                  chainId: formData?.baseTokenConfig?.chainId,
                },
              }));
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
            value={formData?.slippage}
            onChange={(event: any) => {
              let value = event.target.value;
              if (value < 0) {
                value = 0;
              }
              if (value > 50) {
                value = 50;
              }

              setFormData({
                ...formData,
                slippage: parseInt(value),
              });
            }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
}
