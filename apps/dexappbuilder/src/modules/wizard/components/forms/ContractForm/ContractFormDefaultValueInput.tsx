import {
  AbiFragment,
  AbiFragmentInput,
  ContractFormParams,
  TupleAbiFragmentInput,
  ValidatorFunc,
} from '@dexkit/web3forms/types';
import {
  concactValidators,
  requiredField,
  validateAddress,
  validateDecimal,
} from '@dexkit/web3forms/utils/validators';
import { FormControlLabel, Grid, InputAdornment, Switch } from '@mui/material';
import { FastField, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { ChangeEvent, useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export interface ContractFormDefaultValueInputInputProps {
  values: ContractFormParams;
  func: AbiFragment;
  input: AbiFragmentInput;
  index?: number;
  isTuple?: boolean;
}

export default function ContractFormDefaultValueInput({
  values,
  func,
  input,
  index,
  isTuple,
}: ContractFormDefaultValueInputInputProps) {
  const { formatMessage } = useIntl();
  const { setFieldValue } = useFormikContext();

  const inputName = useMemo(() => {
    if (index !== undefined) {
      return `fields.${func.name}.input.${input.name}.defaultValue[${index}]`;
    }

    return `fields.${func.name}.input.${input.name}.defaultValue`;
  }, [func.name, input.name, index]);

  const inputTypeName = useMemo(() => {
    if (index !== undefined) {
      return `${input.type
        .toUpperCase()
        .substring(0, input.type.length - 2)}[${index}]`;
    }

    return input.type.toUpperCase();
  }, [input.type, index]);

  const handleChangeValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>, checked: boolean) =>
      setFieldValue(inputName, checked),
    [func, input],
  );

  const handleChangeValueInTuple = useCallback((inputName: string) => {
    return (_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
      setFieldValue(inputName, checked);
  }, []);

  const inputType = useMemo(() => {
    if (
      values.fields[func.name] &&
      values.fields[func.name].input[input.name]
    ) {
      return values.fields[func.name].input[input.name].inputType;
    }
  }, [values, func, input]);

  const validationFunc = useMemo(() => {
    const validators: ValidatorFunc[] = [];

    if ((values as ContractFormParams).fields[func.name]?.hideInputs) {
      validators.push(
        requiredField(
          formatMessage(
            {
              id: 'field.is.required',
              defaultMessage: '{field} is required',
            },
            {
              field: input.name,
            },
          ),
        ),
      );
    }

    if (inputType === 'decimal') {
      validators.push(
        validateDecimal(
          formatMessage(
            {
              id: 'field.is.invalid',
              defaultMessage: '{field} is invalid',
            },
            {
              field: input.name,
            },
          ),
        ),
      );
    }

    return concactValidators(validators);
  }, [values.fields, func.name, input, inputType]);

  if (inputType === 'switch') {
    return <Switch onChange={handleChangeValue} type="checkbox" />;
  }

  if (input.type.startsWith('tuple')) {
    const tupleInput = input as TupleAbiFragmentInput;

    return (
      <Grid container spacing={2}>
        {tupleInput.components.map((component, key) => {
          const tupleParams = isTuple
            ? values.fields[func.name].input[input.name].tupleParams
            : undefined;

          const validators = [];

          if (tupleParams) {
            if (tupleParams[component.name]?.inputType === 'decimal') {
              validators.push(
                validateDecimal(
                  formatMessage(
                    {
                      id: 'field.is.invalid',
                      defaultMessage: '{field} is invalid',
                    },
                    {
                      field: input.name,
                    },
                  ),
                ),
              );
            } else if (tupleParams[component.name]?.inputType === 'address') {
              validators.push(
                validateAddress(
                  formatMessage(
                    {
                      id: 'field.is.invalid.address',
                      defaultMessage: '{field} is invalid address',
                    },
                    {
                      field: input.name,
                    },
                  ),
                ),
              );
            }

            if (tupleParams[component.name]?.inputType === 'switch') {
              return (
                <Grid xs={12} item key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={handleChangeValueInTuple(
                          `${inputName}.${component.name}`,
                        )}
                        type="checkbox"
                      />
                    }
                    label={component.name}
                  />
                </Grid>
              );
            }
          }

          return (
            <Grid xs={12} item key={key}>
              <FastField
                component={TextField}
                name={`${inputName}.${component.name}`}
                validate={concactValidators(validators)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {component.type.toUpperCase()}
                    </InputAdornment>
                  ),
                }}
                label={component.name}
                fullWidth
                size="small"
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }

  return (
    <FastField
      component={TextField}
      name={inputName}
      validate={validationFunc}
      label={
        <FormattedMessage id="default.value" defaultMessage="Default value" />
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{inputTypeName}</InputAdornment>
        ),
      }}
      fullWidth
      size="small"
    />
  );
}
