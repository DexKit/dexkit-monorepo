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

export const CoinFilterSidebar = () => (
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
      <FilterList label="Coingecko Listed" icon={<CategoryIcon />}>
        <FilterListItem label="Listed" value={{ isCoingeckoListed: true }} />
        <FilterListItem
          label="Not Listed"
          value={{ isCoingeckoListed: false }}
        />
      </FilterList>
    </CardContent>
  </Card>
);
