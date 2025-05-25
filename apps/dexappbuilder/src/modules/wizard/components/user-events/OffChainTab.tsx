import { CountFilter } from '@dexkit/ui/hooks/userEvents';
import { Grid } from '@mui/material';
import useOffChainColumns from '../../hooks/useOffChainColumns';
import OffChainDataGrid from './OffChainDataGrid';

export interface OffChainTabProps {
  siteId?: number;
  type: string;
  filters?: CountFilter;
}

export default function OffChainTab({
  siteId,
  type,
  filters,
}: OffChainTabProps) {
  const offChainColumns = useOffChainColumns();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <OffChainDataGrid
          siteId={siteId}
          key={JSON.stringify(filters)}
          columns={offChainColumns[type]}
          filters={filters}
          type={type}
        />
      </Grid>
    </Grid>
  );
}
