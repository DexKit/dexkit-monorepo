import { ChainId } from "@dexkit/core/constants";
import { Grid } from "@mui/material";
import { AbiFragment, CallParams, ContractFormParams } from "../types";
import ContractFunction from "./ContractFunction";

export interface ContractFormFunctionsProps {
  abi: AbiFragment[];
  params: ContractFormParams;
  callFuncName?: string;
  onCall: ({ name, args, call, payable }: CallParams) => void;
  isCalling?: boolean;
  results: { [key: string]: any };
  chainId?: ChainId;
  isResultsLoading?: boolean;
}

export default function ContractFormFunctions({
  abi,
  params,
  isCalling,
  results,
  chainId,
  onCall,
  isResultsLoading,
  callFuncName,
}: ContractFormFunctionsProps) {
  return (
    <>
      {abi
        .filter((i) => i.type === "function")
        .filter((i) => {
          if (i.name) {
            let field = params.fields[i.name];

            if (field) {
              return field.visible;
            }
          }

          return false;
        })
        .map((item, key) => {
          if (item.type === "function") {
            return (
              <Grid size={12} key={key}>
                <ContractFunction
                  inputs={item.inputs}
                  output={params.fields[item.name]?.output}
                  name={item.name}
                  stateMutability={item.stateMutability}
                  onCall={onCall}
                  params={params}
                  chainId={chainId}
                  results={results}
                  isResultsLoading={isResultsLoading}
                  isCalling={isCalling && callFuncName === item.name}
                />
              </Grid>
            );
          }
        })}
    </>
  );
}
