import Link from '@dexkit/ui/components/AppLink';
import { Container, Grid, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import MainLayout from '../../src/components/layouts/main';
import { useAppConfig } from '../../src/hooks/app';
import {
  QUERY_WHITELABEL_SITES_QUERY,
  useWhitelabelSitesListQuery,
} from '../../src/hooks/whitelabel';
import { getSites } from '../../src/services/whitelabel';

export const SiteIndexPage: NextPage = () => {
  const sitesQuery = useWhitelabelSitesListQuery({});
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'site.templates',
          defaultMessage: 'Site templates',
        })}
        description={formatMessage({
          id: 'site.list.description',
          defaultMessage:
            'Start your own onchain site/marketplace/app in seconds. Here you can view and be inspired by other community apps. Start now being a cryptopreneur',
        })}
        openGraph={{
          title:
            'List of created onchain apps using the DexKit Wizard. Get your inspiration to create yours!',
          description:
            'Start your own onchain site/marketplace/app in seconds. Here you can view other community apps. Start now being a cryptopreneur',
          images: [
            {
              url: `${appConfig.domain}/assets/images/seo_site.jpg`,
              width: 800,
              height: 600,
              alt: 'DexKit images list',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <MainLayout>
        <Container
          maxWidth="lg"
          sx={{
            px: isMobile ? 2 : 3,
            py: isMobile ? 2 : 3
          }}
        >
          <Grid container spacing={isMobile ? 1.5 : 2}>
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
                        id="site.list"
                        defaultMessage="Site list"
                      />
                    ),
                    uri: '/site',
                    active: true,
                  },
                ]}
                showTitleOnDesktop={true}
              />
            </Grid>
            {sitesQuery?.data?.map((site, key) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={key}
                sx={{
                  display: 'flex',
                  '& > .MuiCard-root': {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }}
              >
                <Card
                  sx={{
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "120" : "140"}
                    image={
                      site.appConfig?.seo &&
                      site.appConfig?.seo['home']?.images[0].url
                    }
                    alt=""
                    sx={{
                      objectFit: 'cover',
                      minHeight: isMobile ? 120 : 140
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: isMobile ? 2 : 2.5,
                      '&:last-child': { pb: isMobile ? 2 : 2.5 }
                    }}
                  >
                    <Stack spacing={isMobile ? 1.5 : 2}>
                      <Typography
                        gutterBottom
                        variant={isMobile ? "h6" : "h5"}
                        component="div"
                        sx={{
                          fontSize: isMobile ? '1.1rem' : undefined,
                          lineHeight: 1.2
                        }}
                      >
                        {site.appConfig.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          height: isMobile ? '80px' : '100px',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: isMobile ? 3 : 4,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4
                        }}
                      >
                        {site.appConfig?.seo &&
                          site.appConfig?.seo['home']?.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <CardActions
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      pt: 0,
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    <Stack
                      spacing={isMobile ? 1 : 2}
                      direction={isMobile ? 'column' : 'row'}
                      sx={{
                        width: '100%',
                        alignItems: isMobile ? 'stretch' : 'center'
                      }}
                    >
                      {site.nft && (
                        <Button
                          variant="contained"
                          href={`/asset/${site.nft.networkId}/${site.nft.address
                            }/${Number(site.nft.tokenId)}`}
                          size={isMobile ? "medium" : "small"}
                          sx={{
                            minHeight: isMobile ? '44px' : '36px',
                            fontSize: isMobile ? '0.9rem' : '0.875rem',
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          <FormattedMessage
                            id={'buy.app'}
                            defaultMessage={'Buy App'}
                          />
                        </Button>
                      )}
                      {site.previewUrl && (
                        <Link
                          href={site?.previewUrl || ''}
                          target={'_blank'}
                          underline="none"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: isMobile ? '44px' : '36px',
                            px: isMobile ? 2 : 1.5,
                            py: isMobile ? 1 : 0.5,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            color: theme.palette.text.primary,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                              borderColor: theme.palette.primary.main
                            }
                          }}
                        >
                          <FormattedMessage
                            id={'view.site'}
                            defaultMessage={'View'}
                          />
                        </Link>
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {!sitesQuery?.isLoading && (!sitesQuery?.data || sitesQuery.data.length === 0) && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: isMobile ? 3 : 4,
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    <FormattedMessage
                      id="no.sites.found"
                      defaultMessage="No sites found"
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    <FormattedMessage
                      id="no.sites.description"
                      defaultMessage="There are no sites available at the moment. Please check back later."
                    />
                  </Typography>
                </Card>
              </Grid>
            )}
            {sitesQuery?.isLoading &&
              Array.from({ length: isMobile ? 2 : isTablet ? 3 : 4 }, (_, i) => i + 1).map((id, key) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={key}
                  sx={{
                    display: 'flex',
                    '& > .MuiCard-root': {
                      width: '100%',
                      height: '100%'
                    }
                  }}
                >
                  <Card
                    sx={{
                      maxWidth: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    key={key}
                  >
                    <Skeleton>
                      <CardMedia
                        component="img"
                        height={isMobile ? "120" : "140"}
                        image={''}
                        alt=""
                      />
                    </Skeleton>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: isMobile ? 2 : 2.5,
                        '&:last-child': { pb: isMobile ? 2 : 2.5 }
                      }}
                    >
                      <Skeleton>
                        <Typography
                          gutterBottom
                          variant={isMobile ? "h6" : "h5"}
                          component="div"
                        >
                          <FormattedMessage
                            id={'title'}
                            defaultMessage={'title'}
                          />
                        </Typography>
                      </Skeleton>
                      <Skeleton>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ height: isMobile ? '80px' : '100px' }}
                        >
                          <FormattedMessage
                            id={'description'}
                            defaultMessage={'description'}
                          />
                        </Typography>
                      </Skeleton>
                    </CardContent>
                    <CardActions
                      sx={{
                        p: isMobile ? 1.5 : 2,
                        pt: 0,
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Stack
                        spacing={isMobile ? 1 : 2}
                        direction={isMobile ? 'column' : 'row'}
                        sx={{
                          width: '100%',
                          alignItems: isMobile ? 'stretch' : 'center'
                        }}
                      >
                        <Button
                          size={isMobile ? "medium" : "small"}
                          sx={{
                            minHeight: isMobile ? '44px' : '36px'
                          }}
                        >
                          <Skeleton>
                            <FormattedMessage
                              id={'clone'}
                              defaultMessage={'clone'}
                            />
                          </Skeleton>
                        </Button>

                        <Button
                          size={isMobile ? "medium" : "small"}
                          sx={{
                            minHeight: isMobile ? '44px' : '36px'
                          }}
                        >
                          <Skeleton>
                            <FormattedMessage
                              id={'view'}
                              defaultMessage={'View'}
                            />
                          </Skeleton>
                        </Button>
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const sitesResponse = await getSites({});
  const data = sitesResponse.data.map((resp) => ({
    ...resp,
    appConfig: JSON.parse(resp.config) as AppConfig,
  }));

  await queryClient.prefetchQuery(
    [QUERY_WHITELABEL_SITES_QUERY],
    async () => data,
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3000,
  };
};

export default SiteIndexPage;