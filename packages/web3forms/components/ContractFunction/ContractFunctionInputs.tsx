import { Grid } from "@mui/material";
import { useFormikContext } from "formik";
import {
  ContractFormParams,
  FunctionInput,
  TupleAbiFragmentInput,
} from "../../types";

import { useCallback, useState } from "react";
import SelectAddressDialog from "../SelectAddressDialog";
import ContractFunctionInput from "./ContractFunctionInput";
import ContractFunctionInputArray from "./ContractFunctionInputArray";
import ContractFunctionTupleInput from "./ContractFunctionTupleInput";

const patternTwoDigisAfterComma = /^\d+(\.\d{0,18})?$/;

function validateDecimal(message: string) {
  return (value: string) => {
    if (!patternTwoDigisAfterComma.test(value)) {
      return message;
    }
  };
}

export interface ContractFunctionInputsProps {
  name?: string;
  params: ContractFormParams;
  inputs: FunctionInput[];
}

export default function ContractFunctionInputs({
  name,
  params,
  inputs,
}: ContractFunctionInputsProps) {
  if (name && params.fields[name] && params.fields[name].hideInputs) {
    return null;
  }

  const [showSelectAddress, setSelectedAddress] = useState(false);
  const [selectFor, setSelectFor] = useState<string>();
  const [selectAddresses, setSelectAddresses] = useState<string[]>();

  const { setFieldValue } = useFormikContext();

  const handleShowSelectAddress = (selectFor: string, addresses: string[]) => {
    setSelectedAddress(true);
    setSelectFor(selectFor);
    setSelectAddresses(addresses);
  };

  const handelCloseSelectAddress = () => {
    setSelectedAddress(false);
    setSelectFor(undefined);
    setSelectAddresses(undefined);
  };

  const handleSelect = useCallback(
    (address: string) => {
      if (selectFor) {
        setFieldValue(selectFor, address);
        setSelectFor(undefined);
        setSelectedAddress(false);
      }
    },
    [selectFor]
  );

  return (
    <>
      {showSelectAddress && (
        <SelectAddressDialog
          DialogProps={{
            open: showSelectAddress,
            onClose: handelCloseSelectAddress,
          }}
          addresses={selectAddresses || []}
          onSelect={handleSelect}
        />
      )}

      {inputs.map((input, key) => {
        if (input.type === "tuple") {
          return (
            <Grid size={12} key={key}>
              <ContractFunctionTupleInput
                name={name}
                input={input as TupleAbiFragmentInput}
                params={params}
                onSelectAddress={handleShowSelectAddress}
              />
            </Grid>
          );
        }

        if (input.type.endsWith("[]")) {
          return (
            <Grid size={12} key={key}>
              <ContractFunctionInputArray
                input={input}
                name={name}
                onSelectAddress={handleShowSelectAddress}
                params={params}
              />
            </Grid>
          );
        }

        return (
          <ContractFunctionInput
            input={input}
            name={name}
            onSelectAddress={handleShowSelectAddress}
            params={params}
          />
        );
      })}
    </>
  );
}
