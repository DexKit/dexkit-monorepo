import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatBigNumber } from "@dexkit/core/utils";
import { useDexKitContext } from "@dexkit/ui";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useApproveForAll } from "@dexkit/ui/modules/contract-wizard/hooks/thirdweb";
import { StakeErc155PageSection } from "@dexkit/ui/modules/wizard/types/section";
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
import { BigNumber } from "ethers";
import moment from "moment";
import { SyntheticEvent, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import SelectNFTEditionClaimDialog from "../dialogs/SelectNFTEditionClaimDialog";
import SelectNFTEditionDialog from "../dialogs/SelectNFTEditionDialog";

export interface StakeErc1155SectionProps {
  section: StakeErc155PageSection;
}

export default function StakeErc1155Section({
  section,
}: StakeErc1155SectionProps) {
  const { address, network } = section.settings;

  const [tab, setTab] = useState<"stake" | "unstake">("stake");

  const [amount, setAmount] = useState<number>();

  const { data: contract } = useContract(address, "custom");

  const [selectedTokenId, setSelectedTokenId] = useState<string>();

  const { account } = useWeb3React();

  const { data: rewardTokenAddress } = useContractRead(contract, "rewardToken");

  const { data: stakeInfo, refetch: refetchStakeInfo } = useContractRead(
    contract,
    "getStakeInfo",
    [account],
  );

  const { data: rewardToken } = useContract(rewardTokenAddress || "", "token");

  const { data: rewardTokenBalance, refetch: refetchRewardTokenBalance } =
    useTokenBalance(rewardToken, account);

  const [stakedTokenIds, rewards] = useMemo(() => {
    if (stakeInfo) {
      const [n, d, r] = stakeInfo;

      return [
        Array.isArray(n) ? (n as BigNumber[])?.map((v) => v?.toNumber()) : [],
        r,
      ];
    }

    return [[] as number[], BigNumber.from(0)];
  }, [stakeInfo, rewardTokenBalance]);

  const { data: rewardRatio } = useContractRead(
    contract,
    "getDefaultRewardsPerUnitTime",
  );
  const { data: rewardTimeUnit } = useContractRead(
    contract,
    "getDefaultTimeUnit",
  );

  const handleChangeTab = (e: SyntheticEvent, value: "stake" | "unstake") => {
    setTab(value);
    setAmount(undefined);
    setSelectedTokenId(undefined);
  };

  const { data: stakingAddress } = useContractRead(contract, "stakingToken");

  const [open, setOpen] = useState(false);

  const handleOpenSelectNFT = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectNFT = (tokenId: string, amount: number) => {
    setSelectedTokenId(tokenId);
    setAmount(amount);
    handleClose();
  };

  const trackUserEvent = useTrackUserEventsMutation();

  const { data: stakingTokenContract } = useContract(stakingAddress, "custom");

  const contractInfo = useAsyncMemo(
    async () => {
      return await contract?.metadata.get();
    },
    undefined,
    [contract],
  );

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const stakeNftMutation = useMutation(
    async ({ tokenId, amount }: { tokenId: string; amount: BigNumber }) => {
      let values = {
        nft: tokenId,
        amount: amount?.toNumber().toString(),
        name: contractInfo?.name || "",
      };

      watchTransactionDialog.open("stakeEdition", values);

      let call = contract?.prepare("stake", [tokenId, amount]);

      const tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: "transaction",
          subtype: "stakeEdition",
          values: values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      await trackUserEvent.mutateAsync({
        event: UserEvents.stakeErc1155,
        chainId,
        hash: tx?.hash,
        metadata: JSON.stringify({
          tokenId,
          amount: amount.toString(),
          stakeAddress: address,
          account,
        }),
      });

      return await tx?.wait();
    },
  );

  const unstakeRewardsMutation = useMutation(
    async ({ tokenId, amount }: { tokenId: string; amount: BigNumber }) => {
      let call = contract?.prepare("withdraw", [tokenId, amount]);

      let values = {
        nft: tokenId,
        amount: amount?.toNumber().toString(),
        name: contractInfo?.name || "",
      };

      watchTransactionDialog.open("unstakeEdition", values);

      const tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: "transaction",
          subtype: "unstakeEdition",
          values: values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      await trackUserEvent.mutateAsync({
        event: UserEvents.unstakeErc1155,
        chainId,
        hash: tx?.hash,
        metadata: JSON.stringify({
          tokenId,
          amount: amount.toString(),
          stakeAddress: address,
          account,
        }),
      });

      return await tx?.wait();
    },
  );

  const { chainId } = useWeb3React();

  const claimRewardsMutation = useMutation(
    async ({ tokenId }: { tokenId: string }) => {
      let call = contract?.prepare("claimRewards", [tokenId]);

      let values = {
        nft: tokenId,
        name: contractInfo?.name || "",
      };

      watchTransactionDialog.open("claimEditionRewards", values);

      const tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: "transaction",
          subtype: "claimEditionRewards",
          values: values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      const res = await tx?.wait();

      await trackUserEvent.mutateAsync({
        event: UserEvents.stakeClaimErc1155,
        chainId,
        hash: tx?.hash,
        metadata: JSON.stringify({
          tokenId,
          stakeAddress: address,
          account,
        }),
      });

      return res;
    },
  );

  const approveForAllMuation = useApproveForAll({
    contract: stakingTokenContract,
    address,
  });

  const { data: isApprovedForAll } = useContractRead(
    stakingTokenContract,
    "isApprovedForAll",
    [account, address],
  );

  const handleStake = async () => {
    if (!isApprovedForAll) {
      await approveForAllMuation.mutateAsync();
    }

    if (amount && selectedTokenId) {
      try {
        await stakeNftMutation.mutateAsync({
          tokenId: selectedTokenId,
          amount: BigNumber.from(amount),
        });
        refetchStakeInfo();
        refetchRewardTokenBalance();
      } catch (err) {
        watchTransactionDialog.setError(err as any);
      }
    }

    setSelectedTokenId(undefined);
    setAmount(undefined);
  };

  const handleUnstake = async () => {
    if (selectedTokenId && amount) {
      try {
        await unstakeRewardsMutation.mutateAsync({
          tokenId: selectedTokenId,
          amount: BigNumber.from(amount),
        });
        refetchStakeInfo();
        refetchRewardTokenBalance();
      } catch (err) {
        watchTransactionDialog.setError(err as any);
      }
    }

    setSelectedTokenId(undefined);
    setAmount(undefined);
  };

  const [showClaim, setShowClaim] = useState(false);

  const handleCloseClaim = () => {
    setShowClaim(false);
  };

  const handleOpenClaim = () => {
    setShowClaim(true);
  };

  const handleClaim = async (tokenId: string) => {
    try {
      await claimRewardsMutation.mutateAsync({ tokenId });
      refetchRewardTokenBalance();
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
  };

  return (
    <>
      <SelectNFTEditionDialog
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
      <SelectNFTEditionClaimDialog
        DialogProps={{
          open: showClaim,
          onClose: handleCloseClaim,
          fullWidth: true,
          maxWidth: "lg",
        }}
        stakingContractAddress={address}
        address={stakingAddress}
        onClaim={handleClaim}
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
                  {selectedTokenId && (
                    <Grid item xs={12}>
                      <Typography color="primary" variant="body1">
                        <FormattedMessage
                          id="nft.amount.of.tokenId.is.selected.to.stake"
                          defaultMessage='{amount} of "#{tokenId}" is selected to stake'
                          values={{ tokenId: selectedTokenId, amount }}
                        />
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box>
                      <Stack>
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
                              id="rewards.rate"
                              defaultMessage="Rewards rate"
                            />
                          </Typography>
                          <Typography color="text.secondary">
                            {rewardRatio && rewardTimeUnit ? (
                              <>
                                {formatBigNumber(
                                  rewardRatio,
                                  rewardTokenBalance?.decimals || 18,
                                )}{" "}
                                {rewardTokenBalance?.symbol}{" "}
                                {moment
                                  .duration(
                                    rewardTimeUnit?.toNumber(),
                                    "seconds",
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
                                rewardTokenBalance?.decimals || 18,
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
                      disabled={stakeNftMutation.isLoading || !selectedTokenId}
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
                        onClick={handleOpenClaim}
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
                  {selectedTokenId && (
                    <Grid item xs={12}>
                      <Typography color="primary" variant="body1">
                        <FormattedMessage
                          id="amount.of.tokenId.is.selected.to.unstake"
                          defaultMessage='{amount} of "#{tokenId}" is selected to unstake'
                          values={{ tokenId: selectedTokenId, amount }}
                        />
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box>
                      <Stack>
                        {/*  <Stack direction="row" justifyContent="space-between">
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
                              id="rewards.second"
                              defaultMessage="Rewards/second"
                            />
                          </Typography>
                          <Typography color="text.secondary">
                            {rewardRatio && rewardTimeUnit ? (
                              <>
                                {formatBigNumber(
                                  rewardRatio,
                                  rewardTokenBalance?.decimals || 18,
                                )}{" "}
                                {rewardTokenBalance?.symbol}{" "}
                                {moment
                                  .duration(
                                    rewardTimeUnit?.toNumber(),
                                    "seconds",
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
                                rewardTokenBalance?.decimals || 18,
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
                        unstakeRewardsMutation.isLoading || !selectedTokenId
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
