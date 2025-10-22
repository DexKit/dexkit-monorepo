import { InputBase, InputBaseProps } from "@mui/material";
import { BigNumber } from "ethers";

import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    if (isUserInput) {
      return; // Don't override user input
    }

    try {
      if (value.isZero()) {
        setInternalValue({
          value: "",
          triggerChange: false,
        });
      } else {
        const val = formatUnits(value, decimals);
        const cleanVal = parseFloat(val).toString();
        setInternalValue({
          value: cleanVal,
          triggerChange: false,
        });
      }
    } catch (err) {
      setInternalValue({
        value: "",
        triggerChange: false,
      });
    }
  }, [value, decimals, isUserInput]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setInternalValue({ value: "", triggerChange: true });
      return;
    }

    const decimalPattern = /^[0-9]*\.?[0-9]*$/;
    if (decimalPattern.test(inputValue)) {
      setInternalValue({ value: inputValue, triggerChange: true });
    }
  }, []);

  useDebounceCallback<{ value: string; triggerChange: boolean }>(
    internalValue,
    () => {
      if (!internalValue.triggerChange) {
        return;
      }

      try {
        if (internalValue.value === "" || internalValue.value === ".") {
          onChange(BigNumber.from(0));
        } else if (decimals !== undefined) {
          const parsed = parseUnits(internalValue.value, decimals);
          onChange(parsed);
        }
      } catch (err) {
        onChange(BigNumber.from(0));
      }
    },
    200
  );

  return (
    <InputBase
      {...InputBaseProps}
      inputProps={{
        inputMode: "decimal",
        onClick: onClick
      }}
      value={internalValue.value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="0"
    />
  );
}