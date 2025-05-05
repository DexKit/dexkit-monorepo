import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Referral, useDeleteReferralMutation, useReferralsQuery } from '../../hooks/referrals';

const useCopyToClipboard = (): [(text: string) => void, boolean] => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => setCopied(true))
        .catch(err => console.error('Error copying to clipboard:', err));
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
      document.body.removeChild(textArea);
    }
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return [copyToClipboard, copied];
};

interface ReferralsTableProps {
  siteId?: number;
  refreshTrigger?: number;
}

export default function ReferralsTable({ 
  siteId, 
  refreshTrigger = 0 
}: ReferralsTableProps) {
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [copyToClipboard] = useCopyToClipboard();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [referralToDelete, setReferralToDelete] = useState<Referral | null>(null);
  
  const referralsQuery = useReferralsQuery({ siteId });
  
  const deleteReferralMutation = useDeleteReferralMutation();

  useEffect(() => {
    if (refreshTrigger > 0) {
      referralsQuery.refetch();
    }
  }, [refreshTrigger, referralsQuery]);

  const handleCopyLink = (url: string) => {
    copyToClipboard(url);
    enqueueSnackbar(
      formatMessage({
        id: 'referral.link.copied',
        defaultMessage: 'Referral link copied to clipboard',
      }),
      { variant: 'success' }
    );
  };

  const handleDeleteClick = (referral: Referral) => {
    setReferralToDelete(referral);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (referralToDelete) {
      try {
        await deleteReferralMutation.mutateAsync({
          siteId,
          referralId: referralToDelete.id
        });
        
        enqueueSnackbar(
          formatMessage({
            id: 'referral.deleted',
            defaultMessage: 'Referral link deleted successfully',
          }),
          { variant: 'success' }
        );
      } catch (error) {
        console.error('Error deleting referral:', error);
        enqueueSnackbar(
          formatMessage({
            id: 'error.deleting.referral',
            defaultMessage: 'Error deleting referral link',
          }),
          { variant: 'error' }
        );
      }
    }
    setDeleteConfirmOpen(false);
    setReferralToDelete(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
      flex: 1,
      renderCell: (params: GridRenderCellParams<Referral>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip 
            size="small" 
            label={params.value} 
            color="primary" 
            variant="outlined" 
          />
        </Stack>
      ),
    },
    {
      field: 'url',
      headerName: formatMessage({ id: 'referral.link', defaultMessage: 'Referral Link' }),
      flex: 2,
      renderCell: (params: GridRenderCellParams<Referral>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {params.value}
          </Typography>
          <Tooltip title={formatMessage({ id: 'copy.link', defaultMessage: 'Copy Link' })}>
            <IconButton
              size="small"
              onClick={() => handleCopyLink(params.value as string)}
              color="primary"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'visits',
      headerName: formatMessage({ id: 'visits', defaultMessage: 'Visits' }),
      width: 100,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'conversions',
      headerName: formatMessage({ id: 'conversions', defaultMessage: 'Conversions' }),
      width: 120,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'conversionRate',
      headerName: formatMessage({ id: 'conversion.rate', defaultMessage: 'Conv. Rate' }),
      width: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => `${params.value}%`,
      renderCell: (params: GridRenderCellParams<Referral>) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="body2">{params.value}%</Typography>
          <TrendingUpIcon fontSize="small" color="success" />
        </Stack>
      ),
    },
    {
      field: 'lastUsed',
      headerName: formatMessage({ id: 'last.used', defaultMessage: 'Last Used' }),
      width: 170,
      valueFormatter: (params) => 
        params.value ? new Date(params.value as string).toLocaleDateString() : '-',
    },
    {
      field: 'actions',
      headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
      width: 100,
      renderCell: (params: GridRenderCellParams<Referral>) => (
        <Tooltip title={formatMessage({ id: 'delete', defaultMessage: 'Delete' })}>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Card>
      <Box p={2}>
        {referralsQuery.isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={referralsQuery.data || []}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            disableRowSelectionOnClick
            sx={{ minHeight: 400 }}
            loading={referralsQuery.isLoading || deleteReferralMutation.isLoading}
          />
        )}
      </Box>

      <AppConfirmDialog
        DialogProps={{
          open: deleteConfirmOpen,
          onClose: () => setDeleteConfirmOpen(false),
        }}
        onConfirm={handleConfirmDelete}
        title={
          <FormattedMessage
            id="delete.referral.confirmation"
            defaultMessage="Delete Referral Link"
          />
        }
        actionCaption={
          <FormattedMessage id="delete" defaultMessage="Delete" />
        }
      >
        <FormattedMessage
          id="delete.referral.confirmation.text"
          defaultMessage="Are you sure you want to delete this referral link? This action cannot be undone."
        />
      </AppConfirmDialog>
    </Card>
  );
} 