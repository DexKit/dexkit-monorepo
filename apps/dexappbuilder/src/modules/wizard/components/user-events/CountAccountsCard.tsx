import {
  CountFilter,
  useCountEventAccounts,
} from '@dexkit/ui/hooks/userEvents';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import TopEventsDialog from './TopEventsDialog';

export interface CountAccountsCardProps {
  filters: CountFilter;
}

export default function CountAccountsCard({ filters }: CountAccountsCardProps) {
  const countAccountsQuery = useCountEventAccounts({
    filters,
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleClose = () => {
    setShowDetails(false);
  };

  const handleOpen = () => {
    setShowDetails(true);
  };

  return (
    <>
      <TopEventsDialog
        filters={filters}
        DialogProps={{
          open: showDetails,
          maxWidth: 'sm',
          onClose: handleClose,
          fullWidth: true,
        }}
      />
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage
                  id="total.accounts"
                  defaultMessage="Total accounts"
                />
              </Typography>
              <Typography variant="h5">
                {countAccountsQuery.isLoading ? (
                  <Skeleton />
                ) : (
                  countAccountsQuery.data
                )}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
