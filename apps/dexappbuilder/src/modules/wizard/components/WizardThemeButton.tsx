import {
  Avatar,
  AvatarGroup,
  ButtonBase,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        p: isMobile ? 1.5 : 1,
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
      <Stack
        spacing={isMobile ? 1 : 0.5}
        justifyContent="flex-start"
        alignItems="flex-start"
        width="100%"
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: selected ? 'bold' : 'normal',
            width: '100%',
            textAlign: 'left'
          }}
        >
          {name}
        </Typography>
        <AvatarGroup sx={{ width: '100%', justifyContent: 'flex-start' }}>
          <Avatar
            sx={{
              backgroundColor: colors?.primary,
              color: colors?.primary,
              height: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              width: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              border: isMobile ? '1px solid rgba(255,255,255,0.2)' : undefined,
            }}
          />
          <Avatar
            sx={{
              backgroundColor: colors?.secondary,
              color: colors?.secondary,
              height: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              width: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              border: isMobile ? '1px solid rgba(255,255,255,0.2)' : undefined,
            }}
          />
          <Avatar
            sx={{
              backgroundColor: colors?.text,
              color: colors?.text,
              height: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              width: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              border: isMobile ? '1px solid rgba(255,255,255,0.2)' : undefined,
            }}
          />
          <Avatar
            sx={{
              backgroundColor: colors?.background,
              color: colors?.background,
              height: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              width: isMobile ? theme.spacing(3.5) : theme.spacing(5),
              border: isMobile ? '1px solid rgba(255,255,255,0.2)' : undefined,
            }}
          />
        </AvatarGroup>
      </Stack>
    </Paper>
  );
}

export default memo(WizardThemeButton);
