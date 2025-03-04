import { PageHeader } from '@dexkit/ui/components/PageHeader';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, Stack, Typography } from '@mui/material';
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
import { QueryClient, dehydrate } from 'react-query';
import AuthMainLayout from 'src/components/layouts/authMain';
import AppVersion from 'src/constants/app-version.json';
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
                    id="app.version"
                    defaultMessage="App version"
                  />
                ),
                uri: '/admin/app-version',
                active: true,
              },
            ]}
            showTitleOnDesktop
          />
        </Grid>
        <Grid item xs={12}>
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  <FormattedMessage
                    id={'current.app.version'}
                    defaultMessage={'Current app version'}
                  />{' '}
                  : <b>{AppVersion.version}</b>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack>
                  <Typography>
                    <FormattedMessage
                      id={
                        'check.out.our.video.changelog.from.dexappbuilder.with.last.updates'
                      }
                      defaultMessage={
                        'Checkout video changelog with last updates'
                      }
                    />{' '}
                    :{' '}
                    <Button
                      href={
                        'https://www.youtube.com/playlist?list=PLue98kEkVwivSNt964YC4BBD1AYjAiRoT'
                      }
                      target="_blank"
                      endIcon={<OpenInNewIcon />}
                    >
                      <FormattedMessage
                        id={'video.changelog'}
                        defaultMessage={'Video changelog'}
                      ></FormattedMessage>
                    </Button>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack>
                  <Typography>
                    <FormattedMessage
                      id={
                        'check.out.our.dev.changelog.for.more.technical.updates'
                      }
                      defaultMessage={
                        'Checkout dev changelog for more technical updates'
                      }
                    />{' '}
                    :{' '}
                    <Button
                      href={'/admin/dev-changelog'}
                      target="_blank"
                      endIcon={<OpenInNewIcon />}
                    >
                      <FormattedMessage
                        id={'dev.changelog'}
                        defaultMessage={'Dev changelog'}
                      ></FormattedMessage>
                    </Button>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Container>
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
