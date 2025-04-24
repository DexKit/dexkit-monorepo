import * as Yup from 'yup';

export const COIN_LEAGUE_FILTER_SCHEMA = Yup.object().shape({
  numberOfPlayers: Yup.number().required(),
  orderByGame: Yup.string().required(),
  duration: Yup.number().required(),
  gameLevel: Yup.number().required(),
  isBitboy: Yup.bool().required(),
  isJackpot: Yup.bool().required(),
  isMyGames: Yup.bool().required(),
  gameType: Yup.number().required(),
  stakeAmount: Yup.number().required(),
});
