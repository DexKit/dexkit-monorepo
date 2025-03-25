import type { NextPage } from 'next';

import GamesGrid from '@/modules/coinleague/components/GamesGrid';
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
  useCoinLeagueGames,
  useGamesFilters,
} from '@/modules/coinleague/hooks/coinleague';
import { GameGraph, GamesFilter } from '@/modules/coinleague/types';
import AppFilterDrawer from '@/modules/common/components/AppFilterDrawer';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import { Filter, FilterAlt } from '@mui/icons-material';
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import CreateGameDialog from '@/modules/coinleague/components/dialogs/CreateGameDialog';
import GameMetadataDialog from '@/modules/coinleague/components/dialogs/GameMetadataDialog';
import GamesFilterForm from '@/modules/coinleague/components/GamesFilterForm';
import GamesGridSkeleton from '@/modules/coinleague/components/GamesGridSkeleton';
import GamesTable from '@/modules/coinleague/components/GamesTable';
import TickerTapeTV from '@/modules/coinleague/components/TickerTapeTV';
import { GET_GAME_ORDER_OPTIONS } from '@/modules/coinleague/constants';
import AppShareDialog from '@/modules/common/components/dialogs/AppShareDialog';
import GameController from '@/modules/common/components/icons/GameController';
import TableSkeleton from '@/modules/common/components/skeletons/TableSkeleton';
import { ChainId } from '@/modules/common/constants/enums';
import { getNetworkSlugFromChainId } from '@/modules/common/utils';
import { getWindowUrl } from '@/modules/common/utils/browser';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { useRouter } from 'next/router';

const INITIAL_FILTERS: GamesFilter = {
  numberOfPlayers: NumberOfPLayers.ALL,
  orderByGame: GameOrderBy.HighLevel,
  duration: GameDuration.ALL,
  gameLevel: GameLevel.All,
  isBitboy: false,
  isJackpot: false,
  isMyGames: false,
  gameType: GameType.ALL,
  stakeAmount: GameStakeAmount.ALL,
};

const CoinLeagueIndex: NextPage = () => {
  const { account, chainId } = useWeb3React();

  const router = useRouter();

  const { affiliate } = router.query;

  const [showTable, setShowTable] = useState(false);

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const [selectedGame, setSelectedGame] = useState<GameGraph>();
  const [showMetadata, setShowMetadata] = useState(false);

  const [gameFilters, setGameFilters] = useState<GamesFilter>(INITIAL_FILTERS);

  const filters = useGamesFilters({ myGames: false });

  const [status, setStatus] = useState<CoinLeagueGameStatus>(
    CoinLeagueGameStatus.All
  );

  const [showFilters, setShowFilters] = useState(false);

  const gamesQuery = useCoinLeagueGames({
    status: status,
    accounts: filters.isMyGames && account ? [account] : undefined,
    filters: filters,
  });

  const gameChainId = useMemo(() => {
    return chainId ? chainId : ChainId.Polygon;
  }, [chainId]);

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
    value: any
  ) => {
    setStatus(value as CoinLeagueGameStatus);
  };

  const handleCloseShareDialog = () => {
    setShowShareDialog(false);
    setShareUrl(undefined);
  };

  const handleShare = useCallback(
    (game: GameGraph) => {
      setShareUrl(
        `${getWindowUrl()}/coinleague/${getNetworkSlugFromChainId(
          gameChainId
        )}/${game.id}`
      );
      setShowShareDialog(true);
    },
    [gameChainId]
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
    setGameFilters(gamesFilter);

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
      <GamesFilterForm
        gameFilters={gameFilters}
        onChange={handleChangeFilters}
      />
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

  return (
    <>
      <AppShareDialog
        dialogProps={{
          open: showShareDialog,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        url={shareUrl}
      />
      <GameMetadataDialog
        dialogProps={{
          open: showMetadata,
          onClose: handleCloseMetadataDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        game={selectedGame}
      />
      <CreateGameDialog
        dialogProps={{
          open: showCreateGame,
          onClose: handleCloseCreateGame,
          fullWidth: true,
          maxWidth: 'sm',
        }}
      />
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
                  uri: '/coinleague',
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

          <ButtonBase
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
          </ButtonBase>

          <AppFilterDrawer
            drawerProps={{ open: showFilters, onClose: handleCloseFilters }}
            icon={<Filter />}
            title={<FormattedMessage id="filters" defaultMessage="Filters" />}
          >
            {renderForm()}
          </AppFilterDrawer>

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
                {showTable ? <GridViewIcon /> : <TableRowsIcon />}
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

          <Box>
            <Grid container spacing={2}>
              {!isMobile && (
                <Grid item xs={12} sm={2} sx={{ width: '100%' }}>
                  <Collapse in>
                    <Card>
                      <CardContent>{renderForm()}</CardContent>
                    </Card>
                  </Collapse>
                </Grid>
              )}
              <Grid item xs={12} sm={10}>
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
                  <Box sx={{ py: 4 }}>
                    <Stack>
                      <Box>
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
                      </Box>
                    </Stack>
                  </Box>
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
