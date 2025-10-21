import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { getBlockExplorerUrl, truncateAddress } from "@dexkit/core/utils";
import { useDexKitContext } from "@dexkit/ui/hooks";
import { useInterval } from "@dexkit/ui/hooks/misc";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useMerkleTreeAllowListQuery } from "@dexkit/ui/modules/token/hooks/merkleTree";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMerkleTreeFromAllowList,
  getProofsForAllowListEntry,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";

import { FormattedMessage } from "react-intl";

import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseEther } from "@dexkit/core/utils/ethers/parseEther";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import Link from "@dexkit/ui/components/AppLink";
import { ClaimAirdropErc20PageSection } from "@dexkit/ui/modules/wizard/types/section";

export interface ClaimAidropERC20SectionProps {
  section: ClaimAirdropErc20PageSection;
}

export default function ClaimAirdropERC20Section({
  section,
}: ClaimAidropERC20SectionProps) {
  const { address, network } = section.settings;
  const { account, chainId: accountChainId } = useWeb3React();

  const trackUserEventsMutation = useTrackUserEventsMutation();

  const { data: contract } = useContract(address as string);
  const [count, setCount] = useState<number>(0);

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const contractAddressAirdropQuery = useContractRead(
    contract,
    "airdropTokenAddress"
  );
  const openClaimLimitPerWalletQuery = useContractRead(
    contract,
    "openClaimLimitPerWallet"
  );

  const availableAmountQuery = useContractRead(contract, "availableAmount");

  const merkleRootQuery = useContractRead(contract, "merkleRoot");

  const supplyClaimedByWalletQuery = useContractRead(
    contract,
    "supplyClaimedByWallet",
    [account]
  );

  const expirationTimestampQuery = useContractRead(
    contract,
    "expirationTimestamp"
  );

  const countDown = useMemo(() => {
    if (expirationTimestampQuery.data) {
      const countDownDate = expirationTimestampQuery.data;

      const now = new Date().getTime() / 1000;

      const distance = countDownDate.toNumber() - now;
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
  }, [expirationTimestampQuery.data, count]);

  useInterval(
    () => {
      // Your custom logic here
      setCount(count + 1);
    },
    // Delay in milliseconds or null to stop it
    countDown === "Expired" ? null : 1000
  );

  const { data: tokenContract, isFetched } = useContract(
    contractAddressAirdropQuery.data as string,
    "token"
  );

  const tokenAddress = contractAddressAirdropQuery.data;
  //@ts-ignore
  const tokenMetadataQuery = useQuery(
    ["token_metadata", isFetched],
    async () => {
      if (tokenContract) {
        return tokenContract?.erc20?.get();
      } else {
        return null;
      }
    }
  );

  const merkleTreeAllowList = useMerkleTreeAllowListQuery({
    merkleProof: merkleRootQuery.data,
  });

  const chainId = NETWORK_FROM_SLUG(network as string)?.chainId as number;

  const getUserProof = async (
    address: string,
    allowList: { address: string; maxClaimable: string }[],
    amount: string
  ) => {
    const merkleTree = await createMerkleTreeFromAllowList(allowList);

    const leaf = {
      address: address,
      maxClaimable: amount,
    };

    const proof = await getProofsForAllowListEntry(merkleTree, leaf);
    const proofHash = proof[0];

    return proofHash;
  };

  const amountMaxToClaim = useMemo(() => {
    if (
      merkleRootQuery.data ===
      "0x0000000000000000000000000000000000000000000000000000000000000000" &&
      openClaimLimitPerWalletQuery.data &&
      tokenMetadataQuery?.data?.decimals
    ) {
      return openClaimLimitPerWalletQuery.data as BigNumber;
    } else {
      if (
        merkleTreeAllowList.data &&
        account &&
        tokenMetadataQuery?.data?.decimals
      ) {
        const claimer = merkleTreeAllowList.data.find(
          (d) => d.address.toLowerCase() === account.toLowerCase()
        );
        if (claimer && claimer?.maxClaimable) {
          return parseUnits(
            claimer?.maxClaimable,
            tokenMetadataQuery?.data?.decimals
          );
        } else {
          return BigNumber.from(0);
        }
      }
    }
  }, [
    merkleRootQuery.data,
    openClaimLimitPerWalletQuery.data,
    tokenMetadataQuery.data,
    merkleTreeAllowList.data,
  ]);

  const isLoadingMaxToClaim =
    merkleRootQuery.isLoading ||
    openClaimLimitPerWalletQuery.isLoading ||
    tokenMetadataQuery.isLoading ||
    merkleTreeAllowList.isLoading;

  const amountMaxToClaimFormatted = useMemo(() => {
    if (amountMaxToClaim && tokenMetadataQuery?.data?.decimals) {
      return formatUnits(amountMaxToClaim, tokenMetadataQuery?.data?.decimals);
    }
  }, [amountMaxToClaim, tokenMetadataQuery.data]);

  const amountToBeClaimed = useMemo(() => {
    if (supplyClaimedByWalletQuery.data && amountMaxToClaim) {
      return BigNumber.from(amountMaxToClaim).sub(
        supplyClaimedByWalletQuery.data
      );
    }
  }, [supplyClaimedByWalletQuery.data, amountMaxToClaim]);

  const hasClaimed = useMemo(() => {
    if (supplyClaimedByWalletQuery.data && amountMaxToClaim) {
      const supplyClaimed = BigNumber.from(supplyClaimedByWalletQuery.data);
      if (supplyClaimed.gt(0)) {
        return BigNumber.from(amountMaxToClaim)
          .sub(supplyClaimedByWalletQuery.data)
          .eq(0);
      }
    }
  }, [supplyClaimedByWalletQuery.data, amountMaxToClaim]);

  const isLoadingAvailableAmount =
    availableAmountQuery.isLoading ||
    openClaimLimitPerWalletQuery.isLoading ||
    tokenMetadataQuery.isLoading;

  const availableAmountFormatted = useMemo(() => {
    if (
      availableAmountQuery.data &&
      openClaimLimitPerWalletQuery.data &&
      tokenMetadataQuery?.data?.decimals
    ) {
      return formatUnits(
        availableAmountQuery.data,
        tokenMetadataQuery?.data?.decimals
      );
    }
    return " ";
  }, [availableAmountQuery.data, tokenMetadataQuery.data]);

  const claimAirdropMutation = useMutation(async () => {
    let preparedTX;

    if (
      merkleRootQuery.data ===
      "0x0000000000000000000000000000000000000000000000000000000000000000" &&
      amountToBeClaimed
    ) {
      if (contract && account) {
        preparedTX = contract.prepare("claim", [
          account,
          amountToBeClaimed,
          [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ],
          parseEther("0"),
        ]);
      }
    } else {
      if (
        contract &&
        address &&
        account &&
        merkleTreeAllowList.data &&
        amountToBeClaimed
      ) {
        const claimer = merkleTreeAllowList.data.find(
          (d) => d.address.toLowerCase() === account.toLowerCase()
        );

        if (claimer) {
          const proof = await getUserProof(
            account.toLowerCase(),
            merkleTreeAllowList.data,
            claimer.maxClaimable
          );

          preparedTX = contract.prepare("claim", [
            account,
            amountToBeClaimed.toString(),
            [proof],
            amountToBeClaimed.toString(),
          ]);
        }
      }
    }
    if (preparedTX) {
      const values = {
        name: tokenMetadataQuery.data?.name || " ",
        symbol: tokenMetadataQuery.data?.symbol.toUpperCase() || " ",
      };

      watchTransactionDialog.open("claimAirdropERC20", values);

      const tx = await preparedTX.send();

      watchTransactionDialog.watch(tx.hash);

      createNotification({
        type: "transaction",
        subtype: "claimAirdropERC20",
        values: {
          name: tokenMetadataQuery.data?.name || " ",
          symbol: tokenMetadataQuery.data?.symbol.toUpperCase() || " ",
        },
        metadata: {
          chainId,
          hash: tx.hash,
        },
      });

      const metadata = {
        token: tokenAddress,
        amount: amountToBeClaimed?.toString(),
        airdropContract: address,
      };

      trackUserEventsMutation.mutate({
        event: UserEvents.claimAirdropERC20,
        chainId,
        hash: tx.hash,
        metadata: JSON.stringify(metadata),
      });
    }
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          <FormattedMessage id="claim.airdrop" defaultMessage="Claim airdrop" />
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid size={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ pt: 1 }}
            >
              <Typography>
                <FormattedMessage
                  id="Airdropped token"
                  defaultMessage="Airdropped Token"
                />
              </Typography>
              <Link
                href={`${getBlockExplorerUrl(chainId)}/token/${tokenAddress}`}
                target="_blank"
              >
                {truncateAddress(tokenAddress)}
              </Link>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>
                <FormattedMessage
                  id="available.amount"
                  defaultMessage="Available Amount"
                />
              </Typography>
              {isLoadingAvailableAmount ? (
                <Skeleton>
                  <Typography color="text.secondary">-</Typography>
                </Skeleton>
              ) : (
                <Typography color="text.secondary">
                  {availableAmountFormatted || " "}{" "}
                  {tokenMetadataQuery?.data?.symbol.toUpperCase() || ""}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid size={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>
                <FormattedMessage id="expire.at" defaultMessage="Expire at" />
              </Typography>
              <Typography color="text.secondary">{countDown}</Typography>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>
                <FormattedMessage
                  id="claim.amount"
                  defaultMessage="Claim amount"
                />
              </Typography>
              {isLoadingMaxToClaim ? (
                <Skeleton>
                  <Typography color="text.secondary">-</Typography>
                </Skeleton>
              ) : (
                <Typography color="text.secondary">
                  {amountMaxToClaimFormatted || " "}{" "}
                  {tokenMetadataQuery?.data?.symbol.toUpperCase() || ""}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid size={12}>
            <Box display={"flex"} justifyContent={"center"}>
              <Button
                onClick={() =>
                  claimAirdropMutation.mutate(undefined, {
                    onError: (e) => {
                      watchTransactionDialog.setError(
                        new Error("Error deploying contract")
                      );
                    },
                  })
                }
                variant={"contained"}
                disabled={
                  claimAirdropMutation.isLoading ||
                  accountChainId !== chainId ||
                  hasClaimed
                }
                startIcon={
                  claimAirdropMutation.isLoading && (
                    <CircularProgress size="1rem" color="inherit" />
                  )
                }
              >
                {hasClaimed ? (
                  <FormattedMessage id={"claimed"} defaultMessage={"Claimed"} />
                ) : (
                  <FormattedMessage
                    id={"claim.airdrop"}
                    defaultMessage={"Claim airdrop"}
                  />
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
