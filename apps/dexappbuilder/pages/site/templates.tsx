import { PageHeader } from '@dexkit/ui/components/PageHeader';
import SidebarFilters from '@dexkit/ui/components/SidebarFilters';
import SidebarFiltersContent from '@dexkit/ui/components/SidebarFiltersContent';
import { useIsMobile } from '@dexkit/ui/hooks/misc';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import {
  Box,
  CardActionArea,
  Chip,
  Grid,
  NoSsr,
  Skeleton,
  Stack,
} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { UsecasesAccordion } from 'src/components/UsecasesAccordion';
import MainLayout from '../../src/components/layouts/main';
import { useAppConfig } from '../../src/hooks/app';
import {
  QUERY_WHITELABEL_TEMPLATE_SITES_QUERY,
  useWhitelabelTemplateSitesListQuery,
} from '../../src/hooks/whitelabel';
import { getTemplateSites } from '../../src/services/whitelabel';

function UseCasesList({ usecases }: { usecases?: string[] }) {
  if (!usecases) return null;

  return (
    <Grid container spacing={1}>
      {(usecases || []).map((cid, key) => (
        <Grid item key={`use-${key}`}>
          <Chip label={cid} size="small" />
        </Grid>
      ))}
    </Grid>
  );
}

export const SiteTemplatesPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [usecases, setUsecases] = useState<string[]>([]);

  const sitesQuery = useWhitelabelTemplateSitesListQuery({
    usecases: usecases,
  });

  const isMobile = useIsMobile();

  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();

  const onFilterUsecase = (use?: string) => {
    let newUsecases = [...usecases];
    if (use) {
      if (usecases.includes(use)) {
        newUsecases = usecases.filter((u) => u !== use);
      } else {
        newUsecases.push(use);
      }
      setUsecases(newUsecases);
    } else {
      setUsecases([]);
    }
  };

  const renderSidebar = (onClose?: () => void) => {
    return (
      <SidebarFilters
        title={<NoSsr><FormattedMessage id="filters" defaultMessage="Filters" /></NoSsr>}
        onClose={onClose}
      >
        <SidebarFiltersContent>
          <Stack spacing={1}>
            <UsecasesAccordion
              onFilterUsecase={onFilterUsecase}
              selectedUsecases={usecases}
              defaultExpanded={isMobile ? false : true}
            />
          </Stack>
        </SidebarFiltersContent>
      </SidebarFilters>
    );
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'site.templates',
          defaultMessage: 'Site templates',
        })}
        description={formatMessage({
          id: 'site.templates.description',
          defaultMessage:
            'Start your own site/marketplace/app in seconds. Here you can view and clone apps with various usecases. Start now being a crypto enterpreneur',
        })}
        openGraph={{
          title:
            'List of app templates. Start clone right way and create yours app today!',
          description:
            'Start your own site/marketplace/apps in seconds.  Here you can view and clone apps with various usecases. Start now being a crypto enterpreneur',
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
        <Box pl={isMobile ? 1 : 8} pr={isMobile ? 1 : 8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <NoSsr><FormattedMessage id="home" defaultMessage="Home" /></NoSsr>
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <NoSsr>
                        <FormattedMessage
                          id="site.templates"
                          defaultMessage="Site templates"
                        />
                      </NoSsr>
                    ),
                    uri: '/site',
                    active: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              {renderSidebar()}
            </Grid>

            <Grid item xs={12} sm={9}>
              {sitesQuery?.isLoading && (
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5, 6].map((id, key) => (
                    <Grid item xs={12} sm={6} lg={3} key={key}>
                      <Card sx={{ maxWidth: 345 }} key={key}>
                        <Skeleton>
                          <CardMedia
                            component="img"
                            height="140"
                            image={''}
                            alt=""
                          />
                        </Skeleton>
                        <CardContent>
                          <Skeleton>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              <NoSsr>
                                <FormattedMessage
                                  id={'title'}
                                  defaultMessage={'title'}
                                />
                              </NoSsr>
                            </Typography>
                          </Skeleton>
                          <Skeleton>
                            <Typography variant="body2" color="text.secondary">
                              <NoSsr>
                                <FormattedMessage
                                  id={'description'}
                                  defaultMessage={'description'}
                                />
                              </NoSsr>
                            </Typography>
                          </Skeleton>
                        </CardContent>
                        <CardActions>
                          <Button size="small">
                            <Skeleton>
                              <NoSsr>
                                <FormattedMessage
                                  id={'clone'}
                                  defaultMessage={'clone'}
                                />
                              </NoSsr>
                            </Skeleton>
                          </Button>

                          <Button size="small">
                            <Skeleton>
                              <NoSsr>
                                <FormattedMessage
                                  id={'view'}
                                  defaultMessage={'View'}
                                />
                              </NoSsr>
                            </Skeleton>
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}{' '}
                </Grid>
              )}

              {(sitesQuery?.data as any)?.length === 0 && !sitesQuery?.isLoading && (
                <Box sx={{ py: 4 }}>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    spacing={2}
                  >
                    <SearchOffIcon sx={{ fontSize: '70px' }} />
                    <Typography variant="body1" color="textSecondary">
                      <NoSsr>
                        <FormattedMessage
                          id="no.templates.found.for.this.usecase"
                          defaultMessage="No templates found for this usecase"
                        />
                      </NoSsr>
                    </Typography>
                  </Stack>
                </Box>
              )}

              {(sitesQuery?.data as any)?.length !== 0 && (
                <Grid container spacing={2}>
                  {(sitesQuery?.data as any)?.map((site: any, key: number) => (
                    <Grid item xs={12} sm={6} lg={3} key={key}>
                      <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignContent={'center'}
                      >
                        <Card sx={{ maxWidth: 300 }}>
                          <CardActionArea
                            href={`/site/template/${site.slug}`}
                            target={'_blank'}
                          >
                            <CardMedia sx={{ height: 160 }}>
                              <div
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  height: '100%',
                                }}
                              >
                                <Image
                                  src={site?.metadata?.imageURL || ''}
                                  fill
                                  style={{ objectFit: 'contain' }}
                                  alt={' '}
                                />
                              </div>
                            </CardMedia>

                            <CardContent>
                              <Box>
                                <Stack spacing={2}>
                                  <Typography
                                    gutterBottom
                                    variant={isMobile ? 'h6' : 'h5'}
                                    component="div"
                                  >
                                    {site?.metadata?.title}
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {site?.metadata?.subtitle}
                                  </Typography>
                                  <UseCasesList
                                    usecases={site?.metadata?.usecases}
                                  />
                                </Stack>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Stack
                              spacing={2}
                              direction={'row'}
                              sx={{ pl: 2 }}
                              alignItems={'center'}
                            >
                              <Button
                                variant={'contained'}
                                href={`/admin/create?clone=${site.slug}`}
                                target={'_blank'}
                              >
                                <NoSsr>
                                  <FormattedMessage
                                    id={'clone'}
                                    defaultMessage={'Clone'}
                                  />
                                </NoSsr>
                              </Button>
                              {site.previewUrl && (
                                <Button
                                  variant="outlined"
                                  href={site?.previewUrl || ''}
                                  target={'_blank'}
                                >
                                  <NoSsr>
                                    <FormattedMessage
                                      id={'view.site'}
                                      defaultMessage={'View'}
                                    />
                                  </NoSsr>
                                </Button>
                              )}
                            </Stack>
                          </CardActions>
                        </Card>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </MainLayout>
    </>
  );
};

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  const sitesResponse = await getTemplateSites({});
  const data = sitesResponse.data;

  await queryClient.prefetchQuery({
    queryKey: [QUERY_WHITELABEL_TEMPLATE_SITES_QUERY],
    queryFn: async () => data,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default SiteTemplatesPage;