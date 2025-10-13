import type { NextPage } from 'next';

import GamesFilterForm from '@/modules/coinleague/components/GamesFilterForm';
import GamesGrid from '@/modules/coinleague/components/GamesGrid';
import GamesGridSkeleton from '@/modules/coinleague/components/GamesGridSkeleton';
import GamesTable from '@/modules/coinleague/components/GamesTable';
import TickerTapeTV from '@/modules/coinleague/components/TickerTapeTV';
import { GET_GAME_ORDER_OPTIONS } from '@/modules/coinleague/constants';
import { CoinLeagueGameStatus } from '@/modules/coinleague/constants/enums';
import { useLeaguesChainInfo } from '@/modules/coinleague/hooks/chain';
import {
  useCoinLeagueGames,
  useGamesFilters,
} from '@/modules/coinleague/hooks/coinleague';
import { GameGraph, GamesFilter } from '@/modules/coinleague/types';
import AppFilterDrawer from '@/modules/common/components/AppFilterDrawer';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import TableSkeleton from '@/modules/common/components/skeletons/TableSkeleton';
import { getNetworkSlugFromChainId } from '@/modules/common/utils';
import { getWindowUrl } from '@/modules/common/utils/browser';
import ShareDialogV2 from '@dexkit/ui/components/dialogs/ShareDialogV2';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Filter, FilterAlt } from '@mui/icons-material';
import GridViewIcon from '@mui/icons-material/GridView';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TableRowsIcon from '@mui/icons-material/TableRows';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SyntheticEvent, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { generateShareLink, ShareTypes } from 'src/utils/share';
const CreateGameDialog = dynamic(
  () => import('@/modules/coinleague/components/dialogs/CreateGameDialog'),
);
const GameMetadataDialog = dynamic(
  () => import('@/modules/coinleague/components/dialogs/GameMetadataDialog'),
);

