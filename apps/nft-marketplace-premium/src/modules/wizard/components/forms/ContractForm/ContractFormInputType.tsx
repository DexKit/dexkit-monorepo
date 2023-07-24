import { requiredField } from '@/modules/wizard/utils';
import { WEB3FORMS_INPUT_TYPES } from '@dexkit/web3forms/constants';
import {
  AbiFragment,
  AbiFragmentInput,
  ContractFormParams,
  TupleAbiFragmentInput,
} from '@dexkit/web3forms/types';
import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { FastField } from 'formik';
import { Select, TextField } from 'formik-mui';
import { FormattedMessage, useIntl } from 'react-intl';

export interface Props {
  values: ContractFormParams;
  func: AbiFragment;
  input: AbiFragmentInput;
}

export default function ContractFormInputType({ values, input, func }: Props) {
  const { formatMessage } = useIntl();

  if (input.type.startsWith('tuple')) {
    const tupleInput = input as TupleAbiFragmentInput;

    return (
      <Box>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {tupleInput.components.map((component, index) => {
              const tupleParams =
                values.fields[func.name].input[input.name].tupleParams;

              const inputType = tupleParams
                ? tupleParams[component.name]?.inputType
                : undefined;

              return (
                <Grid item xs={12} key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FastField
                              component={Select}
                              name={`fields.${func.name}.input.${input.name}.tupleParams.${component.name}.inputType`}
                              size="small"
                              fullWidth
                              displayEmpty
                              InputLabelProps={{ shrink: true }}
                              inputLabel={{ shrink: true }}
                              formControl={{ fullWidth: true }}
                              label={
                                <FormattedMessage
                                  id="input.type"
                                  defaultMessage='Input type for "{inputName}"'
                                  values={{ inputName: component.name }}
                                />
                              }
                            >
                              <MenuItem value="">
                                <FormattedMessage
                                  id="default"
                                  defaultMessage="Default"
                                />
                              </MenuItem>
                              {Object.keys(WEB3FORMS_INPUT_TYPES)
                                .map((key) => key)
                                .filter(
                                  (key) =>
                                    WEB3FORMS_INPUT_TYPES[key].type === '' ||
                                    component.type.startsWith(
                                      WEB3FORMS_INPUT_TYPES[key].type
                                    )
                                )
                                .map((key) => (
                                  <MenuItem key={key} value={key}>
                                    <FormattedMessage
                                      id={WEB3FORMS_INPUT_TYPES[key].messageId}
                                      defaultMessage={
                                        WEB3FORMS_INPUT_TYPES[key]
                                          .defaultMessage
                                      }
                                    />
                                  </MenuItem>
                                ))}
                            </FastField>
                          </Grid>
                          {inputType === 'decimal' && (
                            <>
                              <Grid item xs={12}>
                                <FastField
                                  component={TextField}
                                  name={`fields.${func.name}.input.${input.name}.tupleParams.${component.name}.decimals`}
                                  size="small"
                                  fullWidth
                                  type="number"
                                  validate={requiredField(
                                    formatMessage({
                                      id: 'required.field',
                                      defaultMessage: 'required field',
                                    })
                                  )}
                                  label={
                                    <FormattedMessage
                                      id="decimals"
                                      defaultMessage="Decimals"
                                    />
                                  }
                                />
                                {/* <ContractFormInputTypeText inputType="" /> */}
                              </Grid>
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            </>
                          )}

                          {inputType === 'address' && (
                            <>
                              <Grid item xs={12}>
                                {/* <AddressInput input={} /> */}
                              </Grid>
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        <FormControl>
          <InputLabel>
            <FormattedMessage id="input.type" defaultMessage="Input Type" />
          </InputLabel>
          <FastField
            component={Select}
            name={`fields.${func.name}.input.${input.name}.inputType`}
            size="small"
            fullWidth
            displayEmpty
            InputLabelProps={{ shrink: true }}
            inputLabel={{ shrink: true }}
            formControl={{ fullWidth: true }}
            label={
              <FormattedMessage id="input.type" defaultMessage="Input Type" />
            }
          >
            <MenuItem value="">
              <FormattedMessage id="default" defaultMessage="Default" />
            </MenuItem>
            {Object.keys(WEB3FORMS_INPUT_TYPES)
              .map((key) => key)
              .filter(
                (key) =>
                  WEB3FORMS_INPUT_TYPES[key].type === '' ||
                  input.type.startsWith(WEB3FORMS_INPUT_TYPES[key].type)
              )
              .map((key) => (
                <MenuItem key={key} value={key}>
                  <FormattedMessage
                    id={WEB3FORMS_INPUT_TYPES[key].messageId}
                    defaultMessage={WEB3FORMS_INPUT_TYPES[key].defaultMessage}
                  />
                </MenuItem>
              ))}
          </FastField>
        </FormControl>
        {WEB3FORMS_INPUT_TYPES[
          (values as ContractFormParams).fields[func.name].input[input.name]
            .inputType
        ] && (
          <Typography variant="body1" color="text.secondary">
            <FormattedMessage
              id={
                (values as ContractFormParams).fields[func.name]
                  ? WEB3FORMS_INPUT_TYPES[
                      (values as ContractFormParams).fields[func.name].input[
                        input.name
                      ].inputType
                    ]?.helpMessageId
                  : undefined
              }
              defaultMessage={
                (values as ContractFormParams).fields[func.name]
                  ? WEB3FORMS_INPUT_TYPES[
                      (values as ContractFormParams).fields[func.name].input[
                        input.name
                      ].inputType
                    ]?.helpDefaultMessage
                  : undefined
              }
            />
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
