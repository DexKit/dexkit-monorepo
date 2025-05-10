import { Box } from '@mui/material';

interface SliderPaginationDotProps {
  active?: boolean;
}

export default function SliderPaginationDot({
  active,
}: SliderPaginationDotProps) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: active
          ? theme.palette.primary.main
          : theme.palette.grey[100],
        borderRadius: '50%',
        width: theme.spacing(1),
        height: theme.spacing(1),
      })}
    />
  );
}
