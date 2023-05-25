import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { FormattedMessage } from "react-intl";

import { Formik } from "formik";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ethers } from "ethers";
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

          let defaultValue: any;

          if (inp?.inputType === "normal" || inp?.inputType === "address") {
            defaultValue = inp ? inp.defaultValue : "";
          } else if (inp?.inputType === "switch") {
            defaultValue = inp ? Boolean(inp.defaultValue) : false;
          } else if (inp?.inputType === "decimal") {
            defaultValue = inp ? inp.defaultValue : "";
          }

          obj[input.name] = defaultValue;
        }
      }

      return obj;
    },
    []
  );

  const handleSubmit = useCallback(
    async (values: any) => {
      onCall({
        name: !name ? "constructor" : name,
        args: Object.keys(values).map((key) => {
          let inputParams = name ? params.fields[name].input[key] : undefined;

          if (inputParams && inputParams.inputType === "decimal") {
            return ethers.utils.parseUnits(values[key], inputParams.decimals);
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

      if (value instanceof ethers.BigNumber) {
        if (output?.type === "decimal") {
          return ethers.utils.formatUnits(value, output?.decimals);
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

  const callOnMount =
    name && params.fields[name] && params.fields[name].callOnMount;

  const collapse =
    name && params.fields[name] ? params.fields[name].collapse : undefined;

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
      key={String(inputs)}
      initialValues={getInitialValues(inputs, params)}
      onSubmit={handleSubmit}
      validationSchema={getSchemaForInputs(inputs)}
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
              <ContractFunctionInputs
                name={name}
                inputs={inputs}
                params={params}
              />
              <Grid item xs={12}>
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
                          href={`${getBlockExplorerUrl(chainId)}/tx/${
                            results[name]
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
