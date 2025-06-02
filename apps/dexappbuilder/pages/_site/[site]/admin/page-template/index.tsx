import MarketplacesTableSkeleton from '@/modules/admin/components/tables/MaketplacesTableSkeleton';
import PageTemplatesTable from '@/modules/admin/components/tables/PageTemplatesTable';
import { useDebounce } from '@dexkit/core/hooks';
import Link from '@dexkit/ui/components/AppLink';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { DEXKIT_DISCORD_SUPPORT_CHANNEL, WIZARD_DOCS_URL } from 'src/constants';
import { usePageTemplatesByOwnerQuery } from 'src/hooks/whitelabel';

import { getAppConfig } from 'src/services/app';

export const PageTemplateIndexPage: NextPage = () => {
  const { account } = useWeb3React();

  const configsQuery = usePageTemplatesByOwnerQuery({
    owner: account?.toLowerCase(),
  });

  const [search, setSearch] = useState('');

  const lazySearch = useDebounce<string>(search, 500);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleHrefDiscord = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={DEXKIT_DISCORD_SUPPORT_CHANNEL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  const handleHrefDocs = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={WIZARD_DOCS_URL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  const configs = useMemo(() => {
    if (configsQuery.data && configsQuery.data.length > 0) {
      if (lazySearch) {
        return configsQuery.data.filter(
          (c) => c.title.toLowerCase().search(lazySearch.toLowerCase()) > -1,
        );
      }

      return configsQuery.data;
    }

    return [];
  }, [configsQuery.data, lazySearch]);

  const renderTable = () => {
    if (configsQuery.isLoading) {
      return <MarketplacesTableSkeleton />;
    }

    if (configs && configs.length > 0) {
      return (
        <TableContainer>
          <PageTemplatesTable pageTemplates={configs} />
        </TableContainer>
      );
    }

    return (
      <Box py={4}>
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          spacing={2}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            <Typography variant="h5">
              <FormattedMessage
                id="no.page.templates"
                defaultMessage="No page templates"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="create.template.pages"
                defaultMessage="Create template pages"
              />
            </Typography>
          </Stack>
          <Button
            LinkComponent={Link}
            href="/admin/page-template/create"
            startIcon={<Add />}
            variant="outlined"
          >
            <FormattedMessage id="new" defaultMessage="New" />
          </Button>
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
                      id="page.template"
                      defaultMessage=" Page Template"
                    />
                  ),
                  uri: '/admin/page-template',
                  active: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Alert severity="info">
              <FormattedMessage
                id="wizard.welcome.index.message"
                defaultMessage="Welcome to DexKit Marketplace wizard! This is a beta product with constant development and at the moment is offered for free. 
              If you need support please reach us on our <a>dedicated Discord channel</a>. Please check our <d>docs</d> for whitelabels. Reach us at our email <b>info@dexkit.com</b> if you need a custom solution that the wizard not attend."
                values={{
                  //@ts-ignore
                  a: handleHrefDiscord,
                  //@ts-ignore
                  d: handleHrefDocs,
                  //@ts-ignore
                  b: (chunks) => <b>{chunks} </b>,
                }}
              />
            </Alert>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                href="/admin/page-template/create"
                LinkComponent={Link}
                variant="contained"
                color="primary"
              >
                <FormattedMessage id="new" defaultMessage="New" />
              </Button>
              <TextField
                value={search}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {renderTable()}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

(PageTemplateIndexPage as any).getLayout = function getLayout(page: any) {
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

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
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

export default PageTemplateIndexPage;
