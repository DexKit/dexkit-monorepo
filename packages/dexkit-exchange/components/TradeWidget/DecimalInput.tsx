import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEvent } from "react";

export interface DecimalInputProps {
  value?: string;
  onChange: (value?: string) => void;
  TextFieldProps?: TextFieldProps;
  decimals?: number;
}

const patternTwoDigisAfterComma = /^\d+(\.\d{0,18})?$/;

export default function DecimalInput({
  value,
  onChange,
  TextFieldProps,
  decimals,
}: DecimalInputProps) {
  const pattern = new RegExp(
    `^\\d+(\\.\\d{0,${decimals !== undefined ? decimals : 18}})?$`,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (pattern.test(e.target.value)) {
      onChange(e.target.value);
    }
    if (!e.target.value) {
      onChange(undefined);
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
