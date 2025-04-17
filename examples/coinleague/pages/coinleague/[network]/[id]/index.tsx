import type {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';

import CloseIcon from '@mui/icons-material/Close';
import WalletIcon from '@mui/icons-material/Wallet';

import SelectCoinDialog from '@/modules/coinleague/components/dialogs/SelectCoinDialog';
import { GameOverviewCard } from '@/modules/coinleague/components/GameOverviewCard';
import TickerTapeTV from '@/modules/coinleague/components/TickerTapeTV';
import {
  COIN_LEAGUES_FACTORY_ADDRESS_V3,
  GAME_ENDED,
  GAME_WAITING,
  GET_LEAGUES_CHAIN_ID,
} from '@/modules/coinleague/constants';
import {
  COIN_LEAGUE_GAME_ONCHAIN_QUERY,
  useCoinLeagueClaim,
  useCoinLeagueGameOnChainQuery,
  useGameProfilesState,
  useJoinGameMutation,
  useStartGameMutation,
  useWinner,
} from '@/modules/coinleague/hooks/coinleague';
import { useFactoryAddress } from '@/modules/coinleague/hooks/coinleagueFactory';
import { Coin } from '@/modules/coinleague/types';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import {
  TOKEN_ALLOWANCE_QUERY,
  useApproveToken,
  useErc20BalanceQuery,
  useTokenAllowanceQuery,
} from '@/modules/common/hooks/blockchain';
import { getChainIdFromName, isAddressEqual } from '@/modules/common/utils';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import GameCoinList from '@/modules/coinleague/components/GameCoinList';
import PlayersList from '@/modules/coinleague/components/PlayersList';
import { getCoinLeagueGameOnChain } from '@/modules/coinleague/services/coinleague';
import { getGameStatus } from '@/modules/coinleague/utils/game';
import { useNotifications } from '@/modules/common/hooks/app';
import { useConnectWalletDialog } from '@/modules/common/hooks/misc';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';

import GameWinnerCard from '@/modules/coinleague/components/GameWinnerCard';
import { getProviderByChainId } from '@/modules/common/utils';
import { Check, Edit } from '@mui/icons-material';
import Token from '@mui/icons-material/Token';
import { BigNumber, ethers } from 'ethers';

// NOTE: use only on chain

const CoinLeagueGame: NextPage = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { addNotification } = useNotifications();

  const { account, provider, isActive } = useWeb3React();
  const { network, id, affiliate } = router.query;

  const [showSelectCoin, setShowSelectCoin] = useState(false);
  const [isSelectMultiple, setIsSelectMultiple] = useState(false);

  const [selectedCoins, setSelectedCoins] = useState<{ [key: string]: Coin }>(
    {}
  );

  const connectWalletDialog = useConnectWalletDialog();

  const coinList = useMemo(() => {
    return Object.keys(selectedCoins).map((k) => selectedCoins[k]);
  }, [selectedCoins]);

  const [selectedCaptain, setSelectedCaptain] = useState<Coin>();

  const chainId = useMemo(() => {
    return getChainIdFromName(network as string)?.chainId;
  }, [network]);

  const factoryAddress = useFactoryAddress();

  const gameOnChainQuery = useCoinLeagueGameOnChainQuery({
    factoryAddress,
    id: id as string,
    provider,
  });

  const erc20Balance = useErc20BalanceQuery({
    tokenAddress: gameOnChainQuery.data?.coin_to_play,
    account,
    provider,
  });

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account: account,
    tokenAddress: gameOnChainQuery.data?.coin_to_play,
    spender: factoryAddress,
    provider,
  });

  const hasSufficientFunds = useMemo(() => {
    return (
      erc20Balance.data &&
      gameOnChainQuery.data &&
      erc20Balance.data.gte(
        BigNumber.from(gameOnChainQuery.data?.amount_to_play)
      )
    );
  }, [gameOnChainQuery.data, erc20Balance.data]);

  const hasSufficientAllowance = useMemo(() => {
    return (
      gameOnChainQuery.data &&
      tokenAllowanceQuery.data?.gte(gameOnChainQuery.data?.amount_to_play)
    );
  }, [gameOnChainQuery.data, tokenAllowanceQuery.data]);

  const canJoinGame = useMemo(() => {
    const countSelectedCoins = Object.keys(selectedCoins).length;

    const numCoins = gameOnChainQuery.data?.num_coins || 0;

    const isAllCoinsSelecteds =
      gameOnChainQuery.data &&
      countSelectedCoins === numCoins - 1 &&
      selectedCaptain;

    return isAllCoinsSelecteds && hasSufficientFunds && hasSufficientAllowance;
  }, [
    selectedCaptain,
    selectedCoins,
    gameOnChainQuery.data,
    hasSufficientFunds,
    hasSufficientAllowance,
  ]);

  const handleRefetchGame = () => {
    queryClient.resetQueries([COIN_LEAGUE_GAME_ONCHAIN_QUERY]);
  };

  const { formatMessage } = useIntl();

  const handleJoinSubmit = (hash: string) => {
    if (chainId !== undefined) {
      const now = Date.now();

      addNotification({
        notification: {
          type: AppNotificationType.Transaction,
          title: formatMessage(
            {
              defaultMessage: 'Joining Game #{id}',
              id: 'join.game.id',
            },
            { id }
          ) as string,
          hash,
          checked: false,
          created: now,
          icon: 'receipt',
          body: '',
        },
        transaction: {
          status: TransactionStatus.Pending,
          created: now,
          chainId,
        },
      });
    }
  };

  const joinGameMutation = useJoinGameMutation({
    affiliate: affiliate as string,
    captainCoinFeed: selectedCaptain?.address,
    coinFeeds: Object.keys(selectedCoins).map(
      (key) => selectedCoins[key].address
    ),
    factoryAddress,
    gameId: id as string,
    provider,
    onSubmit: handleJoinSubmit,
    options: {
      onSuccess: handleRefetchGame,
    },
  });

  const handleStartSubmit = (hash: string) => {
    if (chainId !== undefined) {
      const now = Date.now();

      addNotification({
        notification: {
          type: AppNotificationType.Transaction,
          title: formatMessage(
            {
              defaultMessage: 'Starting Game #{id}',
              id: 'starting.game.id',
            },
            { id }
          ) as string,
          hash,
          checked: false,
          created: now,
          icon: 'play_arrow',
          body: '',
        },
        transaction: {
          status: TransactionStatus.Pending,
          created: now,
          chainId,
        },
      });
    }
  };

  const startGameMutation = useStartGameMutation({
    factoryAddress,
    gameId: id as string,
    provider,
    onSubmit: handleStartSubmit,
    options: {
      onSuccess: handleRefetchGame,
    },
  });

  const handleApproveSuccess = async () => {
    await queryClient.refetchQueries([TOKEN_ALLOWANCE_QUERY]);
  };

  const handleApproveSubmit = (hash: string) => {
    if (chainId !== undefined) {
      const now = Date.now();

      addNotification({
        notification: {
          type: AppNotificationType.Transaction,
          title: formatMessage(
            {
              defaultMessage: 'Approve Coin League Token Spend',
              id: 'approve.coin.league.token.spend',
            },
            { id }
          ) as string,
          hash,
          checked: false,
          created: now,
          icon: 'check',
          body: '',
        },
        transaction: {
          status: TransactionStatus.Pending,
          created: now,
          chainId,
        },
      });
    }
  };

  const approveTokenMutation = useApproveToken({
    spender: factoryAddress,
    tokenContract: gameOnChainQuery.data?.coin_to_play,
    provider,
    onSubmited: handleApproveSubmit,
    options: {
      onSuccess: handleApproveSuccess,
    },
  });

  const playerAddresses = useMemo(() => {
    if (gameOnChainQuery.data) {
      return gameOnChainQuery.data?.players.map((p) => p.player_address);
    }
  }, [gameOnChainQuery.data]);

  const gameProfilesStateQuery = useGameProfilesState(playerAddresses);

  const isInGame = useMemo(() => {
    return (
      playerAddresses?.find((address) => isAddressEqual(address, account)) !==
      undefined
    );
  }, [playerAddresses, account]);

  const isWaiting = useMemo(() => {
    return (
      gameOnChainQuery.data &&
      getGameStatus(gameOnChainQuery.data) === GAME_WAITING
    );
  }, [gameOnChainQuery.data]);

  const hasSufficientPlayers = useMemo(() => {
    return gameOnChainQuery.data && gameOnChainQuery.data.players?.length >= 2;
  }, [gameOnChainQuery.data]);

  const { data: winner } = useWinner({
    id: id as string,
    account,
    provider,
    factoryAddress,
  });

  const handleClaimSubmit = (hash: string) => {
    if (chainId !== undefined) {
      const now = Date.now();

      addNotification({
        notification: {
          type: AppNotificationType.Transaction,
          title: formatMessage(
            {
              defaultMessage: 'Claim Game #{id}',
              id: 'claim.game.id',
            },
            { id }
          ) as string,
          hash,
          checked: false,
          created: now,
          icon: 'attach_money',
          body: '',
        },
        transaction: {
          status: TransactionStatus.Pending,
          created: now,
          chainId,
        },
      });
    }
  };

  const claimMutation = useCoinLeagueClaim({
    id: id as string,
    account,
    factoryAddress,
    onSubmited: handleClaimSubmit,
    provider,
  });

  const handleCloseCoinDialog = () => {
    setShowSelectCoin(false);
    setIsSelectMultiple(false);
  };

  const handleSelectCaptain = () => {
    setShowSelectCoin(true);
  };

  const handleSelectCoins = () => {
    setShowSelectCoin(true);
    setIsSelectMultiple(true);
  };

  const handleSave = (coins: { [key: string]: Coin }) => {
    if (!isSelectMultiple) {
      setSelectedCaptain(Object.keys(coins).map((k) => coins[k])[0]);
    } else {
      setSelectedCoins(coins);
    }
    handleCloseCoinDialog();
  };

  const handleRemoveCoin = (coin: Coin) => {
    if (coin.address in selectedCoins) {
      setSelectedCoins((coins) => {
        let newCoins = { ...coins };

        delete newCoins[coin.address];

        return newCoins;
      });
    }
  };

  const handleRemoveCaptain = () => {
    setSelectedCaptain(undefined);
  };

  const handleApproveToken = async () => {
    await approveTokenMutation.mutateAsync();
  };

  const handleJoinGame = async () => {
    if (!hasSufficientAllowance) {
      await approveTokenMutation.mutateAsync();
    }

    await joinGameMutation.mutateAsync();
  };

  const handleConnectWallet = () => {
    connectWalletDialog.show();
  };

  const handleStartGame = async () => {
    await startGameMutation.mutateAsync();
  };

  const handleClaim = async () => {
    await claimMutation.mutateAsync();
  };

  return (
    <>
      {showSelectCoin && (
        <SelectCoinDialog
          dialogProps={{
            open: showSelectCoin,
            onClose: handleCloseCoinDialog,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          maxCoins={
            isSelectMultiple && gameOnChainQuery.data
              ? gameOnChainQuery.data.num_coins - 1
              : 1
          }
          chainId={chainId}
          selectMultiple={isSelectMultiple}
          selectedCoins={
            isSelectMultiple
              ? selectedCoins
              : selectedCaptain
              ? { [selectedCaptain.address]: selectedCaptain }
              : {}
          }
          excludeTokens={
            !isSelectMultiple
              ? selectedCoins
              : selectedCaptain
              ? { [selectedCaptain.address]: selectedCaptain }
              : {}
          }
          onSave={handleSave}
        />
      )}

      <MainLayout>
        <Stack spacing={2}>
          <TickerTapeTV />
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
              },
              {
                caption: (
                  <FormattedMessage
                    id="game"
                    defaultMessage="Game #{id}"
                    values={{ id: gameOnChainQuery.data?.id }}
                  />
                ),
                uri: '/coinleague',
                active: true,
              },
            ]}
          />
          {!hasSufficientAllowance && isActive && !isInGame && isWaiting && (
            <Alert
              severity="warning"
              action={
                <Button
                  disabled={approveTokenMutation.isLoading}
                  startIcon={
                    approveTokenMutation.isLoading ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : (
                      <Check />
                    )
                  }
                  size="small"
                  onClick={handleApproveToken}
                  variant="outlined"
                >
                  <FormattedMessage id="approve" defaultMessage="Approve" />
                </Button>
              }
            >
              <FormattedMessage
                id="need.token.approval.to.join.the.game"
                defaultMessage="Need token approval to join the game"
              />
            </Alert>
          )}
          {!hasSufficientFunds && !isInGame && isActive && isWaiting && (
            <Alert severity="warning">
              <FormattedMessage
                id="insufficient.funds"
                defaultMessage="Insufficient funds"
              />
            </Alert>
          )}

          <GameOverviewCard
            chainId={getChainIdFromName(network as string)?.chainId}
            id={id as string}
            provider={provider}
            factoryAddress={factoryAddress}
            onJoin={handleJoinGame}
            isInGame={isInGame}
            canJoinGame={canJoinGame && isWaiting}
            isJoining={joinGameMutation.isLoading}
            onStart={handleStartGame}
            canStart={isInGame && isWaiting && hasSufficientPlayers}
            isStarting={startGameMutation.isLoading}
            onRefetch={handleRefetchGame}
          />

          {isActive &&
            gameOnChainQuery.data &&
            getGameStatus(gameOnChainQuery.data) === GAME_ENDED &&
            !isAddressEqual(
              winner?.winner_address,
              ethers.constants.AddressZero
            ) && (
              <GameWinnerCard
                account={account}
                game={gameOnChainQuery.data}
                chainId={chainId}
                claimed={winner?.claimed}
                onClaim={handleClaim}
                isClaiming={claimMutation.isLoading}
              />
            )}

          {isActive && !isInGame && isWaiting && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Card>
                      <Box sx={{ p: 2 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            <FormattedMessage
                              id="captain.coin"
                              defaultMessage="Captain Coin"
                            />
                          </Typography>

                          <Button
                            variant="outlined"
                            onClick={handleSelectCaptain}
                            size="small"
                          >
                            <FormattedMessage
                              id="select"
                              defaultMessage="Select"
                            />
                          </Button>
                        </Stack>
                      </Box>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        {selectedCaptain ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar src={selectedCaptain.logo}>
                                <Token />
                              </Avatar>
                              <Box>
                                <Typography variant="body1">
                                  {selectedCaptain.baseName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {selectedCaptain.base}
                                </Typography>
                              </Box>
                            </Stack>

                            {selectedCaptain && (
                              <IconButton onClick={handleRemoveCaptain}>
                                <CloseIcon />
                              </IconButton>
                            )}
                          </Stack>
                        ) : (
                          <Box>
                            <Typography variant="h5" align="center">
                              <FormattedMessage
                                id="no.captain"
                                defaultMessage="No Captain"
                              />
                            </Typography>
                            <Typography
                              variant="body1"
                              align="center"
                              color="textSecondary"
                            >
                              <FormattedMessage
                                id="please.select.your.captain.coin"
                                defaultMessage="Please, select your captain coin"
                              />
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Card>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <Box sx={{ p: 2 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          <FormattedMessage
                            id="your.coins"
                            defaultMessage="Your coins"
                          />
                        </Typography>

                        <Button
                          variant="outlined"
                          onClick={handleSelectCoins}
                          startIcon={<Edit />}
                          size="small"
                        >
                          {coinList.length > 0 ? (
                            <FormattedMessage id="edit" defaultMessage="Edit" />
                          ) : (
                            <FormattedMessage
                              id="select"
                              defaultMessage="Select"
                            />
                          )}
                        </Button>
                      </Stack>
                    </Box>
                    {coinList.length > 0 ? (
                      <>
                        <Divider />
                        <GameCoinList
                          coins={coinList}
                          onRemove={handleRemoveCoin}
                        />
                      </>
                    ) : (
                      <>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                          <Typography variant="h5" align="center">
                            <FormattedMessage
                              id="no.captain"
                              defaultMessage="No Coins"
                            />
                          </Typography>
                          <Typography
                            variant="body1"
                            align="center"
                            color="textSecondary"
                          >
                            <FormattedMessage
                              id="please.select.your.coins"
                              defaultMessage="Please, select your coins"
                            />
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          <Typography variant="h5">
            <FormattedMessage id="players" defaultMessage="Players" />
          </Typography>
          <Box>
            {gameOnChainQuery.data && chainId && (
              <Paper>
                <PlayersList
                  gameType={gameOnChainQuery.data.game_type - 1}
                  profiles={gameProfilesStateQuery.profiles}
                  players={gameOnChainQuery.data?.players}
                  chainId={chainId}
                  account={account}
                  game={gameOnChainQuery.data}
                  showWinners={
                    getGameStatus(gameOnChainQuery.data) === GAME_ENDED
                  }
                  hideCoins={
                    getGameStatus(gameOnChainQuery.data) === GAME_WAITING
                  }
                />
              </Paper>
            )}
          </Box>

          {!isActive &&
            gameOnChainQuery.data &&
            getGameStatus(gameOnChainQuery.data) !== GAME_ENDED && (
              <Box>
                <Stack
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  alignContent="center"
                >
                  <Box>
                    <Typography variant="h5" align="center">
                      <FormattedMessage
                        id="connect.wallet"
                        defaultMessage="Connect wallet"
                      />
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      <FormattedMessage
                        id="you.need.to.connect.your.wallet.to.continue"
                        defaultMessage="You need to connect to you wallet to continue"
                      />
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<WalletIcon />}
                    onClick={handleConnectWallet}
                    variant="contained"
                  >
                    <FormattedMessage id="connect" defaultMessage="Connect" />
                  </Button>
                </Stack>
              </Box>
            )}
        </Stack>
      </MainLayout>
    </>
  );
};

type Params = {
  id?: string;
  network?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  if (params) {
    const { id, network } = params;

    if (network && id) {
      const chain = getChainIdFromName(network);

      if (chain) {
        const factoryAddress =
          COIN_LEAGUES_FACTORY_ADDRESS_V3[GET_LEAGUES_CHAIN_ID(chain.chainId)];

        const provider = getProviderByChainId(chain.chainId);

        if (provider) {
          const game = await getCoinLeagueGameOnChain(
            provider,
            factoryAddress,
            id as string
          );

          await queryClient.prefetchQuery(
            [COIN_LEAGUE_GAME_ONCHAIN_QUERY, factoryAddress, id],
            async () => game
          );
        }
      }
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default CoinLeagueGame;
