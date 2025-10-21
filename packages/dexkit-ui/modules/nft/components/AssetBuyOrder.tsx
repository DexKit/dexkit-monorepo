import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Button, Grid, NoSsr, Stack } from "@mui/material";
import { Suspense, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { QueryErrorResetBoundary, useQueryClient } from "@tanstack/react-query";

import { UserEvents } from "@dexkit/core/constants/userEvents";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import {
  getERC20Decimals,
  getERC20Name,
  getERC20Symbol,
} from "@dexkit/core/services/balances";
import { Asset, SwapApiOrder } from "@dexkit/core/types/nft";
import { isAddressEqual } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useDexKitContext, useSwitchNetwork } from "@dexkit/ui";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  SignedNftOrderV4,
  SwappableAssetV4,
  TradeDirection,
} from "@traderxyz/nft-swap-sdk";
import { BigNumber } from "ethers";
import dynamic from "next/dynamic";
import ShareDialog from "../../../components/dialogs/ShareDialog";
import { useTokenList } from "../../../hooks/blockchain";
import { useTrackUserEventsMutation } from "../../../hooks/userEvents";
import { useWalletConnect } from "../../../hooks/wallet";
import { OrderDirection } from "../constants/enum";
import {
  GET_NFT_ORDERS,
  useApproveAssetMutation,
  useCancelSignedOrderMutation,
  useFillSignedOrderMutation,
  useSwapSdkV4,
} from "../hooks";
import { OrderBookItem } from "../types";
import { getAssetProtocol } from "../utils";
import AssetBuyOrderPrice from "./AssetBuyOrderPrice";
import TableSkeleton from "./tables/TableSkeleton";
const ConfirmBuyDialog = dynamic(() => import("./dialogs/ConfirmBuyDialog"));

interface Props {
  orderBookItem?: OrderBookItem;
  asset?: Asset;
}

