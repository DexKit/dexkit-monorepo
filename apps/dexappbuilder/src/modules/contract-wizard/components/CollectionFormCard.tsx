import MediaDialog from '@dexkit/ui/components/mediaDialog';
import ImageIcon from '@mui/icons-material/Image';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  styled,
} from '@mui/material';
import { Field, Form, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionForm } from '../types';
import { GenerateAIImageButton } from './GenerateAIImageButton';

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));

const CustomImageIcon = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
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
              <Grid item xs={12}>
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
                        <CustomImage alt="" src={values.file as string} />
                      ) : (
                        <CustomImageIcon />
                      )}
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="name"
                  component={TextField}
                  fullWidth
                  label={<FormattedMessage id="name" defaultMessage="Name" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="symbol"
                  component={TextField}
                  fullWidth
                  label={
                    <FormattedMessage id="symbol" defaultMessage="Symbol" />
                  }
                />
              </Grid>

              {/* <Grid item xs={12}>
                <Field
                  name="url"
                  component={TextField}
                  fullWidth
                  label={<FormattedMessage id="URL" defaultMessage="URL" />}
                />
                </Grid>*/}
              <Grid item xs={12}>
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

              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
