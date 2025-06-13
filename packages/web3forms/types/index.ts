import { ChainId } from "@dexkit/core/constants";

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

export type BaseAbiFragmentInput = {
  type: string;
  name: string;
  internalType?: string;
};

export type TupleAbiFragmentInput = {
  type: "tuple";
  name: string;
  internalType?: string;
  components: AbiFragmentInput[];
};

export type AbiFragmentInput = BaseAbiFragmentInput | TupleAbiFragmentInput;

export type FunctionInput = AbiFragmentInput;

export type FragmentOutput = {
  internalType?: string;
  name?: string;
  type?: string;
};

export interface AbiFragment {
  type: string;
  name: string;
  inputs: (AbiFragmentInput | TupleAbiFragmentInput)[];
  outputs: FragmentOutput[];
  stateMutability: string;
}

export interface ContractFormFieldInputBase {
  label: string;
  defaultValue: any;
}

export interface ContractFormFieldSwitch extends ContractFormFieldInputBase {
  inputType: "switch";
  label: string;
  defaultValue: any;
}

export interface ContractFormFieldNormal extends ContractFormFieldInputBase {
  inputType: "normal";
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputAddress
  extends ContractFormFieldInputBase {
  inputType: "address";
  addresses: string[];
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputDecimal
  extends ContractFormFieldInputBase {
  inputType: "decimal";
  decimals: number;
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputConnectedAccount
  extends ContractFormFieldInputBase {
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

export type ContractFormFieldInputWithTupleParams = ContractFormFieldInput & {
  tupleParams?: { [key: string]: ContractFormFieldInput };
};

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
  payableAmount?: string;
  visible: boolean;
  lockInputs: boolean;
  hideInputs: boolean;
  callOnMount: boolean;
  collapse: boolean;
  hideLabel: boolean;
  callToAction: string;
  output?: OutputType;
  input: {
    [key: string]: ContractFormFieldInputWithTupleParams;
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

export type ThirdWebDeployFormInputBase = {
  inputType: string;
  label?: string;
  locked?: boolean;
  helpText?: string;
};

export type ThirdWebDeployFormInputIpfs = ThirdWebDeployFormInputBase & {
  inputType: "json";
  ipfsUrl: string;
};

export type ThirdWebDeployFormInput = ThirdWebDeployFormInputIpfs;

export type ThirdWebDeployFormParams = {
  inputs: { [key: string]: ThirdWebDeployFormInput };
};

export type AddressInput = {
  type: "address";
  subtype?: "connected-address" | "string";
};

export type CheckboxInput = {
  type: "checkbox";
};

export type ImageInput = {
  type: "image";
};

export type ImageUrlInput = {
  type: "image-url";
};

export type MerkleTreeFileInput = {
  type: "merkle-tree-file";
};

export type MarkdownInput = {
  type: "markdown";
};

export type HiddenInput = {
  type: "hidden";
  subtype?: "connected-address" | "string";
};

export type AddressArrayInput = {
  type: "address-array";
};

export type DecimalInput = {
  type: "decimal";
  isPercentage?: boolean;
  decimals: number;
  maxDigits?: number;
};

export type SharesArray = {
  type: "shares-array";
  decimals: number;
};

export type InputComponent =
  | AddressInput
  | CheckboxInput
  | ImageInput
  | HiddenInput
  | AddressArrayInput
  | DecimalInput
  | ImageUrlInput
  | SharesArray
  | MerkleTreeFileInput
  | MarkdownInput
  ;

export type FormInput = {
  type: "input";
  ref: string | string[];
  locked: boolean;
  label: string;
  defaultValue?: any;
  component?: InputComponent;
  helperText?: string;
  col?: {
    sm?: number;
    xs?: number;
  };
};

export type FormInputGroup = {
  type: "input-group";
  inputs: FormInput[];
  col?: {
    sm?: number;
    xs?: number;
  };
};

export type FormElement = FormInput | FormInputGroup;

export type Form = {
  elements: FormElement[];
};

export type ObjectMapping = {
  name: string;
  type?: string;
  fields: {
    type?: string;
    name: string;
    fields?: string[];
    decimals?: number;
  }[];
};

export type FormOutputFormat = {
  objects: ObjectMapping[];
};

export type FormConfigParams = {
  paramsOrder: string[];
  output: ObjectMapping[];
  form: FormElement[];
  name: string;
  description: string;
};

export type ThirdwebContract = {
  factory: string;
  implementation: string;
};

export type ThirdwebMetadata = {
  name: string;
  metadataUri: string;
  bytecodeUri: string;
  analytics: {
    command: string;
    contract_name: string;
    cli_version: string;
    project_type: string;
    from_ci: boolean;
    uses_contract_extensions: boolean;
  };
  version: string;
  displayName: string;
  description: string;
  readme: string;
  changelog: string;
  audit: string;
  logo: string;
  isDeployableViaFactory: boolean;
  isDeployableViaProxy: boolean;
  factoryDeploymentData: {
    implementationAddresses: { [key: string]: string };
    implementationInitializerFunction: string;
    factoryAddresses: { [key: string]: string };
  };
  constructorParams: { [key: string]: any };
  publisher: string;
};

export type ValidatorFunc = (message: string) => void;
