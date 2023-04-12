import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { FormattedMessage } from "react-intl";

import { Field, Formik } from "formik";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Divider,
} from "@mui/material";
import { TextField } from "formik-mui";
import { useCallback } from "react";
import { CallParams, FunctionInput } from "../types";
import { getSchemaForInputs } from "../utils";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function isFunctionCall(stateMutability: string) {
  return stateMutability === "nonpayable" || stateMutability === "payable";
}

export interface ContractFieldProps {
  inputs: FunctionInput[];
  name?: string;
  stateMutability: string;
  isCalling?: boolean;
  onCall: ({ name, args, call, payable }: CallParams) => void;
}

export default function ContractFunction({
  inputs,
  name,
  stateMutability,
  isCalling,
  onCall,
}: ContractFieldProps) {
  const renderInputs = () => {
    return inputs.map((input, key) => {
      return (
        <Grid item xs={12} key={key}>
          <Field
            component={TextField}
            size="small"
            fullWidth
            label={input.name}
            name={input.name}
          />
        </Grid>
      );
    });
  };

  const getInitialValues = useCallback((inputs: FunctionInput[]) => {
    let obj: { [key: string]: string } = {};

    for (let input of inputs) {
      obj[input.name] = "";
    }

    return obj;
  }, []);

  const handleSubmit = useCallback(
    async (values: any) => {
      onCall({
        name: !name ? "constructor" : name,
        args: Object.keys(values).map((key) => values[key]),
        call: isFunctionCall(stateMutability),
        payable: stateMutability === "payable",
      });
    },
    [name, stateMutability, onCall]
  );

  const renderSubmitMessage = () => {
    if (isCalling) {
      if (stateMutability === "nonpayable" || stateMutability === "payable") {
        return <FormattedMessage id="calling" defaultMessage="Calling" />;
      } else if (stateMutability === "view") {
        return <FormattedMessage id="loading" defaultMessage="Loading" />;
      }
    } else if (stateMutability === "view") {
      return <FormattedMessage id="get" defaultMessage="Get" />;
    } else {
      return <FormattedMessage id="call" defaultMessage="Call" />;
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(inputs)}
      onSubmit={handleSubmit}
      validationSchema={getSchemaForInputs(inputs)}
    >
      {({ submitForm, isValid }) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {name}
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Grid container spacing={2}>
              {renderInputs()}
              <Grid item xs={12}>
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
                  {renderSubmitMessage()}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Formik>
  );
}
