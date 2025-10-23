import {
  Avatar,
  Box,
  BoxProps,
  Stack,
  styled,
  Typography,
  useTheme
} from '@mui/material';
import { useThemeMode } from 'src/hooks/app';

interface Props {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
}

const Pill = styled(Box)<BoxProps>(({ theme }) => ({
  borderRadius: '3rem',
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(1),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    paddingRight: theme.spacing(1.5),
    paddingLeft: theme.spacing(0.5),
  },
}));

export default function ProfileStatsPill({ icon, body, title }: Props) {
  const theme = useTheme();
  const { mode: themeMode } = useThemeMode();

  const isDarkMode = themeMode === 'dark';

  const backgroundColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.background?.paper || theme.palette.background.paper
    : theme.colorSchemes?.light?.palette?.background?.paper || theme.palette.background.paper;

  const borderColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.divider || theme.palette.divider
    : theme.colorSchemes?.light?.palette?.divider || theme.palette.divider;

  const avatarBackgroundColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.background?.default || theme.palette.background.default
    : theme.colorSchemes?.light?.palette?.background?.paper || theme.palette.background.paper;

  const textPrimaryColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.text?.primary || theme.palette.text.primary
    : theme.colorSchemes?.light?.palette?.text?.primary || theme.palette.text.primary;

  const textSecondaryColor = theme.colorSchemes?.dark?.palette?.text?.secondary ||
    theme.colorSchemes?.light?.palette?.text?.secondary ||
    theme.palette.text.secondary;

  return (
    <Pill
      sx={{
        backgroundColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <Stack
        spacing={1.5}
        alignItems="center"
        alignContent="center"
        direction="row"
        sx={{
          [theme.breakpoints.down('sm')]: {
            spacing: 1,
          },
        }}
      >
        <Avatar
          sx={{
            backgroundColor: avatarBackgroundColor,
            color: textPrimaryColor,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: textSecondaryColor,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: textPrimaryColor,
            }}
            variant="h6"
          >
            {body}
          </Typography>
        </Box>
      </Stack>
    </Pill>
  );
}
