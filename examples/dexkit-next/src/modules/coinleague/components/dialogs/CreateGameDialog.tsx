import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { FormikHelpers, useFormik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { GameLevel, GameType } from '../../constants/enums';
import {
  useCoinToPlay,
  useCoinToPlayStable,
  useCreateGameMutation,
} from '../../hooks/coinleague';
import { useFactoryAddress } from '../../hooks/coinleagueFactory';
import { GET_GAME_LEVEL_AMOUNTS } from '../../utils/game';

import { DateTimePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';

interface Form {
  gameType: number;
  duration: number;
  gameLevel: number;
  maxCoins: number;
  maxPlayers: number;
  startDate: number;
}

interface Props {
  dialogProps: DialogProps;
}

export default function CreateGameDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  const { provider, chainId } = useWeb3React();

  const factoryAddress = useFactoryAddress();

  const handleTxHash = (hash: string) => {};

  const createGameMutation = useCreateGameMutation({
    factoryAddress,
    provider,
    onHash: handleTxHash,
  });

  const coinToPlay = useCoinToPlayStable(chainId);
  const ctop = useCoinToPlay();

  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    createGameMutation.mutate({
      type: values.gameType - 1,
      duration: values.duration,
      isNFT: false,
      numCoins: values.maxCoins,
      numPlayers: values.maxPlayers,
      amountUnit: GET_GAME_LEVEL_AMOUNTS(
        values.gameLevel,
        chainId,
        coinToPlay?.address
      ),
      coin_to_play: coinToPlay?.address || '',
      startTimestamp: values.startDate / 1000,
      abortTimestamp: values.startDate / 1000 + values.duration * 3,
    });
  };

  const form = useFormik<Form>({
    onSubmit: handleSubmit,
    initialValues: {
      gameLevel: GameLevel.Beginner,
      gameType: GameType.Bull,
      maxCoins: 1,
      duration: process.env.NODE_ENV === 'development' ? 60 + 5 : 60 * 60,
      maxPlayers: 2,
      startDate: moment().toDate().getTime(),
    },
  });

  const handleChangeStartDate = (
    newValue: Moment | null,
    keyboardInputValue?: string | undefined
  ) => {
    form.setFieldValue('startDate', newValue?.toDate().getTime());
  };

  const handleSubmitForm = () => {
    form.submitForm();
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage id="create.game" defaultMessage="Create game" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent dividers sx={{ p: 2 }}>
        <form onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <InputLabel>
                <FormattedMessage id="game.type" defaultMessage="Game Type" />
              </InputLabel>
              <Select
                name="gameType"
                type="number"
                value={form.values.gameType}
                onChange={form.handleChange}
                label={
                  <FormattedMessage id="game.type" defaultMessage="Game Type" />
                }
                error={form.touched.gameType && Boolean(form.errors.gameType)}
                fullWidth
              >
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
                <FormattedMessage id="game.type" defaultMessage="Game Level" />
              </InputLabel>
              <Select
                name="gameLevel"
                type="number"
                value={form.values.gameLevel}
                onChange={form.handleChange}
                label={
                  <FormattedMessage
                    id="game.level"
                    defaultMessage="Game Level"
                  />
                }
                error={form.touched.gameLevel && Boolean(form.errors.gameLevel)}
                fullWidth
              >
                <MenuItem value={GameLevel.Beginner}>
                  <FormattedMessage id="beginner" defaultMessage="Beginner" />
                </MenuItem>
                <MenuItem value={GameLevel.Intermediate}>
                  <FormattedMessage
                    id="intermediate"
                    defaultMessage="Intermediate"
                  />
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
                  <FormattedMessage
                    id="grandMaster"
                    defaultMessage="Grand Master"
                  />
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>
                <FormattedMessage id="duration" defaultMessage="Duration" />
              </InputLabel>
              <Select
                name="duration"
                type="number"
                value={form.values.duration}
                onChange={form.handleChange}
                label={
                  <FormattedMessage id="duration" defaultMessage="Duration" />
                }
                error={form.touched.duration && Boolean(form.errors.duration)}
                fullWidth
              >
                {process.env.NODE_ENV === 'development' && (
                  <MenuItem value={60 * 5}>5 minutes</MenuItem>
                )}
                <MenuItem value={60 * 60}>
                  <FormattedMessage id="1hour" defaultMessage="1 Hour" />
                </MenuItem>
                <MenuItem value={4 * 60 * 60}>
                  <FormattedMessage id="4hours" defaultMessage="4 Hours" />
                </MenuItem>
                <MenuItem value={8 * 60 * 60}>
                  <FormattedMessage id="8hours" defaultMessage="8 Hours" />
                </MenuItem>
                <MenuItem value={24 * 60 * 60}>
                  <FormattedMessage id="24hours" defaultMessage="24 Hours" />
                </MenuItem>
                <MenuItem value={7 * 24 * 60 * 60}>
                  <FormattedMessage id="one.week" defaultMessage="1 Week" />
                </MenuItem>
                <MenuItem value={7 * 24 * 60 * 60 * 30}>
                  <FormattedMessage id="one.month" defaultMessage="1 Month" />
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>
                <FormattedMessage id="max.coins" defaultMessage="Max coins" />
              </InputLabel>
              <Select
                name="maxCoins"
                type="number"
                value={form.values.maxCoins}
                onChange={form.handleChange}
                label={
                  <FormattedMessage id="max.coins" defaultMessage="Max coins" />
                }
                error={form.touched.maxCoins && Boolean(form.errors.maxCoins)}
                fullWidth
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>
                <FormattedMessage
                  id="max.players"
                  defaultMessage="Max players"
                />
              </InputLabel>
              <Select
                name="maxPlayers"
                type="number"
                value={form.values.maxPlayers}
                onChange={form.handleChange}
                label={
                  <FormattedMessage
                    id="max.players"
                    defaultMessage="Max Players"
                  />
                }
                error={
                  form.touched.maxPlayers && Boolean(form.errors.maxPlayers)
                }
                fullWidth
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>
                <FormattedMessage
                  id="max.players"
                  defaultMessage="Max players"
                />
              </InputLabel>
              <Select
                name="maxPlayers"
                type="number"
                value={form.values.maxPlayers}
                onChange={form.handleChange}
                label={
                  <FormattedMessage
                    id="max.players"
                    defaultMessage="Max Players"
                  />
                }
                error={
                  form.touched.maxPlayers && Boolean(form.errors.maxPlayers)
                }
                fullWidth
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <DateTimePicker
              renderInput={(params) => <TextField {...params} />}
              label={
                <FormattedMessage id="start.date" defaultMessage="Start date" />
              }
              minDate={moment()}
              ampm={false}
              value={moment(new Date(form.values.startDate))}
              onChange={handleChangeStartDate}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmitForm}
          type="submit"
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="create" defaultMessage="Create" />
        </Button>

        <Button onClick={handleClose} type="submit">
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
