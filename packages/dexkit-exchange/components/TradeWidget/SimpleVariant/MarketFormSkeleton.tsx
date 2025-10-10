import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

export default function MarketFormSkeleton() {
  return (
    <Skeleton>
      <Box>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Skeleton />
          </Grid>
          <Grid size={12}>
            <Skeleton>
              <Typography variant="body2">
                <FormattedMessage id="available" defaultMessage="Available" />:{" "}
              </Typography>
            </Skeleton>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Box>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  alignItems="center"
                >
                  <Skeleton>
                    <Typography>
                      <FormattedMessage
                        id="You will.receive"
                        defaultMessage="You will receive"
                      />
                    </Typography>
                  </Skeleton>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid size={12}>
            <Skeleton>
              <Button size="large" fullWidth variant="contained">
                <FormattedMessage
                  id="loading.quote"
                  defaultMessage="Loading quote..."
                />
              </Button>
            </Skeleton>
          </Grid>
        </Grid>
      </Box>
    </Skeleton>
  );
}
