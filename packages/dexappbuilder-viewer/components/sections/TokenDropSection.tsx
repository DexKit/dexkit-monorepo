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

export default function TokenDropSection({ section }: TokenDropSectionProps) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const { address: tokenAddress, network } = section.settings;

  const networkChainId = NETWORK_FROM_SLUG(network)?.chainId;

  const { contract } = useContract(tokenAddress as string, "token-drop");

  const { account, chainId } = useWeb3React();

  const [lazyQuantity, setQuantity] = useState(1);

  const { data: contractMetadata } = useContractMetadata(contract);

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
      const available = Number(activeClaimCondition.data?.availableSupply?.split('.')[0] || 0);
      return available.toLocaleString();
    } catch (e) {
      return "0";
    }
  }, [activeClaimCondition.data?.availableSupply]);

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

    console.log(value);
    console.log(maxClaimable);

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
        ) : section.settings.variant === "premium" ? (
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
              borderRadius: theme.shape.borderRadius * 2,
              p: {
                xs: theme.spacing(1.5),
                sm: theme.spacing(2),
                md: theme.spacing(3),
              },
              border: `1px solid ${theme.palette.primary.main}20`,
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
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: theme.typography.body1.fontSize,
                        lineHeight: 1.1,
                        textAlign: "center",
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
                      color="text.primary"
                      sx={{
                        fontWeight: 500,
                        fontSize: theme.typography.body2.fontSize,
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
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
                          color: "text.secondary",
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
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          mb: theme.spacing(0.5),
                          fontSize: {
                            sm: theme.typography.h4.fontSize,
                            md: theme.typography.h3.fontSize,
                          },
                          lineHeight: 1.2,
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
                        color="text.primary"
                        sx={{
                          fontWeight: 500,
                          mb: theme.spacing(0.5),
                          fontSize: theme.typography.body1.fontSize,
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
                            color: "text.secondary",
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
                              padding: "2px 4px",
                              borderRadius: "4px",
                              fontSize: "0.875em",
                            },
                            "& pre": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                              padding: 1,
                              borderRadius: "4px",
                              overflow: "auto",
                            },
                            "& blockquote": {
                              borderLeft: "4px solid",
                              borderColor: "primary.main",
                              paddingLeft: 2,
                              margin: "8px 0",
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
                    borderRadius: theme.shape.borderRadius,
                    fontSize: {
                      xs: theme.typography.caption.fontSize,
                      sm: theme.typography.body2.fontSize,
                    },
                    fontWeight: 500,
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
                      gap: { xs: 0.25, sm: 0.5 },
                      px: { xs: 0.75, sm: 1 },
                      py: { xs: 0.125, sm: 0.25 },
                      backgroundColor: theme.palette.info.light + "20",
                      color: theme.palette.info.main,
                      borderRadius: 1,
                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                      fontWeight: 500,
                      minWidth: "fit-content",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 4, sm: 6 },
                        height: { xs: 4, sm: 6 },
                        borderRadius: "50%",
                        backgroundColor: theme.palette.info.main,
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
                  {Number(activeClaimCondition.data?.availableSupply.split('.')[0] || 0).toLocaleString()}
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
                    : Number(activeClaimCondition.data?.maxClaimablePerWallet).toLocaleString()
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
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                borderRadius: theme.shape.borderRadius * 2,
                p: { xs: theme.spacing(2), sm: theme.spacing(3) },
                border: `1px solid ${theme.palette.primary.main}30`,
                mb: { xs: theme.spacing(2), sm: theme.spacing(3) },
              }}
            >
              <Stack spacing={{ xs: theme.spacing(2), sm: theme.spacing(3) }}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
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
                        borderRadius: theme.shape.borderRadius * 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                      >
                        <FormattedMessage
                          id="current.phase"
                          defaultMessage="Current Phase"
                        />
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, mt: theme.spacing(0.5) }}
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
                        borderRadius: theme.shape.borderRadius * 2,
                        backgroundColor: "warning.light",
                        borderColor: "warning.main",
                        "&.MuiPaper-outlined": {
                          borderColor: "warning.main",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "warning.contrastText",
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
                          color: "warning.contrastText",
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
                      borderRadius: theme.shape.borderRadius * 2,
                      backgroundColor: "info.light",
                      borderColor: "info.main",
                      "&.MuiPaper-outlined": {
                        borderColor: "info.main",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="info.main"
                      sx={{ textTransform: "uppercase", letterSpacing: 1 }}
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
                        color: "info.main",
                      }}
                    >
                      {nextPhase?.currencyMetadata?.displayValue}{" "}
                      {nextPhase?.currencyMetadata?.symbol}
                    </Typography>
                  </Paper>
                )}

                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "text.primary", fontWeight: 600 }}
                  >
                    {section.settings.customChipsTitle || "Security Features"}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {(
                      section.settings.customChips || [
                        {
                          text: "Smart Contract Verified",
                          emoji: "✓",
                          color: "success",
                        },
                        {
                          text: "Secure Minting",
                          emoji: "✓",
                          color: "success",
                        },
                        {
                          text: "DexKit Powered",
                          emoji: "✓",
                          color: "success",
                        },
                      ]
                    ).map((chip, index) => (
                      <Box
                        key={index}
                        component="span"
                        sx={{
                          px: theme.spacing(1.5),
                          py: theme.spacing(0.5),
                          backgroundColor:
                            theme.palette[chip.color].light + "20",
                          color: theme.palette[chip.color].main,
                          borderRadius: theme.shape.borderRadius,
                          fontSize: theme.typography.caption.fontSize,
                          fontWeight: 500,
                          border: `1px solid ${theme.palette[chip.color].main}30`,
                        }}
                      >
                        {chip.emoji} {chip.text}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>
        )}

        {section.settings.variant === "premium" ? (
          <Paper
            elevation={2}
            sx={{
              borderRadius: theme.shape.borderRadius * 2,
              p: { xs: theme.spacing(2), sm: theme.spacing(3) },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: { xs: theme.spacing(2), sm: theme.spacing(3) },
              }}
            >
              <FormattedMessage
                id="claim.your.tokens"
                defaultMessage="Claim Your Tokens"
              />
            </Typography>

            <Stack spacing={{ xs: theme.spacing(2), sm: theme.spacing(3) }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
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
                        borderRadius: theme.shape.borderRadius * 2,
                        fontSize: theme.typography.h6.fontSize,
                        fontWeight: 500,
                      },
                    },
                  }}
                  value="1"
                  onChange={handleChangeQuantity}
                />
                {maxClaimable > 1 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: theme.spacing(1), display: "block" }}
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
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: "grey.100",
                    border: "1px solid",
                    borderColor: "grey.300",
                    flex: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: "text.secondary" }}>
                    <FormattedMessage
                      id="max.total.phase"
                      defaultMessage="Max Total (Phase)"
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: "grey.800" }}>
                    {maxTotalSupplyFormatted}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: theme.spacing(1.5),
                    py: theme.spacing(0.75),
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: Number(availableSupplyFormatted.replace(/,/g, '')) > 0 ? "success.main" : "error.main",
                    border: "1px solid",
                    borderColor: Number(availableSupplyFormatted.replace(/,/g, '')) > 0 ? "success.dark" : "error.dark",
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      color: "white"
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
                      fontSize: '0.85rem',
                      color: "white"
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
                    borderRadius: theme.shape.borderRadius * 2,
                    backgroundColor: "primary.light",
                    borderColor: "primary.main",
                    "&.MuiPaper-outlined": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: theme.spacing(1), sm: 0 }}
                  >
                    <Typography variant="body2" color="white">
                      <FormattedMessage
                        id="total.cost"
                        defaultMessage="Total Cost"
                      />
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white" }}
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
                    borderRadius: theme.shape.borderRadius * 2,
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
                    borderRadius: theme.shape.borderRadius * 2,
                    fontSize: {
                      xs: theme.typography.body1.fontSize,
                      sm: theme.typography.h6.fontSize,
                    },
                    fontWeight: 600,
                    textTransform: "none",
                    minHeight: { xs: theme.spacing(5.5), sm: theme.spacing(6) },
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
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage
                      id="your.current.balance"
                      defaultMessage="Your current balance: {balance} {symbol}"
                      values={{
                        balance: balance,
                        symbol: contractMetadata?.symbol || "tokens",
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
