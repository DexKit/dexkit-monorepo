import { Box, Button } from "@mui/material";

import { ChainId } from "@dexkit/core/constants";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { BigNumber, Contract } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useContractDeployMutation } from "../hooks";
import { AbiFragment, ContractDeployParams } from "../types";
import CallConfirmDialog from "./CallConfirmDialog";
import ContractConstructor from "./ContractConstructor";

export interface ContractDeployFormProps {
  abi: AbiFragment[];
  contractType: string;
  contractBytecode: string;
  onContractCreated?: (contract: Contract) => void;
}

export default function ContractDeployForm({
  abi,
  contractType,
  contractBytecode,
  onContractCreated,
}: ContractDeployFormProps) {
  const { signer, chainId } = useWeb3React();

  const [showConfirm, setShowConfirm] = useState(false);

  const contractDeployMutation = useContractDeployMutation({
    signer,
    contractBytecode,
    abi,
    onContractCreated,
  });

  const [deployParams, setDeployParams] = useState<ContractDeployParams>();

  const handleCall = useCallback(async (params: ContractDeployParams) => {
    setDeployParams(params);
    setShowConfirm(true);
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = async (value: BigNumber) => {
    if (deployParams) {
      try {
        setShowConfirm(false);
        await contractDeployMutation.mutateAsync({
          params: deployParams,
          value,
        });
        setDeployParams(undefined);
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
      }
    }
  };

  const handleClose = () => {
    setShowConfirm(false);
    setDeployParams(undefined);
  };

  const switchNetworkMutation = useSwitchNetworkMutation();

  const handleSwitchNetwork = async (chainId?: ChainId) => {
    await switchNetworkMutation.mutateAsync({ chainId: chainId as number });
  };

  const renderForm = () => {
    const contractConstructor = abi?.find((i) => i.type === "constructor");

    if (contractConstructor) {
      return (
        <ContractConstructor
          inputs={contractConstructor.inputs}
          name={contractConstructor.name}
          stateMutability={contractConstructor.stateMutability}
          onCall={handleCall}
          chainId={chainId}
          onSwitchNetwork={handleSwitchNetwork}
          isLoading={
            switchNetworkMutation.isLoading || contractDeployMutation.isLoading
          }
          params={{ inputs: {} }}
        />
      );
    }
    return (
      <Box>
        <Button
          onClick={() => handleCall({ args: [] })}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="deploy" defaultMessage="Deploy" />
        </Button>
      </Box>
    );
  };

  return (
    <Box>
      <CallConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: "sm",
        }}
        onConfirm={handleConfirm}
        payable={deployParams?.payable}
      />
      {renderForm()}
    </Box>
  );
}
