import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAppConfig } from '../../../../src/services/app';

import ProtectedContent from '@/modules/home/components/ProtectedContent';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';

import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import {
  GatedCondition,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { NoSsr } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import AuthMainLayout from 'src/components/layouts/authMain';
import { GlobalDialogs } from 'src/components/layouts/GlobalDialogs';

const EmbedPage: NextPage<{
  site: string;
  page: string;
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  gatedLayout?: GatedPageLayout;
  result: boolean;
  hideLayout: boolean;
  layout?: PageSectionsLayout;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
  slug?: string;
}> = ({
  sections,
  isProtected,
  site,
  page,
  conditions,
  hideLayout,
  gatedLayout,
  layout,
  slug,
}) => {
  if (isProtected) {
    if (hideLayout) {
      return (
        <SessionProvider>
          <AuthProvider>
            <GlobalDialogs />
            <ProtectedContent
              site={site}
              page={page}
              pageLayout={layout}
              isProtected={isProtected}
              conditions={conditions}
              layout={gatedLayout}
              slug={slug}
            />
          </AuthProvider>
        </SessionProvider>
      );
    }

    return (
      <SessionProvider>
        <AuthMainLayout>
          <ProtectedContent
            site={site}
            page={page}
            isProtected={isProtected}
            conditions={conditions}
            layout={gatedLayout}
            pageLayout={layout}
            slug={slug}
          />
        </AuthMainLayout>
      </SessionProvider>
    );
  }

  if (hideLayout) {
    return (
      <NoSsr>
        <GlobalDialogs />
        <SectionsRenderer sections={sections} layout={layout} />
      </NoSsr>
    );
  } else {
    return (
      <MainLayout disablePadding noSsr={true}>
        <SectionsRenderer sections={sections} layout={layout} />
      </MainLayout>
    );
  }
};

type Params = {
  site?: string;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  query,
}: GetServerSidePropsContext<Params>) => {
  const queryClient = new QueryClient();
  const { page, hideLayout } = query;

  const hideM = hideLayout ? String(hideLayout) === 'true' : false;

  const sitePage = page as string;

  const configResponse = await getAppConfig(params?.site, sitePage);
  const { appConfig } = configResponse;
  const homePage = appConfig.pages[sitePage || ''];
  if (!homePage) {
    return {
      redirect: {
        destination: '/404',
        permanent: true,
      },
    };
  }

  if (!homePage) {
    return {
      redirect: {
        destination: '/404',
        permanent: true,
      },
    };
  }

  if (homePage?.gatedConditions && homePage.gatedConditions.length > 0) {
    return {
      props: {
        isProtected: true,
        sections: [],
        result: false,
        conditions: homePage?.gatedConditions,
        gatedLayout: homePage?.gatedPageLayout,
        site: params?.site,
        page: sitePage,
        layout: homePage.layout,
        balances: {},
        partialResults: {},
        ...configResponse,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: homePage.sections,
      layout: homePage.layout,
      page: sitePage,
      hideLayout: hideM,

      ...configResponse,
    },
  };
};

export default EmbedPage;
