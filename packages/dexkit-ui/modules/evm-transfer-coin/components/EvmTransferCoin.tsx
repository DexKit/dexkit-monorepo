import { useIsMobile } from "@dexkit/core";
import { CoinTypes } from "@dexkit/core/constants";
import { Coin, EvmCoin } from "@dexkit/core/types";
import {
  buildEtherReceiveAddress,
  copyToClipboard,
  truncateAddress,
} from "@dexkit/core/utils";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import { useDexKitContext } from "@dexkit/ui/hooks";
import FileCopy from "@mui/icons-material/FileCopy";

import { UserEvents } from "@dexkit/core/constants/userEvents";
import { parseEther } from "@dexkit/core/utils/ethers/parseEther";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { defineChain } from "thirdweb/chains";
import { useWalletBalance } from "thirdweb/react";
import { useTrackUserEventsMutation } from "../../../hooks/userEvents";
import { useEvmTransferMutation } from "../hooks";
import { EvmSendForm } from "./forms/EvmSendForm";

export interface EvmTransferCoinProps {
  account?: string;
  ENSName?: string | null;
  chainId?: number;
  onSwitchNetwork?: ({ chainId }: { chainId?: number }) => void;
  onConnectWallet?: () => void;
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
  const isMobile = useIsMobile();
  const theme = useTheme();

  const trackUserEventsMutation = useTrackUserEventsMutation();

  const [values, setValues] = useState<{
    address?: string | null;
    amount?: number;
    coin?: Coin | null;
  }>({ address: to, amount: amount, coin: defaultCoin });

  const balanceQuery = useWalletBalance({
    chain: chainId ? defineChain(chainId) : undefined,
    address: account,
    client,
  });

  const { data: erc20Balance, isLoading } = useWalletBalance({
    chain: chainId ? defineChain(chainId) : undefined,
    address: account,
    client,
    tokenAddress:
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
    onSubmit: handleSubmitTransaction,
    onConfirm: (
      hash: string,
      params: {
        address: string;
        amount: number;
        coin: Coin;
      }
    ) => {
      if (chainId !== undefined) {
        const values = {
          amount: params.amount.toString(),
          symbol: params.coin.symbol,
          address: params.address,
        };

        trackUserEventsMutation.mutate({
          event: UserEvents.transfer,
          hash: hash,
          chainId,
          metadata: JSON.stringify(values),
        });
      }
    },
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
    address?: string | null;
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
              ? parseUnits(
                values?.amount?.toString() || "0",
                values.coin.decimals
              ).toString()
              : parseEther(values?.amount?.toString() || "0").toString()
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
    if (values.address && values.amount && values.coin && chainId) {
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
          chainId,
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
        return erc20Balance.displayValue;
      } else if (
        values.coin.coinType === CoinTypes.EVM_NATIVE &&
        balanceQuery.data
      ) {
        return balanceQuery.data.displayValue;
      }
    }

    return "0.0";
  }, [erc20Balance, values.coin, values.coin?.coinType, balanceQuery.data]);

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
    <Stack spacing={isMobile ? 2.5 : 3}>
      <Box
        sx={{
          p: isMobile ? 2 : 2.5,
          backgroundColor: theme.palette.action.hover,
          borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(2),
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack justifyContent="center" alignItems="center" spacing={isMobile ? 1 : 1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              color="text.primary"
              variant={isMobile ? "caption" : "body2"}
              sx={{
                fontFamily: theme.typography.fontFamily,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {ENSName ? ENSName : truncateAddress(account)}
            </Typography>
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
              <FileCopy fontSize="small" color="inherit" />
            </CopyIconButton>
          </Stack>

          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              textAlign: 'center',
            }}
          >
            {isLoading ? (
              <Skeleton width={theme.spacing(15)} />
            ) : (
              <>
                {balance} {values.coin?.symbol}
              </>
            )}
          </Typography>
        </Stack>
      </Box>

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
        defaultCoin={defaultCoin}
      />
    </Stack>
  );
}