import { Box, Button, Grid, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useFormikContext } from "formik";

export interface FormActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
  isMobile?: boolean;
  isSmallDevice?: boolean;
}

export default function FormActions({
  onCancel,
  onSubmit,
  isMobile = false,
}: FormActionsProps) {
  const { isValid } = useFormikContext();

  return (
    <Grid container spacing={isMobile ? 1 : 2}>
      <Grid size={12}>
        <Box sx={{
          px: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 1.5 }
        }}>
          <Stack
            spacing={isMobile ? 1 : 2}
            direction="row"
            justifyContent="flex-end"
            sx={{
              mt: isMobile ? 1 : 2,
              mr: { xs: 0, sm: 1 }
            }}
          >
            <Button
              onClick={onCancel}
              size={isMobile ? "small" : "medium"}
            >
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              disabled={!isValid}
              onClick={onSubmit}
              variant="contained"
              size={isMobile ? "small" : "medium"}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
