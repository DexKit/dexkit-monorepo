import { CommerceContent } from '@dexkit/ui/modules/wizard/types/section';
import { FormControlLabel, Grid } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { Checkbox } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export default function StoreForm() {
  const {} = useFormikContext<CommerceContent>();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Field component={Checkbox} name="params.emailRequired" />}
          label={
            <FormattedMessage
              id="email.required"
              defaultMessage="Email required"
            />
          }
        />
      </Grid>
    </Grid>
  );
}
