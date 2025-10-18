import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useDexKitContext } from "@dexkit/ui";
import {
  ConnectWalletMessage,
  SwitchNetworkButtonWithWarning,
} from "@dexkit/ui/components";
import { ConnectWalletButton } from "@dexkit/ui/components/ConnectWalletButton";
import LazyTextField from "@dexkit/ui/components/LazyTextField";
import { useInterval } from "@dexkit/ui/hooks/misc";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import TokenDropSummary from "@dexkit/ui/modules/token/components/TokenDropSummary";
import { TokenDropPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import {
  ClaimEligibility,
  useActiveClaimConditionForWallet,
  useClaimConditions,
  useClaimIneligibilityReasons,
  useClaimerProofs,
  useContract,
  useContractMetadata,
  useContractRead,
  useTokenSupply,
} from "@thirdweb-dev/react";
import { CurrencyValue } from "@thirdweb-dev/sdk/evm";
import { BigNumber } from "ethers";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function parseIneligibility(
  reasons: ClaimEligibility[],
  quantity = 0
): string {
  if (!reasons.length) {
    return "";
  }

  const reason = reasons[0];

  if (
    reason === ClaimEligibility.Unknown ||
    reason === ClaimEligibility.NoActiveClaimPhase ||
    reason === ClaimEligibility.NoClaimConditionSet
  ) {
    return "This drop is not ready to be minted.";
  } else if (reason === ClaimEligibility.NotEnoughTokens) {
    return "You don't have enough currency to mint.";
  } else if (reason === ClaimEligibility.AddressNotAllowed) {
    if (quantity > 1) {
      return `You are not eligible to mint ${quantity} tokens.`;
    }

    return "You are not eligible to mint at this time.";
  }

  return reason;
}

export interface TokenDropSectionProps {
  section: TokenDropPageSection;
}

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

const loadGoogleFont = (fontFamily: string) => {
  if (!fontFamily || fontFamily === 'inherit') return;

  const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
};

const isAvailableSupplyPositive = (availableSupplyFormatted: string): boolean => {
  if (availableSupplyFormatted === "Unlimited") {
    return true;
  }

  try {
    const number = Number(availableSupplyFormatted.replace(/,/g, ''));
    return !isNaN(number) && number > 0;
  } catch (e) {
    return false;
  }
};

export default function TokenDropSection({ section }: TokenDropSectionProps) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const { address: tokenAddress, network } = section.settings;

  const networkChainId = NETWORK_FROM_SLUG(network)?.chainId;

  const { contract } = useContract(tokenAddress as string, "token-drop");

  const { account, chainId } = useWeb3React();

  const [lazyQuantity, setQuantity] = useState(1);

  const { data: contractMetadata } = useContractMetadata(contract);

  const { data: tokenSymbol } = useContractRead(contract, "symbol", []);

  const claimConditions = useClaimConditions(contract);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    account
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
      setCount(count + 1);
    },
    countDown === undefined || countDown === "Expired" ? null : 1000
  );

  const claimerProofs = useClaimerProofs(contract, account || "");

  const claimIneligibilityReasons = useClaimIneligibilityReasons(contract, {
    quantity: lazyQuantity,
    walletAddress: account || "",
  });

  const claimedSupply = useTokenSupply(contract);

  const availableSupply = useMemo(() => {
    const supplyStr = activeClaimCondition.data?.availableSupply;

    let amount = "0";

    if (supplyStr && supplyStr?.indexOf(".") > -1) {
      amount = activeClaimCondition.data?.availableSupply.split(".")[0] || "0";
    }

    return BigNumber.from(amount);
  }, [activeClaimCondition.data?.availableSupply]);

  const totalAvailableSupply = useMemo(() => {
    try {
      return availableSupply;
    } catch {
      return BigNumber.from(1_000_000_000);
    }
  }, [availableSupply]);

  const priceToMint = useMemo(() => {
    if (lazyQuantity) {
      const bnPrice =
        activeClaimCondition.data?.currencyMetadata.value || BigNumber.from(0);

      return `${formatUnits(
        bnPrice.mul(lazyQuantity).toString(),
        activeClaimCondition.data?.currencyMetadata.decimals || 18
      )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
    }
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    lazyQuantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      if (activeClaimCondition.data?.maxClaimableSupply === "unlimited") {
        bnMaxClaimable = BigNumber.from(1_000_000_000);
      } else {
        bnMaxClaimable =
          BigNumber.from(activeClaimCondition.data?.maxClaimableSupply) ||
          BigNumber.from(0);
      }
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000_000);
    }

    let perTransactionClaimable;
    try {
      if (activeClaimCondition.data?.maxClaimablePerWallet === "unlimited") {
        perTransactionClaimable = BigNumber.from(1_000_000_000);
      } else {
        perTransactionClaimable = BigNumber.from(
          activeClaimCondition.data?.maxClaimablePerWallet || 0
        );
      }
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    let max = bnMaxClaimable;

    if (max.gte(1_000_000_000)) {
      return 1_000_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const maxClaimableFormatted = useMemo(() => {
    const maxPerWallet = activeClaimCondition.data?.maxClaimablePerWallet;

    if (maxPerWallet === "unlimited") {
      return formatMessage({ id: "unlimited", defaultMessage: "Unlimited" });
    }

    if (maxPerWallet) {
      try {
        return Number(maxPerWallet).toLocaleString();
      } catch (e) {
        return maxPerWallet;
      }
    }

    return maxClaimable.toLocaleString();
  }, [
    activeClaimCondition.data?.maxClaimablePerWallet,
    maxClaimable,
    formatMessage,
  ]);

  const maxTotalSupplyFormatted = useMemo(() => {
    const maxTotalSupply = activeClaimCondition.data?.maxClaimableSupply;

    if (maxTotalSupply === "unlimited") {
      return formatMessage({ id: "unlimited", defaultMessage: "Unlimited" });
    }

    if (maxTotalSupply) {
      try {
        return Number(maxTotalSupply).toLocaleString();
      } catch (e) {
        return maxTotalSupply;
      }
    }

    return "0";
  }, [
    activeClaimCondition.data?.maxClaimableSupply,
    formatMessage,
  ]);

  const availableSupplyFormatted = useMemo(() => {
    try {
      const availableSupply = activeClaimCondition.data?.availableSupply;

      if (availableSupply === "unlimited") {
        return formatMessage({ id: "unlimited", defaultMessage: "Unlimited" });
      }

      if (!availableSupply) {
        return "0";
      }

      const available = Number(availableSupply.split('.')[0] || 0);

      if (isNaN(available)) {
        return formatMessage({ id: "unlimited", defaultMessage: "Unlimited" });
      }

      if (activeClaimCondition.data?.maxClaimableSupply === "unlimited") {
        return formatMessage({ id: "unlimited", defaultMessage: "Unlimited" });
      }

      return available.toLocaleString();
    } catch (e) {
      return "0";
    }
  }, [activeClaimCondition.data?.availableSupply, formatMessage]);

  const isSoldOut = useMemo(() => {
    if (activeClaimCondition.data?.maxClaimablePerWallet === "unlimited") {
      return false;
    }

    try {
      return activeClaimCondition.isSuccess && availableSupply.lte(0);
    } catch (e) {
      return false;
    }
  }, [availableSupply, activeClaimCondition.isSuccess]);

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
    return activeClaimCondition.isLoading || !contract;
  }, [activeClaimCondition.isLoading, contract]);

  const buttonLoading = useMemo(() => {
    return isLoading || claimIneligibilityReasons.isFetching;
  }, [claimIneligibilityReasons.isFetching, isLoading]);

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id="sold.out" defaultMessage="Sold out" />;
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      if (pricePerToken.eq(0)) {
        return <FormattedMessage id="mint.free" defaultMessage="Mint (Free)" />;
      }
      return (
        <FormattedMessage
          id="mint.priceToMint"
          defaultMessage="Mint {priceToMint}"
          values={{ priceToMint }}
        />
      );
    }

    if (
      claimIneligibilityReasons.data &&
      claimIneligibilityReasons.data?.length > 0
    ) {
      return <FormattedMessage id="cannot.claim" defaultMessage="Cannot Claim" />;
    }

    if (buttonLoading) {
      return (
        <FormattedMessage
          id="checking"
          defaultMessage="Checking..."
        />
      );
    }

    return (
      <FormattedMessage
        id="not.available"
        defaultMessage="Not Available"
      />
    );
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    lazyQuantity,
  ]);

  const hintMessage = useMemo(() => {
    if (claimIneligibilityReasons.isFetching || (isLoading && !claimIneligibilityReasons.isSuccess)) {
      return formatMessage({
        id: "checking.eligibility.hint",
        defaultMessage: "Checking your eligibility to claim tokens..."
      });
    }

    if (
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data &&
      claimIneligibilityReasons.data?.length > 0
    ) {
      return parseIneligibility(claimIneligibilityReasons.data, lazyQuantity);
    }

    if (
      !isLoading &&
      !claimIneligibilityReasons.isFetching &&
      claimIneligibilityReasons.isSuccess &&
      !canClaim &&
      !isSoldOut &&
      (!claimIneligibilityReasons.data || claimIneligibilityReasons.data?.length === 0)
    ) {
      return formatMessage({
        id: "claiming.not.available.hint",
        defaultMessage: "Token claiming is currently not available. Please check back later."
      });
    }

    return null;
  }, [
    claimIneligibilityReasons.data,
    claimIneligibilityReasons.isFetching,
    claimIneligibilityReasons.isSuccess,
    lazyQuantity,
    isLoading,
    canClaim,
    isSoldOut,
    formatMessage,
  ]);

  const handleChangeQuantity = (val: string) => {
    const value = parseInt(val);

    if (value > maxClaimable) {
      setQuantity(maxClaimable);
    } else if (value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const claimMutation = useMutation(async () => {
    if (account) {
      let tx = await contract?.erc20.claimTo.prepare(
        account,
        lazyQuantity.toString()
      );

      const values = {
        quantity: String(lazyQuantity),
        name: String(contractMetadataQuery.data?.name || " "),
      };

      watchTransactionDialog.open("mintTokenDrop", values);

      let res = await tx?.send();

      if (res?.hash) {
        watchTransactionDialog.watch(res?.hash);
      }

      return res;
    }
  });

  const { enqueueSnackbar } = useSnackbar();

  const trackUserEventsMutation = useTrackUserEventsMutation();

  const contractMetadataQuery = useContractMetadata(contract);

  const handleExecute = async () => {
    if (canClaim) {
      try {
        let res = await claimMutation.mutateAsync();

        const values = {
          quantity: String(lazyQuantity),
          name: String(contractMetadataQuery.data?.name || " "),
        };

        if (res?.hash && chainId) {
          createNotification({
            type: "transaction",
            subtype: "mintTokenDrop",
            values,
            metadata: {
              chainId,
              hash: res?.hash,
            },
          });
        }

        const metadata = {
          name: contractMetadataQuery.data?.name,
          quantity: String(lazyQuantity),
          price: activeClaimCondition.data?.price.toString(),
          currency: activeClaimCondition.data?.currencyAddress,
          address: tokenAddress,
        };

        trackUserEventsMutation.mutate({
          event: UserEvents.buyDropToken,
          chainId,
          hash: res?.hash,
          metadata: JSON.stringify(metadata),
        });
      } catch (err) {
        enqueueSnackbar(
          <FormattedMessage
            id="error.while.minting"
            defaultMessage="Error while minting"
          />,
          { variant: "error" }
        );
      }
    }
  };

  const [contractData, setContractData] = useState<CurrencyValue>();
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    (async () => {
      if (contract && account) {
        const data = await contract?.totalSupply();

        setContractData(data);

        setBalance((await contract?.erc20.balanceOf(account)).displayValue);
      }
    })();
  }, [contract, account]);

  useEffect(() => {
    if (section.settings.customStyles?.fontFamily) {
      loadGoogleFont(section.settings.customStyles.fontFamily);
    }
  }, [section.settings.customStyles?.fontFamily]);

  return (
    <Container
      maxWidth="sm"
      sx={{ px: { xs: 0.5, sm: 1, md: 2 }, py: { xs: 1, sm: 2 } }}
    >
      <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
        {(claimConditions.data &&
          claimConditions.data.length > 0 &&
          activeClaimCondition.isError) ||
          (activeClaimCondition.data &&
            activeClaimCondition.data.startTime > new Date() && (
              <Alert severity="warning">
                <FormattedMessage
                  id="drop.is.starting.soon.please.check.back.later"
                  defaultMessage="Drop is starting soon. Please check back later."
                />
              </Alert>
            ))}

        {claimConditions.data?.length === 0 ||
          (claimConditions.data?.every(
            (cc) => cc.maxClaimableSupply === "0"
          ) && (
              <Alert severity="info">
                <FormattedMessage
                  id="this.drop.is.not.ready.to.be.minted.yet.no.claim.condition.set"
                  defaultMessage="This drop is not ready to be minted yet. (No claim condition set)"
                />
              </Alert>
            ))}

        {isLoading ? (
          !account ? (
            <ConnectWalletMessage
              variant="compact"
              title={
                <FormattedMessage
                  id="connect.wallet.to.view.drop"
                  defaultMessage="Connect wallet to view drop details"
                />
              }
              subtitle={
                <FormattedMessage
                  id="connect.wallet.drop.subtitle"
                  defaultMessage="Connect your wallet to see token information and claim tokens"
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
        ) : (section.settings.variant as any) === "premium" ? (
          <Box
            sx={{
              ...generateCustomStyles(section.settings.customStyles, theme),
              borderRadius: section.settings.customStyles?.borderRadius !== undefined
                ? `${section.settings.customStyles.borderRadius}px`
                : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
              p: {
                xs: theme.spacing(1.5),
                sm: theme.spacing(2),
                md: theme.spacing(3),
              },
              border: `1px solid ${theme.palette.divider}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: theme.spacing(-6.25),
                right: theme.spacing(-6.25),
                width: theme.spacing(12.5),
                height: theme.spacing(12.5),
                borderRadius: "50%",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                zIndex: 0,
              }}
            />

            <Stack
              spacing={{
                xs: theme.spacing(1),
                sm: theme.spacing(1.5),
                md: theme.spacing(2),
              }}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Box>
                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                  <Stack spacing={theme.spacing(1)} alignItems="center">
                    {contractMetadata?.image && (
                      <Avatar
                        src={contractMetadata?.image}
                        alt={contractMetadata?.name!}
                        sx={{
                          height: theme.spacing(5),
                          width: theme.spacing(5),
                          objectFit: "contain",
                          aspectRatio: "1/1",
                          border: `${theme.spacing(0.25)} solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    )}

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: theme.typography.fontWeightBold,
                        fontSize: theme.typography.body1.fontSize,
                        lineHeight: theme.typography.body1.lineHeight,
                        textAlign: "center",
                        ...generateTextStyles(section.settings.customStyles, 'primary'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      {section.settings.customTitle || (
                        <FormattedMessage
                          id="claim.tokens"
                          defaultMessage="Claim Tokens"
                        />
                      )}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        fontSize: theme.typography.body2.fontSize,
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                        ...generateTextStyles(section.settings.customStyles, 'secondary'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      {section.settings.customSubtitle ||
                        contractMetadata?.name}
                    </Typography>

                    {contractMetadata?.description && (
                      <Box
                        sx={{
                          fontSize: theme.typography.caption.fontSize,
                          lineHeight: 1.3,
                          textAlign: "center",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
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
                            padding: "1px 2px",
                            borderRadius: "2px",
                            fontSize: "0.9em",
                          },
                        }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {contractMetadata.description}
                        </ReactMarkdown>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Stack
                    direction="row"
                    spacing={{ sm: theme.spacing(2), md: theme.spacing(3) }}
                    alignItems="flex-start"
                  >
                    {contractMetadata?.image && (
                      <Avatar
                        src={contractMetadata?.image}
                        alt={contractMetadata?.name!}
                        sx={{
                          height: {
                            sm: theme.spacing(8),
                            md: theme.spacing(10),
                          },
                          width: {
                            sm: theme.spacing(8),
                            md: theme.spacing(10),
                          },
                          objectFit: "contain",
                          aspectRatio: "1/1",
                          border: `${theme.spacing(0.25)} solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
                          flexShrink: 0,
                        }}
                      />
                    )}

                    <Box sx={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: theme.spacing(0.5),
                          fontSize: {
                            sm: theme.typography.h4.fontSize,
                            md: theme.typography.h3.fontSize,
                          },
                          lineHeight: 1.2,
                          ...generateTextStyles(section.settings.customStyles, 'primary'),
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        {section.settings.customTitle || (
                          <FormattedMessage
                            id="claim.tokens"
                            defaultMessage="Claim Tokens"
                          />
                        )}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          mb: theme.spacing(0.5),
                          fontSize: theme.typography.body1.fontSize,
                          ...generateTextStyles(section.settings.customStyles, 'secondary'),
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        {section.settings.customSubtitle ||
                          contractMetadata?.name}
                      </Typography>

                      {contractMetadata?.description && (
                        <Box
                          sx={{
                            maxWidth: theme.spacing(62.5),
                            fontSize: theme.typography.body2.fontSize,
                            lineHeight: 1.4,
                            ...generateTextStyles(section.settings.customStyles, 'contractDescription'),
                            fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                            "& p": {
                              margin: 0,
                              fontSize: "inherit",
                              lineHeight: "inherit",
                              color: "inherit",
                            },
                            "& p:not(:last-child)": {
                              marginBottom: 1,
                            },
                            "& ul, & ol": {
                              paddingLeft: 2,
                              margin: 0,
                            },
                            "& li": {
                              fontSize: "inherit",
                              lineHeight: "inherit",
                            },
                            "& strong": {
                              fontWeight: 600,
                            },
                            "& em": {
                              fontStyle: "italic",
                            },
                            "& code": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                              padding: theme.spacing(0.25, 0.5),
                              borderRadius: theme.shape.borderRadius,
                              fontSize: "0.875em",
                            },
                            "& pre": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                              padding: theme.spacing(1),
                              borderRadius: theme.shape.borderRadius,
                              overflow: "auto",
                            },
                            "& blockquote": {
                              borderLeft: theme.spacing(0.5) + " solid",
                              borderColor: "primary.main",
                              paddingLeft: theme.spacing(2),
                              margin: theme.spacing(1, 0),
                              fontStyle: "italic",
                            },
                            "& a": {
                              color: "primary.main",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            },
                          }}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {contractMetadata.description}
                          </ReactMarkdown>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Box>

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
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: theme.spacing(0.25), sm: theme.spacing(0.5) },
                    px: { xs: theme.spacing(0.75), sm: theme.spacing(1) },
                    py: { xs: theme.spacing(0.125), sm: theme.spacing(0.25) },
                    backgroundColor: theme.palette.success.light + "20",
                    color: theme.palette.success.main,
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius / 2}px`
                      : theme.shape.borderRadius,
                    fontSize: {
                      xs: theme.typography.caption.fontSize,
                      sm: theme.typography.body2.fontSize,
                    },
                    fontWeight: theme.typography.fontWeightMedium,
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    minWidth: "fit-content",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: theme.spacing(0.5),
                        sm: theme.spacing(0.75),
                      },
                      height: {
                        xs: theme.spacing(0.5),
                        sm: theme.spacing(0.75),
                      },
                      borderRadius: "50%",
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
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: theme.spacing(0.25), sm: theme.spacing(0.5) },
                      px: { xs: theme.spacing(0.75), sm: theme.spacing(1) },
                      py: { xs: theme.spacing(0.125), sm: theme.spacing(0.25) },
                      backgroundColor: theme.palette.success.dark + "20",
                      color: theme.palette.success.dark,
                      borderRadius: section.settings.customStyles?.borderRadius !== undefined
                        ? `${section.settings.customStyles.borderRadius / 2}px`
                        : theme.shape.borderRadius,
                      fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize },
                      fontWeight: theme.typography.fontWeightMedium,
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      minWidth: "fit-content",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: theme.spacing(0.5), sm: theme.spacing(0.75) },
                        height: { xs: theme.spacing(0.5), sm: theme.spacing(0.75) },
                        borderRadius: "50%",
                        backgroundColor: theme.palette.success.dark,
                      }}
                    />
                    <FormattedMessage
                      id="tokens.available"
                      defaultMessage="Tokens Available"
                    />
                  </Box>
                )}
              </Stack>
            </Stack>
          </Box>
        ) : (section.settings.variant as any) === "premium" ? (
          <Box
            sx={{
              ...generateCustomStyles(section.settings.customStyles, theme),
              borderRadius: section.settings.customStyles?.borderRadius !== undefined
                ? `${section.settings.customStyles.borderRadius}px`
                : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
              p: {
                xs: theme.spacing(1.5),
                sm: theme.spacing(2),
                md: theme.spacing(3),
              },
              border: `1px solid ${theme.palette.divider}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Stack
              spacing={{
                xs: theme.spacing(1),
                sm: theme.spacing(1.5),
                md: theme.spacing(2),
              }}
            >
              <Box>
                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                  <Stack spacing={theme.spacing(1)} alignItems="center">
                    {contractMetadata?.image && (
                      <Avatar
                        src={contractMetadata?.image}
                        alt={contractMetadata?.name!}
                        sx={{
                          height: theme.spacing(5),
                          width: theme.spacing(5),
                          objectFit: "contain",
                          aspectRatio: "1/1",
                          border: `${theme.spacing(0.25)} solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    )}

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: theme.typography.fontWeightBold,
                        fontSize: theme.typography.body1.fontSize,
                        lineHeight: theme.typography.body1.lineHeight,
                        textAlign: "center",
                        ...generateTextStyles(section.settings.customStyles, 'primary'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      {section.settings.customTitle || (
                        <FormattedMessage
                          id="claim.tokens"
                          defaultMessage="Claim Tokens"
                        />
                      )}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        fontSize: theme.typography.body2.fontSize,
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                        ...generateTextStyles(section.settings.customStyles, 'secondary'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      {section.settings.customSubtitle ||
                        contractMetadata?.name}
                    </Typography>

                    {contractMetadata?.description && (
                      <Box
                        sx={{
                          fontSize: theme.typography.caption.fontSize,
                          lineHeight: 1.3,
                          textAlign: "center",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
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
                            padding: "1px 2px",
                            borderRadius: "2px",
                            fontSize: "0.9em",
                          },
                        }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {contractMetadata.description}
                        </ReactMarkdown>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Stack
                    direction="row"
                    spacing={{ sm: theme.spacing(2), md: theme.spacing(3) }}
                    alignItems="flex-start"
                  >
                    {contractMetadata?.image && (
                      <Avatar
                        src={contractMetadata?.image}
                        alt={contractMetadata?.name!}
                        sx={{
                          height: {
                            sm: theme.spacing(8),
                            md: theme.spacing(10),
                          },
                          width: {
                            sm: theme.spacing(8),
                            md: theme.spacing(10),
                          },
                          objectFit: "contain",
                          aspectRatio: "1/1",
                          border: `${theme.spacing(0.25)} solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
                          flexShrink: 0,
                        }}
                      />
                    )}

                    <Box sx={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: theme.spacing(0.5),
                          fontSize: {
                            sm: theme.typography.h4.fontSize,
                            md: theme.typography.h3.fontSize,
                          },
                          lineHeight: 1.2,
                          ...generateTextStyles(section.settings.customStyles, 'primary'),
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        {section.settings.customTitle || (
                          <FormattedMessage
                            id="claim.tokens"
                            defaultMessage="Claim Tokens"
                          />
                        )}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          mb: theme.spacing(1),
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          ...generateTextStyles(section.settings.customStyles, 'secondary'),
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        {section.settings.customSubtitle ||
                          contractMetadata?.name}
                      </Typography>

                      {contractMetadata?.description && (
                        <Box
                          sx={{
                            fontSize: theme.typography.body2.fontSize,
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
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
                            {contractMetadata.description}
                          </ReactMarkdown>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </Box>
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
                        id="security.features"
                        defaultMessage="Security Features"
                      />
                    )}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={{ xs: theme.spacing(0.5), sm: theme.spacing(1) }}
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {section.settings.customChips.map((chip, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: theme.spacing(0.25), sm: theme.spacing(0.5) },
                          px: { xs: theme.spacing(0.75), sm: theme.spacing(1) },
                          py: { xs: theme.spacing(0.125), sm: theme.spacing(0.25) },
                          backgroundColor: theme.palette[chip.color]?.light + "20" || theme.palette.primary.light + "20",
                          color: theme.palette[chip.color]?.main || theme.palette.primary.main,
                          borderRadius: section.settings.customStyles?.borderRadius !== undefined
                            ? `${section.settings.customStyles.borderRadius / 2}px`
                            : theme.shape.borderRadius,
                          fontSize: {
                            xs: theme.typography.caption.fontSize,
                            sm: theme.typography.body2.fontSize,
                          },
                          fontWeight: 500,
                          minWidth: "fit-content",
                          flexShrink: 0,
                          fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        }}
                      >
                        <span>{chip.emoji}</span>
                        {chip.text}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        ) : (
          <>
            <Stack
              justifyContent={{ xs: "center", sm: "flex-start" }}
              alignItems="center"
              direction="row"
            >
              {contractMetadata?.image && (
                <Avatar
                  src={contractMetadata?.image}
                  alt={contractMetadata?.name!}
                  sx={{
                    height: "6rem",
                    width: "6rem",
                    objectFit: "contain",
                    aspectRatio: "1/1",
                  }}
                />
              )}
            </Stack>

            <Box>
              <Typography
                sx={{ textAlign: { sm: "left", xs: "center" } }}
                variant="h5"
              >
                {section.settings.customTitle || (
                  <FormattedMessage
                    id="claim.tokens"
                    defaultMessage="Claim tokens"
                  />
                )}
              </Typography>
              <Typography
                sx={{ textAlign: { sm: "left", xs: "center" } }}
                variant="body1"
              >
                {section.settings.customSubtitle || (
                  <FormattedMessage
                    id="claim.tokens.from.contractName"
                    defaultMessage="Claim Tokens from {contractName}"
                    values={{
                      contractName: <strong>{contractMetadata?.name}</strong>,
                    }}
                  />
                )}
              </Typography>
            </Box>
          </>
        )}

        <Divider />

        {section.settings.variant === "detailed" && (
          <Box>
            <TokenDropSummary
              contract={contract}
              hideDecimals
              hideTotalSupply
            />
            {activeClaimCondition.data?.metadata?.name && (
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
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
            )}

            {activeClaimCondition.data?.maxClaimableSupply && (
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <Typography variant="body1">
                  <b>
                    <FormattedMessage
                      id="max.total.supply.current.phase"
                      defaultMessage="Max total supply (current phase)"
                    />
                    :
                  </b>
                </Typography>
                <Typography color="text.secondary">
                  {activeClaimCondition.data?.maxClaimableSupply === "unlimited"
                    ? formatMessage({ id: "unlimited", defaultMessage: "Unlimited" })
                    : Number(activeClaimCondition.data?.maxClaimableSupply).toLocaleString()
                  }
                </Typography>
              </Stack>
            )}

            {activeClaimCondition.data?.availableSupply && (
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <Typography variant="body1">
                  <b>
                    <FormattedMessage
                      id="available.supply.remaining"
                      defaultMessage="Available supply remaining"
                    />
                    :
                  </b>
                </Typography>
                <Typography color="text.secondary">
                  {availableSupplyFormatted}
                </Typography>
              </Stack>
            )}

            {activeClaimCondition.data?.maxClaimablePerWallet && (
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <Typography variant="body1">
                  <b>
                    <FormattedMessage
                      id="max.tokens.per.wallet"
                      defaultMessage="Max tokens per wallet"
                    />
                    :
                  </b>
                </Typography>
                <Typography color="text.secondary">
                  {activeClaimCondition.data?.maxClaimablePerWallet === "unlimited"
                    ? formatMessage({ id: "unlimited", defaultMessage: "Unlimited" })
                    : Number(activeClaimCondition.data?.maxClaimablePerWallet || 0).toLocaleString()
                  }
                </Typography>
              </Stack>
            )}

            {nextPhase && (
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
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
            )}
            {nextPhase && (
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
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
            )}
          </Box>
        )}

        {section.settings.variant === "premium" && (
          <Box>
            <Paper
              elevation={2}
              sx={{
                ...generateCustomStyles(section.settings.customStyles, theme),
                borderRadius: section.settings.customStyles?.borderRadius !== undefined
                  ? `${section.settings.customStyles.borderRadius}px`
                  : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                p: { xs: theme.spacing(2), sm: theme.spacing(3) },
                border: `1px solid ${theme.palette.divider}`,
                mb: { xs: theme.spacing(2), sm: theme.spacing(3) },
              }}
            >
              <Stack spacing={{ xs: theme.spacing(2), sm: theme.spacing(3) }}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      ...generateTextStyles(section.settings.customStyles, 'primary'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="drop.statistics"
                      defaultMessage="Drop Statistics"
                    />
                  </Typography>
                  <TokenDropSummary
                    contract={contract}
                    hideDecimals
                    hideTotalSupply
                    customStyles={section.settings.customStyles}
                    fontFamily={section.settings.customStyles?.fontFamily}
                  />
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: theme.spacing(1.5), sm: theme.spacing(2) }}
                >
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
                          textTransform: "uppercase",
                          letterSpacing: 1,
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
                        p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                        borderRadius: section.settings.customStyles?.borderRadius !== undefined
                          ? `${section.settings.customStyles.borderRadius}px`
                          : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                        backgroundColor: section.settings.customStyles?.phaseColors?.phaseEndsBackground || "warning.light",
                        borderColor: section.settings.customStyles?.phaseColors?.phaseEndsBorder || "warning.main",
                        "&.MuiPaper-outlined": {
                          borderColor: section.settings.customStyles?.phaseColors?.phaseEndsBorder || "warning.main",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: section.settings.customStyles?.phaseColors?.phaseEndsTitle || "warning.contrastText",
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
                          mt: theme.spacing(0.5),
                          color: section.settings.customStyles?.phaseColors?.phaseEndsText || "warning.contrastText",
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
                      p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                      borderRadius: section.settings.customStyles?.borderRadius !== undefined
                        ? `${section.settings.customStyles.borderRadius}px`
                        : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                      backgroundColor: section.settings.customStyles?.phaseColors?.nextPhaseBackground || "info.light",
                      borderColor: section.settings.customStyles?.phaseColors?.nextPhaseBorder || "info.main",
                      "&.MuiPaper-outlined": {
                        borderColor: section.settings.customStyles?.phaseColors?.nextPhaseBorder || "info.main",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: section.settings.customStyles?.phaseColors?.nextPhaseTitle || "info.main",
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
                        mt: theme.spacing(0.5),
                        color: section.settings.customStyles?.phaseColors?.nextPhaseText || "info.main",
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      {nextPhase?.currencyMetadata?.displayValue}{" "}
                      {nextPhase?.currencyMetadata?.symbol}
                    </Typography>
                  </Paper>
                )}

                {(section.settings.customChips && section.settings.customChips.length > 0) && (
                  <Box sx={{ mb: { xs: theme.spacing(2), sm: theme.spacing(3) } }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        ...generateTextStyles(section.settings.customStyles, 'chipsTitle'),
                        fontWeight: 600,
                        mb: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      }}
                    >
                      {section.settings.customChipsTitle || (
                        <FormattedMessage
                          id="security.features"
                          defaultMessage="Security Features"
                        />
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: theme.spacing(0.5), sm: theme.spacing(1) } }}>
                      {section.settings.customChips.map((chip, index) => (
                        <Box
                          key={index}
                          component="span"
                          sx={{
                            px: { xs: theme.spacing(0.75), sm: theme.spacing(1.5) },
                            py: { xs: theme.spacing(0.25), sm: theme.spacing(0.5) },
                            backgroundColor: theme.palette[chip.color]?.light + "20" || theme.palette.primary.light + "20",
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
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Box>
        )}

        {section.settings.variant === "premium" ? (
          <Paper
            elevation={2}
            sx={{
              ...generateCustomStyles(section.settings.customStyles, theme),
              borderRadius: section.settings.customStyles?.borderRadius !== undefined
                ? `${section.settings.customStyles.borderRadius}px`
                : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
              p: { xs: theme.spacing(2), sm: theme.spacing(3) },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: { xs: theme.spacing(2), sm: theme.spacing(3) },
                ...generateTextStyles(section.settings.customStyles, 'primary'),
                fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
              }}
            >
              <FormattedMessage
                id="claim.your.tokens"
                defaultMessage="Claim Your Tokens"
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
                <LazyTextField
                  TextFieldProps={{
                    type: "number",
                    fullWidth: true,
                    variant: "outlined",
                    placeholder: formatMessage({
                      defaultMessage: "Enter amount to claim",
                      id: "enter.amount.to.claim",
                    }),
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: section.settings.customStyles?.borderRadius !== undefined
                          ? `${section.settings.customStyles.borderRadius}px`
                          : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                        fontSize: theme.typography.h6.fontSize,
                        fontWeight: 500,
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        ...generateInputStyles(section.settings.customStyles),
                      },
                      "& .MuiOutlinedInput-input": {
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      },
                    },
                  }}
                  value="1"
                  onChange={handleChangeQuantity}
                />
                {maxClaimable > 1 && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: theme.spacing(1),
                      display: "block",
                      ...generateTextStyles(section.settings.customStyles, 'maxPerWalletLabel'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="max.claimable.per.wallet"
                      defaultMessage="Max per wallet: {max}"
                      values={{ max: maxClaimableFormatted }}
                    />
                  </Typography>
                )}
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: theme.spacing(1), sm: theme.spacing(2) }}
              >
                <Box
                  sx={{
                    px: theme.spacing(1.5),
                    py: theme.spacing(0.75),
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
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
                      color: section.settings.customStyles?.textColors?.maxTotalPhaseLabel || "text.secondary",
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="max.total.phase"
                      defaultMessage="Max Total (Phase)"
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: theme.typography.body2.fontSize,
                      color: section.settings.customStyles?.textColors?.primary || "grey.800",
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    {maxTotalSupplyFormatted}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: theme.spacing(1.5),
                    py: theme.spacing(0.75),
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : theme.shape.borderRadius,
                    backgroundColor: section.settings.customStyles?.statsColors?.availableRemainingBackground || (isAvailableSupplyPositive(availableSupplyFormatted) ? "success.main" : "error.main"),
                    border: "1px solid",
                    borderColor: section.settings.customStyles?.statsColors?.availableRemainingBorder || (isAvailableSupplyPositive(availableSupplyFormatted) ? "success.dark" : "error.dark"),
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: theme.typography.caption.fontSize,
                      color: section.settings.customStyles?.textColors?.availableRemainingLabel || "white",
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="available.remaining"
                      defaultMessage="Available Remaining"
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: theme.typography.body2.fontSize,
                      color: section.settings.customStyles?.textColors?.primary || "white",
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    {availableSupplyFormatted}
                  </Typography>
                </Box>
              </Stack>

              {priceToMint && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    backgroundColor: (section.settings.customStyles as any)?.totalCostColors?.backgroundColor || "primary.light",
                    borderColor: (section.settings.customStyles as any)?.totalCostColors?.borderColor || "primary.main",
                    "&.MuiPaper-outlined": {
                      borderColor: (section.settings.customStyles as any)?.totalCostColors?.borderColor || "primary.main",
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
                        ...generateTextStyles(section.settings.customStyles, 'totalCostLabel'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        color: generateTextStyles(section.settings.customStyles, 'totalCostLabel').color || "white",
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
                        ...generateTextStyles(section.settings.customStyles, 'totalCostValue'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        color: generateTextStyles(section.settings.customStyles, 'totalCostValue').color || "white",
                      }}
                    >
                      {priceToMint}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {hintMessage && (
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    '& .MuiAlert-message': {
                      fontSize: theme.typography.body2.fontSize,
                    }
                  }}
                >
                  {hintMessage}
                </Alert>
              )}

              {!account ? (
                <ConnectWalletButton />
              ) : chainId !== networkChainId ? (
                <SwitchNetworkButtonWithWarning
                  desiredChainId={networkChainId}
                  fullWidth
                />
              ) : (
                <Button
                  size="large"
                  disabled={!canClaim || claimMutation.isLoading}
                  startIcon={
                    claimMutation.isLoading ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : undefined
                  }
                  fullWidth
                  onClick={handleExecute}
                  variant="contained"
                  color="primary"
                  sx={{
                    py: { xs: theme.spacing(1.2), sm: theme.spacing(1.5) },
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    fontSize: {
                      xs: theme.typography.body1.fontSize,
                      sm: theme.typography.h6.fontSize,
                    },
                    fontWeight: 600,
                    textTransform: "none",
                    minHeight: { xs: theme.spacing(5.5), sm: theme.spacing(6) },
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    border: section.settings.customStyles?.buttonColors?.borderColor ? '2px solid' : 'none',
                    ...generateButtonStyles(section.settings.customStyles),
                    "&.Mui-disabled": {
                      color: theme.palette.text.disabled,
                      backgroundColor: theme.palette.action.disabledBackground,
                    },
                  }}
                >
                  {buttonText}
                </Button>
              )}

              {balance && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      ...generateTextStyles(section.settings.customStyles, 'currentBalanceLabel'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="your.current.balance"
                      defaultMessage="Your current balance: {balance} {symbol}"
                      values={{
                        balance: balance,
                        symbol: tokenSymbol || contractMetadata?.symbol || "tokens",
                      }}
                    />
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        ) : (section.settings.variant as any) === "premium" ? (
          <Paper
            elevation={2}
            sx={{
              ...generateCustomStyles(section.settings.customStyles, theme),
              borderRadius: section.settings.customStyles?.borderRadius !== undefined
                ? `${section.settings.customStyles.borderRadius}px`
                : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
              p: { xs: theme.spacing(2), sm: theme.spacing(3) },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: { xs: theme.spacing(2), sm: theme.spacing(3) },
                ...generateTextStyles(section.settings.customStyles, 'primary'),
                fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
              }}
            >
              <FormattedMessage
                id="claim.your.tokens"
                defaultMessage="Claim Your Tokens"
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
                <LazyTextField
                  TextFieldProps={{
                    type: "number",
                    fullWidth: true,
                    variant: "outlined",
                    placeholder: formatMessage({
                      defaultMessage: "Enter amount to claim",
                      id: "enter.amount.to.claim",
                    }),
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: section.settings.customStyles?.borderRadius !== undefined
                          ? `${section.settings.customStyles.borderRadius}px`
                          : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                        fontSize: theme.typography.h6.fontSize,
                        fontWeight: theme.typography.fontWeightMedium,
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        ...generateInputStyles(section.settings.customStyles),
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: section.settings.customStyles?.inputColors?.focusBorderColor || undefined,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: section.settings.customStyles?.inputColors?.focusBorderColor || undefined,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                      },
                    },
                  }}
                  value="1"
                  onChange={handleChangeQuantity}
                />
                {maxClaimable > 1 && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: theme.spacing(1),
                      display: "block",
                      ...generateTextStyles(section.settings.customStyles, 'maxPerWalletLabel'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="max.claimable.per.wallet"
                      defaultMessage="Max per wallet: {max}"
                      values={{ max: maxClaimableFormatted }}
                    />
                  </Typography>
                )}
              </Box>

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
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: theme.typography.caption.fontSize,
                      ...generateTextStyles(section.settings.customStyles, 'maxTotalPhaseLabel'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="max.total.phase"
                      defaultMessage="Max Total (Phase)"
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
                    {maxTotalSupplyFormatted}
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
                      (isAvailableSupplyPositive(availableSupplyFormatted) ? "success.main" : "error.main"),
                    border: "1px solid",
                    borderColor: section.settings.customStyles?.statsColors?.availableRemainingBorder ||
                      (isAvailableSupplyPositive(availableSupplyFormatted) ? "success.dark" : "error.dark"),
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: theme.typography.caption.fontSize,
                      color: section.settings.customStyles?.statsColors?.availableRemainingBackground ?
                        (section.settings.customStyles?.textColors?.availableRemainingLabel || "text.secondary") : "white",
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="available.remaining"
                      defaultMessage="Available Remaining"
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
                    {availableSupplyFormatted}
                  </Typography>
                </Box>
              </Stack>

              {priceToMint && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    backgroundColor: (section.settings.customStyles as any)?.totalCostColors?.backgroundColor || "primary.light",
                    borderColor: (section.settings.customStyles as any)?.totalCostColors?.borderColor || "primary.main",
                    "&.MuiPaper-outlined": {
                      borderColor: (section.settings.customStyles as any)?.totalCostColors?.borderColor || "primary.main",
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
                        ...generateTextStyles(section.settings.customStyles, 'totalCostLabel'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        color: generateTextStyles(section.settings.customStyles, 'totalCostLabel').color || "white",
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
                        ...generateTextStyles(section.settings.customStyles, 'totalCostValue'),
                        fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                        color: generateTextStyles(section.settings.customStyles, 'totalCostValue').color || "white",
                      }}
                    >
                      {priceToMint}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {hintMessage && (
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    '& .MuiAlert-message': {
                      fontSize: theme.typography.body2.fontSize,
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }
                  }}
                >
                  {hintMessage}
                </Alert>
              )}

              {!account ? (
                <ConnectWalletButton />
              ) : chainId !== networkChainId ? (
                <SwitchNetworkButtonWithWarning
                  desiredChainId={networkChainId}
                  fullWidth
                />
              ) : (
                <Button
                  size="large"
                  disabled={!canClaim || claimMutation.isLoading}
                  startIcon={
                    claimMutation.isLoading ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : undefined
                  }
                  fullWidth
                  onClick={handleExecute}
                  variant="contained"
                  color="primary"
                  sx={{
                    py: { xs: theme.spacing(1.2), sm: theme.spacing(1.5) },
                    borderRadius: section.settings.customStyles?.borderRadius !== undefined
                      ? `${section.settings.customStyles.borderRadius}px`
                      : typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
                    fontSize: {
                      xs: theme.typography.body1.fontSize,
                      sm: theme.typography.h6.fontSize,
                    },
                    fontWeight: 600,
                    textTransform: "none",
                    minHeight: { xs: theme.spacing(5.5), sm: theme.spacing(6) },
                    fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    border: section.settings.customStyles?.buttonColors?.borderColor ? '2px solid' : 'none',
                    ...generateButtonStyles(section.settings.customStyles),
                    "&.Mui-disabled": {
                      color: theme.palette.text.disabled,
                      backgroundColor: theme.palette.action.disabledBackground,
                    },
                  }}
                >
                  {buttonText}
                </Button>
              )}

              {balance && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      ...generateTextStyles(section.settings.customStyles, 'currentBalanceLabel'),
                      fontFamily: section.settings.customStyles?.fontFamily || 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="your.current.balance"
                      defaultMessage="Your current balance: {balance} {symbol}"
                      values={{
                        balance: balance,
                        symbol: tokenSymbol || contractMetadata?.symbol || "tokens",
                      }}
                    />
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        ) : (
          <Stack
            spacing={theme.spacing(2)}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <LazyTextField
              TextFieldProps={{
                type: "number",
                sx: { width: { xs: "100%", sm: "auto" } },
                placeholder: formatMessage({
                  defaultMessage: "Enter amount to claim",
                  id: "enter.amount.to.claim",
                }),
              }}
              value="1"
              onChange={handleChangeQuantity}
            />

            {hintMessage && (
              <Alert
                severity="warning"
                sx={{
                  '& .MuiAlert-message': {
                    fontSize: theme.typography.body2.fontSize,
                  }
                }}
              >
                {hintMessage}
              </Alert>
            )}

            {!account ? (
              <ConnectWalletButton />
            ) : chainId !== networkChainId ? (
              <SwitchNetworkButtonWithWarning
                desiredChainId={networkChainId}
                fullWidth
              />
            ) : (
              <Button
                size="large"
                disabled={!canClaim || claimMutation.isLoading}
                startIcon={
                  claimMutation.isLoading ? (
                    <CircularProgress size="1rem" color="inherit" />
                  ) : undefined
                }
                sx={{ width: { xs: "100%", sm: "auto" } }}
                onClick={handleExecute}
                variant="contained"
              >
                {buttonText}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
