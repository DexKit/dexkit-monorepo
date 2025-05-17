import { Stack } from '@mui/material';
import { NotificationsMenu } from '../modules/user/componentes/NotificationsMenu';

export default function AppNavbarMenu() {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <NotificationsMenu />
    </Stack>
  );
}
