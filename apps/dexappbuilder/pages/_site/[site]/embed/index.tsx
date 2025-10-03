import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAppConfig } from '../../../../src/services/app';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';

import ProtectedContent from '@dexkit/dexappbuilder-viewer/components/ProtectedContent';
import { PoweredByDexKit } from '@dexkit/ui/components/PoweredByDexKit';
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
  hide_powered_by: boolean;
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
  hide_powered_by,
  slug,
}: {
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  gatedLayout?: GatedPageLayout;
  layout?: PageSectionsLayout;
  result: boolean;
  site: string;
  page: string;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
  slug?: string;
  hideLayout: boolean;
  hide_powered_by: boolean;
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
            {!hide_powered_by && <PoweredByDexKit />}
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
        {!hide_powered_by && <PoweredByDexKit />}
      </NoSsr>
    );
  } else {
    return (
      <MainLayout disablePadding noSsr={true} isPreview={false}>
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
  const { page, hideLayout, sectionIndex } = query;

  const hideM = hideLayout ? String(hideLayout) === 'true' : false;

  const sitePage = page as string;

  const configResponse = await getAppConfig(params?.site, sitePage);

  const { appConfig } = configResponse;
  const homePage = appConfig.pages[sitePage || ''];

  const sections = sectionIndex
    ? [homePage.sections[Number(sectionIndex)]]
    : homePage.sections;

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
        hide_powered_by: appConfig.hide_powered_by || null,
        ...configResponse,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: sections,
      layout: homePage.layout || null,
      page: sitePage,
      hideLayout: hideM,
      hide_powered_by: appConfig.hide_powered_by || null,

      ...configResponse,
    },
  };
};

export default EmbedPage;
