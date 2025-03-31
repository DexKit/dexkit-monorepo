import { Stack, Typography } from '@mui/material';
import WalletRoundedButton from './WalletRoundedButton';

interface Props {
  onClick: () => void;
  icon?: React.ReactNode;
  title?: React.ReactNode;
}

export default function WalletActionButton({ onClick, icon, title }: Props) {
  return (
    <Stack alignItems="center" alignContent="center" justifyContent="center">
      <WalletRoundedButton onClick={onClick}>{icon}</WalletRoundedButton>
      <Typography variant="overline">{title}</Typography>
    </Stack>
  );
}
