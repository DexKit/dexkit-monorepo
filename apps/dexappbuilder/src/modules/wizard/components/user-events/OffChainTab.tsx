import { UserEvents } from '@dexkit/core/constants/userEvents';
import { USER_OFFCHAIN_EVENT_NAMES } from '@dexkit/ui/constants/userEventNames';
import { Grid, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useOffChainColumns from '../../hooks/useOffChainColumns';
import OffChainDataGrid from './OffChainDataGrid';

export interface OffChainTabProps {
  siteId?: number;
}

export default function OffChainTab({ siteId }: OffChainTabProps) {
  const offChainColumns = useOffChainColumns();

  const [offchainType, setOffchainType] = useState<string>(
    UserEvents.postLimitOrder,
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select
              value={offchainType}
              onChange={(event) => setOffchainType(event.target.value)}
            >
              {Object.keys(USER_OFFCHAIN_EVENT_NAMES).map((key) => (
                <MenuItem key={key} value={key}>
                  <FormattedMessage
                    id={USER_OFFCHAIN_EVENT_NAMES[key].id}
                    defaultMessage={
                      USER_OFFCHAIN_EVENT_NAMES[key].defaultMessage
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <OffChainDataGrid
          siteId={siteId}
          key={offchainType}
          columns={offChainColumns[offchainType]}
          type={offchainType}
        />
      </Grid>
    </Grid>
  );
}
