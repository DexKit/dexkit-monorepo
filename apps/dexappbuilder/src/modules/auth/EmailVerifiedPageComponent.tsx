import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

export default function EmailVerifiedPageComponent() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Email Verified!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your email has been successfully verified. You will be redirected to the home page shortly.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              href="/"
              size="large"
            >
              Go to Home
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
