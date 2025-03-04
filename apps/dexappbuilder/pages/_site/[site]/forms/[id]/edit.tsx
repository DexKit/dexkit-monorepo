import ContractForm from '@/modules/wizard/components/forms/ContractForm';
import ContractFormView from '@dexkit/web3forms/components/ContractFormView';
import { ContractFormParams } from '@dexkit/web3forms/types';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  NoSsr,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';
import { useFormQuery, useUpdateFormMutation } from '@/modules/forms/hooks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function FormsEditPage() {
  const router = useRouter();

  const { id } = router.query;

  const [values, setValues] = useState({ name: '', description: '' });

  const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
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
      <Container>
        <Stack spacing={2}>
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
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  disabled={updateFormMutation.isLoading || !isValid}
                  onClick={handleShowConfirm}
                  variant="contained"
                >
                  <FormattedMessage
                    id="update.form"
                    defaultMessage="Save form"
                  />
                </Button>
              </Grid>
              {params && (
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        disabled={updateFormMutation.isLoading}
                        rows={3}
                        InputLabelProps={{ shrink: true }}
                        value={values.description}
                        onChange={handleChangeInputs}
                        name="description"
                        label={
                          <FormattedMessage
                            id="title"
                            defaultMessage="description"
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ContractForm
                        updateOnChange
                        params={params}
                        onSave={handleChange}
                        onChange={handleChange}
                        onValid={handleFormValid}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h5">
                      <FormattedMessage id="preview" defaultMessage="Preview" />
                    </Typography>
                    <Button
                      LinkComponent={Link}
                      href={`/forms/${formQuery.data?.id}`}
                      target="_blank"
                    >
                      <FormattedMessage
                        id="view.form"
                        defaultMessage="View form"
                      />
                    </Button>
                  </Stack>
                  {params && hasVisibleFields ? (
                    <ContractFormView params={params} />
                  ) : (
                    <Paper sx={{ p: 4 }}>
                      <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                      >
                        <InfoIcon fontSize="large" />
                        <Box>
                          <Typography align="center" variant="h5">
                            <FormattedMessage
                              id="form.preview"
                              defaultMessage="Form Preview"
                            />
                          </Typography>
                          <Typography
                            align="center"
                            variant="body1"
                            color="text.secondary"
                          >
                            <FormattedMessage
                              id="make.at.least.one.form.field.visible.to.see.a.preview"
                              defaultMessage="Make at least one form field visible to see a preview"
                            />
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
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
