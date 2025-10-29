//export * from './components/Render';

import MainLayout from "@dexkit/ui/components/layouts/main";
import { PoweredByDexKit } from "@dexkit/ui/components/PoweredByDexKit";
import { useWidgetConfigQuery } from "@dexkit/ui/modules/wizard/hooks/widget";
import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { SectionRender } from "./components/SectionRenderWithPlugin";

import { WidgetProvider } from "./components/WidgetProvider";
import { useWhitelabelConfigQuery } from "./hooks";

export { default as MediaPlugin } from "./components/page-editor/plugins/MediaPlugin";

interface Props {
  slug: string;
  section?: string;
  page?: string;
  withLayout?: boolean;
}
/**
 * Renders DexAppBuilder sections from slug, filtering from section and page
 * @param param0
 * @returns
 */
export function RenderDexAppBuilder({
  slug,
  page,
  withLayout,
  section,
}: Props) {
  const configResponse = useWhitelabelConfigQuery({ slug, page });

  if (configResponse.data) {
    const appConfig = JSON.parse(configResponse.data.config) as AppConfig;



    const toRender = appConfig.pages[page || "home"].sections
      .filter((s) => (section ? section === s.type : true))
      .map((section, k) => <SectionRender key={k} section={section} />);

    return withLayout ? (
      <MainLayout>
        <>{toRender}</>
      </MainLayout>
    ) : (
      <>{toRender}</>
    );
  }

  return <></>;
}
/**
 * Renders DexAppBuilder sections from config, filtering from page
 * @param param0
 * @returns
 */
export function RenderDexAppBuilderFromConfig({
  config,
  page,
  withLayout,
}: {
  config: AppConfig;
  page?: string;
  withLayout?: boolean;
}) {


  const toRender = config.pages[page || "home"].sections.map((section, k) => (
    <SectionRender key={k} section={section} />
  ));
  return withLayout ? (
    <MainLayout>
      <>{toRender}</>
    </MainLayout>
  ) : (
    <>{toRender}</>
  );
}

export function RenderDexAppBuilderWidget({
  widgetId,
  apiKey,
  onConnectWallet,
  provider,
}: {
  onConnectWallet?: () => void;
  provider?: any;
  widgetId?: number;
  apiKey?: string; // Optional API key for widget configuration
}) {
  const widgetQuery = useWidgetConfigQuery({ id: widgetId });
  const sections = widgetQuery.data?.configParsed.page.sections;
  const isLoading = widgetQuery.isLoading;
  const hidePoweredBy = widgetQuery.data?.configParsed.hide_powered_by;

  let toRender = sections?.map((section, k) => (
    <SectionRender key={k} section={section} />
  ));
  if (toRender && !hidePoweredBy) {
    toRender.push(<PoweredByDexKit />);
  }

  return (
    <>
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress size={64} />
        </Box>
      )}

      {!isLoading && (
        <WidgetProvider
          apiKey={apiKey}
          widgetId={widgetId}
          appConfig={widgetQuery.data?.configParsed as unknown as AppConfig}
          onConnectWallet={onConnectWallet}
          provider={provider}
        >
          {sections ? toRender : null}
        </WidgetProvider>
      )}
    </>
  );
}
