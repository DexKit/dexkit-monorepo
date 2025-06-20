import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { ClaimConditionsContainer } from '../containers/ClaimConditionsContainer';

interface Props {
  dialogProps: DialogProps;
  address?: string;
  network?: string;
  tokenId?: string;
}

export default function ClaimConditionsDialog({
  dialogProps,
  network,
  address,
  tokenId,
}: Props) {
  const { onClose } = dialogProps;
  const theme = useTheme();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog
      {...dialogProps}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          margin: {
            xs: theme.spacing(1),
            sm: theme.spacing(3)
          },
          width: {
            xs: `calc(100% - ${theme.spacing(2)})`,
            sm: 'auto'
          },
          maxHeight: {
            xs: `calc(100% - ${theme.spacing(2)})`,
            sm: `calc(100% - ${theme.spacing(8)})`
          }
        }
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage
            id="claim.conditions"
            defaultMessage="claim.conditions"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent
        sx={{
          p: { xs: theme.spacing(1), sm: 0 },
          '&:first-of-type': {
            pt: { xs: theme.spacing(2), sm: 0 }
          }
        }}
      >
        <ClaimConditionsContainer
          network={network as string}
          address={address as string}
          tokenId={tokenId}
        />
      </DialogContent>
    </Dialog>
  );
}
