import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import { FormattedMessage } from "react-intl";
import useParams from "../hooks/useParams";
import ProductCollectionFormProducts from "./ProductCollectionFormProducts";

export interface ProductCollectionFormProps {
  disabled?: boolean;
}

export default function ProductCollectionForm({
  disabled,
}: ProductCollectionFormProps) {
  const { submitForm, isValid, isSubmitting } = useFormikContext();

  const { goBack } = useParams();

  return (
    <Box sx={{ maxWidth: '800px', width: '100%' }}>
      <Stack spacing={3}>
        <Box>
          <Field
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            component={TextField}
            name="name"
            fullWidth
            disabled={disabled}
          />
        </Box>

        <Box>
          <ProductCollectionFormProducts />
        </Box>
        <Divider />

        <Box>
          <Stack justifyContent="flex-end" direction="row" spacing={2}>
            <Button 
              onClick={goBack}
              sx={{
                color: 'primary.main',
                textTransform: 'uppercase',
                fontWeight: 'normal'
              }}
            >
              <FormattedMessage id="cancel" defaultMessage="CANCEL" />
            </Button>
            <Button
              onClick={submitForm}
              disabled={!isValid || isSubmitting || disabled}
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                textTransform: 'uppercase',
                fontWeight: 'normal',
                px: 3,
                py: 1
              }}
            >
              <FormattedMessage id="save" defaultMessage="SAVE" />
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
