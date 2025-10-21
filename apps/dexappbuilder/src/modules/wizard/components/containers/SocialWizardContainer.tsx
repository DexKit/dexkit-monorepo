import { AppConfig, SocialMedia } from '@dexkit/ui/modules/wizard/types/config';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FacebookIcon from '@mui/icons-material/Facebook';
import ImageIcon from '@mui/icons-material/Image';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RedditIcon from '@mui/icons-material/Reddit';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, styled, SvgIcon, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Field, FieldArray, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'));

const XIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange?: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
  isTabContext?: boolean;
}

interface SocialOptions {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  reddit?: string;
  youtube?: string;
  linkedin?: string;
}

const BackgroundImage = styled('img')(({ theme }) => ({
  height: theme.spacing(4),
  width: theme.spacing(4),
}));

const EmptyImageProfile = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(4),
  width: theme.spacing(4),
}));

const SocialOptionsSchema: Yup.SchemaOf<SocialOptions> = Yup.object().shape({
  twitter: Yup.string(),
  instagram: Yup.string(),
  facebook: Yup.string(),
  linkedin: Yup.string(),
  youtube: Yup.string(),
  reddit: Yup.string(),
  custom: Yup.array().of(
    Yup.object().shape({
      iconUrl: Yup.string().required().url(),
      label: Yup.string().required(),
      link: Yup.string().required().url(),
    }),
  ),
});

function OnChangeListener({
  values,
  onChange,
  config,
  isValid,
  onHasChanges,
  dirty,
}: {
  values: any;
  onChange: any;
  config: any;
  isValid: boolean;
  dirty: boolean;
  onHasChanges: any;
}) {
  useEffect(() => {
    if (onChange && values && config && isValid) {
      const socials: SocialMedia[] = [];
      if (values.twitter) {
        socials.push({ type: 'twitter', handle: values.twitter });
      }
      if (values.instagram) {
        socials.push({ type: 'instagram', handle: values.instagram });
      }
      if (values.facebook) {
        socials.push({ type: 'facebook', handle: values.facebook });
      }
      if (values.linkedin) {
        socials.push({ type: 'linkedin', handle: values.linkedin });
      }
      if (values.reddit) {
        socials.push({ type: 'reddit', handle: values.reddit });
      }

      if (values.youtube) {
        socials.push({ type: 'youtube', handle: values.youtube });
      }

      config.social = socials;
      config.social_custom = values.custom;
      onChange(config);
    }
  }, [values, onChange, config, isValid]);

  useEffect(() => {
    if (dirty && onHasChanges) {
      onHasChanges(dirty);
    }
  }, [dirty, onHasChanges]);

  return null;
}

