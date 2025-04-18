import { UserEditContainer } from '@/modules/user/componentes/containers/UserEditContainer';
import Box from '@mui/material/Box';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';

import AuthMainLayout from 'src/components/layouts/authMain';

const UserEdit: NextPage = () => {
  return (
    <SessionProvider>
      <AuthMainLayout disablePadding>
        <Box py={4}>
          <UserEditContainer />
        </Box>
      </AuthMainLayout>
    </SessionProvider>
  );
};


export default UserEdit;
