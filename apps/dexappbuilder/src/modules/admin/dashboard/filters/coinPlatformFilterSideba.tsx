import CategoryIcon from '@mui/icons-material/LocalOffer';
import MailIcon from '@mui/icons-material/MailOutline';
import { Card, CardContent } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  SavedQueriesList,
} from 'react-admin';
import { NETWORKS } from 'src/constants/chain';

export const CoinPlatformFilterSidebar = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 300 }}>
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
    </CardContent>
  </Card>
);
