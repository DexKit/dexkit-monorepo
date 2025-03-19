import Games from '@/modules/coinleague/components/Games';
import ProfileImage from '@/modules/coinleague/components/ProfileImage';
import ProfileStatsPill from '@/modules/coinleague/components/ProfileStatsPill';
import { GET_GAME_ORDER_OPTIONS } from '@/modules/coinleague/constants';
import {
  CoinLeagueGameStatus,
  GameDuration,
  GameLevel,
  GameOrderBy,
  GameStakeAmount,
  GameType,
  NumberOfPLayers,
} from '@/modules/coinleague/constants/enums';
import {
  useCoinToPlayStable,
  useGamesFilters,
} from '@/modules/coinleague/hooks/coinleague';
import {
  usePlayerProfileStats,
  useProfileGame,
} from '@/modules/coinleague/hooks/profile';
import { GameGraph, GamesFilter } from '@/modules/coinleague/types';
import { reduceAddress } from '@/modules/coinleague/utils/game';
import CopyIconButton from '@/modules/common/components/CopyIconButton';
import AppShareDialog from '@/modules/common/components/dialogs/AppShareDialog';
import Crown from '@/modules/common/components/icons/Crown';
import Cup from '@/modules/common/components/icons/Cup';
import GameController from '@/modules/common/components/icons/GameController';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import Link from '@/modules/common/components/Link';
import { ChainId } from '@/modules/common/constants/enums';
import {
  getNetworkSlugFromChainId,
  getNormalizedUrl,
  isAddressEqual,
  truncateAddress,
} from '@/modules/common/utils';
import { copyToClipboard, getWindowUrl } from '@/modules/common/utils/browser';
import { strPad } from '@/modules/common/utils/strings';
import { Edit } from '@mui/icons-material';
import FileCopy from '@mui/icons-material/FileCopy';
import GridView from '@mui/icons-material/GridView';
import Share from '@mui/icons-material/Share';
import TableRows from '@mui/icons-material/TableRows';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const INITIAL_FILTERS: GamesFilter = {
  numberOfPlayers: NumberOfPLayers.ALL,
  orderByGame: GameOrderBy.HighLevel,
  duration: GameDuration.ALL,
  gameLevel: GameLevel.All,
  isBitboy: false,
  isJackpot: false,
  isMyGames: true,
  gameType: GameType.ALL,
  stakeAmount: GameStakeAmount.ALL,
};

