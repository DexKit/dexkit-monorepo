import { TextField, TextFieldProps, useColorScheme, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isDarkMode = mode === 'dark';

  const pattern = new RegExp(
    `^\\d+(\\.\\d{0,${decimals !== undefined ? decimals : 18}})?$`
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
      sx={{
        '& .MuiOutlinedInput-root': {
          color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
          '& fieldset': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : theme.palette.divider,
          },
          '&:hover fieldset': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : theme.palette.primary.main,
          },
        },
        '& .MuiInputAdornment-root': {
          color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
        },
        ...TextFieldProps?.sx,
      }}
    />
  );
}