const CoinLeagueIndex: NextPage = () => {
  const { account, chainId } = useWeb3React();

  const router = useRouter();

  const { affiliate } = router.query;

  const [showTable, setShowTable] = useState(false);

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const [selectedGame, setSelectedGame] = useState<GameGraph>();
  const [showMetadata, setShowMetadata] = useState(false);

  const filters = useGamesFilters({ myGames: false });

  const [status, setStatus] = useState<CoinLeagueGameStatus>(
    CoinLeagueGameStatus.Waiting,
  );

  const [showFilters, setShowFilters] = useState(false);

  const gamesQuery = useCoinLeagueGames({
    status: status,
    accounts: filters.isMyGames && account ? [account] : undefined,
    filters: filters,
  });
  const { chainId: gameChainId } = useLeaguesChainInfo();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseFilters = () => {
    setShowFilters(false);
  };

  const handleOpenFilters = () => {
    setShowFilters(true);
  };

  const handleChangeStatus = (
    event: SyntheticEvent<Element, Event>,
    value: any,
  ) => {
    setStatus(value as CoinLeagueGameStatus);
  };

  const handleCloseShareDialog = () => {
    setShowShareDialog(false);
    setShareUrl(undefined);
  };

  const handleShare = useCallback(
    async (game: GameGraph) => {
      const url = `${getWindowUrl()}/game/${getNetworkSlugFromChainId(
        gameChainId,
      )}/${game.id}${account ? `?affiliate=${account}` : ''}`;

      setShareUrl(url);
      /*if (navigator.share) {
        try {
          await navigator.share({
            title: 'Play at Coinleague',
            text: 'Look what I found, play with me at Coinleague',
            url: url,
          });
        } catch (error) {
          console.log('Error sharing', error);
        }
      } else {
        alert('Sharing not supported on this browser');
      }*/
      setShowShareDialog(true);
    },
    [gameChainId, account],
  );

  const handleShowMetadata = useCallback((game: GameGraph) => {
    setSelectedGame(game);
    setShowMetadata(true);
  }, []);

  const handleCloseMetadataDialog = () => {
    setSelectedGame(undefined);
    setShowMetadata(false);
  };

  const handleChangeFilters = (gamesFilter: GamesFilter) => {
    filters.setDuration(gamesFilter.duration);
    filters.setGameType(gamesFilter.gameType);
    filters.setGameLevel(gamesFilter.gameLevel);
    filters.setIsJackpot(gamesFilter.isJackpot);
    filters.setIsMyGames(gamesFilter.isMyGames);
    filters.setNumberOfPlayers(gamesFilter.numberOfPlayers);
    filters.setOrderByGame(gamesFilter.orderByGame);
    filters.setStakeAmount(gamesFilter.stakeAmount);
  };

  const handleChangeOrderBy = (e: SelectChangeEvent<any>) => {
    filters.setOrderByGame(e.target.value);
  };

  const renderForm = () => {
    return (
      <GamesFilterForm gameFilters={filters} onChange={handleChangeFilters} />
    );
  };

  const [showCreateGame, setShowCreateGame] = useState(false);

  const handleCloseCreateGame = () => {
    setShowCreateGame(false);
  };

  const handleOpenCreateGame = () => {
    setShowCreateGame(true);
  };

  const handleShowGrid = () => {
    setShowTable((value) => !value);
  };

  const handleShareContent = (value: string) => {
    const msg = `Play with me at Coin League: ${shareUrl}`;

    let link = '';

    if (ShareTypes.includes(value) && shareUrl) {
      link = generateShareLink(msg, shareUrl, value);

      window.open(link, '_blank');
    }
  };

  return (
    <>
      <ShareDialogV2
        DialogProps={{
          open: showShareDialog,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        onClick={handleShareContent}
        url={shareUrl}
      />
      {showMetadata && (
        <GameMetadataDialog
          dialogProps={{
            open: showMetadata,
            onClose: handleCloseMetadataDialog,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          game={selectedGame}
        />
      )}
      {showCreateGame && (
        <CreateGameDialog
          dialogProps={{
            open: showCreateGame,
            onClose: handleCloseCreateGame,
            fullWidth: true,
            maxWidth: 'sm',
          }}
        />
      )}
      <MainLayout>
        <Stack spacing={2}>
          <TickerTapeTV />

          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            justifyContent="space-between"
          >
            <AppPageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="coin.league"
                      defaultMessage="Coin League"
                    />
                  ),
                  uri: '/',
                  active: true,
                },
              ]}
            />

            <IconButton
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={handleOpenFilters}
            >
              <FilterAlt />
            </IconButton>
          </Stack>

          {/*<ButtonBase
            sx={{ width: '100%', display: 'block' }}
            onClick={handleOpenCreateGame}
          >
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                alignContent="center"
              >
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                  alignContent="center"
                >
                  <Avatar
                    sx={(theme) => ({
                      backgroundColor: theme.palette.background.default,
                    })}
                  >
                    <GameController color="action" />
                  </Avatar>
                  <Box>
                    <Typography align="left" variant="body1">
                      <FormattedMessage
                        id="create.game"
                        defaultMessage="Create Game"
                      />
                    </Typography>
                    <Typography
                      align="left"
                      variant="body2"
                      color="textSecondary"
                    >
                      <FormattedMessage
                        id="coin.league"
                        defaultMessage="Coin League"
                      />
                    </Typography>
                  </Box>
                </Stack>
                <ChevronRightIcon />
              </Stack>
            </Paper>
          </ButtonBase>*/}

          <AppFilterDrawer
            drawerProps={{ open: showFilters, onClose: handleCloseFilters }}
            icon={<Filter />}
            title={<FormattedMessage id="filters" defaultMessage="Filters" />}
          >
            {renderForm()}
          </AppFilterDrawer>
          {isMobile && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={status}
                onChange={handleChangeStatus}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
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
          )}

          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'flex-end', sm: 'space-between' },
            }}
          >
            {!isMobile && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={status}
                  onChange={handleChangeStatus}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
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
                    label={
                      <FormattedMessage id="ended" defaultMessage="Ended" />
                    }
                  />
                  <Tab
                    value={CoinLeagueGameStatus.Aborted}
                    label={
                      <FormattedMessage id="aborted" defaultMessage="Aborted" />
                    }
                  />
                </Tabs>
              </Box>
            )}
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <IconButton onClick={handleShowGrid}>
                {showTable ? <GridViewIcon /> : <TableRowsIcon />}
              </IconButton>
              <Select
                name="orderByGame"
                value={filters.orderByGame}
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

          <Box>
            <Grid container spacing={2}>
              {!isMobile && (
                <Grid size={{ xs: 12, sm: 2 }} sx={{ width: '100%' }}>
                  <Collapse in>
                    <Card>
                      <CardContent>{renderForm()}</CardContent>
                    </Card>
                  </Collapse>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 10 }}>
                {gamesQuery.isLoading &&
                  (showTable ? (
                    <TableSkeleton cols={4} rows={4} />
                  ) : (
                    <GamesGridSkeleton />
                  ))}
                {gamesQuery.data && gamesQuery.data.length > 0 ? (
                  showTable ? (
                    <GamesTable
                      chainId={gameChainId}
                      games={gamesQuery.data}
                      onShare={handleShare}
                      onShowMetadata={handleShowMetadata}
                      affiliate={affiliate as string}
                    />
                  ) : (
                    <GamesGrid
                      chainId={gameChainId}
                      games={gamesQuery.data}
                      onShare={handleShare}
                      onShowMetadata={handleShowMetadata}
                      affiliate={affiliate as string}
                    />
                  )
                ) : (
                  !gamesQuery.isLoading && (
                    <Box sx={{ py: 4 }}>
                      <Stack
                        direction={'column'}
                        spacing={2}
                        sx={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: 80 }} />

                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="no.games"
                            defaultMessage="No games"
                          />
                        </Typography>
                        <Typography
                          align="center"
                          variant="body1"
                          color="textSecondary"
                        >
                          <FormattedMessage
                            id="no.games.available"
                            defaultMessage="No games available"
                          />
                        </Typography>
                      </Stack>
                    </Box>
                  )
                )}
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </MainLayout>
    </>
  );
};

export default CoinLeagueIndex;
