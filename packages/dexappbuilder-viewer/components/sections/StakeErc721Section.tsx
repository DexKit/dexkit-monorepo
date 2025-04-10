import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatBigNumber } from "@dexkit/core/utils";
import { useDexKitContext } from "@dexkit/ui";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useApproveForAll } from "@dexkit/ui/modules/contract-wizard/hooks/thirdweb";
import { StakeErc721PageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import Token from "@mui/icons-material/Token";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import {
  useContract,
  useContractRead,
  useTokenBalance,
} from "@thirdweb-dev/react";

import moment from "moment";
import { SyntheticEvent, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import SelectNFTDialog from "../dialogs/SelectNFTDialog";

export interface StakeErc721SectionProps {
  section: StakeErc721PageSection;
}

export default function StakeErc721Section({
  section,
}: StakeErc721SectionProps) {
  const trackUserEventsMutation = useTrackUserEventsMutation();
  const { address, network } = section.settings;

  const [tab, setTab] = useState<"stake" | "unstake">("stake");

  const { data: contract } = useContract(address, "custom");

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const { account } = useWeb3React();

  const { data: stakeInfo, refetch: refetchStakeInfo } = useContractRead(
    contract,
    "getStakeInfo",
    [account]
  );
  const { data: rewardTokenAddress } = useContractRead(contract, "rewardToken");

  const { data: rewardToken } = useContract(rewardTokenAddress || "", "token");

  const { data: rewardTokenBalance, refetch: refetchRewardTokenBalance } =
    useTokenBalance(rewardToken, account);

  const [stakedTokenIds, rewards] = useMemo(() => {
    if (stakeInfo) {
      const [n, d] = stakeInfo;

      return [
        Array.isArray(n) ? (n as bigint[])?.map((v) => v?.toNumber()) : [],
        d,
      ];
    }

    return [[] as number[], BigInt(0)];
  }, [stakeInfo, rewardTokenBalance]);

  const contractInfo = useAsyncMemo(
    async () => {
      return await contract?.metadata.get();
    },
    undefined,
    [contract]
  );

  const { data: rewardRatio } = useContractRead(
    contract,
    "getRewardsPerUnitTime"
  );
  const { data: rewardTimeUnit } = useContractRead(contract, "getTimeUnit");

  const { data: rewardsBalance } = useContractRead(
    contract,
    "getRewardTokenBalance"
  );

  const handleChangeTab = (e: SyntheticEvent, value: "stake" | "unstake") => {
    setTab(value);
    setSelectedTokenIds([]);
  };

  const { data: stakingAddress } = useContractRead(contract, "stakingToken");

  const [open, setOpen] = useState(false);

  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

  const handleOpenSelectNFT = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectNFT = (tokenIds: string[]) => {
    setSelectedTokenIds(tokenIds);
    handleClose();
  };

  const stakeNftMutation = useMutation(
    async ({ tokenIds }: { tokenIds: string[] }) => {
      let values = {
        nfts: tokenIds.join(", "),
        name: contractInfo?.name || "",
      };

      watchTransactionDialog.open("stakeNfts", values);

      let call = contract?.prepare("stake", [tokenIds]);

      const tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: "transaction",
          subtype: "stakeNfts",
          values: values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      const res = await tx?.wait();

      await trackUserEventsMutation.mutateAsync({
        event: UserEvents.stakeErc721,
        chainId,
        hash: tx?.hash,
        metadata: JSON.stringify({
          tokenIds: tokenIds,
          stakeAddress: address,
          account,
        }),
      });

      return res;
    }
  );

  const unstakeRewardsMutation = useMutation(
    async ({ tokenIds }: { tokenIds: string[] }) => {
      let call = contract?.prepare("withdraw", [tokenIds]);

      let values = {
        nfts: tokenIds.join(", "),
        name: contractInfo?.name || "",
      };

      watchTransactionDialog.open("unstakeNfts", values);

      const tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: "transaction",
          subtype: "unstakeNfts",
          values: values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      const res = await tx?.wait();

      await trackUserEventsMutation.mutateAsync({
        event: UserEvents.unstakeErc721,
        chainId,
        hash: tx?.hash,
        metadata: JSON.stringify({
          tokenIds: tokenIds,
          stakeAddress: address,
          account,
        }),
      });

      return res;
    }
  );

  const { chainId } = useWeb3React();

  const claimRewardsMutation = useMutation(async () => {
    const amount = rewardTokenBalance?.value.toString();

    let call = contract?.prepare("claimRewards", []);

    let values = {
      amount: `${formatBigNumber(
        stakeInfo && stakeInfo.length > 0 ? stakeInfo[1] : "0",
        rewardTokenBalance?.decimals
      )} ${rewardTokenBalance?.symbol}`,
      name: contractInfo?.name || "",
    };

    watchTransactionDialog.open("claimRewards", values);

    const tx = await call?.send();

    if (tx?.hash && chainId) {
      createNotification({
        type: "transaction",
        subtype: "claimRewards",
        values: values,
        metadata: { hash: tx.hash, chainId },
      });

      watchTransactionDialog.watch(tx.hash);
    }

    await tx?.wait();

    await trackUserEventsMutation.mutateAsync({
      event: UserEvents.stakeClaimErc721,
      chainId,
      hash: tx?.hash,
      metadata: JSON.stringify({
        amount: rewardTokenBalance?.value.toString(),
        stakeAddress: address,
        account,
      }),
    });
  });

  const handleClaim = async () => {
    await claimRewardsMutation.mutateAsync();
    refetchRewardTokenBalance();
    refetchStakeInfo();
  };

  const { data: stakingTokenContract } = useContract(stakingAddress, "custom");

  const approveForAllMuation = useApproveForAll({
    contract: stakingTokenContract,
    address,
  });

  const { data: isApprovedForAll } = useContractRead(
    stakingTokenContract,
    "isApprovedForAll",
    [account, address]
  );

  const handleStake = async () => {
    if (!isApprovedForAll) {
      await approveForAllMuation.mutateAsync();
    }

    await stakeNftMutation.mutateAsync({ tokenIds: selectedTokenIds });
    refetchRewardTokenBalance();
    refetchStakeInfo();
    setSelectedTokenIds([]);
  };

  const handleUnstake = async () => {
    await unstakeRewardsMutation.mutateAsync({ tokenIds: selectedTokenIds });
    refetchRewardTokenBalance();
    refetchStakeInfo();

    setSelectedTokenIds([]);
  };

  return (
    <>
      <SelectNFTDialog
        DialogProps={{
          open,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: "lg",
        }}
        stakingContractAddress={address}
        address={stakingAddress}
        network={network}
        onSelect={handleSelectNFT}
        isUnstake={tab === "unstake"}
      />
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Tabs onChange={handleChangeTab} variant="fullWidth" value={tab}>
              <Tab
                value="stake"
                label={<FormattedMessage id="stake" defaultMessage="Stake" />}
              />
              <Tab
                value="unstake"
                label={
                  <FormattedMessage id="unstake" defaultMessage="Unstake" />
                }
              />
            </Tabs>
            {tab === "stake" && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper variant="outlined">
                      {stakedTokenIds && stakedTokenIds?.length > 0 ? (
                        <CardActionArea
                          sx={{ py: 2 }}
                          onClick={handleOpenSelectNFT}
                        >
                          <Typography align="center" variant="h5">
                            {stakedTokenIds?.length}
                          </Typography>
                          <Typography
                            align="center"
                            variant="body1"
                            color="text.secondary"
                          >
                            <FormattedMessage
                              id="nfts.staked"
                              defaultMessage="NFTs staked"
                            />
                          </Typography>
                        </CardActionArea>
                      ) : (
                        <CardActionArea
                          onClick={handleOpenSelectNFT}
                          sx={{ p: 2 }}
                        >
                          <Stack spacing={1} alignItems="center">
                            <Token />
                            <Typography color="text.secondary">
                              <FormattedMessage
                                id="select.an.nft"
                                defaultMessage="Select an NFT"
                              />
                            </Typography>
                          </Stack>
                        </CardActionArea>
                      )}
                    </Paper>
                  </Grid>
                  {selectedTokenIds.length > 0 && (
                    <Grid item xs={12}>
                      <Typography color="text.secondary" variant="body1">
                        {selectedTokenIds.length > 1 ? (
                          <FormattedMessage
                            id="amount.nfts.selected.to.stake"
                            defaultMessage="NFTs {tokens} are selected to stake"
                            values={{
                              tokens: selectedTokenIds.join(", "),
                            }}
                          />
                        ) : (
                          <FormattedMessage
                            id="amount.tokens.selected.to.stake"
                            defaultMessage='NFT "{tokens}" is selected to stake'
                            values={{ tokens: selectedTokenIds[0] }}
                          />
                        )}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box>
                      <Stack>
                        <Stack direction="row" justifyContent="space-between">
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
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>
                            <FormattedMessage
                              id="rewards.rate"
                              defaultMessage="Rewards rate"
                            />
                          </Typography>

                          <Typography color="text.secondary">
                            {rewardRatio &&
                            rewardTimeUnit &&
                            rewardTokenBalance ? (
                              <>
                                {formatBigNumber(
                                  rewardRatio,
                                  rewardTokenBalance?.decimals || 18
                                )}{" "}
                                {rewardTokenBalance?.symbol}{" "}
                                {moment
                                  .duration(
                                    rewardTimeUnit?.toNumber(),
                                    "seconds"
                                  )
                                  .humanize()}
                              </>
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>
                            <FormattedMessage
                              id="claimable.rewards"
                              defaultMessage="Claimable rewards"
                            />
                          </Typography>
                          <Typography color="text.secondary">
                            {rewardTokenBalance && rewards ? (
                              `${formatBigNumber(
                                rewards,
                                rewardTokenBalance?.decimals || 18
                              )} ${rewardTokenBalance?.symbol}`
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      disabled={
                        stakeNftMutation.isLoading ||
                        selectedTokenIds.length === 0
                      }
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      startIcon={
                        stakeNftMutation.isLoading ? (
                          <CircularProgress size="1rem" color="inherit" />
                        ) : undefined
                      }
                      onClick={handleStake}
                    >
                      <FormattedMessage id="stake" defaultMessage="Stake" />
                    </Button>
                  </Grid>
                  {rewards && rewards.gt(0) && (
                    <Grid item xs={12}>
                      <Button
                        onClick={handleClaim}
                        startIcon={
                          claimRewardsMutation.isLoading ? (
                            <CircularProgress color="inherit" size="1rem" />
                          ) : undefined
                        }
                        disabled={
                          claimRewardsMutation.isLoading ||
                          rewards?.toNumber() === 0
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
              </Box>
            )}
            {tab === "unstake" && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper variant="outlined">
                      {stakedTokenIds && stakedTokenIds?.length > 0 ? (
                        <CardActionArea
                          sx={{ py: 2 }}
                          onClick={handleOpenSelectNFT}
                        >
                          <Typography align="center" variant="h5">
                            {stakedTokenIds?.length}
                          </Typography>
                          <Typography
                            align="center"
                            variant="body1"
                            color="text.secondary"
                          >
                            <FormattedMessage
                              id="nfts.staked"
                              defaultMessage="NFTs staked"
                            />
                          </Typography>
                        </CardActionArea>
                      ) : (
                        <CardActionArea
                          onClick={handleOpenSelectNFT}
                          sx={{ p: 2 }}
                        >
                          <Stack spacing={1} alignItems="center">
                            <Token />
                            <Typography color="text.secondary">
                              <FormattedMessage
                                id="select.nfts"
                                defaultMessage="Select NFTs"
                              />
                            </Typography>
                          </Stack>
                        </CardActionArea>
                      )}
                    </Paper>
                  </Grid>
                  {selectedTokenIds.length > 0 && (
                    <Grid item xs={12}>
                      <Typography color="text.secondary" variant="body1">
                        {selectedTokenIds.length > 1 ? (
                          <FormattedMessage
                            id="amount.tokens.selected.to.stake"
                            defaultMessage="NFTs {tokens} are selected to unstake"
                            values={{
                              tokens: selectedTokenIds.join(","),
                            }}
                          />
                        ) : (
                          <FormattedMessage
                            id="amount.tokens.selected.to.stake"
                            defaultMessage='NFTs "{tokens}" is selected to stake'
                            values={{ tokens: selectedTokenIds[0] }}
                          />
                        )}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box>
                      <Stack>
                        <Stack direction="row" justifyContent="space-between">
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
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography>
                            <FormattedMessage
                              id="rewards.rate"
                              defaultMessage="Rewards rate"
                            />
                          </Typography>
                          <Typography color="text.secondary">
                            {rewardRatio && rewardTimeUnit ? (
                              <>
                                {formatBigNumber(
                                  rewardRatio,
                                  rewardTokenBalance?.decimals || 18
                                )}{" "}
                                {rewardTokenBalance?.symbol}{" "}
                                {moment
                                  .duration(
                                    rewardTimeUnit?.toNumber(),
                                    "seconds"
                                  )
                                  .humanize()}
                              </>
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography>
                            <FormattedMessage
                              id="claimable.rewards"
                              defaultMessage="Claimable rewards"
                            />
                          </Typography>
                          <Typography color="text.secondary">
                            {rewardTokenBalance && rewards ? (
                              `${formatBigNumber(
                                rewards,
                                rewardTokenBalance?.decimals || 18
                              )} ${rewardTokenBalance?.symbol}`
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      disabled={
                        unstakeRewardsMutation.isLoading ||
                        selectedTokenIds.length === 0
                      }
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      startIcon={
                        unstakeRewardsMutation.isLoading ? (
                          <CircularProgress size="1rem" color="inherit" />
                        ) : undefined
                      }
                      onClick={handleUnstake}
                    >
                      <FormattedMessage id="unstake" defaultMessage="Unstake" />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
