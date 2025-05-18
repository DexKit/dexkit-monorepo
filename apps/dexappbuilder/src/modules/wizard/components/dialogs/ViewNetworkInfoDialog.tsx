import { AppDialogTitle } from '@dexkit/ui';
import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface SearchNetworksDialogProps {
  DialogProps: DialogProps;
  network: {
    name: string;
    symbol: string;
    chainId: number;
    decimals: number;
  };
}

export default function ViewNetworkInfoDialog({
  DialogProps,
  network,
}: SearchNetworksDialogProps) {
  const { onClose } = DialogProps;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="network.info" defaultMessage="Network info" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
        <Stack spacing={isMobile ? 1.5 : 2}>
          <Stack
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 0.5 : 0}
          >
            <Typography variant={isMobile ? "body2" : "body1"} fontWeight="500">
              <FormattedMessage id="name" defaultMessage="name" />
            </Typography>
            <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
              {network.name}
            </Typography>
          </Stack>
          <Stack
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 0.5 : 0}
          >
            <Typography variant={isMobile ? "body2" : "body1"} fontWeight="500">
              <FormattedMessage id="symbol" defaultMessage="Symbol" />
            </Typography>
            <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
              {network.symbol}
            </Typography>
          </Stack>
          <Stack
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 0.5 : 0}
          >
            <Typography variant={isMobile ? "body2" : "body1"} fontWeight="500">
              <FormattedMessage id="chainId" defaultMessage="ChainId" />
            </Typography>
            <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
              {network.chainId}
            </Typography>
          </Stack>
          <Stack
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 0.5 : 0}
          >
            <Typography variant={isMobile ? "body2" : "body1"} fontWeight="500">
              <FormattedMessage id="decimals" defaultMessage="Decimals" />
            </Typography>
            <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
              {network.decimals}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
