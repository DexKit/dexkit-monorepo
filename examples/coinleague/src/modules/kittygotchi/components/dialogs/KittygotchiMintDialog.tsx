import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import { getNativeTokenSymbol } from '@/modules/common/utils';
import { GET_KITTYGOTCHI_CONTRACT_ADDR } from '@/modules/kittygotchi/constants';

import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

import { useNotifications } from '@/modules/common/hooks/app';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';
import { useNativeBalanceQuery } from '@/modules/wallet/hooks/balances';
import { Add } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useKittygotchiMint } from '../../hooks';
import {
  getKittygotchiMetadataEndpoint,
  GET_KITTYGOTCHI_MINT_RATE,
} from '../../utils';

interface Props {
  DialogProps: DialogProps;
}

export default function KittygotchiMintDialog({ DialogProps }: Props) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const mintKittygotchi = useKittygotchiMint();

  const balance = useNativeBalanceQuery();

  const { enqueueSnackbar } = useSnackbar();
  const { addNotification } = useNotifications();

  const { formatMessage } = useIntl();

  const { chainId } = useWeb3React();

  const ratio = useMemo(() => {
    return GET_KITTYGOTCHI_MINT_RATE(chainId);
  }, [chainId]);

  const handleMintKittygotchi = async () => {
    await mintKittygotchi.mutateAsync(
      {
        callbacks: {
          onConfirmation: async (hash?: string, tokenId?: number) => {
            const contractAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

            if (chainId && tokenId && contractAddress) {
              const endpoint = getKittygotchiMetadataEndpoint(chainId);
              const metadata = (
                await axios.get<{ image: string }>(`${endpoint}${tokenId}`)
              ).data;

              if (tokenId) {
                enqueueSnackbar(
                  formatMessage(
                    {
                      id: 'kittygotchi.id.created',
                      defaultMessage: 'Kittygotchi #{id} created',
                    },
                    { id: tokenId }
                  ),
                  { variant: 'success' }
                );
              }
            }
            handleClose();
          },
          onSubmit: (hash?: string) => {
            if (chainId && hash) {
              const now = Date.now();

              addNotification({
                notification: {
                  type: AppNotificationType.Transaction,
                  title: formatMessage({
                    defaultMessage: 'Minting Kittygotchi',
                    id: 'minting.kittygotchi',
                  }) as string,
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
          },
        },
      },
      {
        onError: (err: any) => {
          enqueueSnackbar(
            formatMessage(
              {
                id: 'error.while.minting',
                defaultMessage: 'Error while minting',
              },
              { message: String(err) }
            ),
            { variant: 'error' }
          );
        },
      }
    );
  };

  const hasSufficientFunds = useMemo(() => {
    return balance.data?.gte(ratio);
  }, [ratio, balance.data]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="preview" defaultMessage="Create Kittygotchi" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack alignItems="center" spacing={2}>
          <TipsAndUpdatesIcon fontSize="large" />
          <Stack alignItems="center">
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="create.a.kittygotchi"
                defaultMessage="Create a Kittygotchi"
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="you.will.need.amount.to.create.a.kittygotchi"
                defaultMessage="You will need {amount} to create a Kittygotchi"
                values={{
                  amount: (
                    <strong>
                      {ethers.utils.formatEther(ratio)}{' '}
                      {getNativeTokenSymbol(chainId)}
                    </strong>
                  ),
                }}
              />
            </Typography>
          </Stack>
          <Button
            onClick={handleMintKittygotchi}
            disabled={mintKittygotchi.isLoading || !hasSufficientFunds}
            startIcon={
              mintKittygotchi.isLoading ? (
                <CircularProgress color="inherit" size="1rem" />
              ) : (
                <Add />
              )
            }
            variant="outlined"
            color="inherit"
          >
            {mintKittygotchi.isLoading ? (
              <FormattedMessage id="creating" defaultMessage="Creating" />
            ) : (
              <FormattedMessage id="create" defaultMessage="Create" />
            )}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
