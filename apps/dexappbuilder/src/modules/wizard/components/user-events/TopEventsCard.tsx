import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import TopEventsList from './TopEventsList';

export interface TopEventsCardProps {}

export default function TopEventsCard({}: TopEventsCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage id="top.event" defaultMessage="Top events" />
          </Typography>

          <Button size="small">
            <FormattedMessage id="view.more" defaultMessage="View more" />
          </Button>
        </Stack>
      </CardContent>
      <Divider />
      <TopEventsList events={[]} />
    </Card>
  );
}
