import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Avatar, Box, Chip, Container, Grid, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { FormattedMessage, useIntl } from 'react-intl';
import remarkGfm from 'remark-gfm';
import MainLayout from '../../../src/components/layouts/main';

import { NETWORK_IMAGE, NETWORK_NAME } from '@dexkit/core/constants/networks';
import { SiteMetadata } from '@dexkit/ui/modules/wizard/types';
import ReactMarkdown from 'react-markdown';
import { getSiteMetadata } from 'src/services/whitelabel';

export const SiteTemplatePage: NextPage<{
  slug: string;
  metadata: SiteMetadata;
  previewUrl: string;
}> = ({ slug, metadata, previewUrl }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <NextSeo
        title={metadata?.title}
        description={metadata?.subtitle}
        openGraph={{
          title: metadata?.title,
          description: metadata?.subtitle,
          images: [
            {
              url: `${metadata?.imageURL}`,
              width: 800,
              height: 600,
              alt: 'DexKit images list',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <MainLayout>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="templates"
                        defaultMessage="Templates"
                      />
                    ),
                    uri: '/site/templates',
                  },
                  {
                    caption: metadata?.title,

                    uri: `/site/template/${slug}`,
                    active: true,
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6}>
              <Stack spacing={2}>
                <Typography variant="h2">{metadata?.title}</Typography>
                <Typography variant="h6">{metadata?.subtitle}</Typography>
                <Stack spacing={2} direction={'row'}>
                  <Button
                    variant="contained"
                    href={`/admin/create?clone=${slug}`}
                    target="_blank"
                  >
                    {' '}
                    <FormattedMessage id="clone" defaultMessage="Clone" />
                  </Button>
                  <Button
                    variant="contained"
                    href={previewUrl || ''}
                    target="_blank"
                  >
                    {' '}
                    <FormattedMessage id="view" defaultMessage="View" />
                  </Button>
                </Stack>

                <Stack
                  spacing={2}
                  direction={'row'}
                  alignItems={'center'}
                  alignContent={'center'}
                >
                  <Typography variant="body1">
                    <FormattedMessage id="networks" defaultMessage="Networks" />
                  </Typography>

                  <Grid container spacing={1}>
                    {metadata?.chainIds?.map((cid, key) => (
                      <Grid item key={`net-${key}`}>
                        <Chip
                          avatar={
                            <Avatar
                              alt={NETWORK_NAME(cid)}
                              src={NETWORK_IMAGE(cid)}
                            />
                          }
                          label={NETWORK_NAME(cid)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
                <Stack
                  spacing={2}
                  direction={'row'}
                  alignItems={'center'}
                  alignContent={'center'}
                >
                  <Typography variant="body1">
                    <FormattedMessage
                      id="usecases"
                      defaultMessage="Use cases"
                    />
                  </Typography>

                  <Grid container spacing={1}>
                    {metadata?.usecases?.map((cid, key) => (
                      <Grid item key={`use-${key}`}>
                        <Chip label={cid} />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6} lg={6}>
              {metadata?.imageURL && (
                <Box
                  sx={{
                    maxHeight: '350px',
                    position: 'relative',
                    paddingTop: '350px',
                  }}
                >
                  <Image
                    src={metadata?.imageURL}
                    fill={true}
                    alt={formatMessage({
                      id: 'nft.image',
                      defaultMessage: 'NFT Image',
                    })}
                  />
                </Box>
              )}
              {metadata?.description && (
                <Box
                  sx={{
                    textAlign: { xs: 'center' },
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {metadata?.description}
                  </ReactMarkdown>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
};

type Params = {
  slug?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const slug = params?.slug as string;
  const queryClient = new QueryClient();

  const sitesResponse = await getSiteMetadata({ slug });
  const data = sitesResponse.data;

  return {
    props: {
      slug: slug,
      previewUrl: data.previewUrl,
      metadata: data.metadata,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60000,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default SiteTemplatePage;
