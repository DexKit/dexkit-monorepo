import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { FormattedMessage } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { PageTemplateResponse } from '../../../../types/whitelabel';
import PageTemplateForm from './forms/PageTemplateForm';

interface Props {
  pageTemplate?: PageTemplateResponse;
}

export default function PageTemplateContainer({ pageTemplate }: Props) {
  return (
    <Container maxWidth={'xl'}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            justifyContent="space-between"
          >
            <PageHeader
              breadcrumbs={[
                {
                  caption: (
                    <FormattedMessage id="admin" defaultMessage="Admin" />
                  ),
                  uri: '/admin',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="page.templates"
                      defaultMessage="Page templates"
                    />
                  ),
                  uri: '/admin/page-template',
                },
                {
                  caption: pageTemplate ? (
                    <>
                      <FormattedMessage
                        id={pageTemplate.title}
                        defaultMessage={pageTemplate.title}
                      />{' '}
                      - #{pageTemplate.id}
                    </>
                  ) : (
                    <FormattedMessage id="new" defaultMessage="New" />
                  ),
                  uri: pageTemplate
                    ? `/admin/page-template/${pageTemplate.id}`
                    : '/admin/page-template/create',
                  active: true,
                },
              ]}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <PageTemplateForm initialValues={pageTemplate} />
        </Grid>
      </Grid>
    </Container>
  );
}
