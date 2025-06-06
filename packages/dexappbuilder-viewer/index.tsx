//export * from './components/Render';

import MainLayout from "@dexkit/ui/components/layouts/main";
import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import { SectionRender } from "./components/SectionRenderWithPlugin";
import { WidgetProvider } from "./components/WidgetProvider";
import { useWhitelabelConfigQuery } from "./hooks";

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
    const toRender = (
      JSON.parse(configResponse.data.config) as AppConfig
    ).pages[page || "home"].sections
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
  config,
  widgetId,
  onConnectWallet,
  provider,
}: {
  config: AppConfig;
  onConnectWallet?: () => void;
  provider: any;
  widgetId?: number;
}) {
  const toRender = config.pages["widget"].sections.map((section, k) => (
    <SectionRender key={k} section={section} />
  ));
  return (
    <WidgetProvider
      widgetId={widgetId}
      appConfig={config}
      onConnectWallet={onConnectWallet}
      provider={provider}
    >
      {toRender}
    </WidgetProvider>
  );
}
