import MediaDialog from '@dexkit/ui/components/mediaDialog';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Field, Form, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionForm } from '../types';
import { GenerateAIImageButton } from './GenerateAIImageButton';

const getMediaTypeFromUrl = (url: string): 'image' | 'video' | 'audio' => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm')) {
    return 'video';
  }
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.ogg') || lowerUrl.includes('.flac')) {
    return 'audio';
  }
  return 'image';
};

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));

const CustomVideo = styled('video')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  borderRadius: '50%',
  objectFit: 'cover',
  aspectRatio: '1/1',
}));

const CustomAudioContainer = styled(Box)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
}));

const CustomImageIcon = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  borderRadius: '50%',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.grey[400],
}));

const CustomMediaIcon = styled(VideoLibraryIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  borderRadius: '50%',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.grey[400],
}));

export default function CollectionFormCard() {
  const { setFieldValue, values, submitForm, errors, isValid } =
    useFormikContext<CollectionForm>();
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  return (
    <>
      <MediaDialog
        dialogProps={{
          open: openMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => {
            setOpenMediaDialog(false);
          },
        }}
        onConfirmSelectFile={(file) => {
          if (file) {
            setFieldValue('file', file.url);
          }

          setOpenMediaDialog(false);
        }}
      />
      <Card>
        <CardContent>
          <Form>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Box>
                  <Stack direction="row" justifyContent="center">
                    <Button
                      onClick={() => {
                        setOpenMediaDialog(true);
                      }}
                      sx={
                        errors?.file
                          ? {
                            border: (theme) =>
                              `1px solid ${theme.palette.error.main}`,
                          }
                          : undefined
                      }
                    >
                      {values.file ? (
                        (() => {
                          const mediaType = getMediaTypeFromUrl(values.file as string);
                          if (mediaType === 'video') {
                            return (
                              <CustomVideo
                                src={values.file as string}
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            );
                          } else if (mediaType === 'audio') {
                            return (
                              <CustomAudioContainer>
                                <Typography variant="h4" color="white">♪</Typography>
                              </CustomAudioContainer>
                            );
                          } else {
                            return (
                              <CustomImage alt="" src={values.file as string} />
                            );
                          }
                        })()
                      ) : (
                        <CustomMediaIcon />
                      )}
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid size={12}>
                <Field
                  name="name"
                  component={TextField}
                  fullWidth
                  label={<FormattedMessage id="name" defaultMessage="Name" />}
                />
              </Grid>
              <Grid size={12}>
                <Field
                  name="symbol"
                  component={TextField}
                  fullWidth
                  label={
                    <FormattedMessage id="symbol" defaultMessage="Symbol" />
                  }
                />
              </Grid>

              {/* <Grid size={12}>
                <Field
                  name="url"
                  component={TextField}
                  fullWidth
                  label={<FormattedMessage id="URL" defaultMessage="URL" />}
                />
                </Grid>*/}
              <Grid size={12}>
                <Field
                  name="description"
                  component={TextField}
                  fullWidth
                  label={
                    <FormattedMessage
                      id="description"
                      defaultMessage="Description"
                    />
                  }
                  multiline
                  rows={3}
                />
                <Box pt={2}>
                  <GenerateAIImageButton
                    description={values.description}
                    onImageUrl={(imageUrl) => setFieldValue('file', imageUrl)}
                  />
                </Box>
              </Grid>

              <Grid size={12}>
                <Field
                  name="royalty"
                  component={TextField}
                  type="number"
                  inputProps={{ min: 0, max: 30, step: 0.01 }}
                  fullWidth
                  label={
                    <FormattedMessage
                      id="royalty.percentage"
                      defaultMessage="Royalty (%)"
                    />
                  }
                />
              </Grid>
              <Grid size={12}>
                <Button
                  disabled={!isValid}
                  onClick={submitForm}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="create" defaultMessage="Create" />
                </Button>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
