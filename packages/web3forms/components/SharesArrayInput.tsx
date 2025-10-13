import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { Alert, Button, Grid, IconButton, Paper } from "@mui/material";
import { BigNumber } from "ethers";
import { Field, FieldArray, getIn, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DecimalInput from "./DecimalInput";

export interface SharesArrayInputProps {
  reference: string[];
}

export default function SharesArrayInput({ reference }: SharesArrayInputProps) {
  const { values } = useFormikContext();

  const [rows, setRows] = useState(new Array(0).fill(null));

  const handleAdd = () => {
    setRows((value) => {
      let newValue = [...value];

      newValue.push(null);

      return newValue;
    });
  };

  const handleRemove = (index: number) => {
    return () => {
      setRows((value) => {
        let newValue = [...value];

        newValue.splice(index, 1);

        return newValue;
      });
    };
  };

  const { formatMessage } = useIntl();

  const [formattedTotalPercentage, isOverOneHundred, isBelowOneHundred] =
    useMemo(() => {
      let value: any = getIn(values, `${reference[1]}`);

      const oneHundred = parseUnits("100.00", 2);

      if (Array.isArray(value)) {
        const sum = value
          .map((val) => parseUnits(val !== "" ? val : "0", 2))
          .reduce((prev, curr) => {
            return prev.add(curr);
          }, BigNumber.from(0));

        return [formatUnits(sum, 2), sum.gt(oneHundred), sum.lt(oneHundred)];
      }

      return ["0", false, true];
    }, [reference, values]);

  return (
    <FieldArray
      name={reference[0]}
      render={(arrZero) => (
        <FieldArray
          name={reference[1]}
          render={(arrOne) => (
            <Grid container spacing={2}>
              {rows.map((_, index) => (
                <Grid size={12} key={index}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 9 }}>
                      <Field
                        fullWidth
                        component={TextField}
                        name={`${reference[0]}[${index}]`}
                        label={
                          <FormattedMessage id="payee" defaultMessage="Payee" />
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <DecimalInput
                        name={`${reference[1]}[${index}]`}
                        decimals={2}
                        label={formatMessage({
                          id: "percentage",
                          defaultMessage: "Percentage",
                        })}
                        isPercentage
                        maxDigits={3}
                      />
                    </Grid>
                    <Grid size="grow">
                      <Paper
                        sx={{ borderRadius: "50%" }}
                        component={IconButton}
                        onClick={() => {
                          arrZero.handleRemove(index)();
                          arrOne.handleRemove(index)();
                          handleRemove(index)();
                        }}
                      >
                        <RemoveIcon />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              {isOverOneHundred && (
                <Grid size={12}>
                  <Alert severity="warning">
                    <FormattedMessage
                      id="total.shares.cannot.go.over.one.hundred"
                      defaultMessage="Total shares cannot go over 100%."
                    />
                  </Alert>
                </Grid>
              )}
              {isBelowOneHundred && (
                <Grid size={12}>
                  <Alert severity="warning">
                    <FormattedMessage
                      id="total.shares.need.to.add.up.to.one.hundred"
                      defaultMessage="Total shares need to add up to 100%."
                    />{" "}
                    <FormattedMessage
                      id="total.shares.currently.add.up.to.percentage"
                      defaultMessage="Total shares currently add up to {percentage}%"
                      values={{ percentage: formattedTotalPercentage }}
                    />
                  </Alert>
                </Grid>
              )}
              <Grid size={12}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    arrZero.handlePush("")();
                    arrOne.handlePush("0.00")();
                    handleAdd();
                  }}
                  variant="outlined"
                >
                  <FormattedMessage
                    id="add.recipient"
                    defaultMessage="Add recipient"
                  />
                </Button>
              </Grid>
            </Grid>
          )}
        />
      )}
    />
  );
}