export default function SocialWizardContainer({
  config,
  onSave,
  onChange,
  onHasChanges,
  isTabContext = false,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaFieldToEdit, setMediaFieldToEdit] = useState<string>();

  return (
    <Formik
      initialValues={{
        twitter: config.social?.find((s) => s.type === 'twitter')?.handle,
        instagram: config.social?.find((s) => s.type === 'instagram')?.handle,
        facebook: config.social?.find((s) => s.type === 'facebook')?.handle,
        linkedin: config.social?.find((s) => s.type === 'linkedin')?.handle,
        //  pinterest: config.social?.find((s) => s.type === 'pinterest')?.handle,
        youtube: config.social?.find((s) => s.type === 'youtube')?.handle,
        reddit: config.social?.find((s) => s.type === 'reddit')?.handle,
        custom: config?.social_custom || [],
      }}
      validationSchema={SocialOptionsSchema}
      onSubmit={(values, helpers) => {
        const socials: SocialMedia[] = [];
        if (values.twitter) {
          socials.push({ type: 'twitter', handle: values.twitter });
        }
        if (values.instagram) {
          socials.push({ type: 'instagram', handle: values.instagram });
        }
        if (values.facebook) {
          socials.push({ type: 'facebook', handle: values.facebook });
        }
        if (values.linkedin) {
          socials.push({ type: 'linkedin', handle: values.linkedin });
        }
        if (values.reddit) {
          socials.push({ type: 'reddit', handle: values.reddit });
        }

        if (values.youtube) {
          socials.push({ type: 'youtube', handle: values.youtube });
        }

        config.social = socials;
        config.social_custom = values.custom;
        onSave(config);
      }}
    >
      {({ submitForm, values, setFieldValue, isValid, dirty }: any) => (
        <Form>
          <OnChangeListener
            values={values}
            onChange={onChange}
            config={config}
            isValid={isValid}
            onHasChanges={onHasChanges}
            dirty={dirty}
          />
          {openMediaDialog && (
            <MediaDialog
              dialogProps={{
                open: openMediaDialog,
                maxWidth: 'lg',
                fullWidth: true,
                onClose: () => {
                  setOpenMediaDialog(false);
                  setMediaFieldToEdit(undefined);
                },
              }}
              onConfirmSelectFile={(file: any) => {
                if (mediaFieldToEdit && file) {
                  setFieldValue(mediaFieldToEdit, file.url);
                  /*if (onChange) {
                  onChange({ ...values, [mediaFieldToEdit]: file.url });
                }*/
                }
                setMediaFieldToEdit(undefined);
                setOpenMediaDialog(false);
              }}
            />
          )}
          <Grid container spacing={isMobile ? 1.5 : 3}>
            {!isTabContext && (
              <>
                <Grid size={12}>
                  <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
                    <Typography
                      variant={isMobile ? 'h6' : 'h5'}
                      sx={{
                        fontSize: isMobile ? '1.15rem' : '1.5rem',
                        fontWeight: 600,
                        mb: 0.5
                      }}
                    >
                      <FormattedMessage
                        id="social.media.title"
                        defaultMessage="Social Media"
                      />
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      color="text.secondary"
                      sx={{
                        fontSize: isMobile ? '0.85rem' : 'inherit',
                      }}
                    >
                      <FormattedMessage
                        id="edit.social.description"
                        defaultMessage="Add social media related to your app"
                      />
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Divider />
                </Grid>
              </>
            )}

            <Grid size={12}>
              <Field
                component={TextField}
                name="instagram"
                label={
                  <FormattedMessage
                    id={'instagram'}
                    defaultMessage={'Instagram'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InstagramIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <Field
                component={TextField}
                name="twitter"
                label={
                  <FormattedMessage
                    id={'x.formerly.twitter'}
                    defaultMessage={'X (Formerly Twitter)'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <XIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <Field
                component={TextField}
                name="youtube"
                label={
                  <FormattedMessage
                    id={'youtube.channel'}
                    defaultMessage={'Youtube channel'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <YouTubeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <Field
                component={TextField}
                name="linkedin"
                label={
                  <FormattedMessage
                    id={'linkedin.company'}
                    defaultMessage={'Linkedin company'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <Field
                component={TextField}
                name="facebook"
                label={
                  <FormattedMessage
                    id={'facebook'}
                    defaultMessage={'Facebook'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FacebookIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={12}>
              <Field
                component={TextField}
                name="reddit"
                label={
                  <FormattedMessage id={'reddit'} defaultMessage={'Reddit'} />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RedditIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <FieldArray
              name="custom"
              render={(arrayHelpers: any) => (
                <Box p={2}>
                  <Stack spacing={2}>
                    {values.custom &&
                      values.custom.length > 0 &&
                      values.custom.map((media: any, index: any) => (
                        <Stack key={index} spacing={1} direction={'row'}>
                          <Button
                            onClick={() => {
                              setOpenMediaDialog(true);
                              setMediaFieldToEdit(`custom.${index}.iconUrl`);
                            }}
                          >
                            {values?.custom[index]?.iconUrl ? (
                              <BackgroundImage
                                src={values?.custom[index]?.iconUrl}
                              />
                            ) : (
                              <EmptyImageProfile />
                            )}
                          </Button>
                          <Field
                            name={`custom.${index}.label`}
                            component={TextField}
                            label={
                              <FormattedMessage
                                id={'label'}
                                defaultMessage={'Label'}
                              />
                            }
                          />

                          <Field
                            name={`custom.${index}.link`}
                            component={TextField}
                            label={
                              <FormattedMessage
                                id={'link'}
                                defaultMessage={'Link'}
                              />
                            }
                          />
                          <Button
                            size={'large'}
                            onClick={() => arrayHelpers.remove(index)} // remove a media from the list
                          >
                            <DeleteIcon />
                          </Button>
                        </Stack>
                      ))}

                    <Button
                      variant={'outlined'}
                      sx={{ maxWidth: '200px' }}
                      onClick={() => arrayHelpers.push('')}
                      startIcon={<AddIcon />}
                    >
                      {/* show this when user has removed all friends from the list */}
                      <FormattedMessage
                        id={'add.custom'}
                        defaultMessage={'Add Custom'}
                      />
                    </Button>
                  </Stack>
                </Box>
              )}
            />

            {/*   <Grid size={12}>
              <Field
                component={TextField}
                name="pinterest"
                label={
                  <FormattedMessage
                    id={'pinterest'}
                    defaultMessage={'Pinterest'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinterestIcon />
                    </InputAdornment>
                  ),
                }}
              />
              </Grid>*/}

            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button
                  disabled={!dirty}
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    fontSize: isMobile ? "0.875rem" : undefined,
                    py: isMobile ? 0.75 : undefined,
                    px: isMobile ? 2 : undefined,
                  }}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
