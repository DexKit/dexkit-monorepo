import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { GET_GAME_ORDER_OPTIONS } from '../constants';
import {
  GameDuration,
  GameLevel,
  GameStakeAmount,
  GameType,
  NumberOfPLayers,
} from '../constants/enums';
import { GamesFilter } from '../types';

interface Props {
  onChange: (gameFilters: GamesFilter) => void;
  gameFilters: GamesFilter;
}

export default function GamesFilterForm({ onChange, gameFilters }: Props) {
  const handleChange = (e: any) => {
    if (e.target.name === 'isJackpot' || e.target.name === 'isMyGames') {
      onChange({ ...gameFilters, [e.target.name]: e.target.checked });
    } else {
      onChange({ ...gameFilters, [e.target.name]: e.target.value });
    }
  };

  return (
    <Stack spacing={2}>
      <FormControl>
        <InputLabel>
          <FormattedMessage id="game.type" defaultMessage="Game Type" />
        </InputLabel>

        <Select
          type="number"
          name="gameType"
          fullWidth
          value={gameFilters.gameType}
          onChange={handleChange}
          label={<FormattedMessage id="game.type" defaultMessage="Game Type" />}
        >
          <MenuItem value={GameType.ALL}>
            <FormattedMessage id="all" defaultMessage="All" />
          </MenuItem>
          <MenuItem value={GameType.Bull}>
            <FormattedMessage id="bull" defaultMessage="Bull" />
          </MenuItem>
          <MenuItem value={GameType.Bear}>
            <FormattedMessage id="bear" defaultMessage="Bear" />
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>
          <FormattedMessage id="level" defaultMessage="Level" />
        </InputLabel>
        <Select
          name="gameLevel"
          value={gameFilters.gameLevel}
          fullWidth
          type="number"
          onChange={handleChange}
          label={<FormattedMessage id="level" defaultMessage="Level" />}
        >
          <MenuItem value={GameLevel.All}>
            <FormattedMessage id="app.coinLeagues.all" defaultMessage="All" />
          </MenuItem>
          <MenuItem value={GameLevel.Beginner}>
            <FormattedMessage id="beginner" defaultMessage="Beginner" />
          </MenuItem>
          <MenuItem value={GameLevel.Intermediate}>
            <FormattedMessage id="intermediate" defaultMessage="Intermediate" />
          </MenuItem>
          <MenuItem value={GameLevel.Advanced}>
            <FormattedMessage id="advanced" defaultMessage="Advanced" />
          </MenuItem>
          <MenuItem value={GameLevel.Expert}>
            <FormattedMessage id="expert" defaultMessage="Expert" />
          </MenuItem>
          <MenuItem value={GameLevel.Master}>
            <FormattedMessage id="master" defaultMessage="Master" />
          </MenuItem>
          <MenuItem value={GameLevel.GrandMaster}>
            <FormattedMessage id="grandMaster" defaultMessage="Grand Master" />
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>
          <FormattedMessage id="duration" defaultMessage="Duration" />
        </InputLabel>
        <Select
          name="duration"
          value={gameFilters.duration}
          fullWidth
          onChange={handleChange}
          type="number"
          label={<FormattedMessage id="duration" defaultMessage="Duration" />}
        >
          <MenuItem value={GameDuration.ALL}>
            <FormattedMessage id="all" defaultMessage="All" />
          </MenuItem>
          <MenuItem value={GameDuration.FAST}>
            <FormattedMessage id="1hour" defaultMessage="1 Hour" />
          </MenuItem>
          <MenuItem value={GameDuration.MEDIUM}>
            <FormattedMessage id="4hours" defaultMessage="4 Hours" />
          </MenuItem>
          <MenuItem value={GameDuration.EIGHT}>
            <FormattedMessage id="8hours" defaultMessage="8 Hours" />
          </MenuItem>
          <MenuItem value={GameDuration.DAY}>
            <FormattedMessage id="24hours" defaultMessage="24 Hours" />
          </MenuItem>
          <MenuItem value={GameDuration.WEEK}>
            <FormattedMessage id="one.week" defaultMessage="1 Week" />
          </MenuItem>
          <MenuItem value={GameDuration.MONTH}>
            <FormattedMessage id="one.month" defaultMessage="1 Month" />
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>
          <FormattedMessage
            id="num.of.players"
            defaultMessage="Num. of Players"
          />
        </InputLabel>
        <Select
          name="numberOfPlayers"
          fullWidth
          value={gameFilters.numberOfPlayers}
          onChange={handleChange}
          label={
            <FormattedMessage
              id="num.of.players"
              defaultMessage="Num. of Players"
            />
          }
        >
          <MenuItem value={NumberOfPLayers.ALL}>
            <FormattedMessage id="all" defaultMessage="All" />
          </MenuItem>
          <MenuItem value={NumberOfPLayers.TWO}>
            <FormattedMessage id="two" defaultMessage="2" />
          </MenuItem>
          <MenuItem value={NumberOfPLayers.THREE}>
            <FormattedMessage id="three" defaultMessage="3" />
          </MenuItem>
          <MenuItem value={NumberOfPLayers.FIVE}>
            <FormattedMessage id="five" defaultMessage="5" />
          </MenuItem>
          <MenuItem value={NumberOfPLayers.TEN}>
            <FormattedMessage id="ten" defaultMessage="10" />
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>
          <FormattedMessage id="stake.amount" defaultMessage="Stake Amount" />
        </InputLabel>
        <Select
          name="stakeAmount"
          fullWidth
          value={gameFilters.stakeAmount}
          onChange={handleChange}
          type="number"
          label={
            <FormattedMessage id="stake.amount" defaultMessage="Stake Amount" />
          }
        >
          <MenuItem value={GameStakeAmount.ALL}>
            <FormattedMessage id="all" defaultMessage="All" />
          </MenuItem>
          <MenuItem value={GameStakeAmount.TWO}>
            <FormattedMessage id="two" defaultMessage="2" />
          </MenuItem>
          <MenuItem value={GameStakeAmount.FIVE}>
            <FormattedMessage id="five" defaultMessage="5" />
          </MenuItem>
          <MenuItem value={GameStakeAmount.TEN}>
            <FormattedMessage id="ten" defaultMessage="10" />
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>
          <FormattedMessage id="order.by" defaultMessage="Order by" />
        </InputLabel>
        <Select
          name="orderByGame"
          fullWidth
          value={gameFilters.orderByGame}
          label={<FormattedMessage id="order.by" defaultMessage="Order by" />}
          onChange={handleChange}
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
      </FormControl>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        alignContent="center"
      >
        <FormattedMessage id="my.games" defaultMessage="My Games" />
        <Switch
          type="checkbox"
          name="isMyGames"
          onChange={handleChange}
          value={gameFilters.isMyGames}
        />
      </Stack>

      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        alignContent="center"
      >
        <FormattedMessage id="jackpot" defaultMessage="Jackpot" />
        <Switch
          type="checkbox"
          name="isJackpot"
          onChange={handleChange}
          value={gameFilters.isJackpot}
        />
      </Stack>
    </Stack>
  );
}
