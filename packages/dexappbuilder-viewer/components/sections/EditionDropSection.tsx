import { EditionDropPageSection } from "@dexkit/ui/modules/wizard/types/section";
import {
  useActiveClaimConditionForWallet,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
} from "@thirdweb-dev/react";

import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { SwitchNetworkButtonWithWarning } from "@dexkit/ui/components";
import { ConnectWalletButton } from "@dexkit/ui/components/ConnectWalletButton";
import { useDexKitContext } from "@dexkit/ui/hooks";
import {
  useErc20AllowanceMutation,
  useErc20ApproveMutationV2,
} from "@dexkit/ui/hooks/balances";
import { useInterval } from "@dexkit/ui/hooks/misc";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useNFTBalance } from "@thirdweb-dev/react";
import { ClaimEligibility, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { type SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

const QuantityField = styled(TextField)(({ theme }) => ({
  "& .MuiFormLabel-root": {
    fontSize: "1.5rem",
    paddingBottom: theme.spacing(1),
  },
  "& .MuiInputBase-input": {
    fontSize: "2.5rem",
  },
}));

interface Props {
  section: EditionDropPageSection;
}

export function parseIneligibility(
  reasons: ClaimEligibility[],
  quantity = 0
): JSX.Element {
  if (!reasons.length) {
    return <></>;
  }

  const reason = reasons[0];

  if (
    reason === ClaimEligibility.Unknown ||
    reason === ClaimEligibility.NoActiveClaimPhase ||
    reason === ClaimEligibility.NoClaimConditionSet
  ) {
    return (
      <FormattedMessage
        id="this.drop.is.not.ready.to.be.minted"
        defaultMessage="This drop is not ready to be minted."
      />
    );
  } else if (reason === ClaimEligibility.NotEnoughTokens) {
    return (
      <FormattedMessage
        id="you.dont.have.enough.currency.to.mint"
        defaultMessage="You don't have enough currency to mint."
      />
    );
  } else if (reason === ClaimEligibility.AddressNotAllowed) {
    if (quantity > 1) {
      return (
        <FormattedMessage
          id="you.are.not.eligible.to.mint.tokens.quantity.value"
          defaultMessage="You are not eligible to mint {quantity} tokens."
        />
      );
    }

    return (
      <FormattedMessage
        id="you.are.not.eligible.to.mint.at.this.time"
        defaultMessage="You are not eligible to mint at this time."
      />
    );
  }

  return <>{reason}</>;
}

export function EditionDropSection({ section }: Props) {
  const { tokenId, address, network } = section.config;
  const trackUserEventsMutation = useTrackUserEventsMutation();
  const { createNotification, watchTransactionDialog } = useDexKitContext();
  const networkChainId = NETWORK_FROM_SLUG(network)?.chainId;
  const { account, chainId, provider } = useWeb3React();
  const [quantity, setQuantity] = useState(1);
  const { contract: editionDrop } = useContract(address);

  const { data: balance, isLoading: isLoadingBalance } = useNFTBalance(
    editionDrop,
    account,
    tokenId
  );

  const allowanceMutation = useErc20AllowanceMutation(provider);

  const { data: contractMetadata } = useContractMetadata(editionDrop);

  const claimConditions = useClaimConditions(editionDrop, tokenId);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    editionDrop,
    account,
    tokenId
  );

  const [count, setCount] = useState<number>(0);

  const nextPhase = useMemo(() => {
    const active = activeClaimCondition.data;
    const data = claimConditions.data;
    if (active && data) {
      const total = data?.length;
      const currentIndex = data.findIndex(
        (a) => a?.startTime?.getTime() === active?.startTime?.getTime()
      );

      if (currentIndex === -1) {
        return;
      }
      if (currentIndex + 1 < total) {
        const nextPhase = data[currentIndex + 1];
        return nextPhase;
      }
    }
  }, [activeClaimCondition.data, claimConditions.data]);

  const countDown = useMemo(() => {
    if (nextPhase) {
      const countDownDate = nextPhase?.startTime?.getTime() / 1000;

      const now = new Date().getTime() / 1000;

      const distance = countDownDate - now;
      if (distance < 0) {
        return "Expired";
      }

      const days = Math.floor(distance / (60 * 60 * 24));
      const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((distance % (60 * 60)) / 60);
      const seconds = Math.floor(distance % 60);

      if (days) {
        return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      } else {
        return hours + "h " + minutes + "m " + seconds + "s ";
      }
    }
  }, [nextPhase, count]);

  useInterval(
    () => {
      // Your custom logic here
      setCount(count + 1);
    },
    // Delay in milliseconds or null to stop it
    countDown === undefined || countDown === "Expired" ? null : 1000
  );

  const handleApproveAssetSuccess = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (swapAsset.type === "ERC20") {
        createNotification({
          type: "transaction",
          subtype: "approve",
          values: {
            name: activeClaimCondition.data?.currencyMetadata.symbol || "",
            symbol: activeClaimCondition.data?.currencyMetadata.symbol || "",
          },
          metadata: {
            chainId,
            hash,
          },
        });

        watchTransactionDialog.watch(hash);
      }
    },
    [
      watchTransactionDialog,
      activeClaimCondition.data?.currencyMetadata.symbol,
      chainId,
    ]
  );

  const approveMutation = useErc20ApproveMutationV2(
    provider,
    handleApproveAssetSuccess
  );

  const claimerProofs = useClaimerProofs(editionDrop, account || "", tokenId);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(
    editionDrop,
    {
      quantity,
      walletAddress: account || "",
    },
    tokenId
  );

  const claimedSupply = useTotalCirculatingSupply(editionDrop, tokenId);

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(BigNumber.from(claimedSupply.data || 0));
    if (n.gte(1_000_000)) {
      return "";
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const totalAmount = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return bnPrice.mul(quantity);
  }, [quantity, activeClaimCondition.data?.currencyMetadata.value]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    let max;
    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0
          )) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
  ]);

  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const isLoading = useMemo(() => {
    return (
      activeClaimCondition.isLoading || claimedSupply.isLoading || !editionDrop
    );
  }, [activeClaimCondition.isLoading, editionDrop, claimedSupply.isLoading]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );
  const priceText = useMemo(() => {
    const pricePerToken = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    if (pricePerToken.eq(0)) {
      return <FormattedMessage id={"Free"} defaultMessage={"Free"} />;
    }
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${formatUnits(
      bnPrice.toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,

    activeClaimCondition.data?.currencyMetadata.value,
  ]);

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id={"sold.out"} defaultMessage={"Sold out"} />;
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      if (pricePerToken.eq(0)) {
        return (
          <FormattedMessage id={"mint.free"} defaultMessage={"Mint (free)"} />
        );
      }
      return (
        <FormattedMessage
          id={"mint.price.value"}
          defaultMessage={`Mint ({priceToMint})`}
          values={{ priceToMint: priceToMint }}
        />
      );
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return (
        <>
          <FormattedMessage
            id={"checking.eligibility"}
            defaultMessage={`Checking eligibility`}
          />
          {"..."}
        </>
      );
    }

    return (
      <FormattedMessage
        id={"claiming.not.available"}
        defaultMessage={"Claiming not available"}
      />
    );
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    quantity,
  ]);

  const isLoadingConditions =
    activeClaimCondition.isLoading || claimConditions.isLoading;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Drop Details Section */}
        <Grid size={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <FormattedMessage
              id={"drop.details"}
              defaultMessage={"Drop details"}
            />
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">
                <FormattedMessage
                  id={"total.minted"}
                  defaultMessage={"Total minted"}
                />
                :
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {claimedSupply ? (
                  numberClaimed
                ) : (
                  <>
                    <FormattedMessage id={"loading"} defaultMessage={"Loading"} />
                    ...
                  </>
                )}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">
                <FormattedMessage
                  id={"total.to.mint"}
                  defaultMessage={"Total to mint"}
                />
                :
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {claimedSupply ? (
                  numberTotal || (
                    <FormattedMessage
                      id={"unlimited"}
                      defaultMessage={"Unlimited"}
                    />
                  )
                ) : (
                  <>
                    <FormattedMessage id={"loading"} defaultMessage={"Loading"} />
                    ...
                  </>
                )}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">
                <FormattedMessage id={"you.own"} defaultMessage={"You own"} />:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {isLoadingBalance ? (
                  <Skeleton width={40} height={20} />
                ) : (
                  balance?.toString() || "0"
                )}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        {/* Minting Interface Section */}
        <Grid size={12}>
          {isLoadingConditions && !activeClaimCondition.data ? (
            <Card>
              <CardContent>
                <Skeleton width={"300px"} height={40} />
                <Skeleton width={"300px"} height={40} />
                <Skeleton width={"300px"} height={40} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                {claimConditions.data?.length === 0 ||
                  !claimConditions.data ||
                  claimConditions.data?.every(
                    (cc) => cc.maxClaimableSupply === "0"
                  ) ? (
                  <Alert severity="info">
                    <FormattedMessage
                      id={"drop.not.ready.to.mint.yet"}
                      defaultMessage={
                        "This drop is not ready to be minted yet. (No claim condition set)"
                      }
                    />
                  </Alert>
                ) : activeClaimCondition.data ? (
                  <Stack spacing={2}>
                    <Typography variant="h5" fontWeight="bold">
                      {activeClaimCondition.data?.metadata?.name || "Genesis drop"}
                    </Typography>

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">
                          <FormattedMessage
                            id={"price"}
                            defaultMessage={"Price"}
                          />
                          :
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {priceText}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">
                          {activeClaimCondition.data?.maxClaimablePerWallet === "unlimited"
                            ? "unlimited"
                            : Number(activeClaimCondition.data?.maxClaimablePerWallet || 0).toLocaleString()
                          } {" "}
                          <FormattedMessage
                            id={"per.wallet"}
                            defaultMessage={"per wallet"}
                          />
                        </Typography>
                      </Stack>
                    </Stack>

                    {nextPhase && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">
                          <FormattedMessage
                            id="current.phase.ends.in"
                            defaultMessage="Current phase ends in"
                          />
                          :
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {countDown}
                        </Typography>
                      </Stack>
                    )}

                    {nextPhase && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">
                          <FormattedMessage
                            id="price.in.next.phase"
                            defaultMessage="Price in next phase"
                          />
                          :
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {nextPhase?.currencyMetadata?.displayValue}{" "}
                          {nextPhase?.currencyMetadata?.symbol}
                        </Typography>
                      </Stack>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <FormattedMessage
                          id={"quantity"}
                          defaultMessage={"Quantity"}
                        />
                      </Typography>
                      <QuantityField
                        id="quantity-field"
                        type={"number"}
                        value={quantity}
                        onChange={(ev: any) =>
                          setQuantity(Number(ev.currentTarget.value))
                        }
                        disabled={quantity > maxClaimable}
                        variant="standard"
                        inputProps={{
                          min: 1,
                          max: maxClaimable,
                        }}
                        sx={{ maxWidth: 200 }}
                      />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      {isSoldOut ? (
                        <Typography variant="h4" color="error" fontWeight="bold">
                          <FormattedMessage
                            id={"sold.out"}
                            defaultMessage={"Sold out"}
                          />
                        </Typography>
                      ) : !account ? (
                        <ConnectWalletButton />
                      ) : chainId !== networkChainId ? (
                        <SwitchNetworkButtonWithWarning
                          desiredChainId={networkChainId}
                          fullWidth
                        />
                      ) : (
                        <Button
                          disabled={
                            !canClaim ||
                            buttonLoading ||
                            allowanceMutation.isLoading ||
                            approveMutation.isLoading
                          }
                          sx={{ maxWidth: "300px" }}
                          variant="contained"
                          size="large"
                          onClick={async () => {
                            if (editionDrop) {
                              // it's an erc 20 we need to check allowance
                              if (
                                activeClaimCondition.data?.currencyAddress.toLowerCase() !==
                                NATIVE_TOKEN_ADDRESS
                              ) {
                                const allowance =
                                  await allowanceMutation.mutateAsync({
                                    spender: address,
                                    account,
                                    tokenAddress:
                                      activeClaimCondition.data?.currencyAddress,
                                  });
                                // we need to approve token
                                if (
                                  allowance &&
                                  (allowance as BigNumber).lt(totalAmount)
                                ) {
                                  const values = {
                                    name: activeClaimCondition.data
                                      ?.currencyMetadata.symbol,
                                    symbol:
                                      activeClaimCondition.data?.currencyMetadata
                                        .symbol,
                                  };

                                  watchTransactionDialog.open("approve", values);
                                  await approveMutation.mutateAsync({
                                    spender: address,
                                    amount: totalAmount,
                                    tokenAddress:
                                      activeClaimCondition.data?.currencyAddress,
                                  });
                                }
                              }

                              const values = {
                                tokenId,
                                quantity: String(quantity),
                                name: String(contractMetadata?.name || " "),
                              };

                              watchTransactionDialog.open(
                                "mintEditionDrop",
                                values
                              );
                              const result = await editionDrop.erc1155.claim(
                                tokenId,
                                quantity
                              );

                              const metadata = {
                                tokenId,
                                quantity: String(quantity),
                                name: String(contractMetadata?.name || " "),
                                price:
                                  activeClaimCondition.data?.price.toString(),
                                currency:
                                  activeClaimCondition.data?.currencyAddress,
                                address,
                              };

                              trackUserEventsMutation.mutate({
                                event: UserEvents.buyDropEdition,
                                chainId,
                                hash: result.receipt.transactionHash,
                                metadata: JSON.stringify(metadata),
                              });

                              createNotification({
                                type: "transaction",
                                subtype: "mintEditionDrop",
                                values,
                                metadata: {
                                  chainId,
                                  hash: result.receipt.transactionHash,
                                },
                              });

                              watchTransactionDialog.watch(
                                result.receipt.transactionHash
                              );
                            }
                          }}
                        >
                          {buttonLoading ? (
                            <>
                              <FormattedMessage
                                id={"loading"}
                                defaultMessage={"Loading"}
                              />
                              ...
                            </>
                          ) : (
                            buttonText
                          )}
                        </Button>
                      )}
                    </Box>
                  </Stack>
                ) : (
                  <Alert severity="info">
                    <FormattedMessage
                      id={"drop.not.ready.to.mint.yet"}
                      defaultMessage={
                        "This drop is not ready to be minted yet."
                      }
                    />
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditionDropSection;
