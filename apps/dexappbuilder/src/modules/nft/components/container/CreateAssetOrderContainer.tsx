const ImportAssetDialog = dynamic(
  () => import('@/modules/orders/components/dialogs/ImportAssetDialog'),
);
const OrderCreatedDialog = dynamic(
  () => import('@/modules/orders/components/dialogs/OrderCreatedDialog'),
);
import MakeListingForm from '@/modules/orders/components/forms/MakeListingForm';
import MakeOfferForm from '@/modules/orders/components/forms/MakeOfferForm';
import { useDexKitContext, useSignMessageDialog } from '@dexkit/ui/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Launch from '@mui/icons-material/Launch';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    ListItemButton,
    ListItemText,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { PostOrderResponsePayload } from '@traderxyz/nft-swap-sdk/dist/sdk/v4/orderbook';
import { BigNumber } from 'ethers';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
    getBlockExplorerUrl,
    getChainName,
    getChainSlug,
    isAddressEqual,
    truncateAddress,
} from '@dexkit/core/utils/blockchain';
import Link from '@dexkit/ui/components/AppLink';
import {
    useAccountAssetsBalance,
    useApproveAssetMutation,
    useFavoriteAssets,
    useMakeListingMutation,
    useMakeOfferMutation,
    useSwapSdkV4,
} from '@dexkit/ui/modules/nft/hooks';

import { getERC20Name, getERC20Symbol } from '@dexkit/core/services/balances';
import { Asset } from '@dexkit/core/types/nft';
import { ipfsUriToUrl } from '@dexkit/core/utils/ipfs';

