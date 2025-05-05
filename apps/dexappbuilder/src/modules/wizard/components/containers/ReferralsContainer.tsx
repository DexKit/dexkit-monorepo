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
  Typography
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
        defaultMessage: 'Referral link created successfully',
      }),
      { variant: 'success' }
    );
    setRefreshTrigger(prev => prev + 1);
    setIsCreateDialogOpen(false);
  }, [enqueueSnackbar, formatMessage]);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <Typography variant="h4">
              <FormattedMessage id="referrals" defaultMessage="Referrals" />
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={handleOpenCreateDialog}
            >
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