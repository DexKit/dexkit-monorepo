import { ChainId } from '@dexkit/core/constants/enums';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export type AppType = 'swap' | 'exchange' | 'wallet' | 'nft-store';

export interface AppCreationData {
  appType: AppType;
  appName: string;
  network?: ChainId;
  tokens?: string[];
}

interface Props {
  appType?: AppType;
  onSubmit: (data: AppCreationData) => void;
  onCancel: () => void;
}

export default function VibecoderAppCreationForm({
  appType: initialAppType,
  onSubmit,
  onCancel,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { formatMessage } = useIntl();

  const [appType, setAppType] = useState<AppType>(initialAppType || 'swap');
  const [appName, setAppName] = useState('');
  const [network, setNetwork] = useState<ChainId | ''>('');
  const [errors, setErrors] = useState<{ appName?: string }>({});

  const handleSubmit = () => {
    const newErrors: { appName?: string } = {};

    if (!appName.trim()) {
      newErrors.appName = formatMessage({
        id: 'vibecoder.app.name.required',
        defaultMessage: 'App name is required',
      });
    } else if (!/^[a-z0-9-]+$/.test(appName.trim())) {
      newErrors.appName = formatMessage({
        id: 'vibecoder.app.name.invalid',
        defaultMessage: 'App name can only contain lowercase letters, numbers, and hyphens',
      });
    } else if (appName.trim().length < 3) {
      newErrors.appName = formatMessage({
        id: 'vibecoder.app.name.too.short',
        defaultMessage: 'App name must be at least 3 characters',
      });
    } else if (appName.trim().length > 50) {
      newErrors.appName = formatMessage({
        id: 'vibecoder.app.name.too.long',
        defaultMessage: 'App name must be less than 50 characters',
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        appType,
        appName: appName.trim().toLowerCase(),
        network: network || undefined,
      });
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          <FormattedMessage
            id="vibecoder.create.app.title"
            defaultMessage="Create Your App"
          />
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <FormattedMessage
            id="vibecoder.create.app.description"
            defaultMessage="Let's start by setting up the basics for your app. You can configure more details later in the conversation."
          />
        </Typography>

        <FormControl fullWidth>
          <InputLabel>
            <FormattedMessage
              id="vibecoder.app.type"
              defaultMessage="App Type"
            />
          </InputLabel>
          <Select
            value={appType}
            label={formatMessage({
              id: 'vibecoder.app.type',
              defaultMessage: 'App Type',
            })}
            onChange={(e) => setAppType(e.target.value as AppType)}
            disabled={!!initialAppType}
          >
            <MenuItem value="swap">
              <FormattedMessage id="swap" defaultMessage="Swap" />
            </MenuItem>
            <MenuItem value="exchange">
              <FormattedMessage id="exchange" defaultMessage="Exchange" />
            </MenuItem>
            <MenuItem value="wallet">
              <FormattedMessage id="wallet" defaultMessage="Wallet" />
            </MenuItem>
            <MenuItem value="nft-store">
              <FormattedMessage id="nft.store" defaultMessage="NFT Store" />
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label={formatMessage({
            id: 'vibecoder.app.name',
            defaultMessage: 'App Name',
          })}
          value={appName}
          onChange={(e) => {
            setAppName(e.target.value);
            if (errors.appName) {
              setErrors({ ...errors, appName: undefined });
            }
          }}
          error={!!errors.appName}
          helperText={
            errors.appName || (
              <FormattedMessage
                id="vibecoder.app.name.helper"
                defaultMessage="This will be your app's domain: {name}.dexkit.app"
                values={{ name: appName || 'your-app' }}
              />
            )
          }
          placeholder="my-awesome-app"
          inputProps={{
            pattern: '[a-z0-9-]+',
            style: { textTransform: 'lowercase' },
          }}
        />

        {(appType === 'swap' || appType === 'exchange') && (
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage
                id="vibecoder.network"
                defaultMessage="Preferred Network (Optional)"
              />
            </InputLabel>
            <Select
              value={network}
              label={formatMessage({
                id: 'vibecoder.network',
                defaultMessage: 'Preferred Network (Optional)',
              })}
              onChange={(e) => setNetwork(e.target.value ? (Number(e.target.value) as ChainId) : '')}
            >
              <MenuItem value="">
                <FormattedMessage
                  id="vibecoder.network.any"
                  defaultMessage="Any Network"
                />
              </MenuItem>
              <MenuItem value={ChainId.Ethereum}>
                <FormattedMessage id="ethereum" defaultMessage="Ethereum" />
              </MenuItem>
              <MenuItem value={ChainId.Polygon}>
                <FormattedMessage id="polygon" defaultMessage="Polygon" />
              </MenuItem>
              <MenuItem value={ChainId.BSC}>
                <FormattedMessage id="bsc" defaultMessage="BSC" />
              </MenuItem>
              <MenuItem value={ChainId.Avax}>
                <FormattedMessage id="avalanche" defaultMessage="Avalanche" />
              </MenuItem>
              <MenuItem value={ChainId.Arbitrum}>
                <FormattedMessage id="arbitrum" defaultMessage="Arbitrum" />
              </MenuItem>
              <MenuItem value={ChainId.Optimism}>
                <FormattedMessage id="optimism" defaultMessage="Optimism" />
              </MenuItem>
            </Select>
          </FormControl>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} variant="outlined">
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            <FormattedMessage
              id="vibecoder.create.app"
              defaultMessage="Create App"
            />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

