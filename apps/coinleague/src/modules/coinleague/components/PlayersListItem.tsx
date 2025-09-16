import { ChainId } from '@/modules/common/constants/enums';
import { isAddressEqual, truncateAddress } from '@/modules/common/utils';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {
  CoinLeagueGame,
  CoinLeagueGameCoinFeed,
  CoinLeagueGamePlayer,
  GameProfile,
} from '../types';
import { getIconByCoin } from '../utils/game';

import Cup from '@/modules/common/components/icons/Cup';
import Link from '@/modules/common/components/Link';
import { ipfsUriToUrl } from '@/modules/common/utils/ipfs';
import { strPad } from '@/modules/common/utils/strings';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import Token from '@mui/icons-material/Token';
import { memo, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PlayersListItemText from './PlayersListItemText';

interface Props {
  game: CoinLeagueGame;
  player: CoinLeagueGamePlayer;
  coinFeeds: { [key: string]: CoinLeagueGameCoinFeed };
  isLoadingScore: boolean;
  profiles?: GameProfile[];
  chainId: ChainId;
  account?: string;
  hideCoins?: boolean;
  position: number;
  multipleWinners?: boolean;
  showWinners?: boolean;
}

function PlayersListItem({
  game,
  player,
  profiles,
  isLoadingScore,
  chainId,
  account,
  hideCoins,
  position,
  multipleWinners,
  showWinners,
  coinFeeds,
}: Props) {
  const profile = useMemo(() => {
    return profiles?.find((p) =>
      isAddressEqual(p.address, player.player_address),
    );
  }, [profiles, player, chainId]);

  const score = useMemo(() => {
    return Number(player.score);
  }, [player]);

  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded((value) => !value);
  };

  const captainCoinScore = useMemo(() => {
    if (game) {
      const gameType = game.game_type;
      // 0 equals bull game
      if (gameType === 0) {
        const captainScore = Number(coinFeeds[player.captain_coin].score);
        // if bull game and captain score positive we add the multiplier
        if (captainScore) {
          return captainScore * 1.2;
        } else {
          return captainScore;
        }
      } else {
        const captainScore = Number(coinFeeds[player.captain_coin].score);
        // if bear game and captain score negative we add the multiplier
        if (captainScore) {
          return captainScore;
        } else {
          return captainScore * 1.2;
        }
      }
    }
  }, [game.game_type, coinFeeds]);

  return (
    <>
      <ListItem
        selected={isAddressEqual(player.player_address, account)}
        divider
      >
        {!hideCoins && (
          <Stack
            sx={{ pr: 2 }}
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <Typography>{strPad(position + 1)}°</Typography>
          </Stack>
        )}
        <ListItemAvatar>
          <Avatar src={ipfsUriToUrl(profile?.profileImage || '')}>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Link
              color="inherit"
              href={`/coinleague/profile/${player.player_address}`}
            >
              {isAddressEqual(account, player.player_address) ? (
                <FormattedMessage id="you" defaultMessage="You" />
              ) : profile ? (
                profile.username
              ) : (
                truncateAddress(player.player_address)
              )}
            </Link>
          }
          secondary={
            showWinners &&
            ((multipleWinners && position <= 2) || position === 0) ? (
              <Stack
                direction="row"
                alignItems="center"
                alignContent="center"
                spacing={0.5}
              >
                <Cup color="primary" fontSize="inherit" />{' '}
                <Typography>
                  <FormattedMessage id="winner" defaultMessage="Winner" />
                </Typography>
              </Stack>
            ) : undefined
          }
          secondaryTypographyProps={{ color: 'primary', component: 'div' }}
        />
        {(!hideCoins || isAddressEqual(player.player_address, account)) && (
          <AvatarGroup sx={{ display: { sm: 'flex', xs: 'none' } }}>
            <Badge
              badgeContent="1.2x"
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              color="primary"
              variant="standard"
            >
              <Avatar src={getIconByCoin(player.captain_coin, chainId)}>
                <Token />
              </Avatar>
            </Badge>
            {player.coin_feeds?.map((addr) => (
              <Avatar src={getIconByCoin(addr, chainId)} key={addr} />
            ))}
          </AvatarGroup>
        )}
        {!hideCoins && (
          <Box sx={{ pl: 2 }}>
            {isLoadingScore ? (
              <Skeleton>
                <Typography>-.--</Typography>
              </Skeleton>
            ) : (
              <Typography
                sx={(theme) => ({
                  color:
                    score > 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                })}
              >
                {`${score > 0 ? '+' : ''}${(score / 1000).toFixed(3)}%`}
              </Typography>
            )}
          </Box>
        )}
        {(!hideCoins || isAddressEqual(player.player_address, account)) && (
          <Box sx={{ pl: 2, alignItem: 'center', display: 'flex' }}>
            <IconButton onClick={handleToggleExpand}>
              {!expanded ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          </Box>
        )}
      </ListItem>
      {(!hideCoins || isAddressEqual(player.player_address, account)) && (
        <Collapse in={expanded}>
          <List disablePadding dense>
            <ListItem>
              <ListItemAvatar>
                <Badge
                  badgeContent="1.2x"
                  anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                  color="primary"
                  variant="standard"
                >
                  <Avatar
                    src={getIconByCoin(player.captain_coin, chainId)}
                    key={player.captain_coin}
                  />
                </Badge>
              </ListItemAvatar>
              <PlayersListItemText
                chainId={chainId}
                address={player.captain_coin}
              />
              {isLoadingScore ? (
                <Skeleton>
                  <Typography>-.--</Typography>
                </Skeleton>
              ) : (
                <Typography
                  sx={(theme) => ({
                    color:
                      Number(coinFeeds[player.captain_coin].score) > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  })}
                >
                  {`${
                    Number(coinFeeds[player.captain_coin].score) > 0 ? '+' : ''
                  }${((captainCoinScore || 0) / 1000).toFixed(3)}%`}
                </Typography>
              )}
            </ListItem>
            {player.coin_feeds?.map((addr, index, coinsArr) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={getIconByCoin(addr, chainId)} key={addr} />
                </ListItemAvatar>
                <PlayersListItemText chainId={chainId} address={addr} />
                {isLoadingScore ? (
                  <Skeleton>
                    <Typography>-.--</Typography>
                  </Skeleton>
                ) : (
                  <Typography
                    sx={(theme) => ({
                      color:
                        Number(coinFeeds[addr].score) > 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    })}
                  >
                    {`${Number(coinFeeds[addr].score) > 0 ? '+' : ''}${(
                      Number(coinFeeds[addr].score) / 1000
                    ).toFixed(3)}%`}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default memo(PlayersListItem);
