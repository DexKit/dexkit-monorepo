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
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NFTGrid from "../NFTGrid";
import NFTDropSummary from "../NftDropSummary";

const generateCustomStyles = (customStyles: any, theme: any) => {
  if (!customStyles) return {};

  const styles: any = {};

  if (customStyles.backgroundColor?.type === 'solid' && customStyles.backgroundColor.solid) {
    styles.backgroundColor = customStyles.backgroundColor.solid;
  } else if (customStyles.backgroundColor?.type === 'gradient' && customStyles.backgroundColor.gradient) {
    const { from, to, direction = 'to-r' } = customStyles.backgroundColor.gradient;
    if (from && to) {
      const directionMap: any = {
        'to-r': '90deg',
        'to-br': '135deg',
        'to-b': '180deg',
        'to-bl': '225deg',
        'to-l': '270deg',
        'to-tl': '315deg',
        'to-t': '0deg',
        'to-tr': '45deg',
      };
      styles.background = `linear-gradient(${directionMap[direction] || '90deg'}, ${from}, ${to})`;
    }
  }

  if (customStyles.fontFamily) {
    styles.fontFamily = customStyles.fontFamily;
  }

  if (customStyles.borderRadius !== undefined) {
    styles.borderRadius = `${customStyles.borderRadius}px`;
  }

  return styles;
};

const generateInputStyles = (customStyles: any) => {
  if (!customStyles?.inputColors) return {};

  const styles: any = {};

  if (customStyles.inputColors.backgroundColor) {
    styles.backgroundColor = customStyles.inputColors.backgroundColor;
  }
  if (customStyles.inputColors.textColor) {
    styles.color = customStyles.inputColors.textColor;
  }

  if (customStyles.inputColors.borderColor) {
    styles['& .MuiOutlinedInput-notchedOutline'] = {
      borderColor: customStyles.inputColors.borderColor,
    };
  }

  if (customStyles.inputColors.focusBorderColor) {
    styles['&:hover .MuiOutlinedInput-notchedOutline'] = {
      borderColor: customStyles.inputColors.focusBorderColor,
    };
    styles['&.Mui-focused .MuiOutlinedInput-notchedOutline'] = {
      borderColor: customStyles.inputColors.focusBorderColor,
    };
  }

  return styles;
};

const generateButtonStyles = (customStyles: any) => {
  if (!customStyles?.buttonColors) return {};

  const styles: any = {};

  if (customStyles.buttonColors.backgroundColor) {
    styles.backgroundColor = customStyles.buttonColors.backgroundColor;
  }
  if (customStyles.buttonColors.textColor) {
    styles.color = customStyles.buttonColors.textColor;
  }
  if (customStyles.buttonColors.borderColor) {
    styles.borderColor = customStyles.buttonColors.borderColor;
  }

  if (customStyles.buttonColors.hoverBackgroundColor) {
    styles['&:hover'] = {
      backgroundColor: customStyles.buttonColors.hoverBackgroundColor,
    };
  }

  return styles;
};

const generateTextStyles = (customStyles: any, variant: 'primary' | 'secondary' | 'accent' | 'chipsTitle' | 'balanceLabel' | 'balanceValue' | 'contractDescription' | 'quantityLabel' | 'maxPerWalletLabel' | 'currentBalanceLabel' | 'maxTotalPhaseLabel' | 'availableRemainingLabel' | 'totalCostLabel' | 'totalCostValue' = 'primary') => {
  if (!customStyles?.textColors) return {};

  let color;
  switch (variant) {
    case 'primary':
      color = customStyles.textColors.primary;
      break;
    case 'secondary':
      color = customStyles.textColors.secondary;
      break;
    case 'accent':
      color = customStyles.textColors.accent;
      break;
    case 'chipsTitle':
      color = customStyles.textColors.chipsTitle;
      break;
    case 'balanceLabel':
      color = customStyles.textColors.balanceLabel;
      break;
    case 'balanceValue':
      color = customStyles.textColors.balanceValue;
      break;
    case 'contractDescription':
      color = customStyles.textColors.contractDescription;
      break;
    case 'quantityLabel':
      color = customStyles.textColors.quantityLabel;
      break;
    case 'maxPerWalletLabel':
      color = customStyles.textColors.maxPerWalletLabel;
      break;
    case 'currentBalanceLabel':
      color = customStyles.textColors.currentBalanceLabel;
      break;
    case 'maxTotalPhaseLabel':
      color = customStyles.textColors.maxTotalPhaseLabel;
      break;
    case 'availableRemainingLabel':
      color = customStyles.textColors.availableRemainingLabel;
      break;
    case 'totalCostLabel':
      color = customStyles.textColors.totalCostLabel;
      break;
    case 'totalCostValue':
      color = customStyles.textColors.totalCostValue;
      break;
    default:
      color = customStyles.textColors.primary;
  }

  return color ? { color } : {};
};

