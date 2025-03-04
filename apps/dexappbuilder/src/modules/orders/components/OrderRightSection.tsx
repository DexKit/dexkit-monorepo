import {
    useCoinPricesQuery,
    useCurrency,
    useDexKitContext,
    useSwitchNetwork,
    useTokenList,
} from '@dexkit/ui/hooks';
import {
    Alert,
    Box,
    Button,
    Chip,
    NoSsr,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import {
    getBlockExplorerUrl,
    getNetworkSlugFromChainId,
    isAddressEqual,
    truncateAddress,
} from '@dexkit/core/utils/blockchain';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { BigNumber, constants } from 'ethers';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import Calendar from '../../../components/icons/Calendar';

import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@dexkit/core/constants/zrx';
import {
    getERC20Decimals,
    getERC20Symbol,
} from '@dexkit/core/services/balances';
import { ipfsUriToUrl } from '@dexkit/core/utils/ipfs';
import AppFeePercentageSpan from '@dexkit/ui/components/AppFeePercentageSpan';
import Link from '@dexkit/ui/components/AppLink';
import {
    useApproveAssetMutation,
    useAsset,
    useAssetMetadata,
    useCancelSignedOrderMutation,
    useFillSignedOrderMutation,
    useSwapSdkV4,
} from '@dexkit/ui/modules/nft/hooks';
import { OrderBookItem, SwapApiOrder } from '@dexkit/ui/modules/nft/types';
import { getAssetProtocol } from '@dexkit/ui/modules/nft/utils';
import { OrderPageActions } from './OrderPageActions';

interface Props {
  order?: OrderBookItem;
}

function OrderRightSection({ order }: Props) {
  const { account, provider, chainId } = useWeb3React();
  const { data: asset } = useAsset(order?.nftToken, order?.nftTokenId);
  const { data: metadata } = useAssetMetadata(asset);

  const tokens = useTokenList({ includeNative: true, chainId: asset?.chainId });

  const { currency } = useCurrency();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const token = useMemo(() => {
    return tokens.find((t) => isAddressEqual(t.address, order?.erc20Token));
  }, [tokens, order]);

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const nftSwapSdk = useSwapSdkV4(provider, chainId);

  const switchNetwork = useSwitchNetwork();

  const coinPricesQuery = useCoinPricesQuery({ includeNative: true });

  const amountFormatted = useMemo(() => {
    if (order && token) {
      return formatUnits(
        BigNumber.from(order?.erc20TokenAmount || '0'),
        token?.decimals,
      );
    }
  }, [token, order]);

  const totalInCurrency = useMemo(() => {
    if (token && currency && order) {
      if (coinPricesQuery?.data) {
        let ratio = 0;

        const tokenData = coinPricesQuery.data[token.address.toLowerCase()];

        if (tokenData && currency in tokenData) {
          ratio = tokenData[currency];
        }

        if (ratio) {
          return (
            ratio *
            parseFloat(formatUnits(order?.erc20TokenAmount, token.decimals))
          );
        } else {
          return 0;
        }
      }
    }
  }, [token, coinPricesQuery, currency, order]);

  const handleCancelSignedOrderError = useCallback(
    (error: any) => watchTransactionDialog.setDialogError(error),
    [watchTransactionDialog],
  );

  const handleCancelOrderHash = useCallback(
    (hash: string, order: SwapApiOrder) => {
      if (asset !== undefined) {
        watchTransactionDialog.setRedirectUrl(
          `/asset/${getNetworkSlugFromChainId(
            asset?.chainId,
          )}/${asset?.contractAddress}/${asset?.id}`,
        );

        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
        };

        createNotification({
          type: 'common',
          subtype: 'cancelOffer',
          values,
          metadata: {
            hash,
            chainId,
          },
        });

        watchTransactionDialog.watch(hash);
      }
    },
    [watchTransactionDialog, asset, chainId],
  );

  const handleCancelSignedOrderMutate = useCallback(
    ({ order }: { order: SwapApiOrder }) => {
      if (asset !== undefined) {
        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
        };

        watchTransactionDialog.open('cancelOffer', values);
      }
    },
    [watchTransactionDialog],
  );

  const handleFillSignedOrderError = useCallback(
    (error: any) => watchTransactionDialog.setDialogError(error),
    [watchTransactionDialog],
  );

  const handleMutateSignedOrder = useCallback(
    async ({ order, accept }: { order: SwapApiOrder; accept?: boolean }) => {
      if (asset && order) {
        const decimals = await getERC20Decimals(order.erc20Token, provider);

        const symbol = await getERC20Symbol(order.erc20Token, provider);

        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
          amount: formatUnits(order.erc20TokenAmount, decimals),
          symbol,
        };

        if (accept) {
          return watchTransactionDialog.open('acceptOffer', values);
        }

        watchTransactionDialog.open('buyNft', values);
      }
    },
    [watchTransactionDialog, asset],
  );

  const handleBuyOrderSuccess = useCallback(
    async ({
      hash,
      accept,
      order,
    }: {
      hash: string;
      accept: boolean;
      order: SwapApiOrder;
    }) => {
      if (provider === undefined || asset === undefined) {
        return;
      }

      watchTransactionDialog.setRedirectUrl(
        `/asset/${getNetworkSlugFromChainId(
          asset?.chainId,
        )}/${asset?.contractAddress}/${asset?.id}`,
      );

      const decimals = await getERC20Decimals(order.erc20Token, provider);

      const symbol = await getERC20Symbol(order.erc20Token, provider);

      const values = {
        collectionName: asset.collectionName,
        id: asset.id,
        amount: formatUnits(order.erc20TokenAmount, decimals),
        symbol,
      };

      if (accept) {
        createNotification({
          type: 'transaction',
          subtype: 'acceptOffer',
          values,
          metadata: {
            chainId,
            hash,
          },
        });
      } else {
        createNotification({
          type: 'transaction',
          subtype: 'buyNft',
          values,
          metadata: {
            chainId,
            hash,
          },
        });
      }

      watchTransactionDialog.watch(hash);
    },
    [watchTransactionDialog, provider, asset],
  );

  const handleApproveAsset = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (asset !== undefined) {
        if (swapAsset.type === 'ERC721' || swapAsset.type === 'ERC1155') {
          const values = { name: asset.collectionName, tokenId: asset.id };

          createNotification({
            type: 'transaction',
            subtype: 'approveForAll',
            values,
            metadata: { chainId, hash },
          });
        } else {
          const symbol = await getERC20Symbol(swapAsset.tokenAddress, provider);
          const name = await getERC20Symbol(swapAsset.tokenAddress, provider);

          const values = { name, symbol };

          createNotification({
            type: 'transaction',
            subtype: 'approve',
            values,
            metadata: { chainId, hash },
          });
        }

        watchTransactionDialog.watch(hash);
      }
    },
    [watchTransactionDialog, provider, asset, chainId],
  );

  const approveAsset = useApproveAssetMutation(
    nftSwapSdk,
    account,
    handleApproveAsset,
    {
      onError: (error: any) => watchTransactionDialog.setDialogError(error),
      onMutate: async (variable: { asset: SwappableAssetV4 }) => {
        if (asset) {
          if (
            variable.asset.type === 'ERC721' ||
            variable.asset.type === 'ERC1155'
          ) {
            const values = { name: asset.collectionName, tokenId: asset.id };

            watchTransactionDialog.open('approveForAll', values);
          } else {
            const symbol = await getERC20Symbol(
              variable.asset.tokenAddress,
              provider,
            );
            const name = await getERC20Symbol(
              variable.asset.tokenAddress,
              provider,
            );

            const values = { name, symbol };

            watchTransactionDialog.open('approve', values);
          }
        }
      },
    },
  );

  const fillSignedOrder = useFillSignedOrderMutation(nftSwapSdk, account, {
    onSuccess: handleBuyOrderSuccess,
    onError: handleFillSignedOrderError,
    onMutate: handleMutateSignedOrder,
  });

  const cancelSignedOrder = useCancelSignedOrderMutation(
    nftSwapSdk,
    getAssetProtocol(asset),
    handleCancelOrderHash,
    {
      onError: handleCancelSignedOrderError,
      onMutate: handleCancelSignedOrderMutate,
    },
  );

  const handleCancelOrder = useCallback(async () => {
    if (
      asset?.chainId !== undefined &&
      chainId !== undefined &&
      order !== undefined
    ) {
      if (chainId !== asset?.chainId) {
        switchNetwork.openDialog(asset?.chainId);
      } else {
        await cancelSignedOrder.mutateAsync({ order: order.order });
      }
    }
  }, [cancelSignedOrder, switchNetwork, chainId, asset, order]);

  const handleAcceptOffer = useCallback(async () => {
    if (!account) {
      return;
    }

    const tempAsset: any = {
      tokenAddress: order?.nftToken,
      tokenId: order?.nftTokenId,
      type: getAssetProtocol(asset),
    };

    const status = await nftSwapSdk?.loadApprovalStatus(tempAsset, account);

    if (!status?.contractApproved) {
      await approveAsset.mutateAsync({
        asset: tempAsset,
      });
    }

    if (order) {
      fillSignedOrder.mutateAsync({
        order: order?.order,
        accept: true,
      });
    }
  }, [fillSignedOrder, nftSwapSdk, order, account, approveAsset, asset]);

  const handleBuy = useCallback(async () => {
    if (!account || order?.order === undefined) {
      return;
    }

    if (!isAddressEqual(order?.erc20Token, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
      const asset: any = {
        tokenAddress: order.erc20Token,
        tokenAmount: order.erc20TokenAmount,
        type: 'ERC20',
      };

      const status = await nftSwapSdk?.loadApprovalStatus(asset, account);

      if (!status?.contractApproved) {
        await approveAsset.mutateAsync({
          asset,
        });
      }
    }

    await fillSignedOrder.mutateAsync({
      order: order.order,
    });
  }, [
    watchTransactionDialog,
    fillSignedOrder,
    nftSwapSdk,
    account,
    order,
    approveAsset,
  ]);

  const renderActionButton = () => {
    if (isAddressEqual(order?.order.maker, account)) {
      return (
        <Button
          fullWidth={isMobile}
          onClick={handleCancelOrder}
          variant="contained"
          color="primary"
        >
          <FormattedMessage
            id="cancel.listing"
            defaultMessage="Cancel listing"
          />
        </Button>
      );
    } else {
      if (isAddressEqual(account, asset?.owner)) {
        return (
          <Button
            fullWidth={isMobile}
            variant="contained"
            color="primary"
            onClick={handleAcceptOffer}
          >
            <FormattedMessage id="accept" defaultMessage="Accept" />
          </Button>
        );
      }

      return (
        <Button
          onClick={handleBuy}
          fullWidth={isMobile}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="buy.now" defaultMessage="Buy now" />
        </Button>
      );
    }
  };

  const isOrderExpired = useMemo(() => {
    return moment.unix(parseInt(order?.order.expiry || '0')).isBefore(moment());
  }, [order]);

  const renderStatus = () => {
    if (isOrderExpired) {
      return (
        <Chip
          variant="outlined"
          label={<FormattedMessage id="expired" defaultMessage="Expired" />}
          color="error"
        />
      );
    }

    return <Chip label="Open" />;
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="caption" color="textSecondary">
          {asset?.collectionName}
        </Typography>
        <Typography variant="h5" component="h1">
          {metadata?.name !== '' && metadata?.name !== undefined
            ? metadata?.name
            : `${asset?.collectionName} #${asset?.id}`}
        </Typography>
      </Box>
      {asset && (
        <NoSsr>
          <OrderPageActions
            address={asset.contractAddress}
            id={asset.id}
            nonce={order?.order.nonce}
          />
        </NoSsr>
      )}
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          <Typography sx={{ fontWeight: 400 }} variant="h6" component="h1">
            <FormattedMessage id="order" defaultMessage="Order" /> #
            {order?.order?.nonce.substring(order?.order?.nonce.length - 8)}
          </Typography>

          {renderStatus()}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          <Typography color="textSecondary" variant="body2">
            <FormattedMessage id="price" defaultMessage="Price" />
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={1}
          >
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={0.5}
            >
              <Tooltip title={token?.name || ''}>
                <img
                  alt={token?.name}
                  src={ipfsUriToUrl(token?.logoURI || '')}
                  style={{ width: 'auto', height: '1rem' }}
                />
              </Tooltip>
              <Typography sx={{ fontWeight: 600 }} variant="h6">
                {amountFormatted} {token?.symbol}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={`${totalInCurrency} ${currency.toUpperCase()}`}
            />
          </Stack>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          <Typography color="textSecondary" variant="body2">
            <FormattedMessage id="expires.in" defaultMessage="Expires In" />
          </Typography>

          <Chip
            icon={<Calendar />}
            sx={{ fontWeight: 600 }}
            label={moment
              .unix(parseInt(order?.order.expiry || '0'))
              .format('LLL')}
          />
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          <Typography color="textSecondary" variant="body2">
            <FormattedMessage id="created.by" defaultMessage="Created by" />
          </Typography>

          <Link
            href={`${getBlockExplorerUrl(asset?.chainId)}/address/${order?.order
              .maker}`}
            variant="body2"
            target="_blank"
          >
            {truncateAddress(order?.order.maker)}
          </Link>
        </Stack>
      </Paper>
      {!isAddressEqual(order?.order.taker, constants.AddressZero) && (
        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            alignContent="center"
          >
            <Typography color="textSecondary" variant="body2">
              <FormattedMessage id="visible.for" defaultMessage="Visible for" />
            </Typography>
            <Link
              href={`${getBlockExplorerUrl(
                asset?.chainId,
              )}/address/${asset?.owner}`}
              variant="body2"
              target="_blank"
            >
              {truncateAddress(order?.order.taker)}
            </Link>
          </Stack>
        </Paper>
      )}
      <Alert severity="info">
        <FormattedMessage
          id="the.buyer.will.pay.percentage.in.fees"
          defaultMessage="
                The buyer will pay {amount} {symbol} + {percentage} in fees"
          values={{
            percentage: (
              <b>
                <AppFeePercentageSpan />
              </b>
            ),
            amount: amountFormatted,
            symbol: token?.symbol,
          }}
        />
      </Alert>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {renderActionButton()}
      </Box>
    </Stack>
  );
}

export default OrderRightSection;
