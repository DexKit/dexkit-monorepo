import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { Field, FieldArray } from 'formik';
import { Select, TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

interface Props {
  itemIndex: number;
  index: number;
}

export default function CollectionItemAttributeForm({
  index,
  itemIndex,
}: Props) {
  return (
    <Box>
      <Grid container spacing={2} alignItems="center" alignContent="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="type" defaultMessage="Type" />
            </InputLabel>
            <Field
              component={Select}
              name={`items[${itemIndex}].attributes[${index}].display_type`}
              label={<FormattedMessage id="type" defaultMessage="Type" />}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">
                <FormattedMessage id="generic" defaultMessage="Generic" />
              </MenuItem>
              <MenuItem value="number">
                <FormattedMessage id="number" defaultMessage="Number" />
              </MenuItem>
              <MenuItem value="boost_number">
                <FormattedMessage
                  id="boost.number"
                  defaultMessage="Boost Number"
                />
              </MenuItem>
              <MenuItem value="boost_percentage">
                <FormattedMessage
                  id="boost.percentage"
                  defaultMessage="Boost Percentage"
                />
              </MenuItem>
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Field
            component={TextField}
            name={`items[${itemIndex}].attributes[${index}].trait_type`}
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            fullWidth
          />
        </Grid>
        <Grid item xs>
          <Field
            component={TextField}
            name={`items[${itemIndex}].attributes[${index}].value`}
            label={<FormattedMessage id="value" defaultMessage="Value" />}
            fullWidth
          />
        </Grid>
        <Grid item>
          <FieldArray
            name={`items[${itemIndex}].attributes`}
            render={(arrayHelper) => (
              <Button
                startIcon={<Delete />}
                onClick={() => arrayHelper.remove(index)}
              >
                <FormattedMessage id="remove" defaultMessage="Remove" />
              </Button>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
