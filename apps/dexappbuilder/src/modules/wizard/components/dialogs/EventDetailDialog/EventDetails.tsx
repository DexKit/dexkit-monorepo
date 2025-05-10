import { Box, Stack, Typography } from '@mui/material';

type Item = {
  label: React.ReactNode;
  value: React.ReactNode;
};

export interface EventDetailsProps {
  items: Item[];
}

export default function EventDetails({ items }: EventDetailsProps) {
  return (
    <Stack spacing={1}>
      {items.map((item, index) => (
        <Stack
          key={index}
          justifyContent="space-between"
          alignItems="center"
          direction="row"
        >
          <Typography>{item.label}</Typography>
          <Box>{item.value}</Box>
        </Stack>
      ))}
    </Stack>
  );
}
