import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { useAppRankingQuery } from '@dexkit/ui/modules/wizard/hooks/ranking';

interface Props {
  dialogProps: DialogProps;
  rankingId?: number;
}

function ExportRankingDialog({ dialogProps, rankingId }: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { data } = useAppRankingQuery({
    rankingId: rankingId,
  });

  const exporCSVData = () => {
    if (typeof window !== 'undefined' && data) {
      const csvData = [
        ['address', 'quantity'],
        ...data.data.map((item: any) => [item.account, item.points]),
      ]
        .map((e) => e.join(','))
        .join('\n');

      const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
        csvData,
      )}`;
      const link = document.createElement('a');
      link.href = csvString;
      link.download = `leaderboard-${data.ranking?.title}.csv`;

      link.click();
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose} maxWidth="sm" fullWidth>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="export.leaderboard"
            defaultMessage="Export Leaderboard"
          />
        }
        onClose={handleClose}
        sx={{ px: 4 }}
      />
      <DialogContent dividers sx={{ p: 4 }}>
        <Alert severity="info">
          <FormattedMessage
            id="fileExport.csvFormattedForAirdropContracts."
            defaultMessage="The exported CSV file is formatted for import into airdrop contracts."
          />
        </Alert>
      </DialogContent>
      <DialogActions sx={{ py: 2, px: 4 }}>
        <Button onClick={handleClose}>
          <FormattedMessage id="expot" defaultMessage="Cancel" />
        </Button>
        <Button onClick={exporCSVData} variant="contained">
          <FormattedMessage id="expot" defaultMessage="Export" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExportRankingDialog;
