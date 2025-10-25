import DollarSquare from "@dexkit/ui/components/icons/DollarSquare";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Button, Grid, Paper, Stack } from "@mui/material";
import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { isAddressEqual } from "@dexkit/core/utils/blockchain";
import {
  useDexKitContext,
  useSignMessageDialog,
  useSwitchNetwork,
  useTokenList,
} from "@dexkit/ui/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { type SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import dynamic from "next/dynamic";

import { getERC20Name, getERC20Symbol } from "@dexkit/core/services/balances";
import Icon from "../../../components/Icon";
import { useWalletConnect } from "../../../hooks/wallet";
import {
  GET_NFT_ORDERS,
  useApproveAssetMutation,
  useAsset,
  useAssetBalance,
  useAssetMetadata,
  useMakeListingMutation,
  useMakeOfferMutation,
  useSwapSdkV4,
} from "../hooks";
import { getAssetProtocol, isERC1155Owner } from "../utils";
import { TransferAssetButton } from "./TransferAssetButton";

const MakeListingDialog = dynamic(() => import("./dialogs/MakeListingDialog"));
const MakeOfferDialog = dynamic(() => import("./dialogs/MakeOfferDialog"));

interface Props {
  address: string;
  id: string;
}

export function AssetPricePaper({ address, id }: Props) {
  const { account, chainId, provider, isActive, signer } = useWeb3React();

  const { formatMessage } = useIntl();

  const { data: asset } = useAsset(address, id);
  const { data: metadata } = useAssetMetadata(asset);
  const { data: assetBalance } = useAssetBalance(asset, account);
  const queryClient = useQueryClient();

  const [openMakeOffer, setOpenMakeOffer] = useState(false);
  const [openMakeListing, setOpenMakeListing] = useState(false);

  const nftSwapSdk = useSwapSdkV4({ provider, signer, chainId });

  const { openDialog: switchNetwork } = useSwitchNetwork();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const handleApproveAssetSuccess = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (asset !== undefined) {
        if (swapAsset.type === "ERC721") {
          const values = { name: asset.collectionName, tokenId: asset.id };

          createNotification({
            type: "transaction",
            subtype: "approveForAll",
            values,
            metadata: { chainId, hash },
          });

          watchTransactionDialog.watch(hash);
        } else if (swapAsset.type === "ERC20") {
          const symbol = await getERC20Symbol(swapAsset.tokenAddress, provider);
          const name = await getERC20Name(swapAsset.tokenAddress, provider);

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
    [watchTransactionDialog, asset]
  );

  const handleApproveAssetMutate = useCallback(
    async ({ asset: swapAsset }: { asset: SwappableAssetV4 }) => {
      if (asset) {
        if (swapAsset.type === "ERC721" || swapAsset.type === "ERC1155") {
          watchTransactionDialog.open("approveForAll", {
            name: asset.collectionName,
            tokenId: asset.id,
          });
        } else {
          const symbol = await getERC20Symbol(swapAsset.tokenAddress, provider);
          const name = await getERC20Name(swapAsset.tokenAddress, provider);

          watchTransactionDialog.open("approve", { name, symbol });
        }
      }
    },
    [watchTransactionDialog, asset]
  );

  const handleApproveAssetError = useCallback(
    (error: any) => {
      watchTransactionDialog.setDialogError(error);
    },
    [watchTransactionDialog]
  );

  const approveAsset = useApproveAssetMutation(
    nftSwapSdk,
    account,
    handleApproveAssetSuccess,
    {
      onMutate: handleApproveAssetMutate,
      onError: handleApproveAssetError,
    }
  );

  const signMessageDialog = useSignMessageDialog();

  const handleOpenSignMessageListingDialog = useCallback(() => {
    (signMessageDialog as any).setOpen(true);
    (signMessageDialog as any).setMessage(
      formatMessage({
        id: "creating.a.listing",
        defaultMessage: "Creating a listing",
      })
    );
  }, [signMessageDialog]);

  const handleOpenSignMessageOfferDialog = useCallback(() => {
    (signMessageDialog as any).setOpen(true);
    (signMessageDialog as any).setMessage(
      formatMessage({
        id: "creating.an.offer",
        defaultMessage: "Creating an offer",
      })
    );
  }, [signMessageDialog]);

  const handleInvalidateCache = useCallback(() => {
    queryClient.invalidateQueries([GET_NFT_ORDERS]);
  }, [signMessageDialog]);

  const handleSignMessageError = useCallback(
    (err: any) => {
      (signMessageDialog as any).setError(err);
    },
    [signMessageDialog]
  );

  const handleSignMessageSuccess = useCallback(() => {
    handleInvalidateCache();
    signMessageDialog.setIsSuccess(true);

    if (asset) {
      createNotification({
        type: "common",
        subtype: "createListing",
        values: {
          collectionName: asset.collectionName,
          id: asset.id,
        },
      });
    }
  }, [signMessageDialog, asset]);

  const makeListing = useMakeListingMutation(
    nftSwapSdk,
    account,
    asset?.chainId,
    {
      onSuccess: handleSignMessageSuccess,
      onMutate: handleOpenSignMessageListingDialog,
      onError: handleSignMessageError,
    }
  );

  const makeOffer = useMakeOfferMutation(nftSwapSdk, account, asset?.chainId, {
    onSuccess: handleSignMessageSuccess,
    onMutate: handleOpenSignMessageOfferDialog,
    onError: handleSignMessageError,
  });

  const handleOpenMakeListingDialog = () => {
    if (chainId === undefined && asset?.chainId === undefined) {
      return;
    }

    if (chainId !== asset?.chainId) {
      if (asset?.chainId) {
        switchNetwork(asset?.chainId);
      }
    } else {
      setOpenMakeListing(true);
    }
  };

  const { connectWallet } = useWalletConnect();

  const handleOpenMakeOfferDialog = () => {
    if (!isActive || chainId === undefined) {
      connectWallet;
    } else if (chainId !== asset?.chainId) {
      if (asset?.chainId) {
        switchNetwork(asset?.chainId);
      }
    } else {
      setOpenMakeOffer(true);
    }
  };

  const handleCloseMakeListingDialog = () => setOpenMakeListing(false);

  const handleCloseMakeOfferDialog = () => setOpenMakeOffer(false);

  const handleConfirmMakeListing = async (
    amount: BigNumber,
    tokenAddress: string,
    expiry: Date | null,
    takerAddress?: string,
    quantity?: BigNumber
  ) => {
    setOpenMakeListing(false);

    if (account === undefined) {
      return;
    }

    const status = await nftSwapSdk?.loadApprovalStatus(
      {
        tokenAddress: address as string,
        tokenId: id as string,
        type: getAssetProtocol(asset),
      },
      account
    );

    if (!status?.contractApproved) {
      await approveAsset.mutateAsync({
        asset: {
          tokenAddress: address as string,
          tokenId: id as string,
          type: getAssetProtocol(asset),
        },
      });
    }

    await makeListing.mutateAsync({
      assetOffer: {
        tokenAddress: address as string,
        tokenId: id as string,
        type: getAssetProtocol(asset),
        amount: quantity ? quantity.toString() : "1",
      },
      another: {
        tokenAddress,
        amount: quantity ? amount.mul(quantity).toString() : amount.toString(),
        type: "ERC20",
      },
      expiry: expiry,
      taker: takerAddress,
    });
  };

  const handleConfirmMakeOffer = async (
    amount: BigNumber,
    tokenAddress: string,
    expiry: Date | null,
    quantity?: BigNumber
  ) => {
    setOpenMakeOffer(false);

    if (account === undefined) {
      return;
    }

    const status = await nftSwapSdk?.loadApprovalStatus(
      {
        tokenAddress,
        type: "ERC20",
        amount: amount.toString(),
      },
      account
    );

    if (!status?.contractApproved) {
      await approveAsset.mutateAsync({
        asset: {
          tokenAddress,
          type: "ERC20",
          amount: amount.toString(),
        },
      });
    }

    makeOffer.mutate({
      assetOffer: {
        tokenAddress: address as string,
        tokenId: id as string,
        type: getAssetProtocol(asset),
        quantity,
        amount: quantity ? quantity.toString() : "1",
      },
      another: {
        tokenAddress,
        amount: amount.toString(),
        type: "ERC20",
      },
      expiry: expiry,
    });
  };

  const tokenList = useTokenList({
    chainId,
    includeNative: true,
    onlyTradable: true,
  });

  const assetType = useMemo(() => {
    return getAssetProtocol(asset);
  }, [asset]);

  return (
    <>
      {openMakeListing && (
        <MakeListingDialog
          dialogProps={{
            open: openMakeListing,
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleCloseMakeListingDialog,
          }}
          tokenList={tokenList ? tokenList : []}
          assetBalance={assetBalance}
          onConfirm={handleConfirmMakeListing}
          asset={asset}
          metadata={metadata}
        />
      )}
      {openMakeOffer && (
        <MakeOfferDialog
          dialogProps={{
            open: openMakeOffer,
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleCloseMakeOfferDialog,
          }}
          onConfirm={handleConfirmMakeOffer}
          account={account}
          asset={asset}
        />
      )}
      <Grid size={12}>
        <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ width: "100%" }}
          >
            {/* <Box>
              <Typography variant="caption" color="textSecondary">
                <FormattedMessage
                  id="highest.offer"
                  defaultMessage="Highest Offer"
                  description="Highest Offer"
                />
              </Typography>
              <Typography variant="h6">0.0004</Typography>
            </Box> */}
            {(isAddressEqual(account, asset?.owner) ||
              isERC1155Owner(assetBalance)) && (
                <>
                  <Button
                    size="large"
                    onClick={handleOpenMakeListingDialog}
                    startIcon={<DollarSquare color="primary" />}
                    variant="outlined"
                    sx={{
                      minHeight: { xs: 48, sm: 40 },
                      fontSize: { xs: '1rem', sm: '0.875rem' },
                      py: { xs: 2, sm: 1.5 },
                    }}
                  >
                    <FormattedMessage
                      defaultMessage="Sell"
                      description="Sell button"
                      id="sell"
                    />
                  </Button>
                  <TransferAssetButton asset={asset} />
                </>
              )}

            {(assetType === "ERC1155" ||
              !isAddressEqual(account, asset?.owner)) && (
                <Button
                  size="large"
                  onClick={handleOpenMakeOfferDialog}
                  startIcon={<Icon icon="tag" size="medium" color="primary" />}
                  variant="outlined"
                  sx={{
                    minHeight: { xs: 48, sm: 40 },
                    fontSize: { xs: '1rem', sm: '0.875rem' },
                    py: { xs: 2, sm: 1.5 },
                  }}
                >
                  <FormattedMessage
                    defaultMessage="Make Offer"
                    description="Make offer button"
                    id="make.offer"
                  />
                </Button>
              )}
          </Stack>
        </Paper>
      </Grid>
    </>
  );
}
