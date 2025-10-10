import { Grid, Paper } from "@mui/material";
import { useMemo } from "react";
import { ContractFormParams, TupleAbiFragmentInput } from "../../types";
import ContractFunctionInput from "./ContractFunctionInput";

export interface ContractFunctionTupleInputProps {
  input: TupleAbiFragmentInput;
  params: ContractFormParams;
  name?: string;
  onSelectAddress: (name: string, addresses: string[]) => void;
  index?: number;
}

export default function ContractFunctionTupleInput({
  input,
  params,
  name,
  index,
  onSelectAddress,
}: ContractFunctionTupleInputProps) {
  const inputParams = useMemo(() => {
    const inputParams =
      input.name &&
        name &&
        params.fields[name] &&
        params.fields[name].input &&
        params.fields[name].input[input.name] &&
        params.fields[name].input[input.name]
        ? params.fields[name].input[input.name]
        : undefined;

    return inputParams;
  }, [name, params, input]);

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          {inputParams?.label ? inputParams.label : input.name}
        </Grid>
        {input.components.map((component, key) => (
          <Grid size={12} key={key}>
            <ContractFunctionInput
              objectName={
                index !== undefined ? `${input.name}[${index}]` : input.name
              }
              input={component}
              name={component.name}
              onSelectAddress={onSelectAddress}
              params={params}
              tupleParams={inputParams?.tupleParams}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
