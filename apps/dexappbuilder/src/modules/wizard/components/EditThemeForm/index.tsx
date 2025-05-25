import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  SupportedColorScheme,
  Typography,
} from '@mui/material';
import { Formik } from 'formik';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ThemeFormType } from '../../types';
import FormikMuiColorInput from '../FormikMuiColorInput';
import SelectThemeSection from './SelectThemeSection';

import DecimalInput from '@dexkit/ui/components/DecimalInput';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { CustomThemeInterface } from '../../state';
import ImportExportSection from './ImportExportSection';

function FormChangeListener({
  values,
  onChange,
}: {
  onChange: (values: ThemeFormType) => void;
  values: ThemeFormType;
}) {
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  return null;
}

export interface EditThemeFormProps {
  mode: SupportedColorScheme;
  onChange: (values: ThemeFormType) => void;
  initialValues: ThemeFormType;
  saveOnChange?: boolean;
  customThemeDark?: CustomThemeInterface;
  customThemeLight?: CustomThemeInterface;
  onSubmit: (values: ThemeFormType) => Promise<void>;
}

export default function EditThemeForm({
  mode,
  onChange,
  initialValues,
  customThemeDark,
  customThemeLight,
  saveOnChange,
  onSubmit,
}: EditThemeFormProps) {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setValues, setFieldValue }) => (
        <>
          {saveOnChange && (
            <FormChangeListener values={values} onChange={onChange} />
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <FormattedMessage id="themes" defaultMessage="Themes" />
              </Typography>
              <SelectThemeSection
                mode={mode}
                customThemeDark={customThemeDark}
                customThemeLight={customThemeLight}
              />
            </Grid>
            {values.themeId === 'custom' && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ImportExportSection
                      theme={values}
                      onImport={(theme: ThemeFormType) => {
                        setValues(theme);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight="bold">
                          <FormattedMessage
                            id="general"
                            defaultMessage="General"
                          />
                        </Typography>
                      </AccordionSummary>
                      <Divider />
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="primary.color"
                                  defaultMessage="Primary color"
                                />
                              }
                              name="primary"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="secondary.color"
                                  defaultMessage="Secondary color"
                                />
                              }
                              name="secondary"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="background.color"
                                  defaultMessage="Background Color"
                                />
                              }
                              name="background"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="paper.color"
                                  defaultMessage="Paper Color"
                                />
                              }
                              name="paper"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="text.color"
                                  defaultMessage="Text Color"
                                />
                              }
                              name="text"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight="bold">
                          <FormattedMessage
                            id="advanced"
                            defaultMessage="Advanced"
                          />
                        </Typography>
                      </AccordionSummary>
                      <Divider />
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="success.color"
                                  defaultMessage="Success color"
                                />
                              }
                              name="success"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="error.color"
                                  defaultMessage="Error color"
                                />
                              }
                              name="error"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="info.color"
                                  defaultMessage="Info Color"
                                />
                              }
                              name="info"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormikMuiColorInput
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="warning.color"
                                  defaultMessage="Warning Color"
                                />
                              }
                              name="warning"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Box>
                              <DecimalInput
                                value={values.borderRadius?.toString() || '0'}
                                decimals={1}
                                onChange={(value) => {
                                  setFieldValue(
                                    'borderRadius',
                                    parseInt(value),
                                  );
                                }}
                                TextFieldProps={{
                                  label: (
                                    <FormattedMessage
                                      id="border.radius"
                                      defaultMessage="Border Radius"
                                    />
                                  ),
                                  fullWidth: false,
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <IconButton
                                          onClick={(e) => {
                                            if (values.borderRadius) {
                                              setFieldValue(
                                                'borderRadius',
                                                values.borderRadius - 1,
                                              );
                                            } else {
                                              setFieldValue('borderRadius', 0);
                                            }
                                          }}
                                        >
                                          <Remove />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={(e) => {
                                            if (values.borderRadius) {
                                              setFieldValue(
                                                'borderRadius',
                                                values.borderRadius + 1,
                                              );
                                            } else {
                                              setFieldValue('borderRadius', 1);
                                            }
                                          }}
                                        >
                                          <Add />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Formik>
  );
}
