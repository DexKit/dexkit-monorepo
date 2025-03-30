import type { NextPage } from 'next';

import MainLayout from '@/modules/common/components/layouts/MainLayout';

import { profileNftAtom } from '@/modules/common/atoms';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import OpenSea from '@/modules/common/components/icons/OpenSea';
import Link from '@/modules/common/components/Link';
import MagicNetworkSelect from '@/modules/common/components/MagicNetworkSelect';
import MomentSpan from '@/modules/common/components/MomentSpan';
import { useNotifications } from '@/modules/common/hooks/app';
import { useNetworkProvider } from '@/modules/common/hooks/network';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';
import { getNormalizedUrl } from '@/modules/common/utils';
import { GET_KITTYGOTCHI_CONTRACT_ADDR } from '@/modules/kittygotchi/constants';
import {
  useKittygotchi,
  useKittygotchiFeed,
} from '@/modules/kittygotchi/hooks';
import EvmTransferNftDialog from '@/modules/wallet/components/dialogs/EvmTransferNftDialog';
import { ChainId } from '@0x/contract-addresses';
import { Check, Edit, FoodBank } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import Send from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const KittygotchiDetailPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const [showSendNft, setShowSendNft] = useState(false);

  const { chainId, provider, account } = useWeb3React();
  const rpcProvider = useNetworkProvider(chainId);
  const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

  const kittygotchi: any = useKittygotchi({
    id: id as string,
    kittyAddress,
    chainId,
    provider: rpcProvider,
  });

  const kittygotchiFeed = useKittygotchiFeed({
    chainId,
    provider,
    kittyAddress: GET_KITTYGOTCHI_CONTRACT_ADDR(chainId),
  });

  const { addNotification } = useNotifications();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const handleFeed = () => {
    kittygotchiFeed.mutate(
      {
        id: id as string,
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
                    { id: id as string }
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
          onConfirmation: () => {
            kittygotchi.refetch();
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
  };

  const [profileNft, setProfileNft] = useAtom(profileNftAtom);

  const isDefaultNft = useMemo(() => {
    if (profileNft && kittygotchi.data) {
      return (
        kittygotchi.data.id === profileNft.tokenId &&
        profileNft.contractAddress === GET_KITTYGOTCHI_CONTRACT_ADDR(chainId) &&
        profileNft.chainId === chainId
      );
    }
  }, [profileNft, kittygotchi.data]);

  const handleMakeDefault = () => {
    const contractAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

    if (isDefaultNft) {
      setProfileNft(undefined);
    } else if (
      chainId &&
      kittygotchi.data &&
      kittygotchi.data?.image &&
      contractAddress
    ) {
      setProfileNft({
        image: getNormalizedUrl(kittygotchi.data?.image),
        chainId,
        contractAddress,
        tokenId: kittygotchi.data.id,
      });

      enqueueSnackbar(
        formatMessage({
          id: 'your.kittygotchi.is.now.the.default.nft',
          defaultMessage: 'Your kittygotchi is now the default NFT',
        }),
        { variant: 'success' }
      );
    }
  };

  const handleShowSendNft = () => {
    setShowSendNft(true);
  };

  const handleCloseSendNft = () => {
    setShowSendNft(false);
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
        tokenId={id as string}
        provider={provider}
        account={account}
        chainId={chainId}
      />
      <MainLayout>
        <Stack spacing={2}>
          <Box>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <AppPageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="kittygotchi"
                        defaultMessage="Kittygotchi"
                      />
                    ),
                    uri: '/kittygotchi',
                  },
                  {
                    caption: kittygotchi.isLoading ? (
                      <Skeleton />
                    ) : (
                      `#${kittygotchi.data?.id}`
                    ),
                    active: true,
                    uri: '/kittygotchi',
                  },
                ]}
              />
              <MagicNetworkSelect SelectProps={{ size: 'small' }} />
            </Stack>
          </Box>

          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Stack alignItems="center" spacing={2}>
                      {kittygotchi.isLoading ? (
                        <Skeleton
                          variant="circular"
                          sx={(theme) => ({
                            width: theme.spacing(20),
                            height: theme.spacing(20),
                          })}
                        />
                      ) : (
                        <Avatar
                          sx={(theme) => ({
                            width: theme.spacing(20),
                            height: theme.spacing(20),
                            backgroundColor: theme.palette.action.hover,
                          })}
                          src={
                            kittygotchi.data?.image &&
                            getNormalizedUrl(kittygotchi.data?.image)
                          }
                        />
                      )}

                      <Stack direction="row" spacing={1}>
                        <Tooltip
                          title={
                            <FormattedMessage id="feed" defaultMessage="Feed" />
                          }
                        >
                          <IconButton
                            disabled={
                              kittygotchiFeed.isLoading || kittygotchi.isLoading
                            }
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
                          title={
                            <FormattedMessage id="edit" defaultMessage="Edit" />
                          }
                        >
                          <IconButton
                            disabled={kittygotchi.isLoading}
                            LinkComponent={Link}
                            href={`/kittygotchi/${kittygotchi.data?.id}/edit`}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            <FormattedMessage
                              id="transfer"
                              defaultMessage="Transfer"
                            />
                          }
                        >
                          <IconButton
                            disabled={kittygotchi.isLoading}
                            onClick={handleShowSendNft}
                          >
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
                            disabled={kittygotchi.isLoading}
                            LinkComponent={Link}
                            href={`https://opensea.io/assets/${
                              chainId === ChainId.Polygon
                                ? 'matic'
                                : chainId === ChainId.PolygonMumbai
                                ? 'mumbai'
                                : 'ethereum'
                            }/${GET_KITTYGOTCHI_CONTRACT_ADDR(chainId)}/${
                              id as string
                            }`}
                            target="_blank"
                          >
                            <OpenSea />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Card>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h5">
                          Kittygotchi #{kittygotchi.data?.id}
                        </Typography>
                        <Button
                          variant={isDefaultNft ? 'outlined' : 'contained'}
                          startIcon={isDefaultNft ? <Close /> : <Check />}
                          size="small"
                          onClick={handleMakeDefault}
                        >
                          {isDefaultNft ? (
                            <FormattedMessage
                              id="default.nft"
                              defaultMessage="Default NFT"
                            />
                          ) : (
                            <FormattedMessage
                              id="set.default"
                              defaultMessage="Set default"
                            />
                          )}
                        </Button>
                      </Stack>
                      <Stack spacing={1} direction="row">
                        <Stack>
                          <Typography color="text.secondary" variant="caption">
                            ATK
                          </Typography>
                          <Typography variant="h5">
                            {kittygotchi.isLoading ? (
                              <Skeleton />
                            ) : (
                              kittygotchi.data?.attack
                            )}
                          </Typography>
                        </Stack>
                        <Stack>
                          <Typography color="text.secondary" variant="caption">
                            DEF
                          </Typography>
                          <Typography variant="h5">
                            {kittygotchi.isLoading ? (
                              <Skeleton />
                            ) : (
                              kittygotchi.data?.defense
                            )}
                          </Typography>
                        </Stack>
                        <Stack>
                          <Typography color="text.secondary" variant="caption">
                            RUN
                          </Typography>
                          <Typography variant="h5">
                            {kittygotchi.isLoading ? (
                              <Skeleton />
                            ) : (
                              kittygotchi.data?.run
                            )}
                          </Typography>
                        </Stack>
                        <Stack>
                          <Typography color="text.secondary" variant="caption">
                            STR
                          </Typography>
                          <Typography variant="h5">
                            {kittygotchi.isLoading ? (
                              <Skeleton />
                            ) : (
                              kittygotchi.data &&
                              kittygotchi.data?.run +
                                kittygotchi.data?.attack +
                                kittygotchi.data?.defense
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography variant="body1">
                        <FormattedMessage
                          id="your.kittygotchi.is.hungry"
                          defaultMessage="Your kittygotchi is hungry!"
                        />{' '}
                        <FormattedMessage
                          id="last.time.you.fed.him.was"
                          defaultMessage="The last time you fed him was {lastTimeFeed}"
                          values={{
                            lastTimeFeed:
                              kittygotchi.data?.lastUpdated > 0 ? (
                                <MomentSpan
                                  from={moment(
                                    new Date(
                                      kittygotchi.data?.lastUpdated * 1000
                                    )
                                  )}
                                />
                              ) : (
                                <FormattedMessage
                                  id="never"
                                  defaultMessage="never"
                                />
                              ),
                          }}
                        />
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </MainLayout>
    </>
  );
};

export default KittygotchiDetailPage;
