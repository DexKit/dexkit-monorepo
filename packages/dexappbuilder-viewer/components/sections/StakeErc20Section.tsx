import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatBigNumber } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { useDexKitContext } from "@dexkit/ui";
import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useThirdwebApprove } from "@dexkit/ui/modules/contract-wizard/hooks/thirdweb";
import { StakeErc20PageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  useContract,
  useContractRead,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { Formik, FormikErrors } from "formik";
import moment from "moment";
import { SyntheticEvent, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface StakeErc20SectionProps {
  section: StakeErc20PageSection;
}

export default function StakeErc20Section({ section }: StakeErc20SectionProps) {
  const { address, network } = section.settings;

  const [tab, setTab] = useState<"stake" | "unstake">("stake");

  const { data: contract } = useContract(address, "custom");

  const { account } = useWeb3React();

  const { data: rewardTokenAddress } = useContractRead(contract, "rewardToken");

  const { data: stakingTokenAddress } = useContractRead(
    contract,
    "stakingToken"
  );

  const { data: stakeInfo, refetch: refetchStakeInfo } = useContractRead(
    contract,
    "getStakeInfo",
    [account]
  );

  const { data: rewardToken, isLoading: isLoadingRewardToken } = useContract(
    rewardTokenAddress || "",
    "token"
  );

  const { data: stakingToken } = useContract(
    stakingTokenAddress || "",
    "token"
  );

  const rewardRatioQuery = useContractRead(contract, "getRewardRatio");
  const rewardTimeUnitQuery = useContractRead(contract, "getTimeUnit");

  const {
    data: rewardTokenBalance,
    refetch: refetchRewardTokenBalance,
    isLoading: isLoadingRewardTokenBalance,
  } = useTokenBalance(rewardToken, account);

  const { data: stakingTokenBalance, refetch: refetchStakingTokenBalance } =
    useTokenBalance(stakingToken, account);

  const [tokensStaked, rewards, tokensStakedValueFormatted, tokensStakedValue] =
    useMemo(() => {
      if (stakeInfo) {
        const [n, d] = stakeInfo;
        return [
          formatBigNumber(n, stakingTokenBalance?.decimals || 18),
          formatBigNumber(d, rewardTokenBalance?.decimals || 18),
          formatUnits(n, stakingTokenBalance?.decimals),
          n as BigNumber,
        ];
      }

      return ["0", "0", "0", BigNumber.from(0)];
    }, [stakeInfo, rewardTokenBalance, stakingTokenBalance]);

  const rewardsPerSecond = useMemo(() => {
    if (
      rewardRatioQuery.data &&
      rewardTimeUnitQuery.data &&
      rewardTokenBalance?.symbol
    ) {
      const dividerConst = 10000;
      const [n, d] = rewardRatioQuery.data as [BigNumber, BigNumber];
      const seconds = rewardTimeUnitQuery.data as BigNumber;
      const ratio = n.mul(dividerConst).div(d).toNumber() / dividerConst;
      return `${ratio} ${rewardTokenBalance.symbol} ${moment
        .duration(seconds?.toNumber(), "seconds")
        .humanize()}`;
    }
    return "-";
  }, [
    rewardRatioQuery.data,
    rewardTimeUnitQuery.data,
    rewardTokenBalance?.symbol,
  ]);

  const isLoadingRatio =
    rewardRatioQuery.isLoading ||
    rewardTimeUnitQuery.isLoading ||
    isLoadingRewardTokenBalance;

  // const { data: rewardRatio } = useContractRead(contract, 'getRewardRatio');
  // const { data: rewardTimeUnit } = useContractRead(contract, 'getTimeUnit');

  // const [numerator, denominator] = useMemo(() => {
  //   if (rewardRatio) {
  //     const [n, d] = rewardRatio;
  //     return [n.toNumber(), d.toNumber()];
  //   }

  //   return [0, 0];
  // }, [rewardRatio]);

  const { mutateAsync: approve } = useThirdwebApprove({
    contract: stakingToken,
    address,
  });

  const { data: allowance } = useQuery(
    ["STAKING_TOKEN_ALLOWANCE", rewardTokenAddress],
    async () => {
      return await stakingToken?.erc20.allowance(address);
    }
  );

  const { data: rewardsBalance } = useContractRead(
    contract,
    "getRewardTokenBalance"
  );

  const { chainId } = useWeb3React();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const rewardTokenInfo = useAsyncMemo(
    async () => {
      return await rewardToken?.get();
    },
    undefined,
    [rewardToken]
  );

  const stakingTokenInfo = useAsyncMemo(
    async () => {
      return await stakingToken?.get();
    },
    undefined,
    [stakingToken]
  );

  const trackEventMutation = useTrackUserEventsMutation();

  const stakeMutation = useMutation(
    async ({ amount }: { amount: BigNumber }) => {
      let call = contract?.prepare("stake", [amount]);

      let tx = await call?.send();

      if (tx?.hash && chainId) {
        const values = {
          amount: `${formatUnits(
            amount,
            stakingTokenBalance?.decimals
          )} ${stakingTokenBalance?.symbol}`,
          name: rewardTokenInfo?.name || "",
        };

        createNotification({
          subtype: "stakeToken",
          values,
          type: "transaction",
          metadata: { hash: tx?.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      await tx?.wait();

      await trackEventMutation.mutateAsync({
        event: UserEvents.stakeErc20,
        chainId,
        hash: tx?.hash,
        metadata: JSON.stringify({
          amount: amount.toString(),
          stakeAddress: address,
          account,
        }),
      });
    }
  );

  const unstakeMutation = useMutation(
    async ({ amount }: { amount: BigNumber }) => {
      let call = contract?.prepare("withdraw", [amount]);

      let tx = await call?.send();

      if (tx?.hash && chainId) {
        const values = {
          amount: `${formatUnits(
            amount,
            stakingTokenBalance?.decimals
          )} ${stakingTokenBalance?.symbol}`,
          name: rewardTokenInfo?.name || "",
        };

        createNotification({
          subtype: "unstakeToken",
          values,
          type: "transaction",
          metadata: { hash: tx?.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      await tx?.wait();

      await trackEventMutation.mutateAsync({
        event: UserEvents.unstakeErc20,
        chainId,
        hash: tx?.hash,
        metadata: JSON.stringify({
          amount: amount.toString(),
          stakeAddress: address,
          account,
        }),
      });
      refetchStakingTokenBalance();
      refetchStakeInfo();
    }
  );

  const handleSubmit = async ({ amount }: { amount: string }) => {
    const amountParsed = parseUnits(amount, stakingTokenBalance?.decimals);

    if (!allowance?.value.gte(amountParsed)) {
      await approve({ amount });
    }

    const values = {
      amount: `${amount} ${stakingTokenBalance?.symbol}`,
      name: rewardTokenInfo?.name || "",
    };

    watchTransactionDialog.open("stakeToken", values);

    await stakeMutation.mutateAsync({ amount: amountParsed });
  };

  const claimRewardsMutation = useMutation(async () => {
    try {
      let call = contract?.prepare("claimRewards", []);

      let values = {
        amount: `${rewards} ${rewardTokenInfo?.symbol}`,
        name: rewardTokenInfo?.name || "",
      };

      watchTransactionDialog.open("claimRewards", values);

      const tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          subtype: "claimRewards",
          values,
          type: "transaction",
          metadata: { hash: tx?.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);

        await trackEventMutation.mutateAsync({
          event: UserEvents.stakeClaimErc20,
          chainId,
          hash: tx?.hash,
          metadata: JSON.stringify({
            amount: rewardTokenBalance?.value.toString(),
            stakeAddress: address,
            account,
          }),
        });
      }

      await tx?.wait();

      refetchRewardTokenBalance();
      return true;
    } catch (error: any) {
      console.error("Error during claim rewards:", error);

      if (error.code === -32002) {
        watchTransactionDialog.setError(new Error("There is already a pending request in the wallet. Please resolve that request first."));
      } else if (error.code === 4001) {
        watchTransactionDialog.setError(new Error("Transaction rejected by the user."));
      } else if (
        error.message && (
          error.message.includes("429") ||
          error.message.includes("rate limit") ||
          error.message.includes("too many requests")
        )
      ) {
        watchTransactionDialog.setError(new Error("The network is congested. Please wait a few moments and try again. Your rewards are safe."));
      } else if (
        error.message && (
          error.message.includes("timeout") ||
          error.message.includes("timed out") ||
          error.message.includes("exceeded") ||
          error.message.includes("server error")
        )
      ) {
        watchTransactionDialog.setError(new Error("Timeout exceeded. The transaction could not be completed, but you can try again. Your rewards are safe."));
      } else {
        watchTransactionDialog.setError(error);
      }
      return false;
    }
  });

  const handleClaim = async () => {
    const values = {
      amount: `${rewards} ${rewardTokenInfo?.symbol}`,
      name: rewardTokenInfo?.name || "",
    };

    try {
      const result = await claimRewardsMutation.mutateAsync();
      if (result) {
        refetchRewardTokenBalance();
        refetchStakeInfo();
      }
    } catch (error) {
      console.error("Handle claim error:", error);
    }
  };

  const handleSubmitUnstake = async ({ amount }: { amount: string }) => {
    const amountParsed = parseUnits(amount, stakingTokenBalance?.decimals);

    const values = {
      amount: `${amount} ${stakingTokenBalance?.symbol}`,
      name: rewardTokenInfo?.name || "",
    };

    watchTransactionDialog.open("unstakeToken", values);

    await unstakeMutation.mutateAsync({ amount: amountParsed });

    // await withdraw({ args: [amountParsed] });
  };

  const handleChangeTab = (e: SyntheticEvent, value: "stake" | "unstake") => {
    setTab(value);
  };

  const { formatMessage } = useIntl();

  const validateStake = async ({ amount }: { amount: string }) => {
    let errors: FormikErrors<{ amount: string }> = {};

    const amountParsed = parseUnits(
      amount || "0",
      stakingTokenBalance?.decimals
    );

    if (amountParsed.isZero()) {
      errors["amount"] = formatMessage({
        id: "the.amount.cannot.be.zero",
        defaultMessage: "The amount cannot be zero",
      });
    }

    if (amountParsed.gt(stakingTokenBalance?.value || BigNumber.from(0))) {
      errors["amount"] = formatMessage({
        id: "amount.exceeds.the.balance",
        defaultMessage: "Amount exceeds the balance",
      });
    }

    return errors;
  };

  const validateUnstake = async ({ amount }: { amount: string }) => {
    let errors: FormikErrors<{ amount: string }> = {};

    const amountParsed = parseUnits(
      amount || "0",
      stakingTokenBalance?.decimals
    );

    if (amountParsed.isZero()) {
      errors["amount"] = formatMessage({
        id: "the.amount.cannot.be.zero",
        defaultMessage: "The amount cannot be zero",
      });
    }

    if (amountParsed.gt(tokensStakedValue || BigNumber.from(0))) {
      errors["amount"] = formatMessage({
        id: "amount.exceeds.the.amount.staked",
        defaultMessage: "Amount exceeds the amount staked",
      });
    }

    return errors;
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Tabs value={tab} variant="fullWidth" onChange={handleChangeTab}>
            <Tab
              value="stake"
              label={<FormattedMessage id="stake" defaultMessage="Stake" />}
            />
            <Tab
              value="unstake"
              label={<FormattedMessage id="unstake" defaultMessage="Unstake" />}
            />
          </Tabs>
          <Divider />
          {tab === "stake" && (
            <Box>
              <Formik
                initialValues={{ amount: "" }}
                onSubmit={handleSubmit}
                validate={validateStake}
              >
                {({ submitForm, isValid, isSubmitting, setFieldValue }: any) => (
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Box>
                        <Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography>
                              <FormattedMessage
                                id="your.staked"
                                defaultMessage="Your stake"
                              />
                            </Typography>
                            <Typography color="text.secondary">
                              {stakingTokenBalance ? (
                                `${tokensStaked} ${stakingTokenBalance?.symbol}`
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography>
                              <FormattedMessage
                                id="rewards.rate"
                                defaultMessage="Rewards rate"
                              />
                            </Typography>
                            <Typography color="text.secondary">
                              {!isLoadingRatio ? (
                                `${rewardsPerSecond}`
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                          </Stack>
                          {/* <Stack direction="row" justifyContent="space-between">
                            <Typography>
                              <FormattedMessage
                                id="total.rewards"
                                defaultMessage="Total Rewards"
                              />
                            </Typography>
                            <Typography color="text.secondary">
                              {rewardsBalance && rewardTokenBalance ? (
                                `${formatBigNumber(
                                  rewardsBalance,
                                  rewardTokenBalance?.decimals || 18
                                )} ${rewardTokenBalance?.symbol}`
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                            </Stack>*/}
                          <Stack direction="row" justifyContent="space-between">
                            <Typography>
                              <FormattedMessage
                                id="availclaimableable.rewards"
                                defaultMessage="Claimable rewards"
                              />
                            </Typography>
                            <Typography color="text.secondary">
                              {rewardTokenBalance && stakeInfo?.length > 1 ? (
                                `${formatBigNumber(
                                  stakeInfo[1],
                                  rewardTokenBalance.decimals
                                )} ${rewardTokenBalance?.symbol}`
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid size={12}>
                      <FormikDecimalInput
                        name="amount"
                        decimals={stakingTokenBalance?.decimals}
                        TextFieldProps={{
                          label: (
                            <FormattedMessage
                              id="amount"
                              defaultMessage="Amount"
                            />
                          ),
                          fullWidth: true,
                          InputProps: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  disabled={isSubmitting}
                                  size="small"
                                  onClick={() =>
                                    setFieldValue(
                                      "amount",
                                      stakingTokenBalance?.displayValue
                                    )
                                  }
                                >
                                  <FormattedMessage
                                    id="max"
                                    defaultMessage="Max"
                                  />
                                </Button>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <FormattedMessage
                        id="available.balance.amount"
                        defaultMessage="Available amount: {amount}"
                        values={{
                          amount: stakingTokenBalance ? (
                            `${stakingTokenBalance?.displayValue} ${stakingTokenBalance?.symbol}`
                          ) : (
                            <Skeleton />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        onClick={submitForm}
                        disabled={
                          isSubmitting ||
                          !isValid ||
                          (rewardsBalance && rewardsBalance.eq(0))
                        }
                        startIcon={
                          isSubmitting ? (
                            <CircularProgress color="inherit" size="1rem" />
                          ) : undefined
                        }
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                      >
                        {rewardsBalance && rewardsBalance.eq(0) ? (
                          <FormattedMessage
                            id="no.rewards"
                            defaultMessage="no.rewards"
                          />
                        ) : (
                          <FormattedMessage id="stake" defaultMessage="Stake" />
                        )}
                      </Button>
                    </Grid>
                    {rewardTokenBalance &&
                      stakeInfo?.length > 1 &&
                      stakeInfo[1].gt(0) && (
                        <Grid size={12}>
                          <Button
                            onClick={handleClaim}
                            disabled={
                              isSubmitting || claimRewardsMutation.isLoading
                            }
                            startIcon={
                              claimRewardsMutation.isLoading ? (
                                <CircularProgress color="inherit" size="1rem" />
                              ) : undefined
                            }
                            variant="outlined"
                            color="primary"
                            fullWidth
                            size="large"
                          >
                            <FormattedMessage
                              id="claim.rewards"
                              defaultMessage="Claim rewards"
                            />
                          </Button>
                        </Grid>
                      )}
                  </Grid>
                )}
              </Formik>
            </Box>
          )}
          {tab === "unstake" && (
            <Box>
              <Formik
                initialValues={{ amount: "" }}
                onSubmit={handleSubmitUnstake}
                validate={validateUnstake}
              >
                {({ submitForm, isValid, isSubmitting, setFieldValue }: any) => (
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Box>
                        <Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography>
                              <FormattedMessage
                                id="your.stake"
                                defaultMessage="Your stake"
                              />
                            </Typography>
                            <Typography color="text.secondary">
                              {tokensStaked} {stakingTokenBalance?.symbol}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid size={12}>
                      <FormikDecimalInput
                        name="amount"
                        decimals={stakingTokenBalance?.decimals}
                        TextFieldProps={{
                          label: (
                            <FormattedMessage
                              id="amount"
                              defaultMessage="Amount"
                            />
                          ),
                          fullWidth: true,
                          InputProps: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  size="small"
                                  disabled={isSubmitting}
                                  onClick={() =>
                                    setFieldValue(
                                      "amount",
                                      tokensStakedValueFormatted
                                    )
                                  }
                                >
                                  <FormattedMessage
                                    id="max"
                                    defaultMessage="Max"
                                  />
                                </Button>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        onClick={submitForm}
                        disabled={isSubmitting || !isValid}
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                      >
                        <FormattedMessage
                          id="unstake"
                          defaultMessage="Unstake"
                        />
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Formik>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
