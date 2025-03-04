import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import fs from 'fs';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import { QueryClient, dehydrate } from 'react-query';
import remarkGfm from 'remark-gfm';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

interface Props {
  changelog: string;
}

export function ChangelogDevPage({ changelog }: Props) {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="admin" defaultMessage="Admin" />,
                uri: '/admin',
              },
              {
                caption: (
                  <FormattedMessage
                    id="changelog-dev"
                    defaultMessage="Dev Changelog"
                  />
                ),
                uri: '/admin/dev-changelog',
                active: true,
              },
            ]}
            showTitleOnDesktop
          />
        </Grid>
        <Grid item xs={12}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{changelog}</ReactMarkdown>
        </Grid>
      </Grid>
    </Container>
  );
}

(ChangelogDevPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  const file = await fs.readFileSync(process.cwd() + '/CHANGELOG.md');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      changelog: file.toString(),
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default ChangelogDevPage;
