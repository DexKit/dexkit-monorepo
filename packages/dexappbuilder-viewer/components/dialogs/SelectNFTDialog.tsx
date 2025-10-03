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
import {
    NFT,
    useContract,
    useContractRead,
    useOwnedNFTs,
} from "@thirdweb-dev/react";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

export default function SelectNFTDialog({
  address,
  network,
  onSelect,
  DialogProps,
  isUnstake,
  stakingContractAddress,
}: {
  DialogProps: DialogProps;
  address: string;
  stakingContractAddress: string;
  network: string;
  onSelect: (tokenIds: string[]) => void;
  isUnstake?: boolean;
}) {
  const { onClose } = DialogProps;
  const { data: stakingNFTContract } = useContract(address, "nft-collection");

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

  const { data: accountNftsData, isLoading: isLoadingNfts } = useOwnedNFTs(
    stakingNFTContract,
    account
  );

  const nfts = useAsyncMemo(
    async () => {
      if (isUnstake) {
        const [nfts, rewards] = infoNfts;

        let nftsArr: Promise<NFT>[] = [];

        for (let tokenId of nfts) {
          let promise = stakingNFTContract?.erc721.get(tokenId);

          if (promise !== undefined) {
            nftsArr.push(promise);
          }
        }

        return await Promise.all(nftsArr);
      }

      return accountNftsData;
    },
    [],
    [accountNftsData, infoNfts, isUnstake]
  );

  const [tokenIds, setTokenIds] = useState<string[]>([]);

  const handleSelectNFT = (tokenId: string) => {
    setTokenIds((ids: any) => {
      if (ids?.includes(tokenId)) {
        return ids.filter((i: any) => i !== tokenId);
      }

      return [...ids, tokenId];
    });
  };

  const handleConfirm = () => {
    if (tokenIds) {
      onSelect(tokenIds);
      refetch();
    }
    setTokenIds([]);
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setTokenIds([]);
  };

  const isSelected = useCallback(
    (tokenId: string) => {
      return tokenIds.includes(tokenId);
    },
    [tokenIds]
  );

  const renderCard = (nft: NFT) => {
    return (
      <Card
        sx={{
          borderColor: isSelected(nft.metadata.id)
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
          <FormattedMessage id="select.an.nft" defaultMessage="Select an NFT" />
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
        <Button onClick={handleConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
