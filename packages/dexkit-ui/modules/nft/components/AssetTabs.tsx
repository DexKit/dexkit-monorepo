import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Grid,
  NoSsr,
  Tab,
  Tabs
} from "@mui/material";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { QueryErrorResetBoundary, useQueryClient } from "@tanstack/react-query";

import {
  getNetworkSlugFromChainId,
  isAddressEqual,
} from "@dexkit/core/utils/blockchain";
import {
  GET_NFT_ORDERS,
  useApproveAssetMutation,
  useAsset,
  useAssetMetadata,
  useCancelSignedOrderMutation,
  useFillSignedOrderMutation,
  useSwapSdkV4,
} from "../hooks";
import TableSkeleton from "./tables/TableSkeleton";

import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import {
  useDexKitContext,
  useSwitchNetwork,
  useTokenList,
} from "@dexkit/ui/hooks";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import {
  SignedNftOrderV4,
  SwappableAssetV4,
  TradeDirection,
} from "@traderxyz/nft-swap-sdk";
import { BigNumber } from "ethers";

import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import {
  getERC20Decimals,
  getERC20Name,
  getERC20Symbol,
} from "@dexkit/core/services";
import { SwapApiOrder } from "@dexkit/core/types/nft";
import { getWindowUrl } from "@dexkit/core/utils/browser";
import { OrderDirection } from "../constants/enum";
import { getAssetProtocol } from "../utils";
import ShareDialog from "./dialogs/ShareDialog";
const ConfirmBuyDialog = dynamic(() => import("./dialogs/ConfirmBuyDialog"));

const ListingsTable = dynamic(() => import("./tables/ListingsTable"), {
  ssr: false,
});

const OffersTable = dynamic(() => import("./tables/OffersTable"), {
  ssr: false,
});

enum AssetTabsOptions {
  Listings,
  Offers,
}

interface Props {
  address: string;
  id: string;
}

