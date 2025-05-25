import { truncateAddress } from '@dexkit/core/utils';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { Grid, TextField as MuiTextField } from '@mui/material';

import { Field } from 'formik';
import { Autocomplete } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface AddressInputProps {
  addresses: string[];
  funcName?: string;
  inputName?: string;
  isTuple?: boolean;
  componentName?: string;
}

export function AddressInput({
  addresses,
  funcName,
  inputName,
  isTuple,
  componentName,
}: AddressInputProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          component={Autocomplete}
          freeSolo
          multiple
          size="small"
          autoSelect
          name={
            isTuple
              ? `fields.${funcName}.input.${inputName}.tupleParams.${componentName}.addresses`
              : `fields.${funcName}.input.${inputName}.addresses`
          }
          options={addresses ? addresses : []}
          getOptionLabel={(option: string) => {
            if (isAddress(option)) {
              return truncateAddress(option);
            }

            return (
              <FormattedMessage
                id="invalid.address"
                defaultMessage="Invalid address"
              />
            );
          }}
          filterSelectedOptions
          renderInput={(params: any) => (
            <MuiTextField
              {...params}
              label={
                <FormattedMessage id="addresses" defaultMessage="Addresses" />
              }
              placeholder="Address"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
