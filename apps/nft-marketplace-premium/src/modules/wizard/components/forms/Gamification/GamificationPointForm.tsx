import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';

import { Grid } from '@mui/material';
import { FieldArray, Form, Formik } from 'formik';
import { useState } from 'react';

import { useAddAppRankingMutation } from '@/modules/wizard/hooks';
import { AppRanking } from '@/modules/wizard/types/ranking';
import { UserEvents } from '@dexkit/core/constants/userEvents';
import { beautifyCamelCase } from '@dexkit/core/utils';
import Add from '@mui/icons-material/Add';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { GamificationPoint } from '../../../types';
import LeaderboardRule from './LeaderboardRule';

const userEvents = [
  {
    name: beautifyCamelCase(UserEvents.loginSignMessage),
    value: UserEvents.loginSignMessage,
  },
  {
    name: beautifyCamelCase(UserEvents.swap),
    value: UserEvents.swap,
  },
  {
    value: UserEvents.nftAcceptListERC721,
    name: 'Accept listing ERC721',
  },
  {
    value: UserEvents.nftAcceptListERC1155,
    name: 'Accept listing ERC1155',
  },
  {
    value: UserEvents.nftAcceptOfferERC721,
    name: 'Accept offer ERC721',
  },
  {
    value: UserEvents.nftAcceptOfferERC1155,
    name: 'Accept offer ERC1155',
  },
  {
    value: UserEvents.buyDropCollection,
    name: 'Buy drop collection',
  },
  {
    value: UserEvents.buyDropEdition,
    name: 'Buy drop edition',
  },
];

const options = userEvents.map((op) => op.value);

const GamificationPointSchema = Yup.array(
  Yup.object().shape({
    userEventType: Yup.string().required(),
    points: Yup.number().required(),
    filter: Yup.string(),
  }),
);

const RankingPointsScheme: Yup.SchemaOf<{
  from?: Date;
  to?: Date;
  settings: GamificationPoint[];
}> = Yup.object().shape({
  from: Yup.date(),
  to: Yup.date(),
  settings: GamificationPointSchema,
});

interface Props {
  siteId?: number;
  rankingId?: number;
  onCancel?: () => void;
  onSubmit?: (settings: GamificationPoint[]) => void;
  settings?: GamificationPoint[] | string;
  from?: string;
  to?: string;
  ranking: AppRanking;
  title?: string;
}
// @see https://stackoverflow.com/a/66558369
function localDate({ dateString }: { dateString: string }) {
  const d = new Date(dateString);

  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);
}

export default function GamificationPointForm({
  siteId,
  rankingId,
  onCancel,
  onSubmit,
  settings,
  from,
  to,
  ranking,
  title,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(true);
  const mutationAddRanking = useAddAppRankingMutation();

  const handleAppRankingUpdatedSuccess = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'App leaderboard updated',
        id: 'app.leaderboard.updated',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleAppRankingUpdatedError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on updating app leaderboard',
        id: 'error.updating.app.leaderboard',
      }),
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };
  return (
    <>
      <Formik
        onSubmit={async (values, helper) => {
          if (values) {
            await mutationAddRanking.mutateAsync(
              {
                siteId,
                rankingId,
                from: values.from === '' ? moment().format() : values.from,
                to: values.to === '' ? moment().format() : values.to,
                settings: values.settings,
                title,
              },
              {
                onSuccess: handleAppRankingUpdatedSuccess,
                onError: handleAppRankingUpdatedError,
              },
            );

            //   onSubmit(values.settings);
          }
          helper.setSubmitting(false);
        }}
        initialValues={{
          from: from ? localDate({ dateString: from }) : undefined,
          to: to ? localDate({ dateString: to }) : undefined,
          settings: settings
            ? typeof settings === 'string'
              ? (JSON.parse(settings) as GamificationPoint[])
              : settings
            : ([{ userEventType: UserEvents.swap }] as GamificationPoint[]),
        }}
        validationSchema={RankingPointsScheme}
      >
        {({
          handleChange,
          submitForm,
          isSubmitting,
          isValid,
          values,
          setFieldValue,
          errors,
          resetForm,
          touched,
        }) => (
          <Form>
            <FieldArray
              name="settings"
              render={({ handleInsert, handleRemove }) => (
                <Grid container spacing={2}>
                  {open && (
                    <Grid item xs={12} sm={6}>
                      <Alert severity="info" onClose={() => setOpen(false)}>
                        <AlertTitle sx={{ fontWeight: 'bold' }}>
                          <Typography fontWeight="inherit" variant="body2">
                            <FormattedMessage
                              id="build.a.ranking.alert.message"
                              defaultMessage="Define and assign points to each user event to build a ranking"
                            />
                          </Typography>
                        </AlertTitle>
                        <Typography variant="body2">
                          <FormattedMessage
                            id="points.are.awarded.based.on.user.message"
                            defaultMessage="Points are awarded based on user activity to determine their ranking"
                          />
                        </Typography>
                      </Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <FormattedMessage
                        id="active.period"
                        defaultMessage="Active period"
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <DateTimePicker
                          ampm={false}
                          value={moment(values.from)}
                          label={
                            <FormattedMessage id="From" defaultMessage="From" />
                          }
                          onChange={(value) =>
                            setFieldValue('from', value?.format())
                          }
                          renderInput={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(errors.from)}
                              helperText={Boolean(errors.from) && errors.from}
                            />
                          )}
                          InputProps={{ fullWidth: true }}
                        />
                      </Grid>
                      <Grid item>
                        <DateTimePicker
                          ampm={false}
                          label={
                            <FormattedMessage
                              id="to.date"
                              defaultMessage="To"
                            />
                          }
                          onChange={(value) =>
                            setFieldValue('to', value?.format())
                          }
                          renderInput={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(errors.to)}
                              helperText={Boolean(errors.to) && errors.to}
                            />
                          )}
                          value={moment(values.to)}
                          InputProps={{ fullWidth: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {values.settings.map((rule, index) => (
                    <Grid item xs={12} key={index}>
                      <div>
                        <Stack spacing={2}>
                          <LeaderboardRule
                            index={index}
                            key={index}
                            setFieldValue={setFieldValue}
                            values={values}
                            touched={touched}
                            errors={errors}
                            ranking={ranking}
                            onRemove={handleRemove(index)}
                          />
                          <Divider />
                        </Stack>
                      </div>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      onClick={handleInsert(values.settings.length, {})}
                      startIcon={<Add />}
                      variant="outlined"
                    >
                      <FormattedMessage
                        id="add.rule"
                        defaultMessage="Add rule"
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          disabled={isSubmitting}
                          onClick={() => resetForm()}
                        >
                          <FormattedMessage
                            id="cancel"
                            defaultMessage="Cancel"
                          />
                        </Button>
                        <Button
                          disabled={!isValid || isSubmitting}
                          variant="contained"
                          onClick={submitForm}
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress color="inherit" size="1rem" />
                            ) : undefined
                          }
                        >
                          <FormattedMessage id="save" defaultMessage="Save" />
                        </Button>
                      </Stack>
                    </div>
                  </Grid>
                </Grid>
              )}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
