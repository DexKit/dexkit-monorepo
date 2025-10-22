import { useDebounce } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { InputAdornment, useColorScheme, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import DecimalInput from "./DecimalInput";

export interface LazyDecimalInputProps {
  token: Token;
  onChange: (value?: string) => void;
}

export default function LazyDecimalInput({
  token,
  onChange,
}: LazyDecimalInputProps) {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isDarkMode = mode === 'dark';

  const handleChangeAmount = (value?: string) => {
    setAmount({ value, triggerChange: true });
  };

  const [amount, setAmount] = useState<{
    value?: string;
    triggerChange: boolean;
  }>({ value: "0.0", triggerChange: false });

  const lazyAmount = useDebounce<typeof amount>(amount, 400);

  useEffect(() => {
    onChange(lazyAmount.value);
  }, [lazyAmount, onChange]);

  return (
    <DecimalInput
      decimals={token.decimals}
      value={amount.value}
      onChange={handleChangeAmount}
      TextFieldProps={{
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              {token.symbol.toUpperCase()}
            </InputAdornment>
          ),
        },
        sx: {
          '& .MuiOutlinedInput-root': {
            color: 'text.primary',
            '& fieldset': {
              borderColor: 'divider',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputAdornment-root': {
            color: 'text.primary',
          },
        },
      }}
    />
  );
}
