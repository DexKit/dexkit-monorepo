import AddCircleIcon from '@mui/icons-material/AddCircle';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useReferralsQuery } from '../../hooks/referrals';
import ReferralsTable from '../referrals/ReferralsTable';

const CreateReferralDialog = dynamic(
  () => import('../dialogs/CreateReferralDialog')
);

interface ReferralsContainerProps {
  siteId?: number;
}

export default function ReferralsContainer({ siteId }: ReferralsContainerProps) {
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const referralsQuery = useReferralsQuery({ siteId });

  const handleOpenCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  const handleReferralCreated = useCallback(() => {
    enqueueSnackbar(
      formatMessage({
        id: 'referral.created.success',
        defaultMessage: 'Referral link created successfully'
      }),
      { variant: 'success' }
    );
    
    setRefreshTrigger(prev => prev + 1);
  }, [enqueueSnackbar, formatMessage]);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            marginBottom={2}
          >
            <Typography variant="h4">
              <FormattedMessage id="referrals" defaultMessage="Referrals" />
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={!isMobile ? <AddCircleIcon /> : undefined}
              size={isMobile ? "small" : "medium"}
              onClick={handleOpenCreateDialog}
              sx={{
                alignSelf: { xs: 'flex-end', sm: 'auto' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 }
              }}
            >
              {isMobile ? (
                <AddCircleIcon sx={{ mr: 0.5 }} fontSize="small" />
              ) : null}
              <FormattedMessage
                id="create.referral.link"
                defaultMessage="Create Referral Link"
              />
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage
                  id="referrals.overview"
                  defaultMessage="Referrals Overview"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <FormattedMessage
                  id="referrals.description"
                  defaultMessage="Create and manage custom referral links for your DApp. Track usage and measure the effectiveness of your marketing channels."
                />
              </Typography>
              <Alert severity="info" icon={<InsertLinkIcon />}>
                <FormattedMessage
                  id="referrals.tip"
                  defaultMessage="Add ?ref=your-custom-name to any URL of your DApp to create a referral link. Use different names for different marketing channels to track their performance."
                />
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <ReferralsTable 
            siteId={siteId} 
            refreshTrigger={refreshTrigger} 
          />
        </Grid>
      </Grid>

      {isCreateDialogOpen && (
        <CreateReferralDialog
          dialogProps={{
            open: isCreateDialogOpen,
            onClose: handleCloseCreateDialog,
            maxWidth: 'sm',
            fullWidth: true,
          }}
          siteId={siteId}
          onSuccess={handleReferralCreated}
        />
      )}
    </Container>
  );
} 