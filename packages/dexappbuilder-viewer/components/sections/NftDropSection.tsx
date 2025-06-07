import { useIsMobile } from "@dexkit/core";
import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { ConnectWalletMessage, SwitchNetworkButtonWithWarning } from "@dexkit/ui/components";
import { ConnectWalletButton } from "@dexkit/ui/components/ConnectWalletButton";
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
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
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
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import NFTGrid from "../NFTGrid";
import NFTDropSummary from "../NftDropSummary";

export interface NftDropSectionProps {
  section: NftDropPageSection;
}

export default function NftDropSection({ section }: NftDropSectionProps) {
  const theme = useTheme();
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
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0)
      .add(BigNumber.from(unclaimedSupply.data || 0))
      .toString();
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

    const maxAvailable = BigNumber.from(unclaimedSupply.data || 0);

    let max;
    if (maxAvailable.lt(bnMaxClaimable) && !isOpenEdition) {
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
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0
          )) ||
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

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );

  const buttonMessage = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id="sold.out" defaultMessage="Sold Out" />;
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
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
    if (section.settings.variant === "premium") {
      return (
        <Container maxWidth="sm" sx={{ px: { xs: theme.spacing(0.5), sm: theme.spacing(1), md: theme.spacing(2) }, py: { xs: theme.spacing(1), sm: theme.spacing(2) } }}>
          <Stack spacing={{ xs: theme.spacing(1), sm: theme.spacing(1.5), md: theme.spacing(2) }}>
            {isLoading ? (
              !account ? (
                <ConnectWalletMessage
                  variant="compact"
                  title={
                    <FormattedMessage
                      id="connect.wallet.to.view.nft.drop"
                      defaultMessage="Connect wallet to view NFT drop details"
                    />
                  }
                  subtitle={
                    <FormattedMessage
                      id="connect.wallet.nft.drop.subtitle"
                      defaultMessage="Connect your wallet to see NFT information and claim NFTs"
                    />
                  }
                />
              ) : (
                <Box>
                  <Stack>
                    <Skeleton height="4rem" width="4rem" variant="circular" />
                    <Box>
                      <Typography align="center" variant="h5">
                        <Skeleton />
                      </Typography>
                      <Typography align="center" variant="body1">
                        <Skeleton />
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )
            ) : (
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
                  borderRadius: theme.shape.borderRadius * 2,
                  p: { xs: theme.spacing(1.5), sm: theme.spacing(2), md: theme.spacing(3) },
                  border: `1px solid ${theme.palette.primary.main}20`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: theme.spacing(-6.25),
                    right: theme.spacing(-6.25),
                    width: theme.spacing(12.5),
                    height: theme.spacing(12.5),
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                    zIndex: 0,
                  }}
                />

                <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ position: 'relative', zIndex: 1 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: theme.spacing(1), sm: theme.spacing(2), md: theme.spacing(3) }}
                    alignItems="center"
                  >
                    {contractMetadataQuery.data?.image && (
                      <Avatar
                        src={contractMetadataQuery.data?.image}
                        alt={contractMetadataQuery.data?.name!}
                        sx={{
                          height: { xs: theme.spacing(7), sm: theme.spacing(8), md: theme.spacing(10) },
                          width: { xs: theme.spacing(7), sm: theme.spacing(8), md: theme.spacing(10) },
                          objectFit: "contain",
                          aspectRatio: "1/1",
                          border: `${theme.spacing(0.25)} solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
                          flexShrink: 0,
                          order: { xs: 1, sm: 0 },
                        }}
                      />
                    )}

                    <Box sx={{ flex: 1, textAlign: "center", minWidth: 0, order: { xs: 2, sm: 0 } }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: { xs: theme.spacing(0.5), sm: theme.spacing(0.5) },
                          fontSize: { xs: theme.typography.h5.fontSize, sm: theme.typography.h4.fontSize, md: theme.typography.h3.fontSize },
                          lineHeight: 1.2,
                        }}
                      >
                        <FormattedMessage
                          id="claim.nfts"
                          defaultMessage="Claim NFTs"
                        />
                      </Typography>

                      <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{
                          fontWeight: 500,
                          mb: { xs: theme.spacing(0.5), sm: theme.spacing(0.5) },
                          fontSize: { xs: theme.typography.body1.fontSize, sm: theme.typography.body1.fontSize },
                        }}
                      >
                        {contractMetadataQuery.data?.name}
                      </Typography>

                      {contractMetadataQuery.data?.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: theme.spacing(62.5),
                            fontSize: { xs: theme.typography.body2.fontSize, sm: theme.typography.body2.fontSize },
                            lineHeight: 1.4,
                            display: { xs: '-webkit-box', sm: 'block' },
                            WebkitLineClamp: { xs: 3, sm: 'unset' },
                            WebkitBoxOrient: { xs: 'vertical', sm: 'unset' },
                            overflow: { xs: 'hidden', sm: 'visible' },
                            mx: 'auto',
                          }}
                        >
                          {contractMetadataQuery.data.description}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={{ xs: 0.5, sm: 1 }}
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.25, sm: 0.5 },
                        px: { xs: 0.75, sm: 1 },
                        py: { xs: 0.125, sm: 0.25 },
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: 1,
                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                        fontWeight: 500,
                        minWidth: 'fit-content',
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 4, sm: 6 },
                          height: { xs: 4, sm: 6 },
                          borderRadius: '50%',
                          backgroundColor: theme.palette.success.main,
                        }}
                      />
                      <FormattedMessage
                        id="contract.active"
                        defaultMessage="Contract Active"
                      />
                    </Box>

                    {!isSoldOut && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 0.25, sm: 0.5 },
                          px: { xs: 0.75, sm: 1 },
                          py: { xs: 0.125, sm: 0.25 },
                          backgroundColor: theme.palette.info.light + '20',
                          color: theme.palette.info.main,
                          borderRadius: 1,
                          fontSize: { xs: '0.6rem', sm: '0.7rem' },
                          fontWeight: 500,
                          minWidth: 'fit-content',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 4, sm: 6 },
                            height: { xs: 4, sm: 6 },
                            borderRadius: '50%',
                            backgroundColor: theme.palette.info.main,
                          }}
                        />
                        <FormattedMessage
                          id="nfts.available"
                          defaultMessage="NFTs Available"
                        />
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </Box>
            )}
          </Stack>
        </Container>
      );
    }

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
              <SwitchNetworkButtonWithWarning desiredChainId={networkChainId} fullWidth />
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

  if (section.settings.variant === "premium") {
    return (
      <Container maxWidth="sm" sx={{ px: { xs: 0.5, sm: 1, md: 2 }, py: { xs: 1, sm: 2 } }}>
        <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
          {renderClaim()}

          <Divider />

          <Box>
            <Paper
              elevation={2}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                borderRadius: { xs: 2, sm: 3 },
                p: { xs: 2, sm: 3 },
                border: `1px solid ${theme.palette.primary.main}30`,
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <FormattedMessage
                      id="drop.statistics"
                      defaultMessage="Drop Statistics"
                    />
                  </Typography>
                  <NFTDropSummary contract={contract} />
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 2 }}>
                  {activeClaimCondition.data?.metadata?.name && (
                    <Paper
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        <FormattedMessage
                          id="current.phase"
                          defaultMessage="Current Phase"
                        />
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {activeClaimCondition.data?.metadata?.name}
                      </Typography>
                    </Paper>
                  )}

                  {nextPhase && countDown && (
                    <Paper
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        backgroundColor: 'warning.light',
                        borderColor: 'warning.main',
                        '&.MuiPaper-outlined': {
                          borderColor: 'warning.main',
                        },
                      }}
                    >
                      <Typography variant="caption" color="warning.main" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        <FormattedMessage
                          id="phase.ends.in"
                          defaultMessage="Phase Ends In"
                        />
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: 'warning.main' }}>
                        {countDown}
                      </Typography>
                    </Paper>
                  )}
                </Stack>

                {nextPhase && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      backgroundColor: 'info.light',
                      borderColor: 'info.main',
                      '&.MuiPaper-outlined': {
                        borderColor: 'info.main',
                      },
                    }}
                  >
                    <Typography variant="caption" color="info.main" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      <FormattedMessage
                        id="next.phase.price"
                        defaultMessage="Next Phase Price"
                      />
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, color: 'info.main' }}>
                      {nextPhase?.currencyMetadata?.displayValue} {nextPhase?.currencyMetadata?.symbol}
                    </Typography>
                  </Paper>
                )}

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <FormattedMessage
                      id="security.features"
                      defaultMessage="Security Features"
                    />
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Box
                      component="span"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        border: `1px solid ${theme.palette.success.main}30`,
                      }}
                    >
                      ✓ Smart Contract Verified
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        border: `1px solid ${theme.palette.success.main}30`,
                      }}
                    >
                      ✓ Secure Minting
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        border: `1px solid ${theme.palette.success.main}30`,
                      }}
                    >
                      ✓ DexKit Powered
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Box>

          <Paper
            elevation={2}
            sx={{
              borderRadius: { xs: 2, sm: 3 },
              p: { xs: 2, sm: 3 },
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: { xs: 2, sm: 3 } }}>
              <FormattedMessage
                id="claim.your.nfts"
                defaultMessage="Claim Your NFTs"
              />
            </Typography>

            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="quantity.to.claim"
                    defaultMessage="Quantity to Claim"
                  />
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: maxClaimable }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 500,
                    },
                  }}
                />
                {maxClaimable > 1 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    <FormattedMessage
                      id="max.claimable"
                      defaultMessage="Maximum claimable: {max}"
                      values={{ max: maxClaimable }}
                    />
                  </Typography>
                )}
              </Box>

              {priceToMint && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.main',
                    '&.MuiPaper-outlined': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                  >
                    <Typography variant="body2" color="white">
                      <FormattedMessage
                        id="total.cost"
                        defaultMessage="Total Cost"
                      />
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {priceToMint}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {isSoldOut ? (
                <Typography variant="h6" color="error" sx={{ textAlign: 'center', py: 2 }}>
                  <FormattedMessage id="sold.out" defaultMessage="Sold out" />
                </Typography>
              ) : !account ? (
                <ConnectWalletButton />
              ) : chainId !== networkChainId ? (
                <SwitchNetworkButtonWithWarning desiredChainId={networkChainId} fullWidth />
              ) : (
                <Button
                  size="large"
                  disabled={!canClaim || nftDropClaim.isLoading}
                  startIcon={
                    nftDropClaim.isLoading ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : undefined
                  }
                  fullWidth
                  onClick={handleClaimNft}
                  variant="contained"
                  color="primary"
                  sx={{
                    py: { xs: 1.2, sm: 1.5 },
                    borderRadius: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: { xs: 44, sm: 48 },
                    '&.Mui-disabled': {
                      color: theme.palette.text.disabled,
                      backgroundColor: theme.palette.action.disabledBackground,
                    },
                  }}
                >
                  {buttonMessage}
                </Button>
              )}

              {nfts.data && nfts.data.length > 0 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage
                      id="you.own.nfts.count"
                      defaultMessage="You own {count} NFT(s) from this collection"
                      values={{ count: nfts.data.length }}
                    />
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {nfts.data && nfts.data.length > 0 && (
            <Paper
              elevation={2}
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                p: { xs: 2, sm: 3 },
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: { xs: 2, sm: 3 } }}>
                <FormattedMessage id="my.nfts" defaultMessage="My NFTs" />
              </Typography>
              <NFTGrid nfts={nfts.data} network={network} address={address} />
            </Paper>
          )}
        </Stack>
      </Container>
    );
  }

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
