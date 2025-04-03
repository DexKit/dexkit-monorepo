import { InputBase, InputBaseProps } from "@mui/material";
import { BigNumber } from "ethers";

import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { ChangeEvent, useCallback, useState } from "react";
import { useDebounceCallback } from "../../hooks";

interface Props {
  onChange: (value: BigNumber) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  InputBaseProps?: InputBaseProps;
  value: BigNumber;
  decimals?: number;
  isUserInput?: boolean;
}

export function CurrencyField({
  onChange,
  InputBaseProps,
  value,
  decimals,
  isUserInput,
  onFocus,
  onBlur,
  onClick,
}: Props) {
  const [internalValue, setInternalValue] = useState({
    value: "",
    triggerChange: false,
  });

  useDebounceCallback<BigNumber>(
    value,
    (value) => {
      if (isUserInput) {
        return;
      }
      try {
        const val = formatUnits(value, decimals);
        setInternalValue({
          value: val,
          triggerChange: false,
        });
      } catch (err) {
        setInternalValue({
          value: "",
          triggerChange: false,
        });
      }
    },
    0
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInternalValue({ value: e.target.value, triggerChange: true });
  }, []);

  useDebounceCallback<{ value: string; triggerChange: boolean }>(
    internalValue,
    () => {
      try {
        if (internalValue.triggerChange && decimals) {
          onChange(parseUnits(internalValue.value, decimals));
        }
      } catch (err) {
        onChange(BigNumber.from(0));
      }
    },
    0
  );

  return (
    <InputBase
      {...InputBaseProps}
      inputProps={{ inputMode: "decimal" }}
      value={internalValue.value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
    />
  );
}