export const CreateAssetOrderContainer = () => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [showImportAsset, setShowImportAsset] = useState(false);

  const [showOrderCreated, setShowOrderCreated] = useState(false);

  const [orderCreated, setOrderCreated] = useState<PostOrderResponsePayload>();

  const favorites = useFavoriteAssets();

  const { account, provider, chainId } = useWeb3React();

  const { accountAssets } = useAccountAssetsBalance(
    account ? [account] : [],
    false,
  );

  const nftSwapSdk = useSwapSdkV4(provider, chainId);

  const signMessageDialog = useSignMessageDialog();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { formatMessage } = useIntl();

  const assets = useMemo(() => {
    const favAssets =
      Object.keys(favorites.assets).map((key) => {
        return favorites.assets[key];
      }) || [];
    if (chainId) {
      return (
        accountAssets?.data
          ?.filter((a) => a.network === getChainSlug(chainId))
          .map((a) => a.assets as unknown as Asset)
          .filter((a) => a !== undefined)
          .flat() || []
      )
        .map((a) => {
          return {
            owner: account?.toLowerCase(),
            ...a,
          } as Asset;
        })
        .concat(favAssets);
    }
    return favAssets;
  }, [favorites.assets, accountAssets, chainId, account]);

  const handleChangeOption = (event: any, value: Asset | null) => {
    setAsset(value);
  };

  const handleToggleImportAsset = () => setShowImportAsset((value) => !value);

  const handleApproveAssetSuccess = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (asset !== null) {
        if (swapAsset.type === 'ERC721') {
          createNotification({
            type: 'transaction',
            subtype: 'approveForAll',
            values: {
              name: asset.collectionName,
              tokenId: asset.id,
            },
            metadata: {
              chainId,
              hash,
            },
          });
        } else if (swapAsset.type === 'ERC20') {
          createNotification({
            type: 'transaction',
            subtype: 'approve',
            values: {
              name: asset.collectionName,
              tokenId: asset.id,
            },
            metadata: {
              chainId,
              hash,
            },
          });
        }

        watchTransactionDialog.watch(hash);
      }
    },
    [watchTransactionDialog, asset, chainId],
  );

  const handleApproveAssetMutate = useCallback(
    async (variable: { asset: SwappableAssetV4 }) => {
      if (asset) {
        if (
          variable.asset.type === 'ERC721' ||
          variable.asset.type === 'ERC1155'
        ) {
          const values = {
            name: asset.collectionName,
            tokenId: asset.id,
          };

          watchTransactionDialog.open('approveForAll', values);
        } else {
          const symbol = await getERC20Symbol(
            variable.asset.tokenAddress,
            provider,
          );

          const name = await getERC20Name(
            variable.asset.tokenAddress,
            provider,
          );

          const values = {
            name,
            symbol,
          };

          watchTransactionDialog.open('approve', values);
        }
      }
    },
    [watchTransactionDialog, asset],
  );

  const handleApproveAssetError = useCallback(
    (error: any) => {
      watchTransactionDialog.setDialogError(error);
    },
    [watchTransactionDialog],
  );

  const handleSignMessageSuccess = useCallback(
    async (
      data: PostOrderResponsePayload | undefined,
      variables: void,
      context: any,
    ) => {
      signMessageDialog.setIsSuccess(true);
      signMessageDialog.setOpen(false);
      setShowOrderCreated(true);
      setOrderCreated(data);

      if (asset) {
        createNotification({
          type: 'common',
          subtype: 'createListing',
          values: {
            collectionName: asset.collectionName,
            id: asset.id,
          },
        });
      }
    },
    [signMessageDialog, asset],
  );

  const approveAsset = useApproveAssetMutation(
    nftSwapSdk,
    account,
    handleApproveAssetSuccess,
    {
      onMutate: handleApproveAssetMutate,
      onError: handleApproveAssetError,
    },
  );

  const handleOpenSignMessageListingDialog = useCallback(() => {
    signMessageDialog.setOpen(true);
    signMessageDialog.setMessage(
      formatMessage({
        id: 'creating.a.listing',
        defaultMessage: 'Creating a listing',
      }),
    );
  }, [signMessageDialog]);

  const handleSignMessageError = useCallback(
    (err: any) => {
      signMessageDialog.setError(err);
    },
    [signMessageDialog],
  );

  const handleOpenSignMessageOfferDialog = useCallback(() => {
    signMessageDialog.setOpen(true);
    signMessageDialog.setMessage(
      formatMessage({
        id: 'creating.an.offer',
        defaultMessage: 'Creating an offer',
      }),
    );
  }, [signMessageDialog]);

  const makeListing = useMakeListingMutation(
    nftSwapSdk,
    account,
    asset?.chainId,
    {
      onSuccess: handleSignMessageSuccess,
      onMutate: handleOpenSignMessageListingDialog,
      onError: handleSignMessageError,
    },
  );

  const makeOffer = useMakeOfferMutation(nftSwapSdk, account, asset?.chainId, {
    onSuccess: handleSignMessageSuccess,
    onMutate: handleOpenSignMessageOfferDialog,
    onError: handleSignMessageError,
  });

  const handleConfirmMakeListing = async (
    amount: BigNumber,
    tokenAddress: string,
    expiry: Date | null,
    takerAddress?: string,
  ) => {
    if (account === undefined || asset === null) {
      return;
    }

    const status = await nftSwapSdk?.loadApprovalStatus(
      {
        tokenAddress: asset?.contractAddress as string,
        tokenId: asset.id as string,
        type: asset?.protocol === 'ERC1155' ? 'ERC1155' : 'ERC721',
      },
      account,
    );

    if (!status?.contractApproved) {
      await approveAsset.mutateAsync({
        asset: {
          tokenAddress: asset.contractAddress as string,
          tokenId: asset.id as string,
          type: asset?.protocol === 'ERC1155' ? 'ERC1155' : 'ERC721',
        },
      });
    }

    await makeListing.mutateAsync({
      assetOffer: {
        tokenAddress: asset.contractAddress as string,
        tokenId: asset.id as string,
        type: asset?.protocol === 'ERC1155' ? 'ERC1155' : 'ERC721',
      },
      another: {
        tokenAddress,
        amount: amount.toString(),
        type: 'ERC20',
      },
      expiry: expiry,
      taker: takerAddress,
    });
  };

  const handleConfirmMakeOffer = async (
    amount: BigNumber,
    tokenAddress: string,
    expiry: Date | null,
  ) => {
    if (account === undefined) {
      return;
    }

    const status = await nftSwapSdk?.loadApprovalStatus(
      {
        tokenAddress,
        type: 'ERC20',
        amount: amount.toString(),
      },
      account,
    );

    if (!status?.contractApproved) {
      await approveAsset.mutateAsync({
        asset: {
          tokenAddress,
          type: 'ERC20',
          amount: amount.toString(),
        },
      });
    }

    makeOffer.mutate({
      assetOffer: {
        tokenAddress: asset?.contractAddress as string,
        tokenId: asset?.id as string,
        type: asset?.protocol === 'ERC1155' ? 'ERC1155' : 'ERC721',
      },
      another: {
        tokenAddress,
        amount: amount.toString(),
        type: 'ERC20',
      },
      expiry: expiry,
    });
  };

  const handleCloseCreatedOrderDialog = () => {
    setShowOrderCreated(false);
    setAsset(null);
    setOrderCreated(undefined);
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const hasChainDiff = useMemo(() => {
    return asset?.chainId !== undefined && asset?.chainId !== chainId;
  }, [asset]);

  return (
    <>
      <ImportAssetDialog
        dialogProps={{
          open: showImportAsset,
          fullWidth: true,
          maxWidth: 'xs',
          onClose: handleToggleImportAsset,
        }}
      />
      <OrderCreatedDialog
        dialogProps={{
          open: showOrderCreated,
          fullWidth: true,
          maxWidth: 'xs',
          onClose: handleCloseCreatedOrderDialog,
        }}
        order={orderCreated}
      />
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              alignContent: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {isDesktop && (
              <Typography>
                <FormattedMessage
                  id="Create.Order"
                  defaultMessage="Create Order"
                />
              </Typography>
            )}

            <Button
              startIcon={<ImportExportIcon />}
              onClick={handleToggleImportAsset}
              variant="outlined"
              size="small"
              fullWidth={!isDesktop}
            >
              <FormattedMessage id="import" defaultMessage="Import NFT" />
            </Button>
          </Box>
        </CardContent>

        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={assets}
                value={asset}
                getOptionLabel={(option) =>
                  `${option.collectionName} #${option.id}`
                }
                groupBy={(option: Asset) => option.collectionName}
                onChange={handleChangeOption}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={formatMessage({
                      id: 'nfts',
                      defaultMessage: 'NFTs',
                    })}
                  />
                )}
                renderOption={(props, option: Asset) => (
                  <ListItemButton component="li" {...props}>
                    <ListItemText
                      primary={`#${option.id}`}
                      secondary={option.collectionName}
                    />
                  </ListItemButton>
                )}
                fullWidth
              />
            </Grid>
            {hasChainDiff && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  <FormattedMessage
                    id="switch.network.content.text"
                    defaultMessage="Please, switch to {chainName} network to create listings or offers for this asset"
                    description="Switch network dialog content text"
                    values={{
                      chainName: <b>{getChainName(asset?.chainId)}</b>,
                    }}
                  />
                </Alert>
              </Grid>
            )}
            {asset !== null ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item>
                      {asset?.metadata?.image === undefined ? (
                        <Skeleton
                          variant="rectangular"
                          sx={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'relative',
                            height: '100%',
                            width: '100%',
                          }}
                        >
                          <Image
                            alt={asset?.metadata?.name}
                            src={ipfsUriToUrl(asset?.metadata?.image || '')}
                            style={{
                              height: '100%',
                              width: '100%',
                            }}
                            objectFit="contain"
                          />
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs>
                      <Typography variant="body2" color="textSecondary">
                        {asset?.collectionName === undefined ? (
                          <Skeleton />
                        ) : (
                          asset?.collectionName
                        )}
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }} variant="body1">
                        {asset?.metadata?.name === undefined ? (
                          <Skeleton />
                        ) : (
                          asset?.metadata?.name
                        )}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        <FormattedMessage
                          id="owned.by"
                          defaultMessage="Owned by"
                        />
                      </Typography>
                      <Link
                        href={`${getBlockExplorerUrl(
                          asset?.chainId,
                        )}/address/${asset?.owner}`}
                        color="primary"
                        target="_blank"
                      >
                        <Stack
                          component="span"
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={0.5}
                        >
                          <div>
                            {isAddressEqual(account, asset?.owner) ? (
                              <FormattedMessage id="you" defaultMessage="you" />
                            ) : (
                              truncateAddress(asset?.owner)
                            )}
                          </div>
                          <Launch fontSize="inherit" />
                        </Stack>
                      </Link>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">
                  <FormattedMessage
                    id="select.or.import.nft"
                    defaultMessage="Select or import a NFT to create an order"
                  />
                </Alert>
              </Grid>
            )}
            {asset !== null && (
              <Grid item xs={12}>
                {isAddressEqual(asset.owner, account) ? (
                  <MakeListingForm
                    disabled={hasChainDiff}
                    onConfirm={handleConfirmMakeListing}
                  />
                ) : (
                  <MakeOfferForm
                    disabled={hasChainDiff}
                    onConfirm={handleConfirmMakeOffer}
                  />
                )}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateAssetOrderContainer;
