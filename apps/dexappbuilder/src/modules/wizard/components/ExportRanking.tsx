import { Grid } from '@mui/material';

interface Props {
  rankingId?: number;
}

export function ExportRanking({ rankingId }: Props) {
  return <Grid container spacing={2}></Grid>;
}
