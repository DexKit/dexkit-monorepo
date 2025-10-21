import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { FormattedMessage } from "react-intl";

import { Formik } from "formik";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import {
  CallParams,
  ContractFormParams,
  FunctionInput,
  OutputType,
} from "../../types";
import { getSchemaForInputs } from "../../utils";

import { ChainId } from "@dexkit/core/constants";
import { getBlockExplorerUrl } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BigNumber } from "ethers";

import { arrayify } from "@dexkit/core/utils/ethers/arrayify";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { isBytesLike } from "@dexkit/core/utils/ethers/isBytesLike";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import ContractFunctionInputs from "./ContractFunctionInputs";

export function isFunctionCall(stateMutability: string) {
  return stateMutability === "nonpayable" || stateMutability === "payable";
}

export interface ContractFieldProps {
  inputs: FunctionInput[];
  output?: OutputType;
  params: ContractFormParams;
  name?: string;
  stateMutability: string;
  isCalling?: boolean;
  chainId?: ChainId;
  results?: { [key: string]: any };
  isResultsLoading?: boolean;
  onCall: ({ name, args, call, payable }: CallParams) => void;
}

export default function ContractFunction({
  inputs,
  output,
  name,
  stateMutability,
  chainId,
  isCalling,
  params,
  results,
  isResultsLoading,
  onCall,
}: ContractFieldProps) {
  const { account } = useWeb3React();

  const getInitialValues = useCallback(
    (inputs: FunctionInput[], params: ContractFormParams) => {
      let obj: { [key: string]: string } = {};

      for (let input of inputs) {
        if (
          name !== undefined &&
          input.name &&
          params.fields[name] &&
          params.fields[name].input
        ) {
          const inp = params.fields[name].input[input.name];

          let defaultValue: any = inp ? inp.defaultValue : "";

          if (input.type.endsWith("[]")) {
            if (!inp?.defaultValue) {
              defaultValue = [];
            } else {
              defaultValue = inp.defaultValue;
            }
          } else if (
            inp?.inputType === "normal" ||
            inp?.inputType === "address"
          ) {
            defaultValue = inp ? inp.defaultValue : "";
          } else if (inp?.inputType === "switch") {
            defaultValue = inp ? Boolean(inp.defaultValue) : false;
          } else if (inp?.inputType === "decimal") {
            defaultValue = inp ? inp.defaultValue : "";
          } else if (inp?.inputType === "connectedAccount") {
            defaultValue = account;
          }

          obj[input.name] = defaultValue;
        }
      }

      return obj;
    },
    [account, name]
  );

  const handleSubmit = useCallback(
    async (values: any) => {
      onCall({
        name: !name ? "constructor" : name,
        args: Object.keys(values).map((key) => {
          let inputParams = name ? params.fields[name].input[key] : undefined;

          if (
            inputParams !== undefined &&
            inputParams.inputType === "decimal"
          ) {
            const decimals = inputParams.decimals;

            if (Array.isArray(values[key])) {
              return values[key].map((val: string) => {
                return parseUnits(val, decimals);
              });
            }

            return parseUnits(values[key], decimals);
          }

          if (name) {
            if (isBytesLike(values[key])) {
              //@ts-ignore
              if (!isAddress(values[key])) {
                const arr = arrayify(values[key]);

                return arrayify(values[key]);
              }
            }
          }

          return values[key];
        }),
        call: isFunctionCall(stateMutability),
        payable: stateMutability === "payable",
      });
    },
    [name, stateMutability, onCall, params.fields]
  );

  const submitMessage = useMemo(() => {
    if (isCalling) {
      if (stateMutability === "nonpayable" || stateMutability === "payable") {
        return <FormattedMessage id="calling" defaultMessage="Calling" />;
      } else if (stateMutability === "view") {
        return <FormattedMessage id="loading" defaultMessage="Loading" />;
      }
    } else if (stateMutability === "view") {
      return <FormattedMessage id="get" defaultMessage="Get" />;
    } else {
      if (name && params.fields[name].callToAction) {
        return params.fields[name].callToAction;
      }
      return <FormattedMessage id="call" defaultMessage="Call" />;
    }
  }, [stateMutability, name, params, chainId]);

  const result = useMemo(() => {
    if (stateMutability !== "view") {
      return "";
    }

    if (name && results && results[name]) {
      let value = results[name];

      if (value instanceof BigNumber) {
        if (output?.type === "decimal") {
          return formatUnits(value, output?.decimals);
        }

        return value.toString();
      }

      return String(value);
    }
  }, [results, name, stateMutability]);

  const fieldName = useMemo(() => {
    return name && params.fields[name] && params.fields[name].name
      ? params.fields[name].name
      : name;
  }, [name, params]);

  const hideLabel: boolean = useMemo(() => {
    if (
      name &&
      params.fields[name] &&
      params.fields[name].hideLabel !== undefined
    ) {
      return params.fields[name].hideLabel;
    }

    return false;
  }, [params.fields]);

  const hideInputs: boolean = useMemo(() => {
    if (
      name &&
      params.fields[name] &&
      params.fields[name].hideInputs !== undefined
    ) {
      return params.fields[name].hideInputs;
    }

    return false;
  }, [params.fields, name]);

  const description = useMemo(() => {
    return name && params.fields[name]
      ? params.fields[name].description
      : undefined;
  }, [params.fields, name]);

  const callOnMount =
    name && params.fields[name] && params.fields[name].callOnMount;

  const collapse =
    name && params.fields[name] ? params.fields[name].collapse : undefined;

  const key = useMemo(() => {
    return name ? JSON.stringify(params.fields[name]) : undefined;
  }, [params, name]);

  if (callOnMount) {
    return (
      <Card>
        <Box
          sx={{
            p: 2,
            width: "100%",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            display: "block",
            overflowWrap: "break-word",
            hyphens: "auto",
          }}
        >
          {!hideLabel ? (
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {isResultsLoading ? (
                <Skeleton sx={{ width: "100%" }} />
              ) : (
                <>
                  {fieldName} {result && <>: {result}</>}
                </>
              )}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {result}
            </Typography>
          )}
        </Box>
      </Card>
    );
  }

  return (
    <Formik
      key={key}
      initialValues={getInitialValues(inputs, params)}
      onSubmit={handleSubmit}
      validationSchema={getSchemaForInputs(inputs)}
      validateOnMount={hideInputs}
    >
      {({ submitForm, isValid, values, errors }) => (
        <Accordion
          key={`${String(collapse)}-${name}`}
          defaultExpanded={collapse}
        >
          {!hideLabel && (
            <>
              <AccordionSummary
                expandIcon={!collapse ? <ExpandMoreIcon /> : undefined}
                sx={{
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    display: "block",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {isResultsLoading ? (
                    <Skeleton sx={{ width: "100%" }} />
                  ) : (
                    <Typography
                      component="div"
                      variant="body1"
                      sx={{
                        width: "100%",
                        fontWeight: 600,
                        wordBreak: "break-word",
                        display: "block",
                      }}
                    >
                      {fieldName} {result && <>: {result}</>}
                    </Typography>
                  )}
                </Box>
              </AccordionSummary>
              <Divider />
            </>
          )}
          <AccordionDetails sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                {description}
              </Grid>
              <ContractFunctionInputs
                name={name}
                inputs={inputs}
                params={params}
              />
              {hideInputs && Object.keys(errors).length > 0 && (
                <Grid size={12}>
                  <Alert severity="warning">
                    <FormattedMessage
                      id="this.function.will.not.work.correctly.please.contact.the.creator"
                      defaultMessage="this function will not work correctly. Please, contact the creator"
                    />
                  </Alert>
                </Grid>
              )}

              <Grid size={12}>
                <Box>
                  <Stack spacing={1} direction="row">
                    {!callOnMount && (
                      <Button
                        size="small"
                        disabled={!isValid || isCalling}
                        onClick={submitForm}
                        startIcon={
                          isCalling && (
                            <CircularProgress size="1rem" color="inherit" />
                          )
                        }
                        variant="contained"
                      >
                        {submitMessage}
                      </Button>
                    )}

                    {(stateMutability === "nonpayable" ||
                      stateMutability === "payable") &&
                      name &&
                      results &&
                      results[name] && (
                        <Button
                          LinkComponent="a"
                          href={`${getBlockExplorerUrl(chainId)}/tx/${results[name]
                            }`}
                          target="_blank"
                          size="small"
                          variant="outlined"
                        >
                          <FormattedMessage
                            id="view.transaction"
                            defaultMessage="View Transaction"
                          />
                        </Button>
                      )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Formik>
  );
}
