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
  const { mode: themeMode } = useThemeMode();
  const theme = useTheme();

  const isDarkMode = themeMode === 'dark';

  return (
    <Pill
      sx={{
        backgroundColor: isDarkMode ? '#151B22' : '#FAFAFA',
        border: `1px solid ${isDarkMode ? '#0D1017' : '#DCDCDC'}`,
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
            backgroundColor: isDarkMode ? '#0D1017' : '#FFFFFF',
            color: isDarkMode ? '#fff' : '#0E1116',
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: '#737372',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: isDarkMode ? '#fff' : '#0E1116',
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
