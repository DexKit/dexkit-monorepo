import { Box, Stack, Typography } from '@mui/material';

export function noRowsOverlay(
  title: React.ReactNode,
  subtitle: React.ReactNode,
  icon?: React.ReactNode,
) {
  return function Component() {
    return (
      <Stack
        py={2}
        alignItems="center"
        justifyItems="center"
        justifyContent="center"
        sx={{ height: '100%' }}
      >
        {icon}
        <Box>
          <Typography align="center" variant="h5">
            {title}
          </Typography>
          <Typography align="center" variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    );
  };
}
