import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useIsMobile } from '@dexkit/ui/hooks/misc';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  useTheme
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from '../../src/components/layouts/main';
import { useAppConfig } from '../../src/hooks/app';
import {
  QUERY_WHITELABEL_TEMPLATE_SITES_QUERY,
  useWhitelabelTemplateSitesListQuery,
} from '../../src/hooks/whitelabel';
import { getTemplateSites } from '../../src/services/whitelabel';

type SortOption = 'web3' | 'token' | 'swap' | 'nft' | 'staking' | 'gated' | 'blog';
type FilterOption = 'all' | 'recent' | 'popular' | 'active';

interface FilterState {
  search: string;
  sortBy: SortOption;
  filterBy: FilterOption;
  showFilters: boolean;
}


function UseCasesList({ usecases }: { usecases?: string[] }) {
  if (!usecases) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 0.5, sm: 1 },
        maxHeight: { xs: '60px', sm: 'none' },
        overflow: 'hidden'
      }}
    >
      {(usecases || []).slice(0, 4).map((cid, key) => (
        <Chip
          key={`use-${key}`}
          label={cid}
          size="small"
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: '20px', sm: '24px' }
          }}
        />
      ))}
      {usecases && usecases.length > 4 && (
        <Chip
          label={`+${usecases.length - 4}`}
          size="small"
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: '20px', sm: '24px' }
          }}
        />
      )}
    </Box>
  );
}

