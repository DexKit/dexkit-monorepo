import { getNormalizedUrl } from "@dexkit/core/utils";
import { AppDialogTitle } from "@dexkit/ui";
import DecimalInput from "@dexkit/ui/components/DecimalInput";
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
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface SelectNFTEditionDialogProps {
  DialogProps: DialogProps;
  address: string;
  stakingContractAddress: string;
  network: string;
  onSelect: (tokenId: string, amount: number) => void;
  isUnstake?: boolean;
}

export default function SelectNFTEditionDialog({
  address,
  network,
  onSelect,
  DialogProps,
  isUnstake,
  stakingContractAddress,
}: SelectNFTEditionDialogProps) {
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

  const { data: accountNftsData, isLoading: isLoadingNfts } = useOwnedNFTs(
    stakingNFTContract,
    account
  );

  const nfts = useAsyncMemo(
    async () => {
      if (isUnstake) {
        if (!infoNfts || !Array.isArray(infoNfts)) {
          return [];
        }

        const [nfts, rewards] = infoNfts;

        if (!nfts || (!Array.isArray(nfts) && typeof nfts[Symbol.iterator] !== 'function')) {
          return [];
        }

        let nftsArr: Promise<NFT>[] = [];

        for (let tokenId of nfts) {
          let promise = stakingNFTContract?.erc1155.get(tokenId);

          if (promise !== undefined) {
            nftsArr.push(promise);
          }
        }

        return await Promise.all(nftsArr);
      }

      return accountNftsData || [];
    },
    [],
    [accountNftsData, infoNfts, isUnstake]
  );

  const [tokenId, setTokenId] = useState<string>();
  const [amount, setAmount] = useState<string>("");

  const handleChangeAmount = (value: string) => {
    setAmount(value);
  };

  const handleSelectNFT = (tokenId: string) => {
    setTokenId(tokenId);
  };

  const handleConfirm = () => {
    if (tokenId) {
      onSelect(tokenId, parseInt(amount));
      refetch();
    }
    setTokenId(undefined);
    setAmount("");
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setTokenId(undefined);
    setAmount("");
  };

  const balance = useAsyncMemo(
    async () => {
      if (tokenId && account) {
        if (isUnstake) {
          const [nfts, amounts, rewards] = infoNfts;

          const index: number = nfts
            .map((n: BigNumber) => n.toNumber() as number)
            .findIndex((t: number) => t === parseInt(tokenId));

          if (index > -1) {
            return amounts[index].toNumber() as number;
          }

          return 0;
        }

        const value = await stakingNFTContract?.erc1155.balanceOf(
          account,
          tokenId
        );

        return value?.toNumber() || 0;
      }

      return 0;
    },
    0,
    [
      stakingNFTContract,
      tokenId,
      account,
      stakingContractAddress,
      infoNfts,
      isUnstake,
    ]
  );

  const { formatMessage } = useIntl();

  const amountError = useMemo(() => {
    let value = parseInt(amount || "0");

    if (value > balance) {
      return formatMessage({
        id: "amount.exceeds.the.nft.balance",
        defaultMessage: "amount exceeds the NFT balance",
      });
    }

    if (value === 0) {
      return formatMessage({
        id: "the.amount.cannot.be.zero",
        defaultMessage: "the amount cannot be zero",
      });
    }
  }, [balance, amount]);

  const renderCard = (nft: NFT) => {
    const isSelected = nft.metadata.id === tokenId;

    return (
      <Card
        sx={{
          borderColor: isSelected
            ? (theme) => theme.palette.primary.main
            : undefined,
          borderWidth: isSelected ? 3 : 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease-in-out",
          transform: isSelected ? "scale(1.02)" : "scale(1)",
          boxShadow: isSelected
            ? (theme) => `0 4px 20px ${theme.palette.primary.main}40`
            : "none",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: (theme) => `0 4px 15px ${theme.palette.primary.main}20`,
          },
        }}
      >
        <CardActionArea
          onClick={() => handleSelectNFT(nft.metadata.id)}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 0
          }}
        >
          {nft.metadata.image ? (
            <CardMedia
              image={getNormalizedUrl(nft.metadata.image)}
              sx={{
                aspectRatio: "1/1",
                height: 200,
                objectFit: "cover"
              }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: "1/1",
                height: 200
              }}
            />
          )}
          <Divider />
          <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
            <Typography variant="caption" color="primary" noWrap>
              {nft.metadata.name}
            </Typography>
            <Typography variant="body2" noWrap>#{nft.metadata.id}</Typography>
            {isSelected && (
              <Typography
                variant="caption"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  display: "block",
                  mt: 0.5
                }}
              >
                ✓ Selected
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          isUnstake ? (
            <FormattedMessage
              id="select.nfts.to.unstake"
              defaultMessage="Select NFTs to unstake"
            />
          ) : (
            <FormattedMessage id="select.nfts" defaultMessage="Select NFTs" />
          )
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          {(isLoading || isLoadingNfts) && (
            <Grid size={12}>
              <Box>
                <Stack py={2} alignItems="center" justifyContent="center">
                  <CircularProgress color="primary" size="3rem" />
                </Stack>
              </Box>
            </Grid>
          )}
          {nfts?.length === 0 && (
            <Grid size={12}>
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
            <Grid size={{ xs: 6, sm: 3 }} key={key}>
              {renderCard(nft)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage
            id="available.balance.amount"
            defaultMessage="Available balance: {amount}"
            values={{ amount: balance }}
          />
        </Typography>
        <DecimalInput
          decimals={0}
          onChange={handleChangeAmount}
          value={amount}
          TextFieldProps={{
            fullWidth: true,
            autoComplete: "off",
            helperText: amountError ? amountError : undefined,
            error: Boolean(amountError),
          }}
        />
      </Box>
      <Divider />
      <DialogActions>
        <Button
          disabled={Boolean(amountError) || !tokenId}
          onClick={handleConfirm}
          variant="contained"
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
