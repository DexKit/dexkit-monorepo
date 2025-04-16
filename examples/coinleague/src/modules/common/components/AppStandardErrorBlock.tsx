import { Box, Button, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  onTryAgain: () => void;
}

export default function AppStandardErrorBlock({ onTryAgain }: Props) {
  return (
    <Box>
      <Stack
        sx={{ py: 2 }}
        spacing={2}
        alignItems="center"
        alignContent="center"
        justifyContent="center"
      >
        <Box>
          <Typography align="center" variant="h5">
            <FormattedMessage
              id="oops.something.went.wrong"
              defaultMessage="Oops, something went wrong"
            />
          </Typography>
          <Typography align="center" variant="body1" color="textSecondary">
            <FormattedMessage
              id="please.try.again.later"
              defaultMessage="Please, try again later"
            />
          </Typography>
        </Box>
        <Button onClick={onTryAgain}>
          <FormattedMessage id="try.again" defaultMessage="Try again" />
        </Button>
      </Stack>
    </Box>
  );
}
