import { InputAdornment, TextField } from "@mui/material";
import { getIn, useFormikContext } from "formik";
import { ChangeEvent, useMemo } from "react";

function validateDecimal(message: string, decimals: number) {
  return (value: string) => {
    const patternTwoDigisAfterComma = `^\\d+(\\.\\d{0,${decimals}})?$`;

    if (!new RegExp(patternTwoDigisAfterComma, "i").test(value)) {
      return message;
    }
  };
}

export interface DecimalInputProps {
  decimals: number;
  name: string;
  label: string;
  helperText?: string;
  isPercentage?: boolean;
  maxDigits?: number;
}

export default function DecimalInput({
  decimals,
  name,
  label,
  helperText,
  isPercentage,
  maxDigits,
}: DecimalInputProps) {
  const { values, setFieldValue } = useFormikContext();

  const pattern = useMemo(() => {
    return new RegExp(
      `^\\d{0,${maxDigits !== undefined ? maxDigits : 10}}(\\.\\d{0,${
        decimals !== undefined ? decimals : 18
      }})?$`,
    );
  }, [decimals, maxDigits]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (pattern.test(e.target.value) || e.target.value === "") {
      setFieldValue(name, e.target.value);
    }
  };

  return (
    <TextField
      name={name}
      size="small"
      fullWidth
      onChange={handleChange}
      label={label}
      value={getIn(values, name)}
      InputProps={
        isPercentage
          ? {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }
          : undefined
      }
      helperText={helperText}
    />
  );
}
