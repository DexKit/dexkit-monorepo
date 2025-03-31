import { useKittygotchiRanking } from '@/modules/kittygotchi/hooks';
import { Error } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import KittygotchiRankingListItem from './KittygotchiRankingListItem';

interface Props {
  chainId?: number;
  onClick: (tokenId: string) => void;
}
export default function KittygotchiRankingCard({ onClick, chainId }: Props) {
  const ranking = useKittygotchiRanking(chainId);

  return (
    <Card>
      <CardHeader
        title={
          <FormattedMessage
            id="top.10.ranking"
            defaultMessage="Top 10 Ranking"
          />
        }
      />
      <Divider />
      {ranking.isError ? (
        <CardContent>
          <Stack alignItems="center" alignContent="center">
            <Error fontSize="large" />
            <Typography variant="h5">
              <FormattedMessage
                id="error.while.fetching.ranking"
                defaultMessage="Error While fetching Ranking"
              />
            </Typography>
          </Stack>
        </CardContent>
      ) : (
        <List disablePadding>
          {ranking.isLoading ? (
            <>
              <ListItem>
                <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
              </ListItem>
            </>
          ) : (
            ranking.results.map((r, index: number) => (
              <KittygotchiRankingListItem
                key={index}
                owner={r.owner}
                tokenId={r.tokenId}
                strength={r.strength}
                onClick={onClick}
              />
            ))
          )}
        </List>
      )}
    </Card>
  );
}
