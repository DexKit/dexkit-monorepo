import { AppDialogTitle } from '@dexkit/ui';
import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
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
      <DialogContent>
        <Stack spacing={2}>
          <Stack justifyContent="space-between" direction="row">
            <Typography>
              <FormattedMessage id="name" defaultMessage="name" />
            </Typography>
            <Typography color="text.secondary">{network.name}</Typography>
          </Stack>
          <Stack justifyContent="space-between" direction="row">
            <Typography>
              <FormattedMessage id="symbol" defaultMessage="Symbol" />
            </Typography>
            <Typography color="text.secondary">{network.symbol}</Typography>
          </Stack>
          <Stack justifyContent="space-between" direction="row">
            <Typography>
              <FormattedMessage id="chainId" defaultMessage="ChainId" />
            </Typography>
            <Typography color="text.secondary">{network.chainId}</Typography>
          </Stack>
          <Stack justifyContent="space-between" direction="row">
            <Typography>
              <FormattedMessage id="decimals" defaultMessage="Decimals" />
            </Typography>
            <Typography color="text.secondary">{network.decimals}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
