import { TipsAndUpdates, Visibility, VisibilityOff } from '@mui/icons-material';
import Send from '@mui/icons-material/Send';
import {
  Box,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useListNfts } from '../hooks/nfts';
import { DkApiAsset } from '../types/dexkitapi';
import NftCard from './NftCard';

interface Props {
  networks: string[];
  accounts?: string[];
  showHidden?: boolean;
  searchQuery?: string;
  onTransfer: (nft: DkApiAsset) => void;
}

export default function NftGrid({
  accounts,
  networks,
  showHidden,
  searchQuery,
  onTransfer,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const [selectedNft, setSelectedNft] = useState<DkApiAsset>();

  const { nfts: nftsData, setNfts } = useListNfts({
    accounts: accounts ? accounts : [],
    networks,
  });

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedNft(undefined);
  };

  const handleHide = useCallback(() => {
    setNfts((nfts) => {
      const temp = [...nfts];

      const index = temp.findIndex(
        (n) =>
          selectedNft?.chainId === n.chainId &&
          selectedNft.address === n.address &&
          selectedNft.collectionName === n.collectionName
      );

      if (index > -1) {
        temp[index].isHidden = !Boolean(temp[index].isHidden);

        if (Boolean(temp[index].isHidden)) {
          enqueueSnackbar(
            formatMessage({
              id: 'your.nft.is.now.hidden',
              defaultMessage: 'Your NFT is now hidden',
            }),
            { variant: 'info' }
          );
        } else {
          enqueueSnackbar(
            formatMessage({
              id: 'your.nft.is.now.visible.again',
              defaultMessage: 'Your NFT is now visible again',
            }),
            { variant: 'info' }
          );
        }
      }

      return temp;
    });

    handleCloseMenu();
  }, [selectedNft]);

  const handleSelect = useCallback(
    (nft?: DkApiAsset, el?: HTMLElement | null) => {
      setAnchorEl(el);
      setSelectedNft(nft);
    },
    []
  );

  const handleTransferNft = () => {
    if (selectedNft) {
      onTransfer(selectedNft);
    }

    handleCloseMenu();
  };

  const nfts = useMemo(() => {
    let result = nftsData;

    if (searchQuery) {
      result = result?.filter((n) => {
        let hasFoundInDescription = false;
        let hasFoundInCollectionName = false;
        let hasFoundInCollectionTokenId = false;

        if (n.description && searchQuery) {
          hasFoundInDescription =
            n.description.toLowerCase().search(searchQuery.toLowerCase()) > -1;
        }

        if (n.collectionName && searchQuery) {
          hasFoundInCollectionName =
            n.collectionName.toLowerCase().search(searchQuery?.toLowerCase()) >
            -1;
        }

        if (n.tokenId && searchQuery) {
          hasFoundInCollectionTokenId =
            n.tokenId.toLowerCase().search(searchQuery?.toLowerCase()) > -1;
        }

        return (
          hasFoundInDescription ||
          hasFoundInCollectionName ||
          hasFoundInCollectionTokenId
        );
      });
    }

    return result?.filter((n) => {
      if (showHidden) {
        return true;
      }

      return !n.isHidden;
    });
  }, [nftsData, showHidden, searchQuery]);

  if (nfts?.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <TipsAndUpdates fontSize="large" />
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage id="no.nfts" defaultMessage="No NFTs" />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="you.dont.have.nfts"
                defaultMessage="You don't have NFTs"
              />
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  }

  return (
    <>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleTransferNft}>
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage id="transfer" defaultMessage="Transfer" />
            }
          />
        </MenuItem>
        <MenuItem onClick={handleHide}>
          <ListItemIcon>
            {selectedNft?.isHidden ? <Visibility /> : <VisibilityOff />}
          </ListItemIcon>
          <ListItemText
            primary={
              selectedNft?.isHidden ? (
                <FormattedMessage id="unhide" defaultMessage="Unhide" />
              ) : (
                <FormattedMessage id="hide" defaultMessage="Hide" />
              )
            }
          />
        </MenuItem>
      </Menu>
      <Grid container spacing={2}>
        {nfts?.map((nft: DkApiAsset, index: number) => (
          <Grid key={index} item xs={6} sm={2}>
            <NftCard nft={nft} onSelect={handleSelect} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
