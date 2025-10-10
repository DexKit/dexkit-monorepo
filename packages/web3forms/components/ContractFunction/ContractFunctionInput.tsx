import {
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Field, useFormikContext } from "formik";
import { Switch, TextField } from "formik-mui";
import {
  AbiFragmentInput,
  ContractFormFieldInput,
  ContractFormFieldInputAddress,
  ContractFormParams,
} from "../../types";

import ContactsIcon from "@mui/icons-material/Contacts";
import { ChangeEvent, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import {
  concactValidators,
  requiredField,
  validateAddress,
  validateDecimal,
} from "../../utils/validators";

export interface ContractFunctionProps {
  input: AbiFragmentInput;
  params: ContractFormParams;
  name?: string;
  objectName?: string;
  index?: number;
  tupleParams?: { [key: string]: ContractFormFieldInput };
  onSelectAddress: (name: string, addresses: string[]) => void;
}

export default function ContractFunctionInput({
  name,
  input,
  params,
  objectName,
  tupleParams,
  index,
  onSelectAddress,
}: ContractFunctionProps) {
  const { formatMessage } = useIntl();
  const { setFieldValue } = useFormikContext();

  const handleChangeValueInTuple = useCallback((inputName: string) => {
    return (_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
      setFieldValue(inputName, checked);
  }, []);

  const inputParams = useMemo(() => {
    const inputParams =
      name &&
        input.name &&
        params.fields[name] &&
        params.fields[name].input &&
        params.fields[name].input[input.name] &&
        params.fields[name].input[input.name]
        ? params.fields[name].input[input.name]
        : undefined;

    return inputParams;
  }, [name, params, input]);

  const inputName = useMemo(() => {
    let inpName: string = input.name;

    if (objectName) {
      inpName = `${objectName}.${input.name}`;
    }

    if (index !== undefined) {
      inpName = `${inpName}[${index}]`;
    }

    return inpName;
  }, [input, index, name, objectName]);

  if (
    inputParams?.inputType === "address" ||
    (tupleParams && tupleParams[input.name]?.inputType === "address")
  ) {
    const inputTupleParams: ContractFormFieldInputAddress | undefined =
      tupleParams && tupleParams[input.name].inputType === "address"
        ? (tupleParams[input.name] as ContractFormFieldInputAddress)
        : undefined;

    return (
      <Grid size={12}>
        <Field
          component={TextField}
          size="small"
          fullWidth
          label={inputParams?.label ? inputParams.label : input.name}
          name={inputName}
          validate={concactValidators([
            requiredField(
              formatMessage({
                id: "field.required",
                defaultMessage: "field required",
              })
            ),
            validateAddress(
              formatMessage({
                id: "invalid.address",
                defaultMessage: "Invalid address",
              })
            ),
          ])}
          disabled={
            name && params.fields[name]
              ? params.fields[name].lockInputs
              : undefined
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    onSelectAddress(
                      inputName,
                      inputParams?.inputType === "address"
                        ? inputParams.addresses
                        : inputTupleParams
                          ? inputTupleParams.addresses
                          : []
                    )
                  }
                  size="small"
                >
                  <ContactsIcon fontSize="inherit" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    );
  } else if (
    inputParams?.inputType === "switch" ||
    (tupleParams && tupleParams[input.name]?.inputType === "switch")
  ) {
    return (
      <Grid size={12}>
        <FormControlLabel
          label={inputParams?.label ? inputParams.label : input.name}
          control={
            <Field
              component={Switch}
              size="small"
              type="checkbox"
              fullWidth
              onChange={handleChangeValueInTuple(inputName)}
              validate={concactValidators([
                requiredField(
                  formatMessage({
                    id: "field.required",
                    defaultMessage: "field required",
                  })
                ),
              ])}
              name={inputName}
              disabled={
                name && params.fields[name]
                  ? params.fields[name].lockInputs
                  : undefined
              }
            />
          }
        />
      </Grid>
    );
  }

  const validators = useMemo(() => {
    const vals = [
      requiredField(
        formatMessage({
          id: "field.required",
          defaultMessage: "field required",
        })
      ),
    ];

    if (inputParams?.inputType === "decimal") {
      vals.push(
        validateDecimal(
          formatMessage({
            id: "invalid.decimal",
            defaultMessage: "Invalid decimal",
          })
        )
      );
    }

    return concactValidators(vals);
  }, [inputParams]);

  return (
    <Grid size={12}>
      <Field
        component={TextField}
        size="small"
        fullWidth
        label={inputParams?.label ? inputParams.label : input.name}
        name={inputName}
        disabled={
          name && params.fields[name]
            ? params.fields[name].lockInputs
            : undefined
        }
        validate={validators}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {input.type.toUpperCase()}
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
}
