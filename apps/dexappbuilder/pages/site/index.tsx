import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Chip,
  Collapse,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { SiteCardSkeleton } from '@dexkit/ui/components/SiteCardSkeleton';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import MainLayout from '../../src/components/layouts/main';
import { useAppConfig } from '../../src/hooks/app';
import {
  QUERY_WHITELABEL_SITES_QUERY,
  useWhitelabelSitesListQuery,
} from '../../src/hooks/whitelabel';
import { getSites } from '../../src/services/whitelabel';

type SortOption = 'newest' | 'oldest' | 'mostModified' | 'leastModified' | 'nameAsc' | 'nameDesc';
type FilterOption = 'all' | 'recent' | 'popular' | 'active';

interface FilterState {
  search: string;
  sortBy: SortOption;
  filterBy: FilterOption;
  showFilters: boolean;
}

export const SiteIndexPage: NextPage = () => {
  const sitesQuery = useWhitelabelSitesListQuery({});
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'newest',
    filterBy: 'all',
    showFilters: false
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'newest',
      filterBy: 'all',
      showFilters: false
    });
  };

  const truncateDescription = (text: string, isMobile: boolean) => {
    if (!text) return '';
    if (!isMobile) return text;

    const words = text.split(' ');
    if (words.length <= 8) return text;

    const truncatedWords = words.slice(0, 7);
    return truncatedWords.join(' ') + '...';
  };

  const filteredAndSortedSites = useMemo(() => {
    if (!sitesQuery?.data) return [];

    let filtered = [...sitesQuery.data];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(site =>
        site.appConfig?.name?.toLowerCase().includes(searchLower) ||
        site.appConfig?.seo?.['home']?.description?.toLowerCase().includes(searchLower)
      );
    }

    switch (filters.filterBy) {
      case 'recent':
        filtered = filtered.filter(site => site.id > 0);
        break;
      case 'popular':
        filtered = filtered.filter(site =>
          site.previewUrl || site.nft
        );
        break;
      case 'active':
        filtered = filtered.filter(site =>
          (site.previewUrl || site.nft) && site.domainStatus === 'verified'
        );
        break;
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'mostModified':
          const aScore = (a.previewUrl ? 2 : 0) + (a.nft ? 1 : 0);
          const bScore = (b.previewUrl ? 2 : 0) + (b.nft ? 1 : 0);
          if (aScore !== bScore) return bScore - aScore;
          return b.id - a.id;
        case 'leastModified':
          const aScoreLeast = (a.previewUrl ? 2 : 0) + (a.nft ? 1 : 0);
          const bScoreLeast = (b.previewUrl ? 2 : 0) + (b.nft ? 1 : 0);
          if (aScoreLeast !== bScoreLeast) return aScoreLeast - bScoreLeast;
          return a.id - b.id;
        case 'nameAsc':
          return (a.appConfig?.name || '').localeCompare(b.appConfig?.name || '');
        case 'nameDesc':
          return (b.appConfig?.name || '').localeCompare(a.appConfig?.name || '');
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
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
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
                  id: 'search.sites',
                  defaultMessage: 'Search sites...'
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

                {(filters.search || filters.filterBy !== 'all' || filters.sortBy !== 'newest') && (
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
                          defaultMessage="Recent (30 days)"
                        />
                      </MenuItem>
                      <MenuItem value="active">
                        <FormattedMessage
                          id="filter.active"
                          defaultMessage="Active (7 days)"
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
                      minWidth: { xs: '100%', sm: 200 },
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
                      <MenuItem value="newest">
                        <FormattedMessage
                          id="sort.newest"
                          defaultMessage="Newest"
                        />
                      </MenuItem>
                      <MenuItem value="oldest">
                        <FormattedMessage
                          id="sort.oldest"
                          defaultMessage="Oldest"
                        />
                      </MenuItem>
                      <MenuItem value="mostModified">
                        <FormattedMessage
                          id="sort.most.modified"
                          defaultMessage="Most modified"
                        />
                      </MenuItem>
                      <MenuItem value="leastModified">
                        <FormattedMessage
                          id="sort.least.modified"
                          defaultMessage="Least modified"
                        />
                      </MenuItem>
                      <MenuItem value="nameAsc">
                        <FormattedMessage
                          id="sort.name.asc"
                          defaultMessage="Name A-Z"
                        />
                      </MenuItem>
                      <MenuItem value="nameDesc">
                        <FormattedMessage
                          id="sort.name.desc"
                          defaultMessage="Name Z-A"
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Collapse>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                {sitesQuery?.isLoading ? (
                  <FormattedMessage
                    id="loading.sites"
                    defaultMessage="Loading sites..."
                  />
                ) : (
                  <FormattedMessage
                    id="results.count"
                    defaultMessage="{count} sites found"
                    values={{ count: filteredAndSortedSites.length }}
                  />
                )}
              </Typography>
            </Stack>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: { xs: 1, sm: 2, md: 2.5, lg: 3 },
              alignItems: 'stretch',
              justifyItems: 'stretch'
            }}
          >
            {filteredAndSortedSites.map((site, key) => (
              <Box
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
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                    minHeight: { xs: '240px', sm: '290px', md: '330px' },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      site.appConfig?.seo &&
                      site.appConfig?.seo['home']?.images[0].url
                    }
                    alt=""
                    loading="lazy"
                    sx={{
                      objectFit: 'cover',
                      height: { xs: '100px', sm: '120px', md: '140px' },
                      minHeight: { xs: '100px', sm: '120px', md: '140px' }
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: { xs: 1, sm: 2, md: 2.5 },
                      '&:last-child': { pb: { xs: 1, sm: 2, md: 2.5 } }
                    }}
                  >
                    <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                        sx={{
                          fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.1rem' },
                          lineHeight: 1.2,
                          fontWeight: 600
                        }}
                      >
                        {site.appConfig.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          height: { xs: '40px', sm: '44px', md: '48px' },
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: { xs: 2, sm: 2, md: 2 },
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.2,
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                          wordBreak: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {truncateDescription(
                          site.appConfig?.seo?.home?.description || '',
                          isMobile
                        )}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <CardActions
                    sx={{
                      p: { xs: 0.75, sm: 1.5, md: 2 },
                      pt: 0,
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: { xs: 0.25, sm: 1 }
                    }}
                  >
                    <Stack
                      spacing={{ xs: 0.5, sm: 1, md: 1.5 }}
                      direction={{ xs: 'column', sm: 'row' }}
                      sx={{
                        width: '100%',
                        alignItems: { xs: 'stretch', sm: 'center' }
                      }}
                    >
                      {site.nft && (
                        <Button
                          variant="contained"
                          href={`/asset/${site.nft.networkId}/${site.nft.address
                            }/${Number(site.nft.tokenId)}`}
                          size="small"
                          sx={{
                            minHeight: { xs: '28px', sm: '32px', md: '36px' },
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                            textTransform: 'none',
                            fontWeight: 600,
                            px: { xs: 0.75, sm: 1.5, md: 2 }
                          }}
                        >
                          <FormattedMessage
                            id={'buy.app'}
                            defaultMessage={'Buy App'}
                          />
                        </Button>
                      )}
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
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                            py: { xs: 0.5, sm: 0.75, md: 1 },
                            px: { xs: 0.75, sm: 1.25, md: 1.5 },
                            borderRadius: 1,
                            minHeight: { xs: '28px', sm: '32px', md: '36px' }
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
              </Box>
            ))}
            {sitesQuery?.isError && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Card
                  sx={{
                    p: isMobile ? 3 : 4,
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.error.main}`
                  }}
                >
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    color="error"
                    sx={{ mb: 2 }}
                  >
                    <FormattedMessage
                      id="error.loading.sites"
                      defaultMessage="Error loading sites"
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    <FormattedMessage
                      id="error.loading.sites.description"
                      defaultMessage="There was an error loading the sites. Please try refreshing the page."
                    />
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => window.location.reload()}
                    size="small"
                  >
                    <FormattedMessage
                      id="refresh.page"
                      defaultMessage="Refresh Page"
                    />
                  </Button>
                </Card>
              </Box>
            )}

            {!sitesQuery?.isLoading && !sitesQuery?.isError && filteredAndSortedSites.length === 0 && (
              <Box sx={{ gridColumn: '1 / -1' }}>
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
              </Box>
            )}
            {sitesQuery?.isLoading && (
              <SiteCardSkeleton count={isMobile ? 2 : isTablet ? 3 : 6} />
            )}
          </Box>
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

  try {
    const sitesResponse = await getSites({
      take: 50,
      skip: 0
    });

    const data = sitesResponse.data.map((resp) => {
      try {
        const config = JSON.parse(resp.config) as Partial<AppConfig>;
        return {
          ...resp,
          appConfig: {
            name: config.name || 'Unknown Site',
            description: (config as any).description || null,
            logo: config.logo || null,
            theme: config.theme || 'default',
            domain: config.domain || '',
            email: config.email || '',
            currency: config.currency || 'USD',
            pages: config.pages || {},
            ...(config.menuTree && { menuTree: config.menuTree }),
            ...(config.menuSettings && { menuSettings: config.menuSettings }),
            ...(config.searchbar && { searchbar: config.searchbar }),
            ...(config.analytics && { analytics: config.analytics }),
            ...(config.commerce && { commerce: config.commerce }),
          } as AppConfig,
        };
      } catch (error) {
        console.error('Error parsing config for site:', resp.id, error);
        return {
          ...resp,
          appConfig: {
            name: 'Unknown Site',
            description: null,
            logo: null,
            theme: 'default',
            domain: '',
            email: '',
            currency: 'USD',
            pages: {},
          } as AppConfig,
        };
      }
    });

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
  } catch (error) {
    console.error('Error fetching sites:', error);

    await queryClient.prefetchQuery(
      [QUERY_WHITELABEL_SITES_QUERY],
      async () => [],
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60,
    };
  }
};

export default SiteIndexPage;