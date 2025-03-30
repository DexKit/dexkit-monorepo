import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import ImageIcon from '@mui/icons-material/Image';
import React, { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import { GET_CHAMPIONS_CONTRACT_ADDR } from '@/modules/common/utils/champions';
import { GET_KITTYGOTCHI_CONTRACT_ADDR } from '@/modules/kittygotchi/constants';
import { useKittygotchiList } from '@/modules/kittygotchi/hooks';
import { Kittygotchi } from '@/modules/kittygotchi/types';
import { useWeb3React } from '@web3-react/core';
import { useLeaguesChainInfo } from '../hooks/chain';
import { useMyChampions } from '../hooks/coinleague';
import { CoinLeaguesChampion } from '../types';
import ProfileImageCard from './ProfileImageCard';

interface Props {
  dialogProps: DialogProps;
  onSelect?: (params: {
    contractAddress: string;
    tokenId: string;
    image: string;
  }) => void;
  address: string;
}

const LIST_KITTYGOTCHI = 'LIST_KITTYGOTCHI';
const LIST_CHAMPIONS = 'LIST_CHAMPIONS';

export const ProfileSelectImageDialog: React.FC<Props> = ({
  dialogProps,
  onSelect,
  address,
}) => {
  const { chainId } = useLeaguesChainInfo();

  const myChampions = useMyChampions({ chainId, account: address });

  const { account } = useWeb3React();

  const kittygotchiList = useKittygotchiList(account?.toLowerCase());

  const { messages } = useIntl();

  const [selectedAsset, setSelectedAsset] = useState<{
    contractAddress: string;
    tokenId: string;
    image: string;
  }>();
  const [listOption, setListOption] = useState(LIST_KITTYGOTCHI);

  const { onClose } = dialogProps;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setSelectedAsset(undefined);
    }
  }, [onClose]);

  const handleChangeListOption = useCallback((e: any) => {
    setListOption(e.target.value);
  }, []);

  const handleSelectAsset = useCallback(
    (asset: { contractAddress: string; tokenId: string; image: string }) => {
      if (
        asset.contractAddress === selectedAsset?.contractAddress &&
        asset.tokenId === selectedAsset?.tokenId
      ) {
        setSelectedAsset(undefined);
      } else {
        setSelectedAsset(asset);
      }
    },
    [selectedAsset]
  );

  const renderChampions = useCallback(() => {
    if (!myChampions.data) {
      return new Array(8).fill(null).map((_, index: number) => (
        <Grid item xs={6} sm={3} key={index}>
          <ProfileImageCard />
        </Grid>
      ));
    } else if (myChampions.data?.length === 0) {
      return (
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            alignItems="center"
            alignContent="center"
            spacing={4}
          >
            <Grid item xs={12}></Grid>
            <Grid item>
              <Typography align="center" variant="h5">
                <FormattedMessage
                  id="no.champions.yet"
                  defaultMessage="No champions Yet"
                />
              </Typography>
              <Typography align="center" variant="body1" color="textSecondary">
                <FormattedMessage
                  id="youDontHaveAnyChampionsYou"
                  defaultMessage="You dont have any champions"
                />
              </Typography>
            </Grid>
            <Grid item>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <Button
                  href="https://opensea.io/collection/coinleaguechampions"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="primary"
                >
                  <FormattedMessage
                    id="buy.on.openSea"
                    defaultMessage="Buy Champion on OpenSea"
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return myChampions.data?.map(
        (champion: CoinLeaguesChampion, index: number) => (
          <Grid item xs={6} sm={3} key={index}>
            <ProfileImageCard
              selected={selectedAsset?.tokenId === champion.id}
              onClick={handleSelectAsset}
              image={champion.image}
              name={champion.name}
              tokenId={champion.id}
              contractAddress={GET_CHAMPIONS_CONTRACT_ADDR(chainId)}
            />
          </Grid>
        )
      );
    }
    // eslint-disable-next-line
  }, [String(myChampions.data), selectedAsset, chainId, handleSelectAsset]);

  const renderKitties = useCallback(() => {
    if (!kittygotchiList.data) {
      return new Array(8).fill(null).map((_, index: number) => (
        <Grid item xs={6} sm={3} key={index}>
          <ProfileImageCard />
        </Grid>
      ));
    }
    if (kittygotchiList.data.length === 0) {
      return (
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            alignItems="center"
            alignContent="center"
            spacing={4}
          >
            <Grid item xs={12}></Grid>
            <Grid item>
              <Typography align="center" variant="h5">
                <FormattedMessage
                  id="noKittygotchiYet"
                  defaultMessage="No Kittygotchies yet"
                />
              </Typography>
              <Typography align="center" variant="body1" color="textSecondary">
                <FormattedMessage
                  id="you.dont.have.any.kittygotchies"
                  defaultMessage="You dont have any kittygotchies"
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return kittygotchiList.data?.map(
        (kittygotchi: Kittygotchi, index: number) => (
          <Grid item xs={6} sm={3} key={index}>
            <ProfileImageCard
              selected={selectedAsset?.tokenId === kittygotchi.id}
              onClick={handleSelectAsset}
              image={kittygotchi.image}
              name={kittygotchi.name}
              tokenId={kittygotchi.id}
              contractAddress={GET_KITTYGOTCHI_CONTRACT_ADDR(chainId)}
            />
          </Grid>
        )
      );
    }
    // eslint-disable-next-line
  }, [String(kittygotchiList.data), chainId, selectedAsset, handleSelectAsset]);

  const handleConfirm = useCallback(() => {
    if (onSelect && selectedAsset) {
      onSelect(selectedAsset);
    }
  }, [onSelect, selectedAsset]);

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        icon={<ImageIcon />}
        title={
          <FormattedMessage id="select.image" defaultMessage="Select image" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Box py={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>
                  <FormattedMessage
                    id="collections"
                    defaultMessage="Collections"
                  />
                </InputLabel>
                <Select
                  fullWidth
                  label={
                    <FormattedMessage
                      id="collections"
                      defaultMessage="Collections"
                    />
                  }
                  onChange={handleChangeListOption}
                  variant="outlined"
                  value={listOption}
                >
                  {/*  <MenuItem value={LIST_CHAMPIONS}>Champions</MenuItem>*/}
                  <MenuItem value={LIST_KITTYGOTCHI}>Kittygotchi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {listOption === LIST_CHAMPIONS
              ? renderChampions()
              : renderKitties()}
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          disabled={!selectedAsset}
          onClick={handleConfirm}
          color="primary"
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
};

export default React.memo(ProfileSelectImageDialog);
