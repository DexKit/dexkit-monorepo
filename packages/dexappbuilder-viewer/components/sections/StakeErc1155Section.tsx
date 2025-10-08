import { UserEvents } from "@dexkit/core/constants/userEvents";
import { formatBigNumber } from "@dexkit/core/utils";
import { useDexKitContext } from "@dexkit/ui";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { formatTransactionError, useApproveForAll } from "@dexkit/ui/modules/contract-wizard/hooks/thirdweb";
import { StakeErc155PageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
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
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import SelectNFTEditionClaimDialog from "../dialogs/SelectNFTEditionClaimDialog";
import SelectNFTEditionDialog from "../dialogs/SelectNFTEditionDialog";

export interface StakeErc1155SectionProps {
  section: StakeErc155PageSection;
}

function useContractMetadata(contract: any) {
  const [metadata, setMetadata] = useState<any>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!contract) return;

    let isMounted = true;
    setLoading(true);

    const fetchMetadata = async () => {
      try {
        const result = await contract.metadata.get();
        if (isMounted) {
          setMetadata(result);
          setError(null);
        }
      } catch (err: any) {
        console.warn("Error loading metadata:", err.message);
        if (isMounted) {
          setError(err);
          setMetadata({
            name: "Staking Contract",
            description: "Metadata not available"
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setError(new Error("The IPFS connection has expired. Using basic contract information."));
        setMetadata({
          name: "Staking Contract",
          description: "Metadata not available due to IPFS timeout"
        });
        setLoading(false);
      }
    }, 15000);

    fetchMetadata();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [contract, loading]);

  return { metadata, error, loading };
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
    [account]
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
  }, [stakeInfo]);

  const { data: rewardRatio } = useContractRead(
    contract,
    "getDefaultRewardsPerUnitTime"
  );
  const { data: rewardTimeUnit } = useContractRead(
    contract,
    "getDefaultTimeUnit"
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

  const { metadata: contractInfo, error: contractInfoError } = useContractMetadata(contract);

  useEffect(() => {
    if (contractInfoError) {
      console.warn("Metadata error:", contractInfoError.message);
    }
  }, [contractInfoError]);

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const stakeNftMutation = useMutation(
    async ({ tokenId, amount }: { tokenId: string; amount: BigNumber }) => {
      try {
        let values = {
          nft: tokenId,
          amount: amount?.toNumber().toString(),
          name: contractInfo?.name || "Staking Contract",
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
      } catch (error: any) {
        console.error("Error during staking:", error);

        let errorMessage = error.message || 'Unknown error during staking';

        if (errorMessage.includes('user denied') || errorMessage.includes('User denied') ||
          errorMessage.includes('rejected transaction') || errorMessage.includes('user rejected')) {
          errorMessage = 'Transaction cancelled.';
        } else if (errorMessage.includes('MetaMask Tx Signature')) {
          errorMessage = 'Transaction cancelled.';
        } else if (errorMessage.includes('TRANSACTION ERROR') || errorMessage.includes('TRANSACTION INFORMATION')) {
          if (errorMessage.includes('User denied transaction signature')) {
            errorMessage = 'Transaction cancelled.';
          } else {
            const reasonMatch = errorMessage.match(/Reason: (.+?)(?=\s*╔|$)/);
            errorMessage = reasonMatch ? reasonMatch[1].trim() : 'The transaction failed. Please try again.';
          }
        }

        watchTransactionDialog.setError(new Error(errorMessage));
        throw error;
      }
    }
  );

  const unstakeRewardsMutation = useMutation(
    async ({ tokenId, amount }: { tokenId: string; amount: BigNumber }) => {
      try {
        let call = contract?.prepare("withdraw", [tokenId, amount]);

        let values = {
          nft: tokenId,
          amount: amount?.toNumber().toString(),
          name: contractInfo?.name || "Staking Contract",
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
      } catch (error: any) {
        console.error("Error during unstaking:", error);

        let errorMessage = error.message || 'Unknown error during unstaking';

        if (errorMessage.includes('user denied') || errorMessage.includes('User denied') ||
          errorMessage.includes('rejected transaction') || errorMessage.includes('user rejected')) {
          errorMessage = 'Transaction cancelled.';
        } else if (errorMessage.includes('MetaMask Tx Signature')) {
          errorMessage = 'Transaction cancelled.';
        } else if (errorMessage.includes('TRANSACTION ERROR') || errorMessage.includes('TRANSACTION INFORMATION')) {
          if (errorMessage.includes('User denied transaction signature')) {
            errorMessage = 'Transaction cancelled.';
          } else {
            const reasonMatch = errorMessage.match(/Reason: (.+?)(?=\s*╔|$)/);
            errorMessage = reasonMatch ? reasonMatch[1].trim() : 'The transaction failed. Please try again.';
          }
        }

        watchTransactionDialog.setError(new Error(errorMessage));
        throw error;
      }
    }
  );

  const { chainId } = useWeb3React();

  const claimRewardsMutation = useMutation(
    async ({ tokenId }: { tokenId: string }) => {
      try {
        let call = contract?.prepare("claimRewards", [tokenId]);

        let values = {
          nft: tokenId,
          name: contractInfo?.name || "Staking Contract",
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

        try {
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
        } catch (trackError) {
          console.error("Error tracking claim event:", trackError);
        }

        return res;
      } catch (error: any) {
        console.error("Error during claim rewards:", error);

        let errorMessage = error.message || 'Unknown error during claim rewards';

        const formattedError = formatTransactionError(errorMessage);

        if (error.code === -32002) {
          watchTransactionDialog.setError(new Error("There is already a pending request in the wallet. Please resolve that request first."));
        } else if (error.code === 4001) {
          watchTransactionDialog.setError(new Error("Transaction was cancelled by user."));
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
          watchTransactionDialog.setError(new Error(formattedError));
        }
        throw error;
      }
    }
  );

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

    if (amount && selectedTokenId) {
      try {
        await stakeNftMutation.mutateAsync({
          tokenId: selectedTokenId,
          amount: BigNumber.from(amount),
        });
        refetchStakeInfo();
        refetchRewardTokenBalance();
      } catch (err) {
        console.debug("Handled error in stakeNftMutation");
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
        console.debug("Handled error in unstakeRewardsMutation");
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
      console.error("Error during claim:", err);
      if ((err as any)?.message?.includes("User Events") || (err as any)?.message?.includes("500")) {
        console.log("Transaction successful but user-events error");
        refetchRewardTokenBalance();
        refetchStakeInfo();
      }
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
            <Tabs
              onChange={handleChangeTab}
              variant="fullWidth"
              value={tab}
              sx={{
                '& .MuiTab-root': {
                  color: 'text.primary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
              }}
            >
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
                  <Grid size={12}>
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
                            color="text.primary"
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
                            <Typography color="text.primary">
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
                    <Grid size={12}>
                      <Typography color="primary" variant="body1">
                        <FormattedMessage
                          id="nft.amount.of.tokenId.is.selected.to.stake"
                          defaultMessage='{amount} of "#{tokenId}" is selected to stake'
                          values={{ tokenId: selectedTokenId, amount }}
                        />
                      </Typography>
                    </Grid>
                  )}

                  <Grid size={12}>
                    <Box>
                      <Stack>
                        {/* <Stack direction="row" justifyContent="space-between">
                          <Typography>
                            <FormattedMessage
                              id="total.rewards"
                              defaultMessage="Total Rewards"
                            />
                          </Typography>
                          <Typography color="text.primary">
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
                          <Typography color="text.primary">
                            <FormattedMessage
                              id="rewards.rate"
                              defaultMessage="Rewards rate"
                            />
                          </Typography>
                          <Typography color="text.primary">
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
                          <Typography color="text.primary">
                            <FormattedMessage
                              id="claimable.rewards"
                              defaultMessage="Claimable rewards"
                            />
                          </Typography>
                          <Typography color="text.primary">
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
                  <Grid size={12}>
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
                    <Grid size={12}>
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
                  <Grid size={12}>
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
                            color="text.primary"
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
                            <Typography color="text.primary">
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
                    <Grid size={12}>
                      <Typography color="primary" variant="body1">
                        <FormattedMessage
                          id="amount.of.tokenId.is.selected.to.unstake"
                          defaultMessage='{amount} of "#{tokenId}" is selected to unstake'
                          values={{ tokenId: selectedTokenId, amount }}
                        />
                      </Typography>
                    </Grid>
                  )}

                  <Grid size={12}>
                    <Box>
                      <Stack>
                        {/*  <Stack direction="row" justifyContent="space-between">
                          <Typography>
                            <FormattedMessage
                              id="total.rewards"
                              defaultMessage="Total Rewards"
                            />
                          </Typography>
                          <Typography color="text.primary">
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
                          <Typography color="text.primary">
                            <FormattedMessage
                              id="rewards.second"
                              defaultMessage="Rewards/second"
                            />
                          </Typography>
                          <Typography color="text.primary">
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
                          <Typography color="text.primary">
                            <FormattedMessage
                              id="claimable.rewards"
                              defaultMessage="Claimable rewards"
                            />
                          </Typography>
                          <Typography color="text.primary">
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
                  <Grid size={12}>
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
