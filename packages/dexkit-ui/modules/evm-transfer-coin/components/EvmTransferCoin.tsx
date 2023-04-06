import { CoinTypes } from "@dexkit/core/constants";
import {
  useErc20BalanceQuery,
  useEvmNativeBalanceQuery,
} from "@dexkit/core/hooks";
import { Coin, EvmCoin } from "@dexkit/core/types";
import {
  buildEtherReceiveAddress,
  copyToClipboard,
  truncateAddress,
} from "@dexkit/core/utils";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import { useDexKitContext } from "@dexkit/ui/hooks";
import FileCopy from "@mui/icons-material/FileCopy";

import { Divider, Skeleton, Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useEvmTransferMutation } from "../hooks";
import { EvmSendForm } from "./forms/EvmSendForm";

export interface EvmTransferCoinProps {
  account?: string;
  ENSName?: string | null;
  chainId?: number;
  onSwitchNetwork?: ({ chainId }: { chainId?: number }) => void;
  onConnectWallet?: () => void;
  provider?: ethers.providers.Web3Provider;
  coins?: EvmCoin[];
  defaultCoin?: EvmCoin;
  evmAccounts?: { address: string }[];
  to?: string;
  amount?: number;
  onChangePaymentUrl?: (payment?: string) => void;
}

export default function EvmTransferCoin({
  account,
  ENSName,
  chainId,
  provider,
  evmAccounts,
  defaultCoin,
  coins,
  onSwitchNetwork,
  onConnectWallet,
  to,
  amount,
  onChangePaymentUrl,
}: EvmTransferCoinProps) {
  const { formatMessage } = useIntl();

  const [values, setValues] = useState<{
    address?: string;
    amount?: number;
    coin?: Coin | null;
  }>({ address: to, amount: amount, coin: defaultCoin });

  const { data: nativeBalance, isLoading: isNativeBalanceLoading } =
    useEvmNativeBalanceQuery({
      provider,
      account,
    });

  const { data: erc20Balance, isLoading } = useErc20BalanceQuery({
    provider,
    account,
    contractAddress:
      values.coin?.coinType === CoinTypes.EVM_ERC20
        ? values.coin?.contractAddress
        : undefined,
  });

  const { enqueueSnackbar } = useSnackbar();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const handleSubmitTransaction = (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    }
  ) => {
    enqueueSnackbar(
      formatMessage({
        id: "transaction.submitted",
        defaultMessage: "Transaction Submitted",
      }),
      {
        variant: "info",
      }
    );
    if (chainId !== undefined) {
      const values = {
        amount: params.amount.toString(),
        symbol: params.coin.symbol,
        address: params.address,
      };

      createNotification({
        type: "transaction",
        subtype: "transfer",
        icon: "receipt",
        metadata: { chainId, hash },
        values,
      });

      watchTransactionDialog.watch(hash);
    }
  };

  const evmTransferMutation = useEvmTransferMutation({
    provider,
    onSubmit: handleSubmitTransaction,
  });

  const handleCopy = () => {
    if (account) {
      if (ENSName) {
        copyToClipboard(ENSName);
      } else {
        copyToClipboard(account);
      }
    }
  };

  const handleChange = (values: {
    address?: string;
    amount?: number;
    coin?: Coin | null;
  }) => {
    setValues(values);
    if (onChangePaymentUrl) {
      onChangePaymentUrl(
        buildEtherReceiveAddress({
          receiver: values?.address,
          chainId: values?.coin?.network.chainId
            ? values?.coin?.network.chainId
            : chainId,
          amount: values?.amount
            ? values?.coin
              ? ethers.utils
                  .parseUnits(
                    values?.amount?.toString() || "0",
                    values.coin.decimals
                  )
                  .toString()
              : ethers.utils
                  .parseEther(values?.amount?.toString() || "0")
                  .toString()
            : undefined,
          contractAddress:
            values?.coin?.coinType === CoinTypes.EVM_ERC20
              ? values.coin.contractAddress
              : undefined,
        })
      );
    }
  };

  const handleSubmit = async () => {
    if (values.address && values.amount && values.coin) {
      try {
        const val = {
          amount: values.amount.toString(),
          symbol: values.coin.symbol,
          address: values.address,
        };
        watchTransactionDialog.open("transfer", val);
        await evmTransferMutation.mutateAsync({
          address: values.address,
          amount: values.amount,
          coin: values.coin as EvmCoin,
        });
      } catch (err: any) {
        const error = new Error(err);
        watchTransactionDialog.setError(error);
        enqueueSnackbar(
          formatMessage(
            {
              id: "transaction.failed.reason",
              defaultMessage: "Transaction failed",
            },
            { reason: String(err) }
          ),
          {
            variant: "error",
          }
        );
      }
    }
  };

  const evmCoins = useMemo(() => {
    return coins?.filter((c) => c.network.chainId === chainId);
  }, [coins]);

  const balance = useMemo(() => {
    if (values.coin) {
      if (values.coin.coinType === CoinTypes.EVM_ERC20 && erc20Balance) {
        return ethers.utils.formatUnits(erc20Balance, values.coin.decimals);
      } else if (
        values.coin.coinType === CoinTypes.EVM_NATIVE &&
        nativeBalance
      ) {
        return ethers.utils.formatUnits(nativeBalance, values.coin.decimals);
      }
    }

    return "0.0";
  }, [erc20Balance, values.coin, nativeBalance]);

  /* const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");

      evmTransferMutation.reset();
      setValues({
        address: "",
        amount: 0,
        coin: defaultCoin ? defaultCoin : null,
      });
    }
  };*/

  return (
    <Stack spacing={2}>
      <Stack justifyContent="center" alignItems="center" alignContent="center">
        <Typography color="textSecondary" variant="caption">
          {ENSName ? ENSName : truncateAddress(account)}{" "}
          <CopyIconButton
            iconButtonProps={{
              onClick: handleCopy,
              size: "small",
              color: "inherit",
            }}
            tooltip={formatMessage({
              id: "copy",
              defaultMessage: "Copy",
              description: "Copy text",
            })}
            activeTooltip={formatMessage({
              id: "copied",
              defaultMessage: "Copied!",
              description: "Copied text",
            })}
          >
            <FileCopy fontSize="inherit" color="inherit" />
          </CopyIconButton>
        </Typography>

        <Typography variant="h4">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              {balance} {values.coin?.symbol}
            </>
          )}
        </Typography>
      </Stack>
      <Divider />

      <EvmSendForm
        isSubmitting={evmTransferMutation.isLoading}
        accounts={evmAccounts}
        account={account}
        values={values}
        onChange={handleChange}
        onConnectWallet={onConnectWallet}
        onSwitchNetwork={onSwitchNetwork}
        coins={evmCoins}
        onSubmit={handleSubmit}
        chainId={chainId}
        balance={balance}
      />
    </Stack>
  );
}
