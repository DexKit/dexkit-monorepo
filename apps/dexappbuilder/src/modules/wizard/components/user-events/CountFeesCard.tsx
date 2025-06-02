import { formatBigNumber } from '@dexkit/core/utils';
import { CountFilter, useSwapFeesByToken } from '@dexkit/ui/hooks/userEvents';
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

export interface CountEventsCardProps {
  filters: CountFilter;
}

export default function CountFeesCard({ filters }: CountEventsCardProps) {
  const countEventsQuery = useSwapFeesByToken({
    filters,
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              id="total.in.fees"
              defaultMessage="Total in fees"
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
                    <ListItemText primary={item.tokenName} />
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
