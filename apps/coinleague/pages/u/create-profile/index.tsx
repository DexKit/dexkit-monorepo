import { UserCreateContainer } from '@/modules/user/componentes/containers/UserCreateContainer';
import Box from '@mui/material/Box';
import {
  NextPage
} from 'next';
import AuthMainLayout from 'src/components/layouts/authMain';

const UserCreate: NextPage = () => {
  return (
    <AuthMainLayout disablePadding>
      <Box py={4}>
        <UserCreateContainer />
      </Box>
    </AuthMainLayout>
  );
};


export default UserCreate;