export function AssetBuyOrder({ asset, orderBookItem }: Props) {
  const { account, signer, provider, chainId } = useWeb3React();
  const { connectWallet } = useWalletConnect();
  const trackUserEvent = useTrackUserEventsMutation();
  const nftSwapSdk = useSwapSdkV4({
    provider,
    signer,
    chainId: asset?.chainId,
  });

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const handleApproveAsset = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (asset !== undefined) {
        if (swapAsset.type === "ERC721" || swapAsset.type === "ERC1155") {
          const values = { name: asset.collectionName, tokenId: asset.id };

          createNotification({
            type: "transaction",
            subtype: "approveForAll",
            values,
            metadata: { chainId, hash },
          });

          watchTransactionDialog.watch(hash);
        } else {
          const symbol = await getERC20Symbol(swapAsset.tokenAddress, provider);
          const name = await getERC20Symbol(swapAsset.tokenAddress, provider);

          const values = { name, symbol };

          createNotification({
            type: "transaction",
            subtype: "approve",
            values,
            metadata: { chainId, hash },
          });

          watchTransactionDialog.watch(hash);
        }
      }
    },
    [watchTransactionDialog, provider, asset, createNotification, chainId]
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
            const values = { name: asset.collectionName, tokenId: asset.id };

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

      const decimals = await getERC20Decimals(order.erc20Token, provider);

      const symbol = await getERC20Symbol(order.erc20Token, provider);

      const values = {
        collectionName: asset.collectionName,
        id: asset.id,
        amount: formatUnits(order.erc20TokenAmount, decimals),
        symbol,
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
              BigNumber.from(quantity).mul(100000).div(order.erc1155TokenAmount)
            )
            .div(100000),

          decimals
        );
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
        createNotification({
          type: "transaction",
          subtype: "acceptOffer",
          values,
          metadata: {
            chainId,
            hash,
          },
        });
      } else {
        trackUserEvent.mutate({
          event:
            "erc1155Token" in order
              ? UserEvents.nftAcceptListERC1155
              : UserEvents.nftAcceptListERC721,
          metadata: JSON.stringify(order),
          hash,
          chainId,
        });
        createNotification({
          type: "transaction",
          subtype: "buyNft",
          values,
          metadata: {
            chainId,
            hash,
          },
        });
      }

      watchTransactionDialog.watch(hash);

      queryClient.invalidateQueries([GET_NFT_ORDERS]);
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

        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
          amount: formatUnits(order.erc20TokenAmount, decimals),
          symbol,
        };

        if (accept) {
          return watchTransactionDialog.open("acceptOffer", values);
        }
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

  const fillSignedOrder = useFillSignedOrderMutation(nftSwapSdk, account, {
    onSuccess: handleBuyOrderSuccess,
    onError: handleFillSignedOrderError,
    onMutate: handleMutateSignedOrder,
  });

  const [openConfirmBuy, setOpenConfirmBuy] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const queryClient = useQueryClient();

  const handleInvalidateCache = () => {
    queryClient.invalidateQueries([GET_NFT_ORDERS]);
  };

  const handleCloseConfirmBuy = () => {
    setOpenConfirmBuy(false);
  };

  const handleCancelOrderHash = useCallback(
    (hash: string, order: SwapApiOrder) => {
      if (asset !== undefined) {
        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
        };
        trackUserEvent.mutate({
          event:
            "erc1155Token" in order
              ? UserEvents.cancelNFTERC1155order
              : UserEvents.cancelNFTERC721order,
          metadata: JSON.stringify(order),
          hash,
          chainId,
        });

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
        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
        };
        if (order.direction === OrderDirection.Buy) {
          watchTransactionDialog.open("cancelOffer", values);
        } else {
          watchTransactionDialog.open("cancelOrder", values);
        }
      }
    },
    [watchTransactionDialog]
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

  const handleBuyAsset = useCallback(() => {
    if (asset?.chainId !== undefined && chainId !== undefined) {
      if (chainId !== asset?.chainId) {
        switchNetwork.openDialog(asset?.chainId);
      } else {
        setOpenConfirmBuy(true);
      }
    } else {
      connectWallet();
    }
  }, [asset, chainId, switchNetwork]);

  const handleConfirmBuy = useCallback(
    async ({ quantity }: { quantity?: number }) => {
      if (!account || orderBookItem === undefined) {
        return;
      }

      setOpenConfirmBuy(false);

      if (
        !isAddressEqual(orderBookItem.erc20Token, ZEROEX_NATIVE_TOKEN_ADDRESS)
      ) {
        const asset: any = {
          tokenAddress: orderBookItem.erc20Token,
          tokenAmount: orderBookItem.erc20TokenAmount,
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
        order: orderBookItem.order,
        quantity,
      });
    },
    [
      watchTransactionDialog,
      fillSignedOrder,
      nftSwapSdk,
      account,
      orderBookItem,
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

  const handleCloseShareDialog = () => {
    setOpenShare(false);
    setShareUrl(undefined);
  };

  const tokens = useTokenList({ chainId: chainId, includeNative: true });

  return (
    <NoSsr>
      {openConfirmBuy && (
        <ConfirmBuyDialog
          tokens={tokens}
          asset={asset}
          metadata={asset?.metadata}
          order={orderBookItem}
          dialogProps={{
            open: openConfirmBuy,
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleCloseConfirmBuy,
          }}
          onConfirm={({ quantity }) => {
            handleConfirmBuy({ quantity });
          }}
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
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <div>
                <Suspense fallback={<TableSkeleton rows={4} />}>
                  <Stack spacing={2}>
                    <AssetBuyOrderPrice
                      asset={asset}
                      orderBookItem={orderBookItem}
                    />
                    {isAddressEqual(account, orderBookItem?.order?.maker) ? (
                      <Button
                        startIcon={<CancelIcon />}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCancelOrder!(orderBookItem?.order)}
                      >
                        <FormattedMessage
                          id="cancel"
                          defaultMessage="Cancel"
                          description="Cancel"
                        />
                      </Button>
                    ) : (
                      <Button
                        startIcon={<CancelIcon />}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleBuyAsset!()}
                      >
                        <FormattedMessage
                          id="buy"
                          defaultMessage="Buy"
                          description="Buy asset button text"
                        />
                      </Button>
                    )}
                  </Stack>
                </Suspense>
              </div>
            )}
          </QueryErrorResetBoundary>
        </Grid>
      </Grid>
    </NoSsr>
  );
}
