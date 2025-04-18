import { UserLoginContainer } from '@/modules/user/componentes/containers/UserLoginContainer';
import Box from '@mui/material/Box';
import {
  NextPage
} from 'next';
import AuthMainLayout from 'src/components/layouts/authMain';

export const UserLoginPage: NextPage = () => {
  return (
    <AuthMainLayout disablePadding>
      <Box py={4}>
        <UserLoginContainer />
      </Box>
    </AuthMainLayout>
  );
};


export default UserLoginPage;
