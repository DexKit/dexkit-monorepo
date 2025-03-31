import { profileNftAtom } from '@/modules/common/atoms';
import OpenSea from '@/modules/common/components/icons/OpenSea';
import Link from '@/modules/common/components/Link';
import { ChainId } from '@/modules/common/constants/enums';
import { useNotifications } from '@/modules/common/hooks/app';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';
import {
  getNativeTokenSymbol,
  getNormalizedUrl,
  isAddressEqual,
} from '@/modules/common/utils';
import { GET_KITTYGOTCHI_CONTRACT_ADDR } from '@/modules/kittygotchi/constants';
import {
  useKittygotchiFeed,
  useKittygotchiMint,
} from '@/modules/kittygotchi/hooks';
import {
  getKittygotchiMetadataEndpoint,
  GET_KITTYGOTCHI_MINT_RATE,
} from '@/modules/kittygotchi/utils';
import EvmTransferNftDialog from '@/modules/wallet/components/dialogs/EvmTransferNftDialog';
import { useNativeBalanceQuery } from '@/modules/wallet/hooks/balances';
import { Add, ChevronRight, Edit, FoodBank, Send } from '@mui/icons-material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { useAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  chainId?: number;
}

export default function KittygotchiProfileCard({ chainId }: Props) {
  const mintKittygotchi = useKittygotchiMint();

  const balance = useNativeBalanceQuery();

  const { enqueueSnackbar } = useSnackbar();
  const { addNotification } = useNotifications();

  const [showSendNft, setShowSendNft] = useState(false);

  const { formatMessage } = useIntl();

  const { provider, account } = useWeb3React();

  const ratio = useMemo(() => {
    return GET_KITTYGOTCHI_MINT_RATE(chainId);
  }, [chainId]);

  const [profileNft, setProfileNft] = useAtom(profileNftAtom);

  const kittygotchiFeed = useKittygotchiFeed({
    chainId,
    provider,
    kittyAddress: GET_KITTYGOTCHI_CONTRACT_ADDR(chainId),
  });

  const handleMintKittygotchi = () => {
    mintKittygotchi.mutate(
      {
        callbacks: {
          onConfirmation: async (hash?: string, tokenId?: number) => {
            const contractAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

            if (chainId && tokenId && contractAddress) {
              const endpoint = getKittygotchiMetadataEndpoint(chainId);
              const metadata = (
                await axios.get<{ image: string }>(`${endpoint}/${tokenId}`)
              ).data;

              setProfileNft({
                chainId,
                tokenId: tokenId.toString(),
                contractAddress,
                image: getNormalizedUrl(metadata.image),
              });
            }
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
        onError: (err) => {
          enqueueSnackbar(
            formatMessage(
              { id: 'error.message', defaultMessage: 'Error: {message}' },
              { message: String(err) }
            ),
            { variant: 'error' }
          );
        },
      }
    );
  };

  const handleFeed = () => {
    if (profileNft) {
      kittygotchiFeed.mutate(
        {
          id: profileNft.tokenId,
          callbacks: {
            onSubmit: (hash?: string) => {
              if (hash && chainId) {
                const now = Date.now();
                addNotification({
                  notification: {
                    type: AppNotificationType.Transaction,
                    title: formatMessage(
                      {
                        defaultMessage: 'Feed kittygotchi #{id}',
                        id: 'feed.kittygotchi.id',
                      },
                      { id: profileNft?.tokenId as string }
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
            },
          },
        },
        {
          onError: (error: any) => {
            if (error) {
              enqueueSnackbar(
                formatMessage(
                  {
                    id: 'error.while.feeding',
                    defaultMessage: 'Error while feeding',
                  },
                  { message: String(error) }
                ),
                { variant: 'error' }
              );
            }
          },
        }
      );
    }
  };

  const hasSufficientFunds = useMemo(() => {
    return balance.data?.gte(ratio);
  }, [ratio, balance.data]);

  const handleOpenSendNft = () => {
    setShowSendNft(true);
  };

  const handleCloseSendNft = () => {
    setShowSendNft(false);
  };

  const handleOwnershipChange = (ownerAddress: string) => {
    if (isAddressEqual(ownerAddress, account)) {
      setProfileNft(undefined);
    }
  };

  return (
    <>
      <EvmTransferNftDialog
        DialogProps={{
          open: showSendNft,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseSendNft,
        }}
        contractAddress={GET_KITTYGOTCHI_CONTRACT_ADDR(chainId)}
        tokenId={profileNft?.tokenId}
        provider={provider}
        account={account}
        chainId={chainId}
        onOwnershipChange={handleOwnershipChange}
      />
      <Card>
        <CardHeader
          title={
            <FormattedMessage
              id="my.kittygotchies"
              defaultMessage="My Kittygotchies"
            />
          }
          action={
            <Button
              LinkComponent={Link}
              href="/kittygotchi"
              endIcon={<ChevronRight />}
            >
              <FormattedMessage id="view.more" defaultMessage="View More" />
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {profileNft ? (
            <Stack spacing={2} alignItems="center">
              <Avatar
                sx={(theme) => ({
                  width: theme.spacing(20),
                  height: theme.spacing(20),
                  backgroundColor: theme.palette.action.hover,
                })}
                src={profileNft.image}
              />
              <Typography variant="h5">
                Kittygotchi #{profileNft.tokenId}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Tooltip
                  title={<FormattedMessage id="feed" defaultMessage="Feed" />}
                >
                  <IconButton
                    disabled={kittygotchiFeed.isLoading}
                    onClick={handleFeed}
                  >
                    {kittygotchiFeed.isLoading ? (
                      <CircularProgress color="inherit" size="1rem" />
                    ) : (
                      <FoodBank />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={<FormattedMessage id="edit" defaultMessage="Edit" />}
                >
                  <IconButton
                    LinkComponent={Link}
                    href={`/kittygotchi/${profileNft.tokenId}/edit`}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={
                    <FormattedMessage id="transfer" defaultMessage="Transfer" />
                  }
                >
                  <IconButton onClick={handleOpenSendNft}>
                    <Send />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={
                    <FormattedMessage
                      id="view.on.opensea"
                      defaultMessage="View on OpenSea"
                    />
                  }
                >
                  <IconButton
                    LinkComponent={Link}
                    href={`https://opensea.io/assets/${
                      chainId === ChainId.Polygon
                        ? 'matic'
                        : chainId === ChainId.Mumbai
                        ? 'mumbai'
                        : 'ethereum'
                    }/${GET_KITTYGOTCHI_CONTRACT_ADDR(chainId)}/${
                      profileNft.tokenId
                    }`}
                    target="_blank"
                  >
                    <OpenSea />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={2}>
              <TipsAndUpdatesIcon fontSize="large" />
              <Stack alignItems="center">
                <Typography align="center" variant="h5">
                  <FormattedMessage
                    id="create.a.kittygotchi"
                    defaultMessage="Create a Kittygotchi"
                  />
                </Typography>
                <Typography
                  align="center"
                  variant="body1"
                  color="text.secondary"
                >
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
          )}
        </CardContent>
      </Card>
    </>
  );
}
