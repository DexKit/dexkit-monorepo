import {
  Avatar,
  Box,
  BoxProps,
  Stack,
  styled,
  Typography,
} from '@mui/material';

interface Props {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
}

const Pill = styled(
  Box,
  {}
)<BoxProps>(({ theme }) => ({
  borderRadius: '3rem',
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(1),
  border: `1px ${theme.palette.divider} solid`,
  minWidth: theme.spacing(15),
}));

export default function ProfileStatsPill({ icon, body, title }: Props) {
  return (
    <Pill>
      <Stack
        spacing={1.5}
        alignItems="center"
        alignContent="center"
        direction="row"
      >
        <Avatar
          sx={{ backgroundColor: (theme) => theme.palette.background.default }}
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
