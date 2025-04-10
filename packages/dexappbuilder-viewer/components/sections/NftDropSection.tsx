import { useIsMobile } from "@dexkit/core";
import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { ConnectWalletButton } from "@dexkit/ui/components/ConnectWalletButton";
import { SwitchNetworkButton } from "@dexkit/ui/components/SwitchNetworkButton";
import { useDexKitContext } from "@dexkit/ui/hooks";
import { useInterval } from "@dexkit/ui/hooks/misc";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useClaimNft } from "@dexkit/ui/modules/nft/hooks/thirdweb";
import { NftDropPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  ClaimEligibility,
  detectContractFeature,
  useActiveClaimConditionForWallet,
  useClaimConditions,
  useClaimIneligibilityReasons,
  useClaimedNFTSupply,
  useClaimerProofs,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
  useUnclaimedNFTSupply,
} from "@thirdweb-dev/react";

import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import NFTGrid from "../NFTGrid";
import NFTDropSummary from "../NftDropSummary";

export interface NftDropSectionProps {
  section: NftDropPageSection;
}

export default function NftDropSection({ section }: NftDropSectionProps) {
  const trackUserEventsMutation = useTrackUserEventsMutation();
  const { address, network } = section.settings;
  const networkChainId = NETWORK_FROM_SLUG(network)?.chainId;
  const { createNotification, watchTransactionDialog } = useDexKitContext();
  const { contract } = useContract(address as string, "nft-drop");

  const { data } = useClaimConditions(contract);

  const { account, chainId } = useWeb3React();

  const contractMetadataQuery = useContractMetadata(contract);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    account || ""
  );

  const [count, setCount] = useState<number>(0);

  const nextPhase = useMemo(() => {
    const active = activeClaimCondition.data;
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
  }, [activeClaimCondition.data, data]);

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

  const claimerProofs = useClaimerProofs(contract, address || "");

  const [quantity, setQuantity] = useState(1);

  const claimIneligibilityReasons = useClaimIneligibilityReasons(contract, {
    quantity,
    walletAddress: account || "",
  });

  const unclaimedSupply = useUnclaimedNFTSupply(contract);

  const claimedSupply = useClaimedNFTSupply(contract);

  const nfts = useOwnedNFTs(contract, account || "");

  const parseIneligibility = (reasons: ClaimEligibility[], quantity = 0) => {
    if (!reasons.length) {
      return "";
    }

    const reason = reasons[0];

    if (
      reason === ClaimEligibility.Unknown ||
      reason === ClaimEligibility.NoActiveClaimPhase ||
      reason === ClaimEligibility.NoClaimConditionSet
    ) {
      return (
        <FormattedMessage
          id="this.drop.is.not.ready.to.be.minted."
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
            id="you.are.not.eligible.to.mint.quantity.tokens"
            defaultMessage="You are not eligible to mint {quantity} tokens."
            values={{ quantity }}
          />
        );
      }

      return (
        <FormattedMessage
          id="You.are.not.eligible.to.mint.at.this.time."
          defaultMessage="You are not eligible to mint at this time."
        />
      );
    }

    return reason.toString();
  };

  const numberClaimed = useMemo(() => {
    return BigInt(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    return (
      BigInt(claimedSupply.data || 0) + BigInt(unclaimedSupply.data || 0)
    ).toString();
  }, [claimedSupply.data, unclaimedSupply.data]);

  const isOpenEdition = useMemo(() => {
    if (contract) {
      const contractWrapper = (contract as any).contractWrapper as any;

      const featureDetected = detectContractFeature(
        contractWrapper,
        "ERC721SharedMetadata"
      );

      return featureDetected;
    }
    return false;
  }, [contract]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigInt(
        activeClaimCondition.data?.maxClaimableSupply || 0
      );
    } catch (e) {
      bnMaxClaimable = BigInt(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigInt(
        activeClaimCondition.data?.maxClaimablePerWallet || 0
      );
    } catch (e) {
      perTransactionClaimable = BigInt(1_000_000);
    }

    if (BigInt(perTransactionClaimable) <= BigInt(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigInt(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigInt(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    const maxAvailable = BigInt(unclaimedSupply.data || 0);

    let max;
    if (BigInt(maxAvailable) < BigInt(bnMaxClaimable) && !isOpenEdition) {
      max = maxAvailable;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    unclaimedSupply.data,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigInt(activeClaimCondition.data?.availableSupply || 0) <=
            BigInt(0)) ||
        (numberClaimed === numberTotal && !isOpenEdition)
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
    isOpenEdition,
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
      activeClaimCondition.isLoading ||
      unclaimedSupply.isLoading ||
      claimedSupply.isLoading ||
      !contract
    );
  }, [
    activeClaimCondition.isLoading,
    contract,
    claimedSupply.isLoading,
    unclaimedSupply.isLoading,
  ]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigInt(
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

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );

  const buttonMessage = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id="sold.out" defaultMessage="Sold Out" />;
    }

    if (canClaim) {
      const pricePerToken = BigInt(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );

      if (pricePerToken.eq(0)) {
        return <FormattedMessage id="claim.free" defaultMessage="Claim free" />;
      }

      return (
        <FormattedMessage
          id="clain.priceToMint"
          defaultMessage="Claim ({priceToMint})"
          values={{ priceToMint }}
        />
      );
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return (
        <FormattedMessage
          id="checking.eligibility"
          defaultMessage="Checking eligibility..."
        />
      );
    }

    return (
      <FormattedMessage
        id="Claiming not available"
        defaultMessage="Claiming not available"
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

  const nftDropClaim = useClaimNft({ contract });

  const handleClaimNft = async () => {
    const values = {
      quantity: String(quantity),
      name: String(contractMetadataQuery.data?.name || " "),
    };

    watchTransactionDialog.open("mintNFTDrop", values);
    const transaction = await nftDropClaim.mutateAsync({ quantity });

    if (transaction) {
      const tx = await transaction.send();

      watchTransactionDialog.watch(tx.hash);

      createNotification({
        type: "transaction",
        subtype: "mintNFTDrop",
        values,
        metadata: {
          chainId,
          hash: tx.hash,
        },
      });
      const metadata = {
        name: contractMetadataQuery.data?.name,
        quantity: String(quantity),
        price: activeClaimCondition.data?.price.toString(),
        currency: activeClaimCondition.data?.currencyAddress,
        address,
      };
      await tx.wait(1);

      trackUserEventsMutation.mutate({
        event: UserEvents.buyDropCollection,
        chainId,
        hash: tx.hash,
        metadata: JSON.stringify(metadata),
      });
    }
  };

  const isMobile = useIsMobile();

  const renderContent = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">
            <FormattedMessage id="my.nfts" defaultMessage="My NFTs" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {nfts.data && (
            <NFTGrid nfts={nfts.data} network={network} address={address} />
          )}
        </Grid>
      </Grid>
    );
  };

  const renderClaim = () => {
    return (
      <Box>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: { sm: "flex-start", xs: "center" } }}
        >
          <Grid item xs={12}>
            <Stack
              justifyContent={{ xs: "center", sm: "flex-start" }}
              alignItems="center"
              direction="row"
            >
              {contractMetadataQuery.data?.image && (
                <Avatar
                  src={contractMetadataQuery.data?.image}
                  alt={contractMetadataQuery.data?.name!}
                  sx={{
                    height: "6rem",
                    width: "6rem",
                    objectFit: "cover",
                    aspectRatio: "1/1",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                />
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography
                sx={{ textAlign: { sm: "left", xs: "center" } }}
                variant="h5"
              >
                <FormattedMessage id="claim.nfts" defaultMessage="Claim NFTs" />
              </Typography>
              <Typography
                sx={{ textAlign: { sm: "left", xs: "center" } }}
                variant="body1"
              >
                <FormattedMessage
                  id="claim.erc721.tokens.from.contractName"
                  defaultMessage="Claim ERC721 Tokens from {contractName}"
                  values={{
                    contractName: (
                      <strong>{contractMetadataQuery.data?.name}</strong>
                    ),
                  }}
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          {section.settings.variant === "detailed" && (
            <>
              <Grid item xs={12}>
                <NFTDropSummary contract={contract} />
              </Grid>
              {activeClaimCondition.data?.metadata?.name && (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    spacing={2}
                  >
                    <Typography variant="body1">
                      <b>
                        <FormattedMessage
                          id="current.phase"
                          defaultMessage="Current phase"
                        />
                        :
                      </b>
                    </Typography>
                    <Typography color="text.secondary">
                      {activeClaimCondition.data?.metadata?.name}
                    </Typography>
                  </Stack>
                </Grid>
              )}
              {nextPhase && (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    spacing={2}
                  >
                    <Typography variant="body1">
                      <b>
                        <FormattedMessage
                          id="current.phase.ends.in"
                          defaultMessage="Current phase ends in"
                        />
                        :
                      </b>
                    </Typography>
                    <Typography color="text.secondary">{countDown}</Typography>
                  </Stack>
                </Grid>
              )}
              {nextPhase && (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    spacing={2}
                  >
                    <Typography variant="body1">
                      <b>
                        <FormattedMessage
                          id="price.in.next.phase"
                          defaultMessage="Price in next phase"
                        />
                        :
                      </b>
                    </Typography>
                    <Typography color="text.secondary">
                      {nextPhase?.currencyMetadata?.displayValue}{" "}
                      {nextPhase?.currencyMetadata?.symbol}
                    </Typography>
                  </Stack>
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12}>
            {isSoldOut ? (
              <Typography variant={"h2"}>
                <FormattedMessage id={"sold.out"} defaultMessage={"Sold out"} />
              </Typography>
            ) : !account ? (
              <ConnectWalletButton />
            ) : chainId !== networkChainId ? (
              <Box>
                <SwitchNetworkButton desiredChainId={networkChainId} />
              </Box>
            ) : (
              <Button
                onClick={handleClaimNft}
                startIcon={
                  nftDropClaim.isLoading ? (
                    <CircularProgress size="1rem" color="inherit" />
                  ) : undefined
                }
                sx={{ width: { sm: "auto", xs: "100%" } }}
                disabled={!canClaim || nftDropClaim.isLoading}
                variant="contained"
              >
                {buttonMessage}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderClaim()}
        </Grid>
        {section.settings.variant === "detailed" ? (
          <Grid item xs={12}>
            <Box>{renderContent()}</Box>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
}
