import ConstructionIcon from '@mui/icons-material/Construction';
import { Box, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function UnderConstructionViewer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ py: isMobile ? 4 : 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={isMobile ? 3 : 4} alignItems="center">
          <Box
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: '50%',
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.primary.light + '20'
                  : theme.palette.primary.dark + '30',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ConstructionIcon
              sx={{
                fontSize: isMobile ? '3rem' : '4rem',
                color: 'primary.main',
              }}
            />
          </Box>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            <FormattedMessage
              id="under.construction.title"
              defaultMessage="Under Construction"
            />
          </Typography>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            <FormattedMessage
              id="under.construction.subtitle"
              defaultMessage="We're working hard to build something amazing for you. This page is currently under construction and will be available soon."
            />
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              maxWidth: '500px',
              mb: 3,
            }}
          >
            <FormattedMessage
              id="under.construction.description"
              defaultMessage="Our team is putting the finishing touches on your application. Check back soon to see the final result!"
            />
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
