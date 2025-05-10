import { AppDialogTitle } from '@dexkit/ui';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
} from '@mui/material';
import { NFTDrop, useLazyMint } from '@thirdweb-dev/react';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import { MintNFTFormType } from '../types';
import { MediaInputButton } from './MediaInputButton';

export interface MintNFTDialogProps {
  DialogProps: DialogProps;
  contract?: NFTDrop;
}

export default function MintNFTDialog({
  DialogProps,
  contract,
}: MintNFTDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const mintNftMutation = useLazyMint(contract);

  const handleSubmit = async (values: MintNFTFormType) => {
    await mintNftMutation.mutateAsync({});
  };

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={<FormattedMessage id="mint.nft" defaultMessage="Mint NFT" />}
        onClose={handleClose}
      />
      <Formik
        initialValues={{
          name: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ submitForm, isSubmitting, isValid }) => (
          <>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={3}>
                      <MediaInputButton label="Image" name="image" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    label={<FormattedMessage id="name" defaultMessage="Name" />}
                    required
                    component={TextField}
                    name="name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    label={
                      <FormattedMessage
                        id="description"
                        defaultMessage="description"
                      />
                    }
                    multiline
                    rows={3}
                    component={TextField}
                    name="description"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <FormattedMessage
                        id="advanced"
                        defaultMessage="Advanced"
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Field
                            fullWidth
                            label={
                              <FormattedMessage
                                id="background.color"
                                defaultMessage="Background color"
                              />
                            }
                            component={TextField}
                            name="background_color"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            fullWidth
                            label={
                              <FormattedMessage
                                id="external.url"
                                defaultMessage="External URL"
                              />
                            }
                            component={TextField}
                            name="external_url"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            fullWidth
                            label={
                              <FormattedMessage
                                id="image.url"
                                defaultMessage="Image URL"
                              />
                            }
                            component={TextField}
                            name="image"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            fullWidth
                            label={
                              <FormattedMessage
                                id="animation.url"
                                defaultMessage="Animation URL"
                              />
                            }
                            component={TextField}
                            name="animation_url"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                startIcon={
                  mintNftMutation.isLoading ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : undefined
                }
                disabled={isSubmitting || !isValid}
                onClick={submitForm}
              >
                <FormattedMessage id="mint" defaultMessage="Mint" />
              </Button>
              <Button disabled={mintNftMutation.isLoading}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