export const SiteTemplatesPage: NextPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'web3',
    filterBy: 'all',
    showFilters: false
  });

  const sitesQuery = useWhitelabelTemplateSitesListQuery({});

  const isMobile = useIsMobile();
  const theme = useTheme();

  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'web3',
      filterBy: 'all',
      showFilters: false
    });
  };

  const hasUsecase = (template: any, usecase: string) => {
    return template.metadata?.usecases?.includes(usecase) ? 1 : 0;
  };

  const filteredAndSortedTemplates = useMemo(() => {
    if (!sitesQuery?.data) return [];

    let filtered = [...sitesQuery.data];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(template =>
        template.metadata?.title?.toLowerCase().includes(searchLower) ||
        template.metadata?.subtitle?.toLowerCase().includes(searchLower) ||
        template.metadata?.usecases?.some(usecase =>
          usecase.toLowerCase().includes(searchLower)
        )
      );
    }

    if (filters.filterBy !== 'all') {
      const now = new Date();
      filtered = filtered.filter(template => {
        switch (filters.filterBy) {
          case 'recent':
            return template.id > 0;
          case 'popular':
            return template.previewUrl;
          case 'active':
            return template.metadata?.title && template.metadata?.subtitle;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'web3':
          return hasUsecase(b, 'Web3') - hasUsecase(a, 'Web3') || b.id - a.id;
        case 'token':
          return hasUsecase(b, 'Token Project') - hasUsecase(a, 'Token Project') || b.id - a.id;
        case 'swap':
          return hasUsecase(b, 'Swap') - hasUsecase(a, 'Swap') || b.id - a.id;
        case 'nft':
          return hasUsecase(b, 'NFT Marketplace') - hasUsecase(a, 'NFT Marketplace') || b.id - a.id;
        case 'staking':
          return hasUsecase(b, 'Staking Project') - hasUsecase(a, 'Staking Project') || b.id - a.id;
        case 'gated':
          return hasUsecase(b, 'Gated Content') - hasUsecase(a, 'Gated Content') || b.id - a.id;
        case 'blog':
          return hasUsecase(b, 'Blog') - hasUsecase(a, 'Blog') || b.id - a.id;
        default:
          return 0;
      }
    });

    return filtered;
  }, [sitesQuery?.data, filters]);


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
        <Box
          sx={{
            px: { xs: 1, sm: 2, md: 4 },
            py: { xs: 1, sm: 2 }
          }}
        >
          <Box sx={{ mb: 3 }}>
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
                      id="site.templates"
                      defaultMessage="Site templates"
                    />
                  ),
                  uri: '/site',
                  active: true,
                },
              ]}
            />
          </Box>

          <Paper
            elevation={1}
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
              borderRadius: 2
            }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                placeholder={formatMessage({
                  id: 'search.templates',
                  defaultMessage: 'Search templates...'
                })}
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => updateFilter('search', '')}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  maxWidth: { xs: '100%', sm: 400 },
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => updateFilter('showFilters', !filters.showFilters)}
                  size="small"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 }
                  }}
                >
                  <FormattedMessage
                    id="filters"
                    defaultMessage="Filters"
                  />
                </Button>

                {(filters.search || filters.filterBy !== 'all' || filters.sortBy !== 'web3') && (
                  <Chip
                    label={formatMessage({
                      id: 'clear.filters.button',
                      defaultMessage: 'Clear filters'
                    })}
                    onDelete={clearFilters}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: '24px', sm: '32px' }
                    }}
                  />
                )}
              </Box>

              <Collapse in={filters.showFilters}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1.5, sm: 2 }}
                  sx={{ pt: { xs: 1, sm: 1 } }}
                >
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: { xs: '100%', sm: 150 },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    <InputLabel>
                      <FormattedMessage
                        id="filter.by"
                        defaultMessage="Filter by"
                      />
                    </InputLabel>
                    <Select
                      value={filters.filterBy}
                      label={formatMessage({
                        id: 'filter.by',
                        defaultMessage: 'Filter by'
                      })}
                      onChange={(e) => updateFilter('filterBy', e.target.value)}
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}
                    >
                      <MenuItem value="all">
                        <FormattedMessage
                          id="filter.all"
                          defaultMessage="All"
                        />
                      </MenuItem>
                      <MenuItem value="recent">
                        <FormattedMessage
                          id="filter.recent"
                          defaultMessage="Recent"
                        />
                      </MenuItem>
                      <MenuItem value="active">
                        <FormattedMessage
                          id="filter.active"
                          defaultMessage="Active"
                        />
                      </MenuItem>
                      <MenuItem value="popular">
                        <FormattedMessage
                          id="filter.popular"
                          defaultMessage="Popular"
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{
                      minWidth: { xs: '100%', sm: 150 },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    <InputLabel>
                      <FormattedMessage
                        id="sort.by"
                        defaultMessage="Sort by"
                      />
                    </InputLabel>
                    <Select
                      value={filters.sortBy}
                      label={formatMessage({
                        id: 'sort.by',
                        defaultMessage: 'Sort by'
                      })}
                      onChange={(e) => updateFilter('sortBy', e.target.value)}
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}
                    >
                      <MenuItem value="web3">
                        <FormattedMessage
                          id="sort.web3"
                          defaultMessage="Web3"
                        />
                      </MenuItem>
                      <MenuItem value="token">
                        <FormattedMessage
                          id="sort.token.project"
                          defaultMessage="Token Project"
                        />
                      </MenuItem>
                      <MenuItem value="swap">
                        <FormattedMessage
                          id="sort.swap"
                          defaultMessage="Swap"
                        />
                      </MenuItem>
                      <MenuItem value="nft">
                        <FormattedMessage
                          id="sort.nft.marketplace"
                          defaultMessage="NFT Marketplace"
                        />
                      </MenuItem>
                      <MenuItem value="staking">
                        <FormattedMessage
                          id="sort.staking.project"
                          defaultMessage="Staking Project"
                        />
                      </MenuItem>
                      <MenuItem value="gated">
                        <FormattedMessage
                          id="sort.gated.content"
                          defaultMessage="Gated Content"
                        />
                      </MenuItem>
                      <MenuItem value="blog">
                        <FormattedMessage
                          id="sort.blog"
                          defaultMessage="Blog"
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Collapse>
            </Stack>
          </Paper>

          {!sitesQuery?.isLoading && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                <FormattedMessage
                  id="templates.results.count"
                  defaultMessage="{count} template{count, plural, one {} other {s}} found"
                  values={{ count: filteredAndSortedTemplates.length }}
                />
              </Typography>
            </Box>
          )}

          <Box>
            {sitesQuery?.isLoading && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: { xs: 1.5, sm: 2, md: 2.5 },
                  alignItems: 'stretch'
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((id, key) => (
                  <Card key={key} sx={{ maxWidth: '100%', height: '100%' }}>
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
                          <FormattedMessage
                            id={'title'}
                            defaultMessage={'title'}
                          />
                        </Typography>
                      </Skeleton>
                      <Skeleton>
                        <Typography variant="body2" color="text.secondary">
                          <FormattedMessage
                            id={'description'}
                            defaultMessage={'description'}
                          />
                        </Typography>
                      </Skeleton>
                    </CardContent>
                    <CardActions>
                      <Button size="small">
                        <Skeleton>
                          <FormattedMessage
                            id={'clone'}
                            defaultMessage={'clone'}
                          />
                        </Skeleton>
                      </Button>

                      <Button size="small">
                        <Skeleton>
                          <FormattedMessage
                            id={'view'}
                            defaultMessage={'View'}
                          />
                        </Skeleton>
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}

            {filteredAndSortedTemplates.length === 0 && !sitesQuery?.isLoading && (
              <Box sx={{ py: 4 }}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  alignContent="center"
                  spacing={2}
                >
                  <SearchOffIcon sx={{ fontSize: '70px' }} />
                  <Typography variant="body1" color="textSecondary">
                    <FormattedMessage
                      id="no.templates.found"
                      defaultMessage="No templates found"
                    />
                  </Typography>
                </Stack>
              </Box>
            )}

            {filteredAndSortedTemplates.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: { xs: 1.5, sm: 2, md: 2.5 },
                  alignItems: 'stretch'
                }}
              >
                {filteredAndSortedTemplates.map((site, key) => (
                  <Card
                    key={key}
                    sx={{
                      maxWidth: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease-in-out',
                      borderRadius: { xs: 2, sm: 2.5 },
                      boxShadow: { xs: 1, sm: 2 },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <Box
                      component="a"
                      href={`/site/template/${site.slug}`}
                      target="_blank"
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        flexGrow: 1
                      }}
                    >
                      <CardMedia
                        sx={{
                          height: { xs: 140, sm: 160, md: 180 },
                          position: 'relative',
                          backgroundColor: 'grey.50'
                        }}
                      >
                        <Image
                          src={site?.metadata?.imageURL}
                          fill
                          style={{
                            objectFit: 'contain'
                          }}
                          alt={site?.metadata?.title || 'Template'}
                        />
                      </CardMedia>

                      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                        <Stack spacing={{ xs: 1.5, sm: 2 }}>
                          <Typography
                            gutterBottom
                            variant={isMobile ? 'h6' : 'h5'}
                            component="div"
                            sx={{
                              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.375rem' },
                              fontWeight: 600,
                              lineHeight: 1.3
                            }}
                          >
                            {site?.metadata?.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: '0.85rem', sm: '0.875rem', md: '0.9rem' },
                              lineHeight: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {site?.metadata?.subtitle}
                          </Typography>
                          <UseCasesList
                            usecases={site?.metadata?.usecases}
                          />
                        </Stack>
                      </CardContent>
                    </Box>

                    <CardActions sx={{
                      mt: 'auto',
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      pt: 0
                    }}>
                      <Stack
                        spacing={{ xs: 1, sm: 1.5 }}
                        direction="row"
                        sx={{ width: '100%' }}
                        alignItems="center"
                      >
                        <Button
                          variant="contained"
                          href={`/admin/create?clone=${site.slug}`}
                          target="_blank"
                          size="small"
                          sx={{
                            flex: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            py: { xs: 1, sm: 1.25 },
                            borderRadius: 2
                          }}
                        >
                          <FormattedMessage
                            id={'clone'}
                            defaultMessage={'Clone'}
                          />
                        </Button>
                        {site.previewUrl && (
                          <Button
                            variant="outlined"
                            href={site?.previewUrl || ''}
                            target="_blank"
                            size="small"
                            sx={{
                              flex: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              py: { xs: 1, sm: 1.25 },
                              borderRadius: 2
                            }}
                          >
                            <FormattedMessage
                              id={'view.site'}
                              defaultMessage={'View'}
                            />
                          </Button>
                        )}
                      </Stack>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>
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

  const sitesResponse = await getTemplateSites({});
  const data = sitesResponse.data;

  await queryClient.prefetchQuery(
    [QUERY_WHITELABEL_TEMPLATE_SITES_QUERY],
    async () => data,
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60000,
  };
};

export default SiteTemplatesPage;
