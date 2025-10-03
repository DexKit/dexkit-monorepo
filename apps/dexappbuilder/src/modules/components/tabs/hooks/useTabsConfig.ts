import { useCallback, useMemo } from 'react';
import type { TabConfig, TabsConfig, TabsFormValues } from '../types/tabs';

interface UseTabsConfigProps {
  initialConfig?: Partial<TabsConfig>;
  onChange?: (config: TabsConfig) => void;
}

interface UseTabsConfigReturn {
  config: TabsConfig;
  formValues: TabsFormValues;
  handleFormSubmit: (values: TabsFormValues) => void;
  updateConfig: (updates: Partial<TabsConfig>) => void;
  addTab: (tab?: Partial<TabConfig>) => void;
  removeTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<TabConfig>) => void;
  reorderTabs: (startIndex: number, endIndex: number) => void;
  resetToDefaults: () => void;
}

const createDefaultTab = (): TabConfig => ({
  id: crypto.randomUUID(),
  label: 'New Tab',
  content: 'Tab content goes here...',
  icon: '',
  iconPosition: 'top',
  disabled: false,
  wrapped: false,
});

const createDefaultConfig = (): TabsConfig => ({
  id: crypto.randomUUID(),
  tabs: [
    createDefaultTab(),
    { ...createDefaultTab(), id: crypto.randomUUID(), label: 'Tab 2', content: 'Second tab content...' },
  ],
  orientation: 'horizontal',
  variant: 'standard',
  indicatorColor: 'primary',
  textColor: 'primary',
  centered: false,
  allowScrollButtonsMobile: false,
  scrollButtons: 'auto',
  selectionFollowsFocus: false,
  visibleScrollbar: false,
  fullWidth: false,
  borderRadius: 4,
  elevation: 0,
  padding: 16,
  backgroundColor: undefined,
  tabFontSize: 14,
  contentFontSize: 16,
  tabFontColor: undefined,
  contentFontColor: undefined,
  indicatorCustomColor: undefined,
  className: undefined,
  sx: undefined,
  tabsProps: undefined,
});

const convertConfigToFormValues = (config: TabsConfig): TabsFormValues => {
  return {
    tabs: config.tabs.map((tab: any) => ({
      label: tab.label,
      content: tab.content,
      icon: tab.icon,
      iconPosition: tab.iconPosition,
      disabled: tab.disabled,
      wrapped: tab.wrapped,
      sx: tab.sx,
      tabProps: tab.tabProps,
      tempId: tab.id,
    })),
    orientation: config.orientation,
    variant: config.variant,
    indicatorColor: config.indicatorColor,
    textColor: config.textColor,
    centered: config.centered,
    allowScrollButtonsMobile: config.allowScrollButtonsMobile,
    scrollButtons: config.scrollButtons,
    selectionFollowsFocus: config.selectionFollowsFocus,
    visibleScrollbar: config.visibleScrollbar,
    fullWidth: config.fullWidth,
    borderRadius: config.borderRadius,
    elevation: config.elevation,
    padding: config.padding,
    backgroundColor: config.backgroundColor,
    tabFontSize: config.tabFontSize,
    contentFontSize: config.contentFontSize,
    tabFontColor: config.tabFontColor,
    contentFontColor: config.contentFontColor,
    indicatorCustomColor: config.indicatorCustomColor,
    className: config.className,
    sx: config.sx,
    tabsProps: config.tabsProps,
  };
};

const convertFormValuesToConfig = (values: TabsFormValues, currentConfig: TabsConfig): TabsConfig => {
  return {
    ...currentConfig,
    tabs: values.tabs.map((tab: any, index: any) => ({
      id: tab.tempId || currentConfig.tabs[index]?.id || crypto.randomUUID(),
      label: tab.label,
      content: tab.content,
      icon: tab.icon,
      iconPosition: tab.iconPosition,
      disabled: tab.disabled,
      wrapped: tab.wrapped,
      sx: tab.sx,
      tabProps: tab.tabProps,
    })),
    orientation: values.orientation,
    variant: values.variant,
    indicatorColor: values.indicatorColor,
    textColor: values.textColor,
    centered: values.centered,
    allowScrollButtonsMobile: values.allowScrollButtonsMobile,
    scrollButtons: values.scrollButtons,
    selectionFollowsFocus: values.selectionFollowsFocus,
    visibleScrollbar: values.visibleScrollbar,
    fullWidth: values.fullWidth,
    borderRadius: values.borderRadius,
    elevation: values.elevation,
    padding: values.padding,
    backgroundColor: values.backgroundColor,
    tabFontSize: values.tabFontSize,
    contentFontSize: values.contentFontSize,
    tabFontColor: values.tabFontColor,
    contentFontColor: values.contentFontColor,
    indicatorCustomColor: values.indicatorCustomColor,
    className: values.className,
    sx: values.sx,
    tabsProps: values.tabsProps,
  };
};

export const useTabsConfig = ({
  initialConfig,
  onChange
}: UseTabsConfigProps = {}): UseTabsConfigReturn => {
  const config = useMemo(() => {
    const defaultConfig = createDefaultConfig();
    if (!initialConfig) return defaultConfig;

    return {
      ...defaultConfig,
      ...initialConfig,
      id: initialConfig.id || defaultConfig.id,
      tabs: initialConfig.tabs?.length ?
        initialConfig.tabs.map((tab: any) => ({
          ...createDefaultTab(),
          ...tab,
          id: tab.id || crypto.randomUUID(),
        })) :
        defaultConfig.tabs,
    };
  }, [initialConfig]);

  const formValues = useMemo(() => convertConfigToFormValues(config), [config]);

  const handleFormSubmit = useCallback((values: TabsFormValues) => {
    const newConfig = convertFormValuesToConfig(values, config);
    onChange?.(newConfig);
  }, [config, onChange]);

  const updateConfig = useCallback((updates: Partial<TabsConfig>) => {
    const newConfig = { ...config, ...updates };
    onChange?.(newConfig);
  }, [config, onChange]);

  const addTab = useCallback((tab?: Partial<TabConfig>) => {
    const newTab = {
      ...createDefaultTab(),
      ...tab,
      id: tab?.id || crypto.randomUUID(),
    };

    const newConfig = {
      ...config,
      tabs: [...config.tabs, newTab],
    };
    onChange?.(newConfig);
  }, [config, onChange]);

  const removeTab = useCallback((tabId: string) => {
    if (config.tabs.length <= 1) return;

    const newConfig = {
      ...config,
      tabs: config.tabs.filter((tab: any) => tab.id !== tabId),
    };
    onChange?.(newConfig);
  }, [config, onChange]);

  const updateTab = useCallback((tabId: string, updates: Partial<TabConfig>) => {
    const newConfig = {
      ...config,
      tabs: config.tabs.map((tab: any) =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      ),
    };
    onChange?.(newConfig);
  }, [config, onChange]);

  const reorderTabs = useCallback((startIndex: number, endIndex: number) => {
    const newTabs = [...config.tabs];
    const [reorderedTab] = newTabs.splice(startIndex, 1);
    newTabs.splice(endIndex, 0, reorderedTab);

    const newConfig = {
      ...config,
      tabs: newTabs,
    };
    onChange?.(newConfig);
  }, [config, onChange]);

  const resetToDefaults = useCallback(() => {
    const defaultConfig = createDefaultConfig();
    onChange?.(defaultConfig);
  }, [onChange]);

  return {
    config,
    formValues,
    handleFormSubmit,
    updateConfig,
    addTab,
    removeTab,
    updateTab,
    reorderTabs,
    resetToDefaults,
  };
}; 