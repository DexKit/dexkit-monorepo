import CategoryIcon from '@mui/icons-material/LocalOffer';
import { Card, CardContent } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  SavedQueriesList,
} from 'react-admin';

export const SiteFilterSidebar = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 400 }}>
    <CardContent>
      <SavedQueriesList />
      <FilterLiveSearch />
      <FilterList label="Domain Status" icon={<CategoryIcon />}>
        <FilterListItem label="Verified" value={{ domainStatus: 'VERIFIED' }} />
        <FilterListItem
          label="Not Verified"
          value={{ domainStatus: 'NOT_VERIFIED' }}
        />
      </FilterList>
    </CardContent>
  </Card>
);
