import { IconButton, styled } from '@mui/material';

const WalletRoundedButton = styled(IconButton)(({ theme }) => ({
  height: theme.spacing(8),
  width: theme.spacing(8),
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
}));

export default WalletRoundedButton;
