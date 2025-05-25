import { useAppRankingListQuery } from '@dexkit/ui/modules/wizard/hooks/ranking';
import { ReferralPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { SiteContext } from '@dexkit/ui/providers/SiteProvider';
import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Formik, FormikProps } from 'formik';
import { useContext, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

export interface DexGeneratorReferralFormProps {
  onChange: (section: ReferralPageSection) => void;
  section?: ReferralPageSection;
}

interface ReferralFormValues {
  title: string;
  subtitle: string;
  showStats: boolean;
  showLeaderboard: boolean;
  rankingId?: number;
  pointsConfig: {
    connect: number;
    swap: number;
    default: number;
  };
}

export default function DexGeneratorReferralForm({
  onChange,
  section,
}: DexGeneratorReferralFormProps) {
  const formikRef = useRef<FormikProps<ReferralFormValues>>(null);
  const { siteId } = useContext(SiteContext);

  // Fetch available leaderboards
  const leaderboardsQuery = useAppRankingListQuery({
    siteId,
    pageSize: 100,
  });

  const initialValues = {
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    showStats:
      section?.config?.showStats !== undefined
        ? section.config.showStats
        : true,
    showLeaderboard:
      section?.config?.showLeaderboard !== undefined
        ? section.config.showLeaderboard
        : true,
    rankingId: section?.config?.rankingId,
    pointsConfig: {
      connect: section?.config?.pointsConfig?.connect || 1,
      swap: section?.config?.pointsConfig?.swap || 5,
      default: section?.config?.pointsConfig?.default || 1,
    },
  };

  useEffect(() => {
    if (section && formikRef.current) {
      formikRef.current.setValues({
        title: section.title || '',
        subtitle: section.subtitle || '',
        showStats:
          section.config?.showStats !== undefined
            ? section.config.showStats
            : true,
        showLeaderboard:
          section.config?.showLeaderboard !== undefined
            ? section.config.showLeaderboard
            : true,
        rankingId: section.config?.rankingId,
        pointsConfig: {
          connect: section.config?.pointsConfig?.connect || 1,
          swap: section.config?.pointsConfig?.swap || 5,
          default: section.config?.pointsConfig?.default || 1,
        },
      });
    }
  }, [section]);

  const handleUpdateSection = (values: ReferralFormValues) => {
    const updatedSection: ReferralPageSection = {
      type: 'referral',
      title: values.title,
      subtitle: values.subtitle,
      config: {
        showStats: values.showStats,
        showLeaderboard: values.showLeaderboard,
        rankingId: values.rankingId,
        pointsConfig: values.pointsConfig,
      },
    };
    onChange(updatedSection);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={() => {}}
      enableReinitialize
    >
      {({ values, setFieldValue }) => {
        const handleChange =
          (field: string) =>
          (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            const value = event.target.value;
            setFieldValue(field, value);

            // Use setTimeout to ensure the value is updated in the Formik state
            setTimeout(() => {
              handleUpdateSection({
                ...values,
                [field]: value,
              });
            }, 0);
          };

        const handleSwitchChange =
          (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.checked;
            setFieldValue(field, value);

            // Use setTimeout to ensure the value is updated in the Formik state
            setTimeout(() => {
              handleUpdateSection({
                ...values,
                [field]: value,
              });
            }, 0);
          };

        const handleLeaderboardChange = (event: SelectChangeEvent<unknown>) => {
          const value = event.target.value;
          setFieldValue('rankingId', value === '' ? undefined : Number(value));

          // Use setTimeout to ensure the value is updated in the Formik state
          setTimeout(() => {
            handleUpdateSection({
              ...values,
              rankingId: value === '' ? undefined : Number(value),
            });
          }, 0);
        };

        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={<FormattedMessage id="title" defaultMessage="Title" />}
                name="title"
                value={values.title}
                onChange={(e) => {
                  handleChange('title')(e);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={
                  <FormattedMessage id="subtitle" defaultMessage="Subtitle" />
                }
                name="subtitle"
                value={values.subtitle}
                onChange={(e) => {
                  handleChange('subtitle')(e);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.showStats}
                    onChange={handleSwitchChange('showStats')}
                    name="showStats"
                  />
                }
                label={
                  <FormattedMessage
                    id="show.statistics"
                    defaultMessage="Show Statistics"
                  />
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.showLeaderboard}
                    onChange={handleSwitchChange('showLeaderboard')}
                    name="showLeaderboard"
                  />
                }
                label={
                  <FormattedMessage
                    id="show.leaderboard"
                    defaultMessage="Enable Leaderboard Tab"
                  />
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                <FormattedMessage
                  id="leaderboard.configuration"
                  defaultMessage="Leaderboard Configuration"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <FormattedMessage
                  id="leaderboard.configuration.description"
                  defaultMessage="Select a leaderboard to display statistics and ranking for your referral program."
                />
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="leaderboard-select-label">
                        <FormattedMessage
                          id="select.leaderboard"
                          defaultMessage="Select Leaderboard"
                        />
                      </InputLabel>
                      <Select
                        labelId="leaderboard-select-label"
                        id="leaderboard-select"
                        value={values.rankingId ?? ''}
                        onChange={handleLeaderboardChange}
                        label={
                          <FormattedMessage
                            id="select.leaderboard"
                            defaultMessage="Select Leaderboard"
                          />
                        }
                      >
                        <MenuItem value="">
                          <em>
                            <FormattedMessage id="none" defaultMessage="None" />
                          </em>
                        </MenuItem>
                        {!leaderboardsQuery.isLoading &&
                          leaderboardsQuery.data?.data.map((leaderboard) => (
                            <MenuItem
                              key={leaderboard.id}
                              value={leaderboard.id}
                            >
                              {leaderboard.title}
                            </MenuItem>
                          ))}
                      </Select>
                      {(!leaderboardsQuery.data?.data ||
                        leaderboardsQuery.data?.data.length === 0) &&
                        !leaderboardsQuery.isLoading && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            <FormattedMessage
                              id="create.leaderboard.first"
                              defaultMessage="You need to create a leaderboard in the Gamification section first."
                            />
                          </Typography>
                        )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );
      }}
    </Formik>
  );
}
