import PageEditor from '@/modules/wizard/components/pageEditor/PageEditor';
import { ThemeMode } from '@dexkit/ui/constants/enum';
import { createTheme, responsiveFontSizes } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import AuthMainLayout from 'src/components/layouts/authMain';
import { useThemeMode } from 'src/hooks/app';
import { getAppConfig } from 'src/services/app';
import { themes } from 'src/theme';

function PageEditorPage() {
  const { mode } = useThemeMode();

  return (
    <PageEditor
      theme={responsiveFontSizes(
        createTheme(
          mode === ThemeMode.light
            ? themes['kittygotchi'].theme.colorSchemes.light
            : themes['kittygotchi'].theme.colorSchemes.dark,
        ),
      )}
    ></PageEditor>
  );
}

(PageEditorPage as any).getLayout = function getLayout(page: any) {
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

export default PageEditorPage;
