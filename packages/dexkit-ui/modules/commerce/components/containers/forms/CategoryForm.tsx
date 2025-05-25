import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import { FormattedMessage } from "react-intl";
import useParams from "../hooks/useParams";

export interface CategoryFormProps {
  disabled?: boolean;
}

export default function CategoryForm({ disabled }: CategoryFormProps) {
  const { submitForm, isValid, isSubmitting } = useFormikContext();

  const { goBack } = useParams();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            component={TextField}
            name="name"
            fullWidth
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Stack justifyContent="flex-end" direction="row" spacing={2}>
              <Button onClick={goBack}>
                <FormattedMessage id="Cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                onClick={submitForm}
                disabled={!isValid || isSubmitting || disabled}
                variant="contained"
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
