import { useRouter } from 'next/router';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useMemo } from 'react';
import { useAdminWhitelabelConfigQuery } from 'src/hooks/whitelabel';
import { getAppConfig } from 'src/services/app';

import PreviewAuthLayout from 'src/components/layouts/PreviewAuthLayout';

function PreviewPage() {
  const router = useRouter();

  const { slug, page, index, disableLayout } = router.query;

  const { data } = useAdminWhitelabelConfigQuery({ slug: slug as string });

  const appConfig = useMemo(() => {
    if (data?.config) {
      return JSON.parse(data.config) as AppConfig;
    }
  }, [data]);

  const [sections, layout] = useMemo(() => {
    const sectionIndex = parseInt((index as string) ?? '-1');

    if (sectionIndex >= 0) {
      let result = appConfig?.pages[page as string]?.sections[sectionIndex];

      return [
        appConfig && result ? [result] ?? [] : [],
        appConfig?.pages[page as string]?.layout,
      ];
    }
    return [
      appConfig ? appConfig.pages[page as string]?.sections ?? [] : [],
      appConfig?.pages[page as string]?.layout,
    ];
  }, [appConfig, page, index]);

  const disableLayoutFlag = useMemo(() => {
    return Boolean(disableLayout as string);
  }, [disableLayout]);

  return (
    <PreviewAuthLayout noSsr disableLayout={disableLayoutFlag}>
      <SectionsRenderer sections={sections} layout={layout} />
    </PreviewAuthLayout>
  );
}

type Params = {
  site?: string;
  page?: string;
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

export default PreviewPage;
