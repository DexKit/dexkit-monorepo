import { ChainId } from "@dexkit/core/constants";

export type FunctionInput = {
  type: string;
  name: string;
};

export interface CallParams {
  name: string;
  args: any[];
  call: boolean;
  payable?: boolean;
}

export interface ContractDeployParams {
  args: any[];
  payable?: boolean;
}

export type AbiFragmentInput = {
  type: string;
  name: string;
  internalType?: string;
};

export type FragmentOutput = {
  internalType?: string;
  name?: string;
  type?: string;
};

export interface AbiFragment {
  type: "function" | "constructor";
  name: string;
  inputs: AbiFragmentInput[];
  outputs: FragmentOutput[];
  stateMutability: string;
}

export interface ContractFormFieldInputBase {
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldSwitch {
  inputType: "switch";
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldNormal {
  inputType: "normal";
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputAddress {
  inputType: "address";
  addresses: string[];
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputDecimal {
  inputType: "decimal";
  decimals: number;
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputConnectedAccount {
  inputType: "connectedAccount";
  label: string;
  defaultValue: string;
}

export type ContractFormFieldInput =
  | ContractFormFieldNormal
  | ContractFormFieldSwitch
  | ContractFormFieldInputAddress
  | ContractFormFieldInputDecimal
  | ContractFormFieldInputConnectedAccount;

export type NoOutputType = {
  type: "";
};

export type DecimalOutputType = {
  type: "decimal";
  decimals: number;
};

export type OutputType = NoOutputType | DecimalOutputType;

export type ContractFormField = {
  name: string;
  description?: string;
  visible: boolean;
  lockInputs: boolean;
  hideInputs: boolean;
  callOnMount: boolean;
  collapse: boolean;
  hideLabel: boolean;
  callToAction: string;
  output?: OutputType;
  input: {
    [key: string]: ContractFormFieldInput;
  };
};

export type ContractFormParams = {
  contractAddress: string;
  disableProxy?: boolean;
  chainId: ChainId;
  fields: {
    [key: string]: ContractFormField;
  };
  abi: AbiFragment[];
};

export type DeployableContract = {
  name: string;
  description: string;
  publisherIcon: string;
  publisherName: string;
  slug: string;
};
