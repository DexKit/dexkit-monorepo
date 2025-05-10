import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  Card,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { FastField, Field, FormikConsumer } from 'formik';
import { Checkbox, Select, Switch, TextField } from 'formik-mui';
import { memo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ContractFormDefaultValue from './ContractFormDefaultValue';
import ContractFormInputParams from './ContractFormInputParams';
import ContractFormInputType from './ContractFormInputType';
import ContractFormPayableValueInput from './ContractFormPayableValueInput';

function requiredField(message: string) {
  return (value: string) => {
    return !value ? message : undefined;
  };
}

export interface Props {
  func: AbiFragment;
}

function ContractFormAccordion({ func }: Props) {
  const [expanded, setExpanded] = useState(false);

  const { formatMessage } = useIntl();

  return (
    <Accordion expanded={expanded}>
      <Stack
        sx={{ p: 1 }}
        direction="row"
        alignItems="center"
        alignContent="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          spacing={1}
        >
          <Field
            component={Checkbox}
            type="checkbox"
            name={`fields.${func.name}.visible`}
          />

          <Typography sx={{ fontWeight: 600 }}>{func.name}</Typography>
        </Stack>
        <IconButton onClick={() => setExpanded((value) => !value)}>
          <ExpandMoreIcon />
        </IconButton>
      </Stack>
      <Divider />
      {expanded && (
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FastField
                component={TextField}
                name={`fields.${func.name}.name`}
                label={
                  <FormattedMessage
                    id="function.name"
                    defaultMessage="Function name"
                  />
                }
                fullWidth
                size="small"
              />
            </Grid>
            {func.stateMutability === 'payable' && (
              <Grid item xs={12}>
                <ContractFormPayableValueInput
                  name={`fields.${func.name}.payableAmount`}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FastField
                component={TextField}
                name={`fields.${func.name}.description`}
                label={
                  <FormattedMessage
                    id="short.description"
                    defaultMessage="Short description"
                  />
                }
                multiline
                rows={3}
                fullWidth
                size="small"
              />
            </Grid>

            <FormikConsumer>
              {({ values }) =>
                !(values as ContractFormParams).fields[func.name]
                  .callOnMount ? (
                  <Grid item xs={12}>
                    <FastField
                      component={TextField}
                      name={`fields.${func.name}.callToAction`}
                      label={
                        <FormattedMessage
                          id="call.label"
                          defaultMessage="Call label"
                        />
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                ) : null
              }
            </FormikConsumer>

            {func.inputs.length > 0 && (
              <Grid item>
                <FormControlLabel
                  control={
                    <FastField
                      component={Switch}
                      type="checkbox"
                      name={`fields.${func.name}.hideInputs`}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="hide.inputs"
                      defaultMessage="Hide inputs"
                    />
                  }
                />
              </Grid>
            )}
            <FormikConsumer>
              {({ values }) =>
                !(values as ContractFormParams).fields[func.name].hideInputs
                  ? func.inputs.length > 0 && (
                      <Grid item>
                        <FormControlLabel
                          control={
                            <FastField
                              component={Switch}
                              type="checkbox"
                              name={`fields.${func.name}.lockInputs`}
                            />
                          }
                          label={
                            <FormattedMessage
                              id="lock.inputs"
                              defaultMessage="Lock inputs"
                            />
                          }
                        />
                      </Grid>
                    )
                  : null
              }
            </FormikConsumer>
            {func.stateMutability === 'view' && (
              <Grid item>
                <FormControlLabel
                  control={
                    <FastField
                      component={Switch}
                      type="checkbox"
                      name={`fields.${func.name}.callOnMount`}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="call.on.view"
                      defaultMessage="Call on view"
                    />
                  }
                />
              </Grid>
            )}

            <FormikConsumer>
              {({ values }) =>
                !(values as ContractFormParams).fields[func.name].callOnMount &&
                !(values as ContractFormParams).fields[func.name].hideInputs ? (
                  <Grid item>
                    <FormControlLabel
                      control={
                        <FastField
                          component={Switch}
                          type="checkbox"
                          name={`fields.${func.name}.collapse`}
                        />
                      }
                      label={
                        <FormattedMessage
                          id="collapse"
                          defaultMessage="Collapse"
                        />
                      }
                    />
                  </Grid>
                ) : undefined
              }
            </FormikConsumer>

            <Grid item>
              <FormControlLabel
                control={
                  <FastField
                    component={Switch}
                    type="checkbox"
                    name={`fields.${func.name}.hideLabel`}
                  />
                }
                label={
                  <FormattedMessage
                    id="hide.label"
                    defaultMessage="Hide label"
                  />
                }
              />
            </Grid>

            {func.inputs.length > 0 && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      <FormattedMessage id="inputs" defaultMessage="Inputs" />
                    </Typography>
                  </Grid>
                  {func.inputs.map((input, index) => (
                    <Grid item xs={12} key={index}>
                      <Card sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {input.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <FormikConsumer>
                              {({ values }) => (
                                <ContractFormInputType
                                  func={func}
                                  values={values}
                                  input={input}
                                />
                              )}
                            </FormikConsumer>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <FastField
                                  component={TextField}
                                  name={`fields.${func.name}.input.${input.name}.label`}
                                  label={
                                    <FormattedMessage
                                      id="label"
                                      defaultMessage="Label"
                                    />
                                  }
                                  fullWidth
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <FormikConsumer>
                                  {({ values }) => (
                                    <ContractFormDefaultValue
                                      func={func}
                                      values={values}
                                      input={input}
                                    />
                                  )}
                                </FormikConsumer>
                              </Grid>
                              <Grid item xs={12}>
                                <FormikConsumer>
                                  {({ values }) => (
                                    <ContractFormInputParams
                                      funcName={func.name}
                                      inputName={input.name}
                                      input={
                                        (values as ContractFormParams).fields[
                                          func.name
                                        ].input[input.name]
                                      }
                                    />
                                  )}
                                </FormikConsumer>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                  {func.stateMutability === 'view' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          <FormattedMessage
                            id="output"
                            defaultMessage="Output"
                          />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <FastField
                          component={Select}
                          name={`fields.${func.name}.output.type`}
                          size="small"
                          fullWidth
                          displayEmpty
                          InputLabelProps={{ shrink: true }}
                          inputLabel={{ shrink: true }}
                          formControl={{
                            fullWidth: true,
                            InputLabelProps: { shrink: true },
                          }}
                          label={
                            <FormattedMessage
                              id="output.type"
                              defaultMessage="Output Type"
                            />
                          }
                        >
                          <MenuItem value="">
                            <FormattedMessage
                              id="default"
                              defaultMessage="Default"
                            />
                          </MenuItem>
                          <MenuItem value="decimal">
                            <FormattedMessage
                              id="formatted.decimal"
                              defaultMessage="Formatted decimal"
                            />
                          </MenuItem>
                        </FastField>
                      </Grid>
                      <FormikConsumer>
                        {({ values }) =>
                          (values as ContractFormParams).fields[func.name]
                            .output &&
                          (values as ContractFormParams).fields[func.name]
                            .output?.type === 'decimal' && (
                            <Grid item xs={12}>
                              <FastField
                                component={TextField}
                                type="number"
                                name={`fields.${func.name}.output.decimals`}
                                label={
                                  <FormattedMessage
                                    id="decimals"
                                    defaultMessage="Decimals"
                                  />
                                }
                                fullWidth
                                size="small"
                              />
                            </Grid>
                          )
                        }
                      </FormikConsumer>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      )}
    </Accordion>
  );
}

export default memo(ContractFormAccordion);
