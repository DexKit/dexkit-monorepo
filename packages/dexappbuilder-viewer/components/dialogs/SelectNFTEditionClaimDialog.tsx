// @ts-nocheck
import { getNormalizedUrl } from "@dexkit/core/utils";
import { AppDialogTitle } from "@dexkit/ui";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { NFT, useContract, useContractRead } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

export interface SelectNFTEditionClaimDialogProps {
  DialogProps: DialogProps;
  address: string;
  stakingContractAddress: string;
  onClaim: (tokenId: string) => Promise<void>;
}

export default function SelectNFTEditionClaimDialog({
  address,
  onClaim,
  DialogProps,
  stakingContractAddress,
}: SelectNFTEditionClaimDialogProps) {
  const { onClose } = DialogProps;
  const { data: stakingNFTContract } = useContract(address, "edition");

  const { account } = useWeb3React();

  const { data: stakingContract } = useContract(
    stakingContractAddress,
    "custom"
  );

  const {
    data: infoNfts,
    refetch,
    isLoading,
  } = useContractRead(stakingContract, "getStakeInfo", [account]);

  const nfts = useAsyncMemo(
    async () => {
      if (infoNfts && infoNfts?.length > 0) {
        const [nfts, rewards] = infoNfts;

        let nftsArr: Promise<NFT>[] = [];

        for (let tokenId of nfts) {
          let promise = stakingNFTContract?.erc1155.get(tokenId);

          if (promise !== undefined) {
            nftsArr.push(promise);
          }
        }

        let res = await Promise.all(nftsArr);

        return res;
      }
    },
    [],
    [infoNfts, stakingNFTContract]
  );

  const [tokenId, setTokenId] = useState<string>();

  const handleSelectNFT = (tokenId: string) => {
    setTokenId(tokenId);
  };

  const claimMutation = useMutation(
    async ({ tokenId }: { tokenId: string }) => {
      await onClaim(tokenId);
      await refetch();
    }
  );

  const handleConfirm = async () => {
    if (tokenId) {
      await claimMutation.mutateAsync({ tokenId });
    }
    setTokenId(undefined);
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setTokenId(undefined);
  };

  const balance = useAsyncMemo(
    async () => {
      if (tokenId && account) {
        const [nfts, amounts, rewards] = infoNfts;

        const index: number = nfts
          .map((n: BigNumber) => n.toNumber() as number)
          .findIndex((t: number) => t === parseInt(tokenId));

        if (index > -1) {
          return amounts[index].toNumber() as number;
        }

        return 0;
      }

      return 0;
    },
    0,
    [tokenId, infoNfts]
  );

  const renderCard = (nft: NFT) => {
    return (
      <Card
        sx={{
          borderColor:
            nft.metadata.id === tokenId
              ? (theme) => theme.palette.primary.main
              : undefined,
        }}
      >
        <CardActionArea onClick={() => handleSelectNFT(nft.metadata.id)}>
          {nft.metadata.image ? (
            <CardMedia
              image={getNormalizedUrl(nft.metadata.image)}
              sx={{ aspectRatio: "1/1", height: "100%" }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{ aspectRatio: "16/9", height: "100%" }}
            />
          )}
          <Divider />
          <CardContent>
            <Typography variant="caption" color="primary">
              {nft.metadata.name}
            </Typography>
            <Typography>#{nft.metadata.id}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="claim.rewards" defaultMessage="Claim rewards" />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          {isLoading && (
            <Grid item xs={12}>
              <Box>
                <Stack py={2} alignItems="center" justifyContent="center">
                  <CircularProgress color="primary" size="3rem" />
                </Stack>
              </Box>
            </Grid>
          )}
          {nfts?.length === 0 && (
            <Grid item xs={12}>
              <Box py={2}>
                <Typography align="center" variant="h5">
                  <FormattedMessage id="no.nfts" defaultMessage="No NFTs" />
                </Typography>
                <Typography
                  align="center"
                  variant="body1"
                  color="text.secondary"
                >
                  <FormattedMessage
                    id="no.nfts.found"
                    defaultMessage="No NFTs found"
                  />
                </Typography>
              </Box>
            </Grid>
          )}
          {nfts?.map((nft: NFT, key: number) => (
            <Grid item xs={6} sm={3} key={key}>
              {renderCard(nft)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!tokenId || claimMutation.isLoading}
          startIcon={
            claimMutation.isLoading ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : undefined
          }
          onClick={handleConfirm}
          variant="contained"
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button disabled={claimMutation.isLoading} onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
