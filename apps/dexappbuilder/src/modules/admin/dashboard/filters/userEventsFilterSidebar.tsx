import { UserEvents } from '@dexkit/core/constants/userEvents';

import MailIcon from '@mui/icons-material/MailOutline';
import { Card, CardContent } from '@mui/material';
import { FilterList, FilterListItem, SavedQueriesList } from 'react-admin';

export const UserEventsFilterSidebar = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 400 }}>
    <CardContent>
      <SavedQueriesList />
      <FilterList label="Event Type" icon={<MailIcon />}>
        <>
          {Object.values(UserEvents).map((n, k) => (
            <FilterListItem key={k} label={n} value={{ type: n }} />
          ))}
        </>
      </FilterList>
    </CardContent>
  </Card>
);