export function AssetTabs({ address, id }: Props) {
  const trackUserEvent = useTrackUserEventsMutation();
  const { account, provider, chainId, signer } = useWeb3React();

  const { data: asset } = useAsset(address, id);
  const { data: metadata } = useAssetMetadata(asset);

  const [selectedTab, setSelectedTab] = useState<AssetTabsOptions>(
    AssetTabsOptions.Listings
  );

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const nftSwapSdk = useSwapSdkV4({ provider, chainId, signer });

  const handleApproveAsset = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (asset !== undefined) {
        if (swapAsset.type === "ERC721" || swapAsset.type === "ERC1155") {
          createNotification({
            type: "transaction",
            subtype: "approveForAll",
            values: {
              name: asset.collectionName || asset?.metadata?.name || " ",
              tokenId: asset.id,
            },
            metadata: {
              chainId,
              hash,
            },
          });
        } else {
          createNotification({
            type: "transaction",
            subtype: "approve",
            values: {
              name: asset.collectionName || asset?.metadata?.name || " ",
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
    [watchTransactionDialog, provider, asset, chainId]
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
            variable.asset.type === "ERC721" ||
            variable.asset.type === "ERC1155"
          ) {
            const values = {
              name: asset.collectionName || asset?.metadata?.name,
              tokenId: asset.id,
            };

            watchTransactionDialog.open("approveForAll", values);
          } else {
            const symbol = await getERC20Symbol(
              asset.contractAddress,
              provider
            );

            const name = await getERC20Name(asset.contractAddress, provider);

            const values = { name, symbol };

            watchTransactionDialog.open("approve", values);
          }
        }
      },
    }
  );

  const handleBuyOrderSuccess = useCallback(
    async ({
      hash,
      accept,
      order,
      quantity,
    }: {
      hash: string;
      accept: boolean;
      order: SignedNftOrderV4;
      quantity?: number;
    }) => {
      if (provider === undefined || asset === undefined) {
        return;
      }

      if (accept) {
        trackUserEvent.mutate({
          event:
            "erc1155Token" in order
              ? UserEvents.nftAcceptOfferERC1155
              : UserEvents.nftAcceptOfferERC721,
          metadata: JSON.stringify(order),
          hash,
          chainId,
        });
      } else {
        const decimals = await getERC20Decimals(order.erc20Token, provider);
        const symbol = await getERC20Symbol(order.erc20Token, provider);
        const values = {
          amount: formatUnits(order.erc20TokenAmount, decimals),
          symbol,
          collectionName: asset.collectionName,
          id: asset.id,
        };
        if (
          quantity &&
          quantity > 1 &&
          "erc1155Token" in order &&
          order.direction === TradeDirection.SellNFT
        ) {
          values.amount = formatUnits(
            BigNumber.from(order.erc20TokenAmount)
              .mul(
                BigNumber.from(quantity)
                  .mul(100000)
                  .div(order.erc1155TokenAmount)
              )
              .div(100000),

            decimals
          );
        }
        trackUserEvent.mutate({
          event:
            "erc1155Token" in order
              ? UserEvents.nftAcceptListERC1155
              : UserEvents.nftAcceptListERC721,
          metadata: JSON.stringify(order),
          hash,
          chainId,
        });
      }

      queryClient.invalidateQueries([GET_NFT_ORDERS]);
    },
    [watchTransactionDialog, provider, asset]
  );

  const handleHashFillSignedOrder = useCallback(
    async ({
      hash,
      accept,
      order,
      quantity,
    }: {
      hash: string;
      accept?: boolean;
      order: SignedNftOrderV4;
      quantity?: number;
    }) => {
      if (provider === undefined || asset === undefined) {
        return;
      }
      const decimals = await getERC20Decimals(order.erc20Token, provider);
      const symbol = await getERC20Symbol(order.erc20Token, provider);

      if (accept) {
        const values = {
          amount: formatUnits(order.erc20TokenAmount, decimals),
          symbol,
          collectionName: asset.collectionName,
          id: asset.id,
        };

        createNotification({
          type: "transaction",
          subtype: "acceptOffer",
          values,
          metadata: { chainId, hash },
        });
      } else {
        const values = {
          amount: formatUnits(order.erc20TokenAmount, decimals),
          symbol,
          collectionName: asset.collectionName,
          id: asset.id,
        };
        if (
          quantity &&
          quantity > 1 &&
          "erc1155Token" in order &&
          order.direction === TradeDirection.SellNFT
        ) {
          values.amount = formatUnits(
            BigNumber.from(order.erc20TokenAmount)
              .mul(
                BigNumber.from(quantity)
                  .mul(100000)
                  .div(order.erc1155TokenAmount)
              )
              .div(100000),

            decimals
          );
        }

        createNotification({
          type: "transaction",
          subtype: "buyNft",
          values,
          metadata: { chainId, hash },
        });
      }
      watchTransactionDialog.watch(hash);
    },
    [watchTransactionDialog, provider, asset]
  );

  const handleFillSignedOrderError = useCallback(
    (error: any) => watchTransactionDialog.setDialogError(error),
    [watchTransactionDialog]
  );

  const handleMutateSignedOrder = useCallback(
    async ({
      order,
      accept,
      quantity,
    }: {
      order: SignedNftOrderV4;
      accept?: boolean;
      quantity?: number;
    }) => {
      if (asset && order) {
        const decimals = await getERC20Decimals(order.erc20Token, provider);

        const symbol = await getERC20Symbol(order.erc20Token, provider);

        if (accept) {
          const values = {
            amount: formatUnits(order.erc20TokenAmount, decimals),
            symbol,
            collectionName: asset.collectionName,
            id: asset.id,
          };

          return watchTransactionDialog.open("acceptOffer", values);
        }

        const values = {
          amount: formatUnits(order.erc20TokenAmount, decimals),
          symbol,
          collectionName: asset.collectionName,
          id: asset.id,
        };
        if (
          quantity &&
          quantity > 1 &&
          "erc1155Token" in order &&
          order.direction === TradeDirection.SellNFT
        ) {
          values.amount = formatUnits(
            BigNumber.from(order.erc20TokenAmount)
              .mul(
                BigNumber.from(quantity)
                  .mul(100000)
                  .div(order.erc1155TokenAmount)
              )
              .div(100000),

            decimals
          );
        }

        watchTransactionDialog.open("buyNft", values);
      }
    },
    [watchTransactionDialog, asset]
  );

  const fillSignedOrder = useFillSignedOrderMutation(
    nftSwapSdk,
    account,
    {
      onSuccess: handleBuyOrderSuccess,
      onError: handleFillSignedOrderError,
      onMutate: handleMutateSignedOrder,
    },
    handleHashFillSignedOrder
  );

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: AssetTabsOptions
  ) => {
    setSelectedTab(newValue);
  };

  const [openConfirmBuy, setOpenConfirmBuy] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [openShare, setOpenShare] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const queryClient = useQueryClient();

  const handleInvalidateCache = () => {
    queryClient.invalidateQueries([GET_NFT_ORDERS]);
  };

  const handleCloseConfirmBuy = () => {
    setSelectedOrder(undefined);
    setOpenConfirmBuy(false);
  };

  const handleCancelOrderHash = useCallback(
    (hash: string, order: SwapApiOrder) => {
      if (asset !== undefined) {
        const values = { collectionName: asset.collectionName, id: asset.id };

        if (order.direction === OrderDirection.Buy) {
          createNotification({
            type: "transaction",
            subtype: "cancelOffer",
            values,
            metadata: {
              chainId,
              hash,
            },
          });
        } else {
          createNotification({
            type: "transaction",
            subtype: "cancelListing",
            values,
            metadata: {
              chainId,
              hash,
            },
          });
        }

        watchTransactionDialog.watch(hash);
      }
    },
    [watchTransactionDialog, asset]
  );

  const handleCancelSignedOrderError = useCallback(
    (error: any) => watchTransactionDialog.setDialogError(error),
    [watchTransactionDialog]
  );

  const handleCancelSignedOrderMutate = useCallback(
    ({ order }: { order: SwapApiOrder }) => {
      if (asset !== undefined) {
        if (order.direction === OrderDirection.Buy) {
          watchTransactionDialog.open("cancelOffer", {
            collectionName: asset.collectionName,
            id: asset.id,
          });
        } else {
          watchTransactionDialog.open("cancelListing", {
            collectionName: asset.collectionName,
            id: asset.id,
          });
        }
      }
    },
    [watchTransactionDialog, asset]
  );

  const cancelSignedOrder = useCancelSignedOrderMutation(
    nftSwapSdk,
    getAssetProtocol(asset),
    handleCancelOrderHash,
    {
      onError: handleCancelSignedOrderError,
      onMutate: handleCancelSignedOrderMutate,
    }
  );

  const switchNetwork = useSwitchNetwork();

  const handleBuyAsset = useCallback(
    (order: any) => {
      if (asset?.chainId !== undefined && chainId !== undefined) {
        if (chainId !== asset?.chainId) {
          switchNetwork.openDialog(asset?.chainId);
        } else {
          setSelectedOrder(order);
          setOpenConfirmBuy(true);
        }
      }
    },
    [asset, chainId, switchNetwork]
  );

  const handleConfirmBuy = useCallback(
    async ({ quantity }: { quantity?: number }) => {
      if (!account || selectedOrder === undefined) {
        return;
      }

      setOpenConfirmBuy(false);

      if (
        !isAddressEqual(selectedOrder.erc20Token, ZEROEX_NATIVE_TOKEN_ADDRESS)
      ) {
        const asset: any = {
          tokenAddress: selectedOrder.erc20Token,
          tokenAmount: selectedOrder.erc20TokenAmount,
          type: "ERC20",
        };

        const status = await nftSwapSdk?.loadApprovalStatus(asset, account);

        if (!status?.contractApproved) {
          await approveAsset.mutateAsync({
            asset,
          });
        }
      }

      await fillSignedOrder.mutateAsync({
        order: selectedOrder,
        quantity,
      });
    },
    [
      watchTransactionDialog,
      fillSignedOrder,
      nftSwapSdk,
      address,
      id,
      account,
      selectedOrder,
      approveAsset,
    ]
  );

  const handleCancelOrder = useCallback(
    async (order?: SwapApiOrder) => {
      if (
        asset?.chainId !== undefined &&
        chainId !== undefined &&
        order !== undefined
      ) {
        if (chainId !== asset?.chainId) {
          switchNetwork.openDialog(asset?.chainId);
        } else {
          await cancelSignedOrder.mutateAsync({ order });
          handleInvalidateCache();
        }
      }
    },
    [cancelSignedOrder, switchNetwork, chainId, asset]
  );

  const handleAcceptOffer = useCallback(
    async (order: any) => {
      if (!account) {
        return;
      }

      const tempAsset: any = {
        tokenAddress: address,
        tokenId: id,
        type: getAssetProtocol(asset),
      };

      const status = await nftSwapSdk?.loadApprovalStatus(tempAsset, account);

      if (!status?.contractApproved) {
        await approveAsset.mutateAsync({
          asset: tempAsset,
        });
      }

      fillSignedOrder.mutateAsync({
        order,
        accept: true,
      });
    },
    [fillSignedOrder, nftSwapSdk, address, id, account, approveAsset, asset]
  );

  const handleCloseShareDialog = () => {
    setOpenShare(false);
    setShareUrl(undefined);
  };

  const handleShareOrder = (nonce: string) => {
    if (asset) {
      setOpenShare(true);
      setShareUrl(
        `${getWindowUrl()}/order/${getNetworkSlugFromChainId(
          asset.chainId
        )}/${nonce}`
      );
    }
  };

  const tokens = useTokenList({ chainId: chainId, includeNative: true });

  return (
    <NoSsr>
      {openConfirmBuy && (
        <ConfirmBuyDialog
          tokens={tokens}
          asset={asset}
          metadata={metadata}
          order={selectedOrder}
          dialogProps={{
            open: openConfirmBuy,
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleCloseConfirmBuy,
          }}
          onConfirm={({ quantity }) => handleConfirmBuy({ quantity })}
        />
      )}
      <ShareDialog
        dialogProps={{
          open: openShare,
          fullWidth: true,
          maxWidth: "sm",
          onClose: handleCloseShareDialog,
        }}
        url={shareUrl}
      />
      <Grid container spacing={2}>
        <Grid size={12}>
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                color: 'text.primary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minHeight: { xs: 48, sm: 40 },
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <Tab
              value={AssetTabsOptions.Listings}
              label={
                <FormattedMessage id="listings" defaultMessage="Listings" />
              }
            />
            <Tab
              value={AssetTabsOptions.Offers}
              label={<FormattedMessage id="offers" defaultMessage="Offers" />}
            />
          </Tabs>
        </Grid>
        <Grid size={12}>
          {selectedTab === AssetTabsOptions.Listings ? (
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <div>
                  <Suspense fallback={<TableSkeleton rows={4} />}>
                    <ListingsTable
                      address={address}
                      id={id}
                      onBuy={handleBuyAsset}
                      onCancel={handleCancelOrder}
                      onShare={handleShareOrder}
                    />
                  </Suspense>
                </div>
              )}
            </QueryErrorResetBoundary>
          ) : (
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <div>
                  <Suspense fallback={<TableSkeleton rows={4} />}>
                    <OffersTable
                      address={address}
                      id={id}
                      onAcceptOffer={handleAcceptOffer}
                      onCancelOffer={handleCancelOrder}
                      onShare={handleShareOrder}
                    />
                  </Suspense>
                </div>
              )}
            </QueryErrorResetBoundary>
          )}
        </Grid>
      </Grid>
    </NoSsr>
  );
}
