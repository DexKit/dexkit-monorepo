import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { parseEther } from "@dexkit/core/utils/ethers/parseEther";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { BigNumber, providers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { useCallOnMountFields, useContractCallMutation } from "../hooks";
import { CallParams, ContractFormParams } from "../types";

import { useSnackbar } from "notistack";
import CallConfirmDialog from "./CallConfirmDialog";
import ContractFormFunctions from "./ContractFormFunctions";

import { AppConfirmDialog } from "@dexkit/ui/components";
import { FormattedMessage } from "react-intl";

export interface Props {
  params: ContractFormParams;
}

export default function ContractFormView({ params }: Props) {
  const { abi, contractAddress, chainId: contractChainId } = params;
  const { provider, chainId, signer } = useWeb3React();

  const [showConfirm, setShowConfirm] = useState(false);

  const rpcProvider = useMemo(() => {
    let network = NETWORKS[contractChainId];

    if (network) {
      return new providers.JsonRpcProvider(network.providerRpcUrl);
    }
  }, [contractChainId]);

  const [results, setResults] = useState<{ [key: string]: any }>({});

  let callOnMountQuery = useCallOnMountFields({
    contractAddress,
    abi,
    params,
    provider: rpcProvider,
    onSuccess: (results) => {
      setResults((res) => {
        return { ...res, ...results };
      });
    },
  });

  const contractCallMutation = useContractCallMutation({
    signer,
    contractAddress,
    abi,
    onSuccess: ({ name, result }: { name: string; result: any }) => {
      if (result.hash) {
        setResults((results) => {
          return { ...results, [name]: result.hash };
        });
      } else {
        setResults((results) => {
          return { ...results, [name]: result };
        });
      }
    },
  });

  const [callParams, setCallParams] = useState<CallParams>();

  const switchNetworkMutation = useSwitchNetworkMutation();

  const { enqueueSnackbar } = useSnackbar();

  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);

  const handleConfirmSwitchNetwork = async () => {
    try {
      await switchNetworkMutation.mutateAsync({ chainId: params.chainId });
      setShowConfirmSwitch(false);
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const handleCloseConfirmSwitch = () => {
    setShowConfirmSwitch(false);
  };

  const handleCall = useCallback(
    async (callParams: CallParams) => {
      setCallParams(callParams);

      if (params.chainId !== chainId && callParams && callParams.call) {
        setShowConfirmSwitch(true);
        return;
      }

      if (callParams && callParams.call) {
        setShowConfirm(true);
      } else {
        try {
          await contractCallMutation.mutateAsync({
            ...callParams,
            rpcProvider,
          });
        } catch (err) {
          enqueueSnackbar(String(err), { variant: "error" });
        }
      }

      await callOnMountQuery.refetch();
    },
    [chainId, params.chainId, callOnMountQuery, rpcProvider]
  );

  const handleConfirm = useCallback(
    async (value: BigNumber) => {
      if (callParams && callParams.call) {
        setShowConfirm(false);
        await contractCallMutation.mutateAsync({ ...callParams, value });
      }
    },
    [callParams]
  );

  const handleClose = () => {
    setShowConfirm(false);
    setCallParams(undefined);
  };

  const execLabel =
    callParams?.name &&
    params.fields[callParams?.name] &&
    params.fields[callParams?.name].callToAction
      ? params.fields[callParams?.name].callToAction
      : callParams?.name;

  const defaultPayableAmount = useMemo(() => {
    if (
      callParams?.name &&
      params.fields[callParams.name] &&
      params.fields[callParams.name].payableAmount !== undefined
    ) {
      return parseEther(params.fields[callParams.name].payableAmount || "0.0");
    }
  }, [params, callParams]);

  return (
    <Box>
      {showConfirm && (
        <CallConfirmDialog
          DialogProps={{
            open: showConfirm,
            onClose: handleClose,
            fullWidth: true,
            maxWidth: "sm",
          }}
          onConfirm={handleConfirm}
          execLabel={execLabel}
          payable={callParams?.payable}
          payableAmount={defaultPayableAmount}
        />
      )}

      <AppConfirmDialog
        DialogProps={{
          open: showConfirmSwitch,
          onClose: handleCloseConfirmSwitch,
          maxWidth: "sm",
          fullWidth: true,
        }}
        onConfirm={handleConfirmSwitchNetwork}
        isConfirming={switchNetworkMutation.isLoading}
        title={
          <FormattedMessage
            id="switch.network"
            defaultMessage="switch.network"
          />
        }
      >
        <FormattedMessage
          id="do.you.really.want.to.switch.to.network"
          defaultMessage="Do you really want to switch to {network}?"
          values={{
            network: (
              <strong>
                {params.chainId && NETWORKS[params.chainId]
                  ? NETWORKS[params.chainId].name
                  : undefined}
              </strong>
            ),
          }}
        />
      </AppConfirmDialog>
      <Grid container spacing={1}>
        <ContractFormFunctions
          abi={abi}
          onCall={handleCall}
          params={params}
          results={results}
          chainId={chainId}
          isResultsLoading={callOnMountQuery.isLoading}
          isCalling={
            contractCallMutation.isLoading || switchNetworkMutation.isLoading
          }
          callFuncName={callParams?.name}
        />
      </Grid>
    </Box>
  );
}
