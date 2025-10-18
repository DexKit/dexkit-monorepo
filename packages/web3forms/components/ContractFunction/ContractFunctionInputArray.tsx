import { Button, Grid } from "@mui/material";
import { FieldArray, useFormikContext } from "formik";
import { FormattedMessage } from "react-intl";
import {
  AbiFragmentInput,
  ContractFormParams,
  TupleAbiFragmentInput,
} from "../../types";
import ContractFunctionInput from "./ContractFunctionInput";
import ContractFunctionTupleInput from "./ContractFunctionTupleInput";

import AddIcon from "@mui/icons-material/Add";
export interface Props {
  input: AbiFragmentInput;
  params: ContractFormParams;
  name?: string;
  onSelectAddress: (name: string, addresses: string[]) => void;
}

export default function ContractFunctionInputArray({
  input,
  params,
  name,
  onSelectAddress,
}: Props) {
  const { values } = useFormikContext<any>();

  return (
    <FieldArray
      name={`${input.name}`}
      render={(helpers) => (
        <Grid container spacing={2}>
          {(values[input.name] || []).map((_: any, index: number) => (
            <Grid size={12} key={index}>
              {input.type.startsWith("tuple") ? (
                <ContractFunctionTupleInput
                  input={input as TupleAbiFragmentInput}
                  onSelectAddress={onSelectAddress}
                  params={params}
                  index={index}
                  name={name}
                />
              ) : (
                <ContractFunctionInput
                  input={input}
                  onSelectAddress={onSelectAddress}
                  params={params}
                  index={index}
                />
              )}
            </Grid>
          ))}
          <Grid size={12}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={helpers.handlePush(
                input.type.startsWith("tuple") ? {} : ""
              )}
            >
              <FormattedMessage id="add" defaultMessage="add" />
            </Button>
          </Grid>
        </Grid>
      )}
    />
  );
}
