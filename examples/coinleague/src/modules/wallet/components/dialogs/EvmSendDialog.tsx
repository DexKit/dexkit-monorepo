import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import CopyIconButton from '@/modules/common/components/CopyIconButton';
import { useNotifications } from '@/modules/common/hooks/app';
import {
  useErc20BalanceQuery,
  useEvmNativeBalance,
} from '@/modules/common/hooks/blockchain';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';
import { truncateAddress } from '@/modules/common/utils';
import { copyToClipboard } from '@/modules/common/utils/browser';
import FileCopy from '@mui/icons-material/FileCopy';

import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Connector } from '@web3-react/types';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CoinTypes } from '../../constants/enums';
import { useAccounts, useCoins, useEvmTransferMutation } from '../../hooks';
import { Coin, EvmCoin } from '../../types';
import { EvmSendForm } from '../forms/EvmSendForm';

interface Props {
  dialogProps: DialogProps;
  account?: string;
  chainId?: number;
  provider?: ethers.providers.Web3Provider;
  defaultCoin?: EvmCoin;
  connector?: Connector;
}

export default function EvmSendDialog({
  dialogProps,
  account,
  chainId,
  provider,
  defaultCoin,
  connector,
}: Props) {
  const { onClose } = dialogProps;

  const [values, setValues] = useState<{
    address?: string;
    amount?: number;
    coin: Coin | null;
  }>({ address: '', amount: 0, coin: null });

  useEffect(() => {
    if (defaultCoin) {
      setValues((values) => ({ ...values, coin: defaultCoin }));
    }
  }, [defaultCoin]);

  const { data: nativeBalance, isLoading: isNativeBalanceLoading } =
    useEvmNativeBalance({
      provider,
      account,
    });

  const { data: erc20Balance, isLoading } = useErc20BalanceQuery({
    provider,
    account,
    tokenAddress:
      values.coin?.coinType === CoinTypes.EVM_ERC20
        ? values.coin?.contractAddress
        : undefined,
  });

  const { enqueueSnackbar } = useSnackbar();

  const { addNotification } = useNotifications();

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
        id: 'transaction.submitted',
        defaultMessage: 'Transaction Submitted',
      }),
      {
        variant: 'info',
      }
    );
    if (chainId !== undefined) {
      const now = Date.now();

      addNotification({
        notification: {
          type: AppNotificationType.Transaction,
          title: formatMessage(
            {
              defaultMessage: 'Transfering {amount} {symbol} to {address}',
              id: 'transfering.amount.symbol.to.address',
            },
            {
              symbol: params.coin.symbol,
              amount: params.amount,
              address: truncateAddress(params.address),
            }
          ) as string,
          hash,
          checked: false,
          created: now,
          icon: 'receipt',
          body: '',
        },
        transaction: {
          status: TransactionStatus.Pending,
          created: now,
          chainId,
        },
      });
    }
  };

  const evmTransferMutation = useEvmTransferMutation({
    provider,
    onSubmit: handleSubmitTransaction,
  });

  const { formatMessage } = useIntl();

  const { evmAccounts } = useAccounts({});

  const handleCopy = () => {
    if (account) {
      copyToClipboard(account);
    }
  };

  const handleChange = (values: {
    address?: string;
    amount?: number;
    coin: Coin | null;
  }) => {
    setValues(values);
  };

  const handleSubmit = async () => {
    if (values.address && values.amount && values.coin) {
      try {
        await evmTransferMutation.mutateAsync({
          address: values.address,
          amount: values.amount,
          coin: values.coin as EvmCoin,
        });
      } catch (err: any) {
        enqueueSnackbar(
          formatMessage(
            {
              id: 'transaction.failed.reason',
              defaultMessage: 'Transaction failed: {reason}',
            },
            { reason: String(err) }
          ),
          {
            variant: 'error',
          }
        );
      }
    }
  };

  const { evmCoins: coins } = useCoins();

  const evmCoins = useMemo(() => {
    return coins.filter((c) => c.network.chainId === chainId);
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

    return '0.0';
  }, [erc20Balance, values.coin, nativeBalance]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');

      evmTransferMutation.reset();
      setValues({
        address: '',
        amount: 0,
        coin: defaultCoin ? defaultCoin : null,
      });
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={<FormattedMessage id="send" defaultMessage="Send" />}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Stack
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <Typography color="textSecondary" variant="caption">
              {truncateAddress(account)}{' '}
              <CopyIconButton
                iconButtonProps={{
                  onClick: handleCopy,
                  size: 'small',
                  color: 'inherit',
                }}
                tooltip={formatMessage({
                  id: 'copy',
                  defaultMessage: 'Copy',
                  description: 'Copy text',
                })}
                activeTooltip={formatMessage({
                  id: 'copied',
                  defaultMessage: 'Copied!',
                  description: 'Copied text',
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
            values={values}
            onChange={handleChange}
            coins={evmCoins}
            onSubmit={handleSubmit}
            connector={connector}
            chainId={chainId}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
