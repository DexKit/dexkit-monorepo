import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from 'next';

import { dehydrate, QueryClient } from '@tanstack/react-query';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';

import ProtectedContent from '@dexkit/dexappbuilder-viewer/components/ProtectedContent';
import { PoweredByDexKit } from '@dexkit/ui/components/PoweredByDexKit';
import { getWidgetConfig } from '@dexkit/ui/modules/wizard/services/widget';
import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import {
  GatedCondition,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { WidgetConfig } from '@dexkit/ui/modules/wizard/types/widget';
import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { NoSsr } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { GlobalDialogs } from 'src/components/layouts/GlobalDialogs';

const WidgetIframePage: NextPage<{
  site: string;
  page: string;
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  gatedLayout?: GatedPageLayout;
  result: boolean;
  layout?: PageSectionsLayout;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
  slug?: string;
  hide_powered_by?: boolean;
}> = ({
  sections,
  isProtected,
  site,
  page,
  conditions,
  gatedLayout,
  layout,
  slug,
  hide_powered_by,
}) => {
  if (isProtected) {
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
    <NoSsr>
      <GlobalDialogs />
      <SectionsRenderer sections={sections} layout={layout} />
      {!hide_powered_by && <PoweredByDexKit />}
    </NoSsr>
  );
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
  const { widgetId } = query;

  const configResponse = await getWidgetConfig({ id: Number(widgetId) });
  const widget = configResponse.data;
  const config = JSON.parse(widget.config) as WidgetConfig;

  const homePage = config.page;

  if (homePage?.gatedConditions && homePage.gatedConditions.length > 0) {
    return {
      props: {
        isProtected: true,
        sections: [],
        result: false,
        conditions: homePage?.gatedConditions,
        gatedLayout: homePage?.gatedPageLayout,
        site: params?.site,
        layout: homePage.layout || null,
        balances: {},
        partialResults: {},
        hide_powered_by: config?.hide_powered_by
          ? config.hide_powered_by
          : false,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: homePage.sections || [],
      layout: homePage.layout || null,
      hide_powered_by: config?.hide_powered_by ? config.hide_powered_by : false,
    },
  };
};

export default WidgetIframePage;
