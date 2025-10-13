import {
  Avatar,
  Box,
  BoxProps,
  Stack,
  styled,
  Typography,
  useColorScheme,
} from '@mui/material';

interface Props {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
}

const Pill = styled(Box)<BoxProps>(({ theme }) => ({
  borderRadius: '3rem',
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  minWidth: theme.spacing(15),
}));

export default function ProfileStatsPill({ icon, body, title }: Props) {
  const { mode } = useColorScheme();

  return (
    <Pill>
      <Stack
        spacing={1.5}
        alignItems="center"
        alignContent="center"
        direction="row"
      >
        <Avatar
          sx={{
            backgroundColor: mode === 'dark' ? '#0D1017' : '#FFFFFF'
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="caption" color="textSecondary">
            {title}
          </Typography>
          <Typography sx={{ fontWeight: 600 }} variant="h6">
            {body}
          </Typography>
        </Box>
      </Stack>
    </Pill>
  );
}