const generateTotalCostStyles = (customStyles: any) => {
  if (!customStyles?.totalCostColors) return {};

  const styles: any = {};

  if (customStyles.totalCostColors.backgroundColor) {
    styles.backgroundColor = customStyles.totalCostColors.backgroundColor;
  }
  if (customStyles.totalCostColors.borderColor) {
    styles.borderColor = customStyles.totalCostColors.borderColor;
    styles['&.MuiPaper-outlined'] = {
      borderColor: customStyles.totalCostColors.borderColor,
    };
  }

  return styles;
};

export interface NftDropSectionProps {
  section: NftDropPageSection;
}

const loadGoogleFont = (fontFamily: string) => {
  if (!fontFamily || fontFamily === 'inherit') return;

  const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
};

export default function NftDropSection({ section }: NftDropSectionProps) {
  const { formatMessage } = useIntl();
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
        <Grid size={12}>
          <Typography variant="h5">
            <FormattedMessage id="my.nfts" defaultMessage="My NFTs" />
          </Typography>
        </Grid>
        <Grid size={12}>
          {nfts.data && (
            <NFTGrid nfts={nfts.data} network={network} address={address} />
          )}
        </Grid>
      </Grid>
    );
  };

  const renderClaim = () => {
    if ((section.settings.variant as any) === "premium") {
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
                  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
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
                          fontWeight: theme.typography.fontWeightBold,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: { xs: theme.spacing(0.5), sm: theme.spacing(0.5) },
                          fontSize: { xs: theme.typography.h5.fontSize, sm: theme.typography.h4.fontSize, md: theme.typography.h3.fontSize },
                          lineHeight: theme.typography.h4.lineHeight,
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
                          fontWeight: theme.typography.fontWeightMedium,
                          mb: { xs: theme.spacing(0.5), sm: theme.spacing(0.5) },
                          fontSize: { xs: theme.typography.body1.fontSize, sm: theme.typography.body1.fontSize },
                        }}
                      >
                        {contractMetadataQuery.data?.name}
                      </Typography>

                      {contractMetadataQuery.data?.description && (
                        <Box
                          sx={{
                            maxWidth: theme.spacing(62.5),
                            fontSize: { xs: theme.typography.body2.fontSize, sm: theme.typography.body2.fontSize },
                            lineHeight: theme.typography.body2.lineHeight,
                            display: { xs: '-webkit-box', sm: 'block' },
                            WebkitLineClamp: { xs: 3, sm: 'unset' },
                            WebkitBoxOrient: { xs: 'vertical', sm: 'unset' },
                            overflow: { xs: 'hidden', sm: 'visible' },
                            mx: 'auto',
                            ...generateTextStyles(section.settings.customStyles, 'contractDescription'),
                            fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                            "& p": {
                              margin: 0,
                              fontSize: "inherit",
                              lineHeight: "inherit",
                              color: "inherit",
                            },
                            "& p:not(:last-child)": {
                              marginBottom: 0.5,
                            },
                            "& strong": {
                              fontWeight: 600,
                            },
                            "& em": {
                              fontStyle: "italic",
                            },
                            "& code": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                              padding: theme.spacing(0.125, 0.25),
                              borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 0.25 : theme.shape.borderRadius,
                              fontSize: "0.9em",
                            },
                          }}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {contractMetadataQuery.data.description}
                          </ReactMarkdown>
                        </Box>
                      )}
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={{ xs: theme.spacing(0.5), sm: theme.spacing(1) }}
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: theme.spacing(0.25), sm: theme.spacing(0.5) },
                        px: { xs: theme.spacing(0.75), sm: theme.spacing(1) },
                        py: { xs: theme.spacing(0.125), sm: theme.spacing(0.25) },
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: theme.shape.borderRadius,
                        fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize },
                        fontWeight: theme.typography.fontWeightMedium,
                        minWidth: 'fit-content',
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: theme.spacing(0.5), sm: theme.spacing(0.75) },
                          height: { xs: theme.spacing(0.5), sm: theme.spacing(0.75) },
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
                          gap: { xs: theme.spacing(0.25), sm: theme.spacing(0.5) },
                          px: { xs: theme.spacing(0.75), sm: theme.spacing(1) },
                          py: { xs: theme.spacing(0.125), sm: theme.spacing(0.25) },
                          backgroundColor: theme.palette.success.dark + '20',
                          color: theme.palette.success.dark,
                          borderRadius: theme.shape.borderRadius,
                          fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize },
                          fontWeight: theme.typography.fontWeightMedium,
                          minWidth: 'fit-content',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: theme.spacing(0.5), sm: theme.spacing(0.75) },
                            height: { xs: theme.spacing(0.5), sm: theme.spacing(0.75) },
                            borderRadius: '50%',
                            backgroundColor: theme.palette.success.dark,
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
          <Grid size={12}>
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

          <Grid size={12}>
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

          <Grid size={12}>
            <Divider />
          </Grid>
          {section.settings.variant === "detailed" && (
            <>
              <Grid size={12}>
                <NFTDropSummary contract={contract} />
              </Grid>
              {activeClaimCondition.data?.metadata?.name && (
                <Grid size={12}>
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
                <Grid size={12}>
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
                <Grid size={12}>
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

          <Grid size={12}>
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

  useEffect(() => {
    if (section.settings.customStyles?.fontFamily) {
      loadGoogleFont(section.settings.customStyles.fontFamily);
    }
  }, [section.settings.customStyles?.fontFamily]);

  if ((section.settings.variant as any) === "premium") {
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
              <Stack spacing={{ xs: theme.spacing(2), sm: theme.spacing(3) }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <FormattedMessage
                      id="drop.statistics"
                      defaultMessage="Drop Statistics"
                    />
                  </Typography>
                  <NFTDropSummary contract={contract} />
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: theme.spacing(1.5), sm: theme.spacing(2) }}>
                  {activeClaimCondition.data?.metadata?.name && (
                    <Paper
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                        borderRadius: section.settings.customStyles?.borderRadius !== undefined
                          ? `${section.settings.customStyles.borderRadius}px`
                          : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                        backgroundColor: section.settings.customStyles?.phaseColors?.currentPhaseBackground || "background.paper",
                        borderColor: section.settings.customStyles?.phaseColors?.currentPhaseBorder || "divider",
                        "&.MuiPaper-outlined": {
                          borderColor: section.settings.customStyles?.phaseColors?.currentPhaseBorder || "divider",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          letterSpacing: theme.spacing(0.125),
                          color: section.settings.customStyles?.phaseColors?.currentPhaseTitle || "text.secondary",
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        <FormattedMessage
                          id="current.phase"
                          defaultMessage="Current Phase"
                        />
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          mt: theme.spacing(0.5),
                          color: section.settings.customStyles?.phaseColors?.currentPhaseText || "text.primary",
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
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
                        borderRadius: section.settings.customStyles?.borderRadius !== undefined
                          ? `${section.settings.customStyles.borderRadius}px`
                          : 2,
                        backgroundColor: section.settings.customStyles?.phaseColors?.phaseEndsBackground || 'warning.light',
                        borderColor: section.settings.customStyles?.phaseColors?.phaseEndsBorder || 'warning.main',
                        '&.MuiPaper-outlined': {
                          borderColor: section.settings.customStyles?.phaseColors?.phaseEndsBorder || 'warning.main',
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          color: section.settings.customStyles?.phaseColors?.phaseEndsTitle || 'warning.main',
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        <FormattedMessage
                          id="phase.ends.in"
                          defaultMessage="Phase Ends In"
                        />
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          mt: 0.5,
                          color: section.settings.customStyles?.phaseColors?.phaseEndsText || 'warning.main',
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
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
                      borderRadius: section.settings.customStyles?.borderRadius !== undefined
                        ? `${section.settings.customStyles.borderRadius}px`
                        : 2,
                      backgroundColor: section.settings.customStyles?.phaseColors?.nextPhaseBackground || 'info.light',
                      borderColor: section.settings.customStyles?.phaseColors?.nextPhaseBorder || 'info.main',
                      '&.MuiPaper-outlined': {
                        borderColor: section.settings.customStyles?.phaseColors?.nextPhaseBorder || 'info.main',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: section.settings.customStyles?.phaseColors?.nextPhaseTitle || 'info.main',
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      <FormattedMessage
                        id="next.phase.price"
                        defaultMessage="Next Phase Price"
                      />
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mt: 0.5,
                        color: section.settings.customStyles?.phaseColors?.nextPhaseText || 'info.main',
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
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
                  <Stack direction="row" spacing={theme.spacing(1)} flexWrap="wrap" useFlexGap>
                    <Box
                      component="span"
                      sx={{
                        px: theme.spacing(1.5),
                        py: theme.spacing(0.5),
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: theme.shape.borderRadius,
                        fontSize: theme.typography.caption.fontSize,
                        fontWeight: theme.typography.fontWeightMedium,
                        border: `1px solid ${theme.palette.success.main}30`,
                      }}
                    >
                      ✓ Smart Contract Verified
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        px: theme.spacing(1.5),
                        py: theme.spacing(0.5),
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: theme.shape.borderRadius,
                        fontSize: theme.typography.caption.fontSize,
                        fontWeight: theme.typography.fontWeightMedium,
                        border: `1px solid ${theme.palette.success.main}30`,
                      }}
                    >
                      ✓ Secure Minting
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        px: theme.spacing(1.5),
                        py: theme.spacing(0.5),
                        backgroundColor: theme.palette.success.light + '20',
                        color: theme.palette.success.main,
                        borderRadius: theme.shape.borderRadius,
                        fontSize: theme.typography.caption.fontSize,
                        fontWeight: theme.typography.fontWeightMedium,
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
              borderRadius: { xs: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius, sm: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 3 : theme.shape.borderRadius },
              p: { xs: theme.spacing(2), sm: theme.spacing(3) },
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: { xs: theme.spacing(2), sm: theme.spacing(3) } }}>
              <FormattedMessage
                id="claim.your.nfts"
                defaultMessage="Claim Your NFTs"
              />
            </Typography>

            <Stack spacing={{ xs: theme.spacing(2), sm: theme.spacing(3) }}>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{
                    ...generateTextStyles(section.settings.customStyles, 'quantityLabel'),
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                  }}
                >
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
                      borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                      fontSize: theme.typography.h6.fontSize,
                      fontWeight: theme.typography.fontWeightMedium,
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    },
                    '& .MuiOutlinedInput-input': {
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    },
                  }}
                />
                {maxClaimable > 1 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: theme.spacing(1), display: 'block' }}>
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
                    p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.main',
                    '&.MuiPaper-outlined': {
                      borderColor: 'primary.main',
                    },
                    ...generateTotalCostStyles(section.settings.customStyles),
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: theme.spacing(1), sm: 0 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        ...generateTextStyles(section.settings.customStyles, 'totalCostLabel'),
                      }}
                    >
                      <FormattedMessage
                        id="total.cost"
                        defaultMessage="Total Cost"
                      />
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'white',
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        ...generateTextStyles(section.settings.customStyles, 'totalCostValue'),
                      }}
                    >
                      {priceToMint}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {isSoldOut ? (
                <Typography variant="h6" color="error" sx={{ textAlign: 'center', py: theme.spacing(2) }}>
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
                    py: { xs: theme.spacing(1.2), sm: theme.spacing(1.5) },
                    borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    fontSize: { xs: theme.typography.body1.fontSize, sm: theme.typography.h6.fontSize },
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: { xs: theme.spacing(5.5), sm: theme.spacing(6) },
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

  if ((section.settings.variant as any) === "premium") {
    return (
      <Container maxWidth="sm" sx={{ px: { xs: 0.5, sm: 1, md: 2 }, py: { xs: 1, sm: 2 } }}>
        <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
          {renderClaim()}

          <Divider />

          <Box>
            <Paper
              elevation={2}
              sx={{
                ...generateCustomStyles(section.settings.customStyles, theme),
                borderRadius: section.settings.customStyles?.borderRadius !== undefined
                  ? `${section.settings.customStyles.borderRadius}px`
                  : { xs: 2, sm: 3 },
                p: { xs: 2, sm: 3 },
                border: `1px solid ${theme.palette.divider}`,
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                      ...generateTextStyles(section.settings.customStyles, 'primary'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="drop.statistics"
                      defaultMessage="Drop Statistics"
                    />
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: theme.spacing(1), sm: theme.spacing(2) }}
                  >
                    <Box
                      sx={{
                        px: theme.spacing(1.5),
                        py: theme.spacing(0.75),
                        borderRadius: section.settings.customStyles?.borderRadius !== undefined
                          ? `${section.settings.customStyles.borderRadius / 2}px`
                          : theme.shape.borderRadius,
                        backgroundColor: section.settings.customStyles?.statsColors?.maxTotalBackground || "grey.100",
                        border: "1px solid",
                        borderColor: section.settings.customStyles?.statsColors?.maxTotalBorder || "grey.300",
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: theme.typography.caption.fontSize,
                          ...generateTextStyles(section.settings.customStyles, 'secondary'),
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        <FormattedMessage
                          id="total.supply"
                          defaultMessage="Total Supply"
                        />
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: theme.typography.body2.fontSize,
                          ...generateTextStyles(section.settings.customStyles, 'primary'),
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        {!account ? (
                          <FormattedMessage
                            id="connect.wallet"
                            defaultMessage="Connect Wallet"
                          />
                        ) : unclaimedSupply.isLoading || claimedSupply.isLoading ? (
                          "Loading..."
                        ) : unclaimedSupply.data && claimedSupply.data ? (
                          claimedSupply.data.add(unclaimedSupply.data || 0).toNumber().toLocaleString()
                        ) : (
                          '0'
                        )}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        px: theme.spacing(1.5),
                        py: theme.spacing(0.75),
                        borderRadius: section.settings.customStyles?.borderRadius !== undefined
                          ? `${section.settings.customStyles.borderRadius / 2}px`
                          : theme.shape.borderRadius,
                        backgroundColor: section.settings.customStyles?.statsColors?.availableRemainingBackground ||
                          (unclaimedSupply.data && unclaimedSupply.data.toNumber() > 0 ? "success.main" : "error.main"),
                        border: "1px solid",
                        borderColor: section.settings.customStyles?.statsColors?.availableRemainingBorder ||
                          (unclaimedSupply.data && unclaimedSupply.data.toNumber() > 0 ? "success.dark" : "error.dark"),
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: theme.typography.caption.fontSize,
                          color: section.settings.customStyles?.statsColors?.availableRemainingBackground ?
                            (section.settings.customStyles?.textColors?.secondary || "text.secondary") : "white",
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        <FormattedMessage
                          id="unclaimed.supply"
                          defaultMessage="Unclaimed Supply"
                        />
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: theme.typography.body2.fontSize,
                          color: section.settings.customStyles?.statsColors?.availableRemainingBackground ?
                            (section.settings.customStyles?.textColors?.primary || "text.primary") : "white",
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        {!account ? (
                          <FormattedMessage
                            id="connect.wallet"
                            defaultMessage="Connect Wallet"
                          />
                        ) : unclaimedSupply.isLoading ? (
                          "Loading..."
                        ) : (
                          unclaimedSupply.data?.toNumber().toLocaleString() || '0'
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {section.settings.customChips && section.settings.customChips.length > 0 && (
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        mb: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
                        ...generateTextStyles(section.settings.customStyles, 'chipsTitle'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      {section.settings.customChipsTitle || (
                        <FormattedMessage
                          id="collection.features"
                          defaultMessage="Collection Features"
                        />
                      )}
                    </Typography>
                    <Stack direction="row" spacing={{ xs: theme.spacing(0.5), sm: theme.spacing(1) }} flexWrap="wrap" useFlexGap>
                      {section.settings.customChips.map((chip, index) => (
                        <Box
                          key={index}
                          component="span"
                          sx={{
                            px: { xs: theme.spacing(0.75), sm: theme.spacing(1.5) },
                            py: { xs: theme.spacing(0.25), sm: theme.spacing(0.5) },
                            backgroundColor: theme.palette[chip.color]?.light + '20' || theme.palette.primary.light + '20',
                            color: theme.palette[chip.color]?.main || theme.palette.primary.main,
                            borderRadius: section.settings.customStyles?.borderRadius !== undefined
                              ? `${section.settings.customStyles.borderRadius / 2}px`
                              : theme.shape.borderRadius,
                            fontSize: {
                              xs: theme.typography.caption.fontSize,
                              sm: theme.typography.body2.fontSize,
                            },
                            fontWeight: 500,
                            border: `1px solid ${theme.palette[chip.color]?.main || theme.palette.primary.main}30`,
                            fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                          }}
                        >
                          {chip.emoji} {chip.text}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Box>

          <Paper
            elevation={2}
            sx={{
              ...generateCustomStyles(section.settings.customStyles, theme),
              borderRadius: section.settings.customStyles?.borderRadius !== undefined
                ? `${section.settings.customStyles.borderRadius}px`
                : { xs: 2, sm: 3 },
              p: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: { xs: 2, sm: 3 },
                ...generateTextStyles(section.settings.customStyles, 'primary'),
                fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
              }}
            >
              {section.settings.customTitle || (
                <FormattedMessage
                  id="claim.your.nfts"
                  defaultMessage="Claim Your NFTs"
                />
              )}
            </Typography>

            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{
                    ...generateTextStyles(section.settings.customStyles, 'quantityLabel'),
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                  }}
                >
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
                      borderRadius: section.settings.customStyles?.borderRadius !== undefined
                        ? `${section.settings.customStyles.borderRadius}px`
                        : 2,
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      ...generateInputStyles(section.settings.customStyles),
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: section.settings.customStyles?.inputColors?.focusBorderColor || undefined,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: section.settings.customStyles?.inputColors?.focusBorderColor || undefined,
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    },
                  }}
                />
                {maxClaimable > 1 && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      display: 'block',
                      ...generateTextStyles(section.settings.customStyles, 'quantityLabel'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
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
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : 2,
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.main',
                    '&.MuiPaper-outlined': {
                      borderColor: 'primary.main',
                    },
                    ...generateTotalCostStyles(section.settings.customStyles),
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        ...generateTextStyles(section.settings.customStyles, 'totalCostLabel'),
                      }}
                    >
                      <FormattedMessage
                        id="total.cost"
                        defaultMessage="Total Cost"
                      />
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'white',
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        ...generateTextStyles(section.settings.customStyles, 'totalCostValue'),
                      }}
                    >
                      {priceToMint}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {isSoldOut ? (
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    py: 2,
                    color: 'error.main',
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                  }}
                >
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
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : 2,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: { xs: 44, sm: 48 },
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    ...generateButtonStyles(section.settings.customStyles),
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
                  <Typography
                    variant="caption"
                    sx={{
                      ...generateTextStyles(section.settings.customStyles, 'quantityLabel'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
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
                ...generateCustomStyles(section.settings.customStyles, theme),
                borderRadius: section.settings.customStyles?.borderRadius !== undefined
                  ? `${section.settings.customStyles.borderRadius}px`
                  : { xs: 2, sm: 3 },
                p: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, sm: 3 },
                  ...generateTextStyles(section.settings.customStyles, 'primary'),
                  fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                }}
              >
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
        <Grid size={12}>
          {renderClaim()}
        </Grid>
        {section.settings.variant === "detailed" ? (
          <Grid size={12}>
            <Box>{renderContent()}</Box>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
}
