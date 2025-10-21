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
import { useCreateFormTemplateMutation } from '@/modules/forms/hooks';
import { CreateTemplateSchemaType } from '@/modules/forms/types';
import { MarkdownDescriptionField } from '@dexkit/ui/components';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
const FormikTextField = dynamic(() => import('formik-mui').then(mod => ({ default: mod.TextField })), { ssr: false });

export default function CreateTemplatePage() {
  const router = useRouter();

  const createFormTemplateMutation = useCreateFormTemplateMutation();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const handleSubmit = async (
    values: CreateTemplateSchemaType,
    helpers: FormikHelpers<CreateTemplateSchemaType>,
  ) => {
    try {
      const result = await createFormTemplateMutation.mutateAsync({
        name: values.name,
        description: values.description,
        bytecode: values.bytecode,
        abi: values.abi,
      });

      enqueueSnackbar(
        formatMessage({
          id: 'template.created',
          defaultMessage: 'Template created',
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
                  uri: `/forms`,
                },
                {
                  caption: (
                    <FormattedMessage id="create" defaultMessage="Create" />
                  ),
                  uri: `/forms/contract-templates/create`,
                  active: true,
                },
              ]}
            />
          </NoSsr>
          <Box>
            <Card>
              <CardContent>
                <Formik
                  initialValues={
                    {
                      abi: '',
                      bytecode: '',
                      description: '',
                      name: '',
                    } as any
                  }
                  onSubmit={handleSubmit}
                  validationSchema={CreateTemplateSchema}
                >
                  {({ submitForm, isValid, errors, isSubmitting }: any) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid size={12}>
                          <Field
                            component={FormikTextField}
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
                        <Grid size={12}>
                          <MarkdownDescriptionField
                            name="description"
                            label={
                              <FormattedMessage
                                id="description"
                                defaultMessage="Description"
                              />
                            }
                            helperText={
                              <FormattedMessage
                                id="description.markdown.helper"
                                defaultMessage="You can use markdown formatting for rich text descriptions"
                              />
                            }
                          />
                        </Grid>
                        <Grid size={12}>
                          <AbiInput />
                        </Grid>
                        <Grid size={12}>
                          <Field
                            component={FormikTextField}
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
                        <Grid size={12}>
                          <Button
                            variant="contained"
                            onClick={submitForm}
                            disabled={!isValid || isSubmitting}
                          >
                            <FormattedMessage
                              id="create"
                              defaultMessage="Create"
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
        </Stack>
      </Container>
    </>
  );
}

(CreateTemplatePage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};