const CoinLeagueProfilePage: NextPage = () => {
  const router = useRouter();

  const { formatMessage } = useIntl();
  const [selectedChainId, setSelectedChainId] = useState(ChainId.Polygon);

  const { account } = useWeb3React();

  const { address } = router.query;

  const profileQuery = useProfileGame(address as string);

  const [showShare, setShowShare] = useState(false);

  const filters = useGamesFilters({ myGames: true });

  const [gameFilters, setGameFilters] = useState<GamesFilter>(INITIAL_FILTERS);

  const playerStats = usePlayerProfileStats(address as string, false);

  const coinToPlay = useCoinToPlayStable(selectedChainId);

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const handleToggleShare = () => {
    setShowShare((value) => !value);
  };

  const handleCopy = () => {
    if (address) {
      copyToClipboard(address as string);
    }
  };

  const [status, setStatus] = useState<CoinLeagueGameStatus>(
    CoinLeagueGameStatus.All
  );

  const [showTable, setShowTable] = useState(false);

  const canEdit = useMemo(() => {
    return isAddressEqual(account, address as string);
  }, [address, account]);

  const handleShowGrid = () => {
    setShowTable((value) => !value);
  };

  const handleChangeStatus = (
    event: SyntheticEvent<Element, Event>,
    value: any
  ) => {
    setStatus(value as CoinLeagueGameStatus);
  };

  const handleChangeOrderBy = (e: SelectChangeEvent<any>) => {
    filters.setOrderByGame(e.target.value);
  };

  const handleCloseShareDialog = () => {
    setShowShareDialog(false);
    setShareUrl(undefined);
  };

  const handleShare = useCallback(
    (game: GameGraph) => {
      setShareUrl(
        `${getWindowUrl()}/coinleague/${getNetworkSlugFromChainId(
          selectedChainId
        )}/${game.id}`
      );
      setShowShareDialog(true);
    },
    [selectedChainId]
  );

  return (
    <>
      <AppShareDialog
        url={
          isAddress(address as string)
            ? `${getWindowUrl()}/coinleague/profile/${address}`
            : undefined
        }
        dialogProps={{
          open: showShare,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleToggleShare,
        }}
      />
      <AppShareDialog
        dialogProps={{
          open: showShareDialog,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        url={shareUrl}
      />
      <MainLayout>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            alignContent="center"
          >
            {profileQuery.data && profileQuery.data.profileImage ? (
              <ProfileImage
                image={getNormalizedUrl(profileQuery.data.profileImage)}
              />
            ) : (
              <Avatar />
            )}
            <Box>
              <Typography variant="body1">
                {profileQuery.data && !profileQuery.error
                  ? profileQuery.data.username
                  : isAddress(address as string)
                  ? reduceAddress(address as string)
                  : null}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {truncateAddress(address as string)}{' '}
                <CopyIconButton
                  iconButtonProps={{
                    onClick: handleCopy,
                    size: 'small',
                  }}
                  tooltip={formatMessage({
                    id: 'copy',
                    defaultMessage: 'Copy',
                    description: 'Copy text',
                  })}
                  activeTooltip={formatMessage({
                    id: 'copied',
                    defaultMessage: 'Copied!',
                    description: 'Copied text',
                  })}
                >
                  <FileCopy fontSize="inherit" />
                </CopyIconButton>
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              {canEdit && (
                <Button
                  LinkComponent={Link}
                  href={`/coinleague/profile/${address as string}/edit`}
                  startIcon={<Edit />}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="edit" defaultMessage="Edit" />
                </Button>
              )}

              <Button
                onClick={handleToggleShare}
                startIcon={<Share />}
                color="primary"
                variant="outlined"
              >
                <FormattedMessage id="share" defaultMessage="Share" />
              </Button>
            </Stack>
          </Box>
          <Stack direction="row" spacing={2}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body1">
                  <FormattedMessage id="network" defaultMessage="Network" />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <FormattedMessage
                    id="select.a.network.to.view.data.from"
                    defaultMessage="Select a network to view data from"
                  />
                </Typography>
              </Box>
              <Select
                displayEmpty
                fullWidth
                renderValue={(value: string) => (
                  <FormattedMessage id="polygon" defaultMessage="Polygon" />
                )}
              >
                <MenuItem value="">
                  <FormattedMessage id="polygon" defaultMessage="Polygon" />
                </MenuItem>
              </Select>
            </Stack>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body1">
                  <FormattedMessage id="game" defaultMessage="Game" />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <FormattedMessage
                    id="select.the.game.you.want.to.view"
                    defaultMessage="Select the game you want to view"
                  />
                </Typography>
              </Box>
              <Select
                displayEmpty
                fullWidth
                value="all"
                renderValue={(value: string) => (
                  <FormattedMessage
                    id="coin.league"
                    defaultMessage="Coin League"
                  />
                )}
              >
                <MenuItem value="all">
                  <FormattedMessage
                    id="coin.league"
                    defaultMessage="Coin League"
                  />
                </MenuItem>
              </Select>
            </Stack>
          </Stack>
          <Box>
            <Typography variant="body1">
              <FormattedMessage
                id="profile.statistics"
                defaultMessage="Profile statistics"
              />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <FormattedMessage
                id="statistics.description"
                defaultMessage="Statistics may change depending on the network you selected above"
              />
            </Typography>
          </Box>
          {playerStats.data ? (
            <Stack
              spacing={2}
              alignItems="center"
              alignContent="center"
              direction="row"
            >
              <ProfileStatsPill
                icon={<Cup color="primary" />}
                title={<FormattedMessage id="wins" defaultMessage="Wins" />}
                body={Number(playerStats.data?.totalWinnedGames)}
              />
              <ProfileStatsPill
                icon={<GameController color="primary" />}
                title={
                  <FormattedMessage
                    id="joined.games"
                    defaultMessage="Joined Games"
                  />
                }
                body={strPad(Number(playerStats.data?.totalJoinedGames))}
              />
              <ProfileStatsPill
                icon={<Cup color="primary" />}
                title={
                  <FormattedMessage
                    id="win.in.first"
                    defaultMessage="Win in 1°"
                  />
                }
                body={strPad(Number(playerStats.data?.totalFirstWinnedGames))}
              />
              <ProfileStatsPill
                icon={<Cup color="primary" />}
                title={
                  <FormattedMessage
                    id="win.in.second"
                    defaultMessage="Win in 2°"
                  />
                }
                body={strPad(Number(playerStats.data?.totalSecondWinnedGames))}
              />

              <ProfileStatsPill
                icon={<Cup color="primary" />}
                title={
                  <FormattedMessage
                    id="win.in.third"
                    defaultMessage="Win in 3°"
                  />
                }
                body={strPad(Number(playerStats.data?.totalThirdWinnedGames))}
              />

              <ProfileStatsPill
                icon={<Crown color="primary" />}
                title={
                  <FormattedMessage
                    id="total.earned"
                    defaultMessage="Total earned"
                  />
                }
                body={
                  <>
                    {ethers.utils.formatUnits(
                      playerStats.data?.totalEarned,
                      coinToPlay?.decimals
                    )}{' '}
                    {coinToPlay?.symbol.toUpperCase()}
                  </>
                }
              />
              <ProfileStatsPill
                icon={<Crown color="primary" />}
                title={
                  <FormattedMessage
                    id="total.spent"
                    defaultMessage="Total spent"
                  />
                }
                body={
                  <>
                    {ethers.utils.formatUnits(
                      playerStats.data?.totalSpent,
                      coinToPlay?.decimals
                    )}{' '}
                    {coinToPlay?.symbol.toUpperCase()}
                  </>
                }
              />
            </Stack>
          ) : null}

          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'flex-end', sm: 'space-between' },
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={status}
                onChange={handleChangeStatus}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  value={CoinLeagueGameStatus.All}
                  label={<FormattedMessage id="all" defaultMessage="All" />}
                />
                <Tab
                  value={CoinLeagueGameStatus.Waiting}
                  label={
                    <FormattedMessage id="waiting" defaultMessage="Waiting" />
                  }
                />
                <Tab
                  value={CoinLeagueGameStatus.Started}
                  label={
                    <FormattedMessage id="started" defaultMessage="Started" />
                  }
                />
                <Tab
                  value={CoinLeagueGameStatus.Ended}
                  label={<FormattedMessage id="ended" defaultMessage="Ended" />}
                />
                <Tab
                  value={CoinLeagueGameStatus.Aborted}
                  label={
                    <FormattedMessage id="aborted" defaultMessage="Aborted" />
                  }
                />
              </Tabs>
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <IconButton onClick={handleShowGrid}>
                {showTable ? <GridView /> : <TableRows />}
              </IconButton>
              <Select
                name="orderByGame"
                value={gameFilters.orderByGame}
                size="small"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
                onChange={handleChangeOrderBy}
              >
                {GET_GAME_ORDER_OPTIONS.map((o, index) => (
                  <MenuItem key={index} value={o.value}>
                    <FormattedMessage
                      id={o.messageId}
                      defaultMessage={o.defaultMessage}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>
          <Games
            chainId={selectedChainId}
            account={address as string}
            filters={filters}
            status={status}
            showTable={showTable}
            onShare={handleShare}
          />
        </Stack>
      </MainLayout>
    </>
  );
};

export default CoinLeagueProfilePage;
