import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useCreateReferralMutation } from '../../hooks/referrals';

interface CreateReferralDialogProps {
  dialogProps: DialogProps;
  siteId?: number;
  onSuccess?: () => void;
}

interface FormValues {
  name: string;
  baseUrl: string;
}

export default function CreateReferralDialog({ 
  dialogProps, 
  siteId,
  onSuccess,
}: CreateReferralDialogProps) {
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [baseUrl, setBaseUrl] = useState('');
  const createReferralMutation = useCreateReferralMutation();

  useEffect(() => {
    const getSiteUrl = async () => {
      try {
        const origin = window.location.origin;
        
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          setBaseUrl('https://yourdapp.dexkit.app');
        } else {
          setBaseUrl(origin);
        }
      } catch (error) {
        console.error('Error getting site URL:', error);
        setBaseUrl('https://yourdapp.dexkit.app');
      }
    };
    
    getSiteUrl();
  }, [siteId]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(formatMessage({ 
        id: 'referral.name.required', 
        defaultMessage: 'Referral name is required' 
      }))
      .matches(
        /^[a-zA-Z0-9-_]+$/,
        formatMessage({
          id: 'referral.name.format',
          defaultMessage: 'Only letters, numbers, hyphens and underscores are allowed'
        })
      )
      .max(30, formatMessage({
        id: 'referral.name.max',
        defaultMessage: 'Name must be 30 characters or less'
      })),
  });

  const initialValues: FormValues = {
    name: '',
    baseUrl: baseUrl,
  };

  const handleSubmit = useCallback(async (values: FormValues, { setSubmitting, resetForm }: any) => {
    try {
      if (!siteId) {
        throw new Error('Site ID is required');
      }
      
      await createReferralMutation.mutateAsync({
        siteId,
        name: values.name
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      resetForm();
      
      if (dialogProps.onClose) {
        dialogProps.onClose({}, 'escapeKeyDown');
      }
    } catch (error) {
      console.error('Error creating referral:', error);
      enqueueSnackbar(
        formatMessage({
          id: 'referral.create.error',
          defaultMessage: 'Error creating referral link'
        }),
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  }, [formatMessage, enqueueSnackbar, onSuccess, dialogProps, siteId, createReferralMutation]);

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <FormattedMessage
          id="create.referral.link"
          defaultMessage="Create Referral Link"
        />
      </DialogTitle>
      <Divider />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, touched, errors }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <FormattedMessage
                      id="create.referral.description"
                      defaultMessage="Create a custom referral link to track visits and conversions from your marketing channels."
                    />
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="name"
                    label={formatMessage({ id: 'referral.name', defaultMessage: 'Referral Name' })}
                    placeholder={formatMessage({ 
                      id: 'referral.name.placeholder', 
                      defaultMessage: 'e.g., instagram, twitter, newsletter' 
                    })}
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name ? (
                      errors.name
                    ) : (
                      <FormattedMessage
                        id="referral.name.helper"
                        defaultMessage="This will be used in your URL as ?ref=name"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label={formatMessage({ id: 'referral.preview', defaultMessage: 'Preview' })}
                    fullWidth
                    value={`${baseUrl}?ref=${values.name}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <FormHelperText>
                    <FormattedMessage
                      id="referral.preview.helper"
                      defaultMessage="This is how your referral link will look"
                    />
                  </FormHelperText>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={dialogProps.onClose as any} 
                color="inherit"
                disabled={isSubmitting}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={isSubmitting}
              >
                <FormattedMessage id="create" defaultMessage="Create" />
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
} 