import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

export default function GameCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography>
            <Skeleton />
          </Typography>
          <Divider />
          <Stack spacing={1}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                <Skeleton />
              </Typography>
              <Typography sx={{ fontWeight: 600 }} variant="h5">
                <Skeleton />
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                <Skeleton />
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Typography variant="caption" color="textSecondary">
              <Skeleton />
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" align="center">
              <Skeleton />
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
