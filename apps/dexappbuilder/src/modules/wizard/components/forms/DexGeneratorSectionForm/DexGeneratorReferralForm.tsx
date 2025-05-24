import { ReferralPageSection } from '@dexkit/ui/modules/wizard/types/section';
import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Slider,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Formik, FormikProps } from 'formik';
import { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

export interface DexGeneratorReferralFormProps {
  onChange: (section: ReferralPageSection) => void;
  section?: ReferralPageSection;
}

interface ReferralFormValues {
  title: string;
  subtitle: string;
  showStats: boolean;
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

  const initialValues = {
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    showStats: section?.config?.showStats !== undefined ? section.config.showStats : true,
    pointsConfig: {
      connect: section?.config?.pointsConfig?.connect || 1,
      swap: section?.config?.pointsConfig?.swap || 5,
      default: section?.config?.pointsConfig?.default || 1
    }
  };

  useEffect(() => {
    if (section && formikRef.current) {
      formikRef.current.setValues({
        title: section.title || '',
        subtitle: section.subtitle || '',
        showStats: section.config?.showStats !== undefined ? section.config.showStats : true,
        pointsConfig: {
          connect: section.config?.pointsConfig?.connect || 1,
          swap: section.config?.pointsConfig?.swap || 5,
          default: section.config?.pointsConfig?.default || 1
        }
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
        pointsConfig: values.pointsConfig
      },
    };
    onChange(updatedSection);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={() => { }}
      enableReinitialize
    >
      {({ values, setFieldValue }) => {
        const handleChange = (field: string) => (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          const value = event.target.value;
          setFieldValue(field, value);

          // Use setTimeout to ensure the value is updated in the Formik state
          setTimeout(() => {
            handleUpdateSection({
              ...values,
              [field]: value
            });
          }, 0);
        };

        const handleSwitchChange = (field: string) => (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const value = event.target.checked;
          setFieldValue(field, value);

          // Use setTimeout to ensure the value is updated in the Formik state
          setTimeout(() => {
            handleUpdateSection({
              ...values,
              [field]: value
            });
          }, 0);
        };

        const handlePointChange = (field: string) => (
          event: Event,
          value: number | number[],
          activeThumb: number
        ) => {
          if (typeof value === 'number') {
            setFieldValue(`pointsConfig.${field}`, value);

            // Use setTimeout to ensure the value is updated in the Formik state
            setTimeout(() => {
              handleUpdateSection({
                ...values,
                pointsConfig: {
                  ...values.pointsConfig,
                  [field]: value
                }
              });
            }, 0);
          }
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
                label={<FormattedMessage id="subtitle" defaultMessage="Subtitle" />}
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
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                <FormattedMessage id="points.configuration" defaultMessage="Points Configuration" />
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <FormattedMessage
                  id="points.configuration.description"
                  defaultMessage="Configure how many points users earn for different actions. Points are counted once per user per day for each action."
                />
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      <FormattedMessage id="connect.wallet.points" defaultMessage="Connect Wallet Points" />
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <Slider
                          value={values.pointsConfig.connect}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          onChange={handlePointChange('connect')}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                      <Box sx={{ minWidth: 50 }}>
                        <TextField
                          value={values.pointsConfig.connect}
                          type="number"
                          size="small"
                          inputProps={{
                            min: 1,
                            max: 10,
                            step: 1
                          }}
                          onChange={(e) => {
                            const value = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
                            setFieldValue('pointsConfig.connect', value);
                            setTimeout(() => {
                              handleUpdateSection({
                                ...values,
                                pointsConfig: {
                                  ...values.pointsConfig,
                                  connect: value
                                }
                              });
                            }, 0);
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      <FormattedMessage id="swap.points" defaultMessage="Swap Points" />
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <Slider
                          value={values.pointsConfig.swap}
                          min={1}
                          max={20}
                          step={1}
                          marks={[
                            { value: 1, label: '1' },
                            { value: 5, label: '5' },
                            { value: 10, label: '10' },
                            { value: 15, label: '15' },
                            { value: 20, label: '20' },
                          ]}
                          onChange={handlePointChange('swap')}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                      <Box sx={{ minWidth: 50 }}>
                        <TextField
                          value={values.pointsConfig.swap}
                          type="number"
                          size="small"
                          inputProps={{
                            min: 1,
                            max: 20,
                            step: 1
                          }}
                          onChange={(e) => {
                            const value = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
                            setFieldValue('pointsConfig.swap', value);
                            setTimeout(() => {
                              handleUpdateSection({
                                ...values,
                                pointsConfig: {
                                  ...values.pointsConfig,
                                  swap: value
                                }
                              });
                            }, 0);
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      <FormattedMessage id="default.points" defaultMessage="Default Points (Other Actions)" />
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <Slider
                          value={values.pointsConfig.default}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          onChange={handlePointChange('default')}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                      <Box sx={{ minWidth: 50 }}>
                        <TextField
                          value={values.pointsConfig.default}
                          type="number"
                          size="small"
                          inputProps={{
                            min: 1,
                            max: 10,
                            step: 1
                          }}
                          onChange={(e) => {
                            const value = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
                            setFieldValue('pointsConfig.default', value);
                            setTimeout(() => {
                              handleUpdateSection({
                                ...values,
                                pointsConfig: {
                                  ...values.pointsConfig,
                                  default: value
                                }
                              });
                            }, 0);
                          }}
                        />
                      </Box>
                    </Box>
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