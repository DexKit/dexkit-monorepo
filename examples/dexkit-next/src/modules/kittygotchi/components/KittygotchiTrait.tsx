import { Box, Paper, Skeleton, Typography } from '@mui/material';

interface Props {
  traitType?: string;
  value?: string;
  loading?: boolean;
}

export function KittygotchiTrait(props: Props) {
  const { traitType, value, loading } = props;

  return (
    <Paper sx={{ height: '100%' }}>
      <Box p={2}>
        <Typography component="p" align="center" variant="overline">
          {loading ? <Skeleton /> : traitType}
        </Typography>
        <Typography align="center" variant="body2">
          <strong>{loading ? <Skeleton /> : value}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}

export default KittygotchiTrait;
