import { truncateAddress } from '@dexkit/core/utils';
import {
  ContractFormFieldInputAddress,
  ContractFormFieldInputDecimal,
  ContractFormFieldInputWithTupleParams,
  ContractFormParams,
} from '@dexkit/web3forms/types';
import Grid from '@mui/material/Grid';

import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { TextField as MuiTextField } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { Autocomplete, TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

function AddressInput({
  input,
  funcName,
  inputName,
}: {
  input: ContractFormFieldInputAddress;
  funcName?: string;
  inputName?: string;
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          component={Autocomplete}
          freeSolo
          multiple
          size="small"
          autoSelect
          name={`fields.${funcName}.input.${inputName}.addresses`}
          options={input.addresses ? input.addresses : []}
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

function DecimalInput({
  input,
  funcName,
  inputName,
}: {
  input: ContractFormFieldInputDecimal;
  funcName?: string;
  inputName?: string;
}) {
  const { values } = useFormikContext<ContractFormParams>();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          component={TextField}
          label={<FormattedMessage id="decimals" defaultMessage="Decimals" />}
          fullWidth
          size="small"
          type="number"
          name={`fields.${funcName}.input.${inputName}.decimals`}
        />
      </Grid>
    </Grid>
  );
}

export interface ContractFormInputParamsProps {
  input?: ContractFormFieldInputWithTupleParams;
  funcName?: string;
  inputName?: string;
}

export default function ContractFormInputParams({
  input,
  funcName,
  inputName,
}: ContractFormInputParamsProps) {
  if (input?.inputType === 'address') {
    return (
      <AddressInput funcName={funcName} inputName={inputName} input={input} />
    );
  } else if (input?.inputType === 'decimal') {
    return (
      <DecimalInput funcName={funcName} inputName={inputName} input={input} />
    );
  }

  return null;
}
