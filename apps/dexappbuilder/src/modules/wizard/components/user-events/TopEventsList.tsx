import { List, ListItem, ListItemText, Typography } from '@mui/material';

export interface TopEventListProps {
  events: { name: string; count: number }[];
}

export default function TopEventList({ events }: TopEventListProps) {
  return (
    <List disablePadding dense>
      {events?.map((event, index) => (
        <ListItem divider key={index}>
          <ListItemText primary={event.name} />
          <Typography color="text.secondary">{event.count}</Typography>
        </ListItem>
      ))}
    </List>
  );
}
