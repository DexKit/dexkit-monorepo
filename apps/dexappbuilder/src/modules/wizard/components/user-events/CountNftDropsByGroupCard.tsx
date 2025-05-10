import {
  CountFilter,
  DropNFTTokenInfo,
  useCountDropCollectionByGroup,
} from '@dexkit/ui/hooks/userEvents';
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Skeleton,
  Typography,
} from '@mui/material';
import React from 'react';

export interface CountNftDropsByGroupCardProps {
  title: React.ReactNode;
  filters: CountFilter;
  group: string;
  renderItem: (e: DropNFTTokenInfo, index: number) => React.ReactNode;
  renderGroup: (group: string, index: number) => React.ReactNode;
}

export default function CountNftDropsByGroupCard({
  filters,
  renderItem,
  group,
  title,
  renderGroup,
}: CountNftDropsByGroupCardProps) {
  const countEventsQuery = useCountDropCollectionByGroup({
    filters,
    group,
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
        <Divider />
        {countEventsQuery?.data ? (
          <Box
            sx={{ overflowY: 'auto', maxHeight: (theme) => theme.spacing(20) }}
          >
            <List dense disablePadding>
              {Object.keys(countEventsQuery.data || {})
                .map((key: string) => key)
                .map((key, index, arr) => (
                  <React.Fragment key={index}>
                    <ListSubheader>{renderGroup(key, index)}</ListSubheader>
                    {Object.keys(countEventsQuery.data[key].tokens)
                      .map(
                        (subKey) => countEventsQuery.data[key].tokens[subKey],
                      )
                      .map((item, listIndex) => renderItem(item, listIndex))}
                  </React.Fragment>
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
