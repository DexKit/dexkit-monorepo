import CategoryIcon from '@mui/icons-material/LocalOffer';
import MailIcon from '@mui/icons-material/MailOutline';
import { Card, CardContent } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  SavedQueriesList,
} from 'react-admin';

import { CollectionSyncStatus } from '@dexkit/ui/modules/nft/constants/enum';
import { NETWORKS } from 'src/constants/chain';

export const CollectionFilterSidebar = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 400 }}>
    <CardContent>
      <SavedQueriesList />
      <FilterLiveSearch />
      <FilterList label="Networks" icon={<MailIcon />}>
        <>
          {Object.values(NETWORKS)
            .filter((t) => !t.testnet)
            .map((n, k) => (
              <FilterListItem
                key={k}
                label={n.name}
                value={{ networkId: n.slug }}
              />
            ))}
        </>
      </FilterList>
      <FilterList label="Sync Status" icon={<CategoryIcon />}>
        <FilterListItem
          label="Not Synced"
          value={{ syncStatus: CollectionSyncStatus.NotSynced }}
        />
        <FilterListItem
          label="Syncing"
          value={{ syncStatus: CollectionSyncStatus.Syncing }}
        />
        <FilterListItem
          label="Synced"
          value={{ syncStatus: CollectionSyncStatus.Synced }}
        />
        <FilterListItem
          label="Not Syncable"
          value={{ syncStatus: CollectionSyncStatus.NotSyncable }}
        />
      </FilterList>
    </CardContent>
  </Card>
);
