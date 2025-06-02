import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  NoSsr,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';

import AbiInput from '@/modules/forms/components/AbiInput';
import { CreateTemplateSchema } from '@/modules/forms/constants';
import {
  useFormTemplateQuery,
  useUpdateFormTemplateMutation,
} from '@/modules/forms/hooks';
import { CreateTemplateSchemaType } from '@/modules/forms/types';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useSnackbar } from 'notistack';

export default function EditTemplatePage() {
  const router = useRouter();

  const { id } = router.query;

  const formTemplateQuery = useFormTemplateQuery({
    id: id ? parseInt(id as string) : undefined,
  });

  const updateFormTemplateMutation = useUpdateFormTemplateMutation();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const handleSubmit = async (
    values: CreateTemplateSchemaType,
    helpers: FormikHelpers<CreateTemplateSchemaType>,
  ) => {
    try {
      const result = await updateFormTemplateMutation.mutateAsync({
        id: id ? parseInt(id as string) : 0,
        name: values.name,
        description: values.description,
        bytecode: values.bytecode,
        abi: values.abi,
      });

      enqueueSnackbar(
        formatMessage({
          id: 'template.created',
          defaultMessage: 'Contract template updated',
        }),
        { variant: 'success' },
      );

      router.push(`/forms/contract-templates/${result.id}`);
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <>
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
                      id="contract.templates"
                      defaultMessage="Contract Templates"
                    />
                  ),
                  uri: `/forms/contract-templates`,
                },
                {
                  caption: (
                    <FormattedMessage
                      id="edit.templateName"
                      defaultMessage="Edit: {templateName}"
                      values={{ templateName: formTemplateQuery.data?.name }}
                    />
                  ),
                  uri: `/forms/contract-templates/{edit}/${formTemplateQuery.data?.id}`,
                  active: true,
                },
              ]}
            />
          </NoSsr>
          {formTemplateQuery.data && (
            <Box>
              <Card>
                <CardContent>
                  <Formik
                    initialValues={
                      {
                        abi: JSON.stringify(formTemplateQuery.data?.abi || []),
                        bytecode: formTemplateQuery.data?.bytecode,
                        description: formTemplateQuery.data?.description,
                        name: formTemplateQuery.data?.name,
                      } as any
                    }
                    onSubmit={handleSubmit}
                    validationSchema={CreateTemplateSchema}
                  >
                    {({ submitForm, isValid, errors, isSubmitting }) => (
                      <Form>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Field
                              component={TextField}
                              name="name"
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="name"
                                  defaultMessage="Name"
                                />
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              component={TextField}
                              name="description"
                              fullWidth
                              label={
                                <FormattedMessage
                                  id="description"
                                  defaultMessage="Description"
                                />
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <AbiInput />
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              component={TextField}
                              name="bytecode"
                              fullWidth
                              multiline
                              rows={3}
                              label={
                                <FormattedMessage
                                  id="bytecode"
                                  defaultMessage="Bytecode"
                                />
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              onClick={submitForm}
                              disabled={!isValid || isSubmitting}
                            >
                              <FormattedMessage
                                id="save"
                                defaultMessage="Save"
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
}

(EditTemplatePage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};
