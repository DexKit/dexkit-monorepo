import {
  Avatar,
  AvatarGroup,
  ButtonBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { memo } from 'react';

interface Props {
  id: string;
  selected?: boolean;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  onClick?: (id: string) => void;
}

function WizardThemeButton({ selected, name, id, colors, onClick }: Props) {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <Paper
      component={ButtonBase}
      sx={{
        width: '100%',
        p: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderColor: (theme) =>
          selected ? theme.palette.primary.main : theme.palette.divider,
        backgroundColor: (theme) =>
          selected
            ? theme.palette.action.hover
            : theme.palette.background.paper,
      }}
      onClick={handleClick}
    >
      <Stack spacing={0.5} justifyContent="flex-start" alignItems="flex-start">
        <Typography variant="body2">{name}</Typography>
        <AvatarGroup>
          <Avatar
            sx={{
              backgroundColor: colors?.primary,
              color: colors?.primary,
              height: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
              width: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
            }}
          />
          <Avatar
            sx={{
              backgroundColor: colors?.secondary,
              color: colors?.secondary,
              height: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
              width: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
            }}
          />
          <Avatar
            sx={{
              backgroundColor: colors?.text,
              color: colors?.text,
              height: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
              width: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
            }}
          />
          <Avatar
            sx={{
              backgroundColor: colors?.background,
              color: colors?.background,
              height: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
              width: (theme) => ({
                xs: theme.spacing(4),
                sm: theme.spacing(5),
              }),
            }}
          />
        </AvatarGroup>
      </Stack>
    </Paper>
  );
}

export default memo(WizardThemeButton);
