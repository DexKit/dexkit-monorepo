import type { NextPage } from 'next';

import MainLayout from '@/modules/common/components/layouts/MainLayout';

import AppPageHeader from '@/modules/common/components/AppPageHeader';
import DexkitLogo from '@/modules/common/components/icons/DexkitLogo';
import MagicNetworkSelect from '@/modules/common/components/MagicNetworkSelect';
import { getNormalizedUrl } from '@/modules/common/utils';
import KittygotchiImage from '@/modules/kittygotchi/components/KittygotchiImage';
import KittygotchiTrait from '@/modules/kittygotchi/components/KittygotchiTrait';
import KittygotchiTraitSelector from '@/modules/kittygotchi/components/KittygotchiTraitSelector';
import {
  GET_KITTYGOTCHI_CONTRACT_ADDR,
  KittygotchiTraits,
  KittygotchiTraitType,
  KITTYGOTCHI_EDIT_MIN_AMOUNT,
} from '@/modules/kittygotchi/constants';
import {
  useKitHolding,
  useKittygotchi,
  useKittygotchiStyleEdit,
  useKittygotchiUpdate,
} from '@/modules/kittygotchi/hooks';
import { isKittygotchiNetworkSupported } from '@/modules/kittygotchi/utils';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const KittygotchiEditPage: NextPage = () => {
  const router = useRouter();

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [isEditing, setIsEditing] = useState(false);

  const { id } = router.query;

  const { account, chainId, provider } = useWeb3React();

  const updateKittygotchi = useKittygotchiUpdate();

  const kittygotchi = useKittygotchi({
    chainId,
    id: id as string,
    kittyAddress: GET_KITTYGOTCHI_CONTRACT_ADDR(chainId),
    provider,
  });

  const kitHolding = useKitHolding(account);

  const kittyStyles = useKittygotchiStyleEdit();

  const kitAmount = useMemo(() => {
    if (kitHolding.data && kitHolding.data.length) {
      return Number(ethers.utils.formatEther(kitHolding.data[0].balance));
    }
    return 0;
  }, [kitHolding?.data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveKittygotchi = async () => {
    await updateKittygotchi.mutateAsync(
      {
        id: id as string,
        params: kittyStyles.params,
        callbacks: {},
      },
      {
        onError: (err) => {
          enqueueSnackbar(
            formatMessage({
              id: 'error.while.updating.kittygotchi',
              defaultMessage: 'Error while updating kittygotchi',
            }),
            { variant: 'error' }
          );
        },
      }
    );

    enqueueSnackbar(
      formatMessage({
        id: 'kittygotchi.updated',
        defaultMessage: 'Kittygotchi Updated',
      }),
      { variant: 'success' }
    );
  };

  useEffect(() => {
    if (kittygotchi.data) {
      kittyStyles.fromTraits(kittygotchi.data.attributes);
    }
  }, [kittygotchi.data]);

  return (
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
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
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
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {kitAmount < KITTYGOTCHI_EDIT_MIN_AMOUNT &&
                  isKittygotchiNetworkSupported(chainId) ? (
                    <Alert severity="info">
                      <FormattedMessage
                        id="you.need.at.least.amount.to.edit.your.kittygotchi"
                        defaultMessage="You need at least {amount} to edit your Kittygotchi"
                        values={{
                          amount: (
                            <strong>{KITTYGOTCHI_EDIT_MIN_AMOUNT} KIT</strong>
                          ),
                        }}
                      />
                    </Alert>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={(theme) => ({
                      height: '100%',
                      width: '100%',
                    })}
                  >
                    <Stack spacing={2}>
                      <Card>
                        <CardContent>
                          {kittygotchi.isLoading ? (
                            <Skeleton
                              variant="rectangular"
                              sx={{ height: '100%', width: '100%' }}
                            />
                          ) : kittyStyles.isEmpty() ? (
                            <Box>
                              <img
                                alt="EMPTY"
                                src={getNormalizedUrl(
                                  kittygotchi.data?.image || ''
                                )}
                                style={{ height: '100%', width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <KittygotchiImage
                              images={kittyStyles.getImageArray()}
                            />
                          )}
                        </CardContent>
                      </Card>
                      {isEditing ? (
                        <Stack spacing={2}>
                          <Button
                            onClick={handleSaveKittygotchi}
                            variant="contained"
                            color="primary"
                            disabled={updateKittygotchi.isLoading}
                            startIcon={
                              updateKittygotchi.isLoading ? (
                                <CircularProgress color="inherit" size="1rem" />
                              ) : undefined
                            }
                          >
                            <FormattedMessage id="save" defaultMessage="Save" />
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outlined"
                            color="primary"
                          >
                            <FormattedMessage
                              id="cancel"
                              defaultMessage="Cancel"
                            />
                          </Button>
                        </Stack>
                      ) : (
                        <Button
                          disabled={
                            kittygotchi.isLoading ||
                            kitAmount < KITTYGOTCHI_EDIT_MIN_AMOUNT
                          }
                          onClick={handleEdit}
                          variant="contained"
                        >
                          <FormattedMessage id="edit" defaultMessage="Edit" />
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="overline" color="text.secondary">
                            <FormattedMessage
                              id="kit.balance"
                              defaultMessage="Kit balance"
                            />
                          </Typography>
                          <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center"
                          >
                            <Avatar>
                              <DexkitLogo color="action" />
                            </Avatar>
                            <Typography variant="h5">{kitAmount}</Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography gutterBottom variant="h5">
                            Kittygotchi #{kittygotchi.data?.id}
                          </Typography>
                          {kittygotchi.data?.description}
                        </CardContent>
                      </Card>
                    </Grid>
                    {isEditing ? (
                      <Grid item xs={12}>
                        <Fade in>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <KittygotchiTraitSelector
                                kitHolding={
                                  kitHolding.data && kitHolding.data?.length > 0
                                    ? kitAmount
                                    : 0
                                }
                                title={formatMessage({
                                  id: 'accessories',
                                  defaultMessage: 'Accessories',
                                })}
                                traitType={KittygotchiTraitType.ACCESSORIES}
                                items={
                                  KittygotchiTraits[
                                    KittygotchiTraitType.ACCESSORIES
                                  ]
                                }
                                onSelect={kittyStyles.handleSelectAccessory}
                                value={kittyStyles?.accessory}
                                disabled={!isEditing}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <KittygotchiTraitSelector
                                kitHolding={
                                  kitHolding.data && kitHolding.data?.length > 0
                                    ? kitAmount
                                    : 0
                                }
                                traitType={KittygotchiTraitType.NOSE}
                                title={formatMessage({
                                  id: 'noses',
                                  defaultMessage: 'Noses',
                                })}
                                items={
                                  KittygotchiTraits[KittygotchiTraitType.NOSE]
                                }
                                onSelect={kittyStyles.handleSelectNose}
                                value={kittyStyles?.nose}
                                disabled={!isEditing}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <KittygotchiTraitSelector
                                kitHolding={
                                  kitHolding.data && kitHolding.data?.length > 0
                                    ? kitAmount
                                    : 0
                                }
                                traitType={KittygotchiTraitType.EARS}
                                title={formatMessage({
                                  id: 'ears',
                                  defaultMessage: 'Ears',
                                })}
                                items={
                                  KittygotchiTraits[KittygotchiTraitType.EARS]
                                }
                                onSelect={kittyStyles.handleSelectEars}
                                value={kittyStyles.ears}
                                disabled={!isEditing}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <KittygotchiTraitSelector
                                kitHolding={
                                  kitHolding.data && kitHolding.data?.length > 0
                                    ? kitAmount
                                    : 0
                                }
                                traitType={KittygotchiTraitType.EYES}
                                title={formatMessage({
                                  id: 'eyes',
                                  defaultMessage: 'Eyes',
                                })}
                                items={
                                  KittygotchiTraits[KittygotchiTraitType.EYES]
                                }
                                onSelect={kittyStyles.handleSelectEyes}
                                value={kittyStyles.eyes}
                                disabled={!isEditing}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <KittygotchiTraitSelector
                                kitHolding={
                                  kitHolding.data && kitHolding.data?.length > 0
                                    ? kitAmount
                                    : 0
                                }
                                traitType={KittygotchiTraitType.CLOTHES}
                                title={formatMessage({
                                  id: 'clothes',
                                  defaultMessage: 'Clothes',
                                })}
                                items={
                                  KittygotchiTraits[
                                    KittygotchiTraitType.CLOTHES
                                  ]
                                }
                                onSelect={kittyStyles.handleSelectCloth}
                                value={kittyStyles.cloth}
                                disabled={!isEditing}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <KittygotchiTraitSelector
                                kitHolding={
                                  kitHolding.data && kitHolding.data?.length > 0
                                    ? kitAmount
                                    : 0
                                }
                                traitType={KittygotchiTraitType.MOUTH}
                                title={formatMessage({
                                  id: 'mouths',
                                  defaultMessage: 'Mouths',
                                })}
                                items={
                                  KittygotchiTraits[KittygotchiTraitType.MOUTH]
                                }
                                onSelect={kittyStyles.handleSelectMouth}
                                value={kittyStyles.mouth}
                                disabled={!isEditing}
                              />
                            </Grid>
                          </Grid>
                        </Fade>
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <Grid container alignItems="stretch" spacing={2}>
                          {kittygotchi.isLoading
                            ? new Array(6)
                                .fill(null)
                                .map((i: any, index: number) => (
                                  <Grid xs={4} key={index} item>
                                    <KittygotchiTrait loading />
                                  </Grid>
                                ))
                            : kittygotchi.data?.attributes.map(
                                (attr: any, index: number) => (
                                  <Grid key={index} item xs={4}>
                                    <KittygotchiTrait
                                      traitType={attr.trait_type}
                                      value={attr.value}
                                    />
                                  </Grid>
                                )
                              )}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </MainLayout>
  );
};

export default KittygotchiEditPage;
