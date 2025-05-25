import { CountFilter, useCountUserEvents } from '@dexkit/ui/hooks/userEvents';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import TopEventsDialog from './TopEventsDialog';

export interface CountEventsCardProps {
  filters: CountFilter;
  disableDetails?: boolean;
}

export default function CountEventsCard({
  filters,
  disableDetails,
}: CountEventsCardProps) {
  const countEventsQuery = useCountUserEvents({
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
                  id="total.events"
                  defaultMessage="Total events"
                />
              </Typography>
              <Typography variant="h5">
                {countEventsQuery.isLoading ? (
                  <Skeleton />
                ) : (
                  countEventsQuery.data
                )}
              </Typography>
            </Box>
            {!disableDetails && (
              <>
                <Divider />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleOpen}
                  fullWidth
                >
                  <FormattedMessage
                    defaultMessage="View events"
                    id="view.events"
                  />
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
