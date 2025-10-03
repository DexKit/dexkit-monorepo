import ContractForm from '@/modules/wizard/components/forms/ContractForm';
import ContractFormView from '@dexkit/web3forms/components/ContractFormView';
import { ContractFormParams } from '@dexkit/web3forms/types';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  NoSsr,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useFormQuery, useUpdateFormMutation } from '@/modules/forms/hooks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import DKMDEditor from '@dexkit/ui/components/DKMDEditor';
import { myAppsApi } from '@dexkit/ui/constants/api';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function FormsEditPage() {
  const router = useRouter();

  const { id } = router.query;

  const [values, setValues] = useState({ name: '', description: '' });

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((values: any) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const formQuery = useFormQuery({
    id: id ? parseInt(id as string) : undefined,
  });

  const [params, setParams] = useState<ContractFormParams>();

  useEffect(() => {
    if (formQuery.data && formQuery.data.params) {
      setParams(formQuery.data.params);
      setValues({
        name: formQuery.data.name || '',
        description: formQuery.data.description || '',
      });
    }
  }, [formQuery.data]);

  const handleChange = (params: ContractFormParams) => {
    setParams(params);
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const updateFormMutation = useUpdateFormMutation();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const handleConfirm = async () => {
    setShowConfirm(false);

    if (params && values.name && values.description && formQuery.data?.id) {
      try {
        await updateFormMutation.mutateAsync({
          id: formQuery.data.id,
          name: values.name,
          description: values.description,
          params,
        });
        enqueueSnackbar(
          formatMessage({ id: 'form.updated', defaultMessage: 'Form updated' }),
          { variant: 'success' },
        );
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
      }
    }
  };

  const hasVisibleFields = useMemo(() => {
    return (
      params !== undefined &&
      Object.keys(params.fields).filter((key) => params.fields[key].visible)
        .length > 0
    );
  }, [params]);

  const [isValid, setIsValid] = useState(false);

  const handleFormValid = (valid: boolean) => {
    setIsValid(valid);
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={
          <FormattedMessage id="update.form" defaultMessage="Update form" />
        }
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.update.this.form"
            defaultMessage="Do you really want to update this form?"
          />
        </Typography>
      </AppConfirmDialog>
      <Backdrop
        open={updateFormMutation.isLoading}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 30 }}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <NoSsr>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage id="forms" defaultMessage="Forms" />
                  ),
                  uri: '/forms',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="form.name"
                      defaultMessage="Form: {name}"
                      values={{
                        name: formQuery.data?.name,
                      }}
                    />
                  ),
                  uri: `/forms/${formQuery.data?.id}`,
                  active: true,
                },
              ]}
            />
          </NoSsr>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={3}>
                <Box>
                  <Button
                    disabled={updateFormMutation.isLoading || !isValid}
                    onClick={handleShowConfirm}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      px: 4,
                      py: 1.5
                    }}
                  >
                    <FormattedMessage
                      id="update.form"
                      defaultMessage="SAVE FORM"
                    />
                  </Button>
                </Box>

                {params && (
                  <Stack spacing={3}>
                    <TextField
                      disabled={updateFormMutation.isLoading}
                      fullWidth
                      value={values.name}
                      onChange={handleChangeInputs}
                      name="name"
                      InputLabelProps={{ shrink: true }}
                      label={
                        <FormattedMessage id="name" defaultMessage="Name" />
                      }
                      sx={{ maxWidth: 400 }}
                    />

                    <Box>
                      <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
                              <FormattedMessage
                                id="description"
                                defaultMessage="Description"
                              />
                            </FormLabel>
                            <Box
                              sx={{
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                '& .w-md-editor': {
                                  backgroundColor: 'transparent',
                                },
                                '& .w-md-editor-text-pre, & .w-md-editor-text-input, & .w-md-editor-text': {
                                  fontSize: '14px !important',
                                  lineHeight: '1.4375em !important',
                                },
                              }}
                            >
                              <DKMDEditor
                                value={values.description || ""}
                                setValue={(val) => setValues((values: any) => ({
                                  ...values,
                                  description: val || ""
                                }))}
                              />
                            </Box>
                            <FormHelperText>
                              <FormattedMessage
                                id="description.markdown.helper"
                                defaultMessage="You can use markdown formatting for rich text descriptions"
                              />
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Stack spacing={2}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{ mb: 1 }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                <FormattedMessage id="preview" defaultMessage="Preview" />
                              </Typography>
                              <Button
                                LinkComponent={Link}
                                href={`/forms/${formQuery.data?.id}`}
                                target="_blank"
                                variant="text"
                                color="primary"
                                sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                              >
                                <FormattedMessage
                                  id="view.form"
                                  defaultMessage="VIEW FORM"
                                />
                              </Button>
                            </Stack>
                            
                            <Paper 
                              sx={{ 
                                p: 4, 
                                minHeight: 300,
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                              }}
                            >
                              {params && hasVisibleFields ? (
                                <ContractFormView params={params} />
                              ) : (
                                <Stack
                                  justifyContent="center"
                                  alignItems="center"
                                  spacing={2}
                                  sx={{ height: '100%', minHeight: 200 }}
                                >
                                  <InfoIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                  <Box textAlign="center">
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      <FormattedMessage
                                        id="form.preview"
                                        defaultMessage="Form Preview"
                                      />
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      <FormattedMessage
                                        id="make.at.least.one.form.field.visible.to.see.a.preview"
                                        defaultMessage="Make at least one form field visible to see a preview"
                                      />
                                    </Typography>
                                  </Box>
                                </Stack>
                              )}
                            </Paper>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box>
                      <ContractForm
                        updateOnChange
                        params={params}
                        onSave={handleChange}
                        onChange={handleChange}
                        onValid={handleFormValid}
                      />
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

(FormsEditPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};
