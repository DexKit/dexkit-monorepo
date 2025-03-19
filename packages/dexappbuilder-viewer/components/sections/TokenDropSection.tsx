import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useDexKitContext } from "@dexkit/ui";
import { ConnectWalletButton } from "@dexkit/ui/components/ConnectWalletButton";
import LazyTextField from "@dexkit/ui/components/LazyTextField";
import { SwitchNetworkButton } from "@dexkit/ui/components/SwitchNetworkButton";
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
  Skeleton,
  Stack,
  Typography,
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

export function parseIneligibility(
  reasons: ClaimEligibility[],
  quantity = 0,
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

  const { address: tokenAddress, network } = section.settings;

  const networkChainId = NETWORK_FROM_SLUG(network)?.chainId;

  const { contract } = useContract(tokenAddress as string, "token-drop");

  const { account, chainId } = useWeb3React();

  const [lazyQuantity, setQuantity] = useState(1);

  const { data: contractMetadata } = useContractMetadata(contract);

  const claimConditions = useClaimConditions(contract);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    account,
  );

  const [count, setCount] = useState<number>(0);

  const nextPhase = useMemo(() => {
    const active = activeClaimCondition.data;
    const data = claimConditions.data;
    if (active && data) {
      const total = data?.length;
      const currentIndex = data.findIndex(
        (a) => a?.startTime?.getTime() === active?.startTime?.getTime(),
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
    countDown === undefined || countDown === "Expired" ? null : 1000,
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

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data?.value || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(claimedSupply.data?.value || 0);
    if (n.gte(1_000_000_000)) {
      return "";
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const priceToMint = useMemo(() => {
    if (lazyQuantity) {
      const bnPrice =
        activeClaimCondition.data?.currencyMetadata.value || BigNumber.from(0);

      return `${formatUnits(
        bnPrice.mul(lazyQuantity).toString(),
        activeClaimCondition.data?.currencyMetadata.decimals || 18,
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
      bnMaxClaimable =
        BigNumber.from(activeClaimCondition.data?.maxClaimableSupply) ||
        BigNumber.from(0);
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0,
      );
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

    let max;

    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000_000)) {
      return 1_000_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    if (
      activeClaimCondition.data?.maxClaimablePerWallet === "unlimited" &&
      activeClaimCondition.data?.maxClaimablePerWallet === "unlimited"
    ) {
      return false;
    }

    try {
      return (
        (activeClaimCondition.isSuccess && availableSupply.lte(0)) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    availableSupply,
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
    return activeClaimCondition.isLoading || !contract;
  }, [activeClaimCondition.isLoading, contract]);

  const buttonLoading = useMemo(() => {
    return isLoading || claimIneligibilityReasons.isFetching;
  }, [claimIneligibilityReasons.isLoading, isLoading]);

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id="sold.out" defaultMessage="Sold out" />;
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0,
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
      return parseIneligibility(claimIneligibilityReasons.data, lazyQuantity);
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
        id="claiming.not.available"
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
    lazyQuantity,
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
        lazyQuantity.toString(),
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
          { variant: "error" },
        );
      }
    }
  };

  const [contractData, setContractData] = useState<CurrencyValue>();
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    (async () => {
      if (contract) {
        const data = await contract?.totalSupply();

        setContractData(data);

        setBalance((await contract?.erc20.balance()).displayValue);
      }
    })();
  }, [contract]);

  return (
    <Container>
      <Stack spacing={2}>
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
            (cc) => cc.maxClaimableSupply === "0",
          ) && (
            <Alert severity="info">
              <FormattedMessage
                id="this.drop.is.not.ready.to.be.minted.yet.no.claim.condition.set"
                defaultMessage="This drop is not ready to be minted yet. (No claim condition set)"
              />
            </Alert>
          ))}

        {isLoading ? (
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
                <FormattedMessage
                  id="claim.tokens"
                  defaultMessage="Claim tokens"
                />
              </Typography>
              <Typography
                sx={{ textAlign: { sm: "left", xs: "center" } }}
                variant="body1"
              >
                <FormattedMessage
                  id="claim.tokens.from.contractName"
                  defaultMessage="Claim Tokens from {contractName}"
                  values={{
                    contractName: <strong>{contractMetadata?.name}</strong>,
                  }}
                />
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

        <Stack spacing={2} justifyContent="flex-start" alignItems="flex-start">
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
          {!account ? (
            <ConnectWalletButton />
          ) : chainId !== networkChainId ? (
            <SwitchNetworkButton desiredChainId={networkChainId} />
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
      </Stack>
    </Container>
  );
}
