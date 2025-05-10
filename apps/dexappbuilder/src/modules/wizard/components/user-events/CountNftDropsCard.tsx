import { formatBigNumber } from '@dexkit/core/utils';
import {
  CountFilter,
  useCountDropCollection,
} from '@dexkit/ui/hooks/userEvents';
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { BigNumber } from 'ethers';
import { FormattedMessage } from 'react-intl';

export interface CountNftDropsCardProps {
  filters: CountFilter;
}

export default function CountNftDropsCard({ filters }: CountNftDropsCardProps) {
  const countEventsQuery = useCountDropCollection({
    filters,
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              id="total.in.drops"
              defaultMessage="Total in drops"
            />
          </Typography>
        </CardContent>
        <Divider />
        {countEventsQuery?.data ? (
          <Box
            sx={{ overflowY: 'auto', maxHeight: (theme) => theme.spacing(12) }}
          >
            <List dense disablePadding>
              {Object.keys(countEventsQuery.data || {})
                .map((key: string) => countEventsQuery.data[key])
                .map((item, index, arr) => (
                  <ListItem key={index} divider={index < arr.length - 1}>
                    <ListItemText
                      primary={`${item.tokenName} (${item.nftAmount})`}
                    />
                    <Typography color="text.secondary">
                      {formatBigNumber(
                        BigNumber.from(item.amount),
                        item.decimals,
                      )}{' '}
                      {item.symbol.toUpperCase()}
                    </Typography>
                  </ListItem>
                ))}
            </List>
          </Box>
        ) : (
          <List>
            {new Array(4).fill(null).map((_, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
              </ListItem>
            ))}
          </List>
        )}
      </Card>
    </>
  );
}
