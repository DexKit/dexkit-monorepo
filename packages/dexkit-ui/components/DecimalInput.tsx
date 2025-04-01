import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEvent, useMemo } from "react";

export interface DecimalInputProps {
  value: string;
  onChange: (value: string) => void;
  TextFieldProps?: TextFieldProps;
  decimals?: number;
  maxDigits?: number;
}

export default function DecimalInput({
  value,
  onChange,
  TextFieldProps,
  decimals,
  maxDigits,
}: DecimalInputProps) {
  const pattern = useMemo(() => {
    return new RegExp(
      `^\\d{0,${maxDigits !== undefined ? maxDigits : 10}}(\\.\\d{0,${
        decimals !== undefined ? decimals : 18
      }})?$`,
    );
  }, [decimals, maxDigits]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (pattern.test(e.target.value) || e.target.value === "") {
      onChange(e.target.value);
    }
  };

  return (
    <TextField
      {...TextFieldProps}
      value={value}
      fullWidth
      onChange={handleChange}
    />
  );
}
