import { Box, Button, FormControlLabel, Grid } from "@mui/material";
import { BigNumber } from "ethers";
import { Field, Formik, FormikErrors, getIn } from "formik";
import { Autocomplete, Checkbox, TextField } from "formik-mui";
import {
  useIfpsUploadMutation,
  useServerUploadMerkleTreeMutation,
  useServerUploadMutation,
} from "../hooks";

import MuiTextField from "@mui/material/TextField";
import { Form, FormElement, FormOutputFormat } from "../types";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import React, { useEffect } from "react";
import * as Yup from "yup";
import DecimalInput from "./DecimalInput";
import { ImageInput } from "./ImageInput";
import { IpfsImageInput } from "./IpfsImageInput";
import { MerkleTreeFileInput } from "./MerkleTreeFileInput";
import SharesArrayInput from "./SharesArrayInput";

import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { MarkdownDescriptionField } from "@dexkit/ui/components";
import CompletationProvider from "@dexkit/ui/components/CompletationProvider";

type FormParams = {
  values: any;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

function validateAddress(message: string) {
  return (value: string) => {
    return !isAddress(value) ? message : undefined;
  };
}

function getValidation(type?: string) {
  if (type === "address") {
    return validateAddress("invalid address");
  }
}
// Syncs context always when updated
function SyncContextAndHiddenFields({
  context,
  setFieldValue,
  elements,
  account,
}: {
  context?: { [key: string]: any };
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<any>>;
  elements: FormElement[];
  account?: string;
}) {
  // syncs context fields
  useEffect(() => {
    if (context) {
      const keys = Object.keys(context);
      for (let index = 0; index < keys.length; index++) {
        const value = context[keys[index]];
        setFieldValue(keys[index], value);
      }
    }
  }, [context, setFieldValue]);
  // syncs hidden fields with connected accounts. Sometimes account is not available at beginning
  useEffect(() => {
    if (elements) {
      const inputElements = elements.filter((el) => el.type === "input");
      for (let index = 0; index < inputElements.length; index++) {
        const element = inputElements[index];
        if (
          element.type === "input" &&
          element?.component?.type === "hidden" &&
          element?.component.subtype === "connected-address"
        ) {
          if (element.ref && typeof element.ref === "string") {
            setFieldValue(element.ref, account);
          }
        }
      }
    }
  }, [account, setFieldValue, elements]);

  return <></>;
}

export interface GenericFormProps {
  form: Form;
  output: FormOutputFormat;
  context?: { [key: string]: any };
  onSubmit: (values: any[], formValues?: any) => Promise<void>;
  actionLabel: React.ReactNode;
}

export default function GenericForm({
  form,
  output,
  onSubmit,
  context,
  actionLabel,
}: GenericFormProps) {
  const { account } = useWeb3React();

  const renderInput = (el: FormElement, params?: FormParams) => {
    if (el.type === "input") {
      if (el.component?.type === "address") {
        return (
          <Field
            component={TextField}
            name={el.ref}
            size="small"
            fullWidth
            validate={getValidation(el.component.type)}
            disabled={el.locked}
            helperText={el.helperText}
            required
            label={el.label}
          />
        );
      } else if (el.component?.type === "address-array") {
        return (
          <Field
            component={Autocomplete}
            freeSolo
            multiple
            size="small"
            autoSelect
            name={el.ref}
            required
            helperText={el.helperText}
            options={[]}
            filterSelectedOptions
            renderInput={(params: any) => (
              <MuiTextField
                {...params}
                label={el.label}
                placeholder="Address"
              />
            )}
          />
        );
      } else if (el.component?.type === "shares-array") {
        return <SharesArrayInput reference={el.ref as string[]} />;
      } else if (el.component?.type === "checkbox") {
        return (
          <FormControlLabel
            control={
              <Field
                component={Checkbox}
                name={el.ref}
                type="checkbox"
                size="small"
                helperText={el.helperText}
                validate={getValidation(el.component.type)}
                disabled={el.locked}
                required
              />
            }
            label={el.label}
          />
        );
      } else if (el.component?.type === "image") {
        return <IpfsImageInput label={el.label} name={el.ref as string} />;
      } else if (el.component?.type === "image-url") {
        return <ImageInput label={el.label} name={el.ref as string} />;
      } else if (el.component?.type === "hidden") {
        return false;
      } else if (el.component?.type === "merkle-tree-file") {
        return <MerkleTreeFileInput el={el} />;
      } else if (el.component?.type === "markdown") {
        return (
          <MarkdownDescriptionField
            name={el.ref as string}
            label={el.label}
            helperText={el.helperText}
            disabled={el.locked}
          />
        );
      } else if (el.component?.type === "decimal") {
        return (
          <DecimalInput
            label={el.label}
            name={el.ref as string}
            decimals={el.component.decimals}
            helperText={el.helperText}
            isPercentage={el?.component?.isPercentage}
            maxDigits={el?.component?.maxDigits}
          />
        );
      } else {
        if (params) {
          const { values, setFieldValue } = params;

          const isDescriptionField = (el.ref as string)?.toLowerCase().includes('description') ||
            el.label?.toLowerCase().includes('description') ||
            (el.ref as string)?.toLowerCase().includes('desc') ||
            el.label?.toLowerCase().includes('desc') ||
            (el.ref as string) === 'description' ||
            (el.ref as string) === 'desc';

          if (isDescriptionField) {
            return (
              <MarkdownDescriptionField
                name={el.ref as string}
                label={el.label}
                helperText={el.helperText || "You can use markdown formatting for rich text descriptions"}
                disabled={el.locked}
              />
            );
          }

          return (
            <CompletationProvider
              onCompletation={(output: string) => {
                setFieldValue(el.ref as string, output);
              }}
              initialPrompt={getIn(values, el.ref as string)}
            >
              {({ inputAdornment, ref }) => (
                <Field
                  component={TextField}
                  name={el.ref as string}
                  size="small"
                  fullWidth
                  disabled={el.locked}
                  label={el.label}
                  helperText={el.helperText}
                  required
                  inputRef={ref}
                  InputProps={{ endAdornment: inputAdornment("end") }}
                />
              )}
            </CompletationProvider>
          );
        }
      }
    }
  };

  const renderElements = (
    elements: FormElement[],
    group?: string,
    params?: FormParams
  ) => {
    const hasImageField = elements.some(el =>
      el.type === "input" &&
      (el.component?.type === "image" || el.component?.type === "image-url")
    );
    const hasDescriptionField = elements.some(el =>
      el.type === "input" &&
      ((el.ref as string)?.toLowerCase().includes('description') ||
        el.label?.toLowerCase().includes('description'))
    );

    if (hasImageField && hasDescriptionField && !group) {
      const imageElement = elements.find(el =>
        el.type === "input" &&
        (el.component?.type === "image" || el.component?.type === "image-url")
      );
      const descriptionElement = elements.find(el =>
        el.type === "input" &&
        ((el.ref as string)?.toLowerCase().includes('description') ||
          el.label?.toLowerCase().includes('description'))
      );
      const otherElements = elements.filter(el =>
        el !== imageElement && el !== descriptionElement
      );

      return [
        imageElement && descriptionElement && (
          <Grid key="image-description-layout" size={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  alignItems: 'center',
                  minHeight: { xs: 'auto', sm: '200px' },
                  py: { xs: 2, sm: 0 }
                }}>
                  {renderInput(imageElement, params)}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 'grow' }}>
                {renderInput(descriptionElement, params)}
              </Grid>
            </Grid>
          </Grid>
        ),
        ...otherElements.map((el, key) => {
          if (el.type === "input" && el.component?.type !== "hidden") {
            return (
              <Grid
                key={group ? `${group}-${key}-${el.type}` : `${key}-${el.type}`}
                size={{
                  xs: el.col?.xs ? el.col.xs : 12,
                  ...(el.col?.sm && { sm: el.col.sm })
                }}
              >
                {renderInput(el, params)}
              </Grid>
            );
          } else if (el.type === "input-group") {
            return (
              <Grid
                key={`group-${key}`}
                size={{
                  xs: el.col?.xs ? el.col.xs : 12,
                  ...(el.col?.sm && { sm: el.col.sm })
                }}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  alignContent="center"
                >
                  {renderElements(el.inputs, `group-${key}`, params)}
                </Grid>
              </Grid>
            );
          }
        }).filter((i) => i !== undefined)
      ].filter((i) => i !== undefined);
    }

    return elements
      .map((el, key) => {
        if (el.type === "input" && el.component?.type !== "hidden") {
          return (
            <Grid
              key={group ? `${group}-${key}-${el.type}` : `${key}-${el.type}`}
              size={{
                xs: el.col?.xs ? el.col.xs : 12,
                ...(el.col?.sm && { sm: el.col.sm })
              }}
            >
              {renderInput(el, params)}
            </Grid>
          );
        } else if (el.type === "input-group") {
          return (
            <Grid
              key={`group-${key}`}
              size={{
                xs: el.col?.xs ? el.col.xs : 12,
                ...(el.col?.sm && { sm: el.col.sm })
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                alignContent="center"
              >
                {renderElements(el.inputs, `group-${key}`, params)}
              </Grid>
            </Grid>
          );
        }
      })
      .filter((i) => i !== undefined);
  };

  const getInitialValues = (elements: FormElement[]): any => {
    return elements
      .filter((el) => el.type === "input")
      .map((el) => {
        if (el.type === "input") {
          if (el.component?.type === "address" && el.ref) {
            if (el.component.subtype === "connected-address") {
              return { [el.ref as string]: account };
            }
            if (el.defaultValue) {
              return { [el.ref as string]: el.defaultValue };
            } else {
              return { [el.ref as string]: "" };
            }
          } else if (el.component?.type === "checkbox" && el.ref) {
            if (el.defaultValue) {
              return { [el.ref as string]: el.defaultValue };
            } else {
              return { [el.ref as string]: false };
            }
          } else if (el.component?.type === "address-array" && el.ref) {
            if (el.defaultValue) {
              return { [el.ref as string]: el.defaultValue };
            } else {
              return { [el.ref as string]: [] };
            }
          } else if (
            el.component?.type === "hidden" &&
            el.component.subtype === "connected-address"
          ) {
            return { [el.ref as string]: account };
          } else if (
            el.component?.type === "hidden" &&
            typeof el.defaultValue === "object" &&
            context
          ) {
            if ("ref" in el.defaultValue) {
              return { [el.ref as string]: context[el.defaultValue.ref] };
            }
          }

          return {
            [el.ref as string]: el.defaultValue ? el.defaultValue : undefined,
          };
        }
      })
      .reduce((obj, curr) => {
        return { ...obj, ...curr };
      }, {});
  };

  const getValidationSchema = (elements: FormElement[]): any => {
    const mapping: any = (els: FormElement[]) => {
      return els.map((el: FormElement) => {
        if (el.type === "input") {
          if (el.component?.type === "address" && el.ref) {
            return {
              [el.ref as string]: Yup.string()
                .test("address", (value) => {
                  return value !== undefined ? isAddress(value) : true;
                })
                .required(),
            };
          } else if (el.component?.type === "checkbox" && el.ref) {
            return { [el.ref as string]: Yup.boolean().required() };
          } else if (el.component?.type === "address-array" && el.ref) {
            return {
              [el.ref as string]: Yup.array(
                Yup.string()
                  .test("address", (value) => {
                    return value !== undefined ? isAddress(value) : true;
                  })
                  .required()
              ),
            };
          } else if (
            (el.component?.type === "image" ||
              el.component?.type === "image-url") &&
            el.ref
          ) {
            return {
              [el.ref as string]: Yup.string().required(),
            };
          } else if (
            el.component?.type === "hidden" &&
            typeof el.defaultValue === "object"
          ) {
            if ("ref" in el.defaultValue) {
              if (el.defaultValue.ref === "trustedForwarders") {
                return {
                  [el.ref as string]: Yup.array(Yup.string()).required(),
                };
              }
            }

            return {
              [el.ref as string]: Yup.string().required(),
            };
          } else if (el.component?.type === "hidden" && el.ref) {
            return {
              [el.ref as string]: Yup.string().required(),
            };
          }

          if (Array.isArray(el.ref)) {
            if (el.component?.type === "shares-array") {
              return {
                [el.ref[0]]: Yup.array(
                  Yup.string().test("address", (value) => {
                    return value !== undefined ? isAddress(value) : true;
                  })
                ).required(),
                [el.ref[1]]: Yup.array(Yup.string()).required(),
              };
            }
          }

          return { [el.ref as string]: Yup.string().required() };
        } else if (el.type === "input-group") {
          return mapping(el.inputs).reduce((o: any, curr: any) => {
            return { ...o, ...curr };
          }, {});
        }
      });
    };

    const obj = mapping(elements);

    let newObj = obj.reduce((o: any, curr: any) => {
      return { ...o, ...curr };
    }, {});

    return Yup.object().shape(newObj);
  };

  const ipfsUploadMutation = useIfpsUploadMutation();

  const serverUploadMutation = useServerUploadMutation();

  const serverUploadMerkleTreeMutation = useServerUploadMerkleTreeMutation();

  const handleSubmit = async (formValues: any) => {
    const ocurrsKeys: string[] = [];
    const serverDataKeys: string[] = [];
    const merkleTreeKeys: string[] = [];

    const mapping = (elements: FormElement[]) => {
      return elements
        .map((e: FormElement) => {
          if (e.type === "input-group") {
            return e.inputs;
          }

          return [e];
        })
        .flat();
    };

    const fields = mapping(form.elements);

    const values = Object.keys(formValues)
      .map((key) => {
        let field = fields.find((f) => f.type === "input" && f.ref === key);

        if (field?.component?.type === "decimal") {
          return {
            [key]:
              field.component.decimals > 0
                ? parseUnits(formValues[key], field.component.decimals)
                : BigNumber.from(formValues[key]),
          };
        } else if (
          field?.component?.type === "hidden" &&
          field.component.subtype === "connected-address"
        ) {
          return {
            [key]: account,
          };
        }

        return { [key]: formValues[key] };
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      }, {});

    let result: any = output.objects
      .map((obj) => {
        return {
          [obj.name]: obj.fields
            .map((fieldName: any) => {
              if (!fieldName.fields) {
                if (fieldName.type === "decimal") {
                  let vals: any;

                  if (Array.isArray(values[fieldName.name])) {
                    vals = values[fieldName.name].map((v: string) =>
                      fieldName.decimals > 0
                        ? parseUnits(v, fieldName.decimals)
                        : BigNumber.from(v)
                    );
                  } else {
                    vals =
                      fieldName.decimals > 0
                        ? parseUnits(values[fieldName.name], fieldName.decimals)
                        : BigNumber.from(values[fieldName.name]);
                  }

                  return {
                    [fieldName.name]: vals,
                  };
                }
                if (fieldName.type === "merkle-tree-file") {
                  merkleTreeKeys.push(fieldName.name);
                }

                return { [fieldName.name]: values[fieldName.name] };
              }

              const res = {
                [fieldName.name]: fieldName.fields
                  ?.map((f: any) => {
                    if (typeof f === "string") {
                      if (fieldName.name) {
                        return { [f]: values[f] };
                      }
                    }
                  })
                  .reduce((prev: any, curr: any) => {
                    return { ...prev, ...curr };
                  }, {}),
              };

              if (fieldName.type === "ipfs-file") {
                ocurrsKeys.push(fieldName.name);
              }
              if (fieldName.type === "server-file") {
                serverDataKeys.push(fieldName.name);
              }

              if (fieldName.type === "merkle-tree-file") {
                merkleTreeKeys.push(fieldName.name);
              }

              return res;
            })
            .filter((f) => f !== undefined)
            .reduce((prev, curr) => {
              return { ...prev, ...curr };
            }, {}),
        };
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      }, {});

    for (let obj of Object.keys(result)) {
      for (let key of ocurrsKeys) {
        const content = Buffer.from(JSON.stringify(result[obj][key]));

        let cid = await ipfsUploadMutation.mutateAsync({
          content,
          token: "",
        });

        result[obj][key] = `ipfs://${cid}s`;
      }
      for (let key of serverDataKeys) {
        const content = JSON.stringify(result[obj][key]);
        let url = await serverUploadMutation.mutateAsync({
          content,
        });
        result[obj][key] = url;
      }
      for (let key of merkleTreeKeys) {
        const merkleTreeProof = result[obj][key];
        if (merkleTreeProof !== "0x") {
          const content = JSON.stringify(values[merkleTreeProof]);
          await serverUploadMerkleTreeMutation.mutateAsync({
            content,
            merkleProof: merkleTreeProof,
          });
        }
      }
    }

    await onSubmit(result, values);
  };

  return (
    <Formik
      initialValues={getInitialValues(form.elements)}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema(form.elements)}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        errors,
        values,
        setFieldValue,
      }) => (
        <Grid container spacing={2}>
          <SyncContextAndHiddenFields
            context={context}
            setFieldValue={setFieldValue}
            elements={form.elements}
            account={account}
          />
          {renderElements(form.elements, undefined, { setFieldValue, values })}
          <Grid size={12}>
            <Button
              disabled={isSubmitting || !isValid}
              onClick={submitForm}
              variant="contained"
              color="primary"
            >
              {actionLabel}
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}