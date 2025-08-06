export { default as Tab } from './components/Tab';
export { default as TabPanel } from './components/TabPanel';
export { default as TabsGroup } from './components/TabsGroup';
export { default as TabsForm } from './forms/TabsForm';
export { useTabsConfig } from './hooks/useTabsConfig';

export type {
  MuiTabProps, MuiTabsProps, TabConfig, TabPanelProps, TabsConfig,
  TabsFormValues, TabsIndicatorColor, TabsOrientation, TabsSection, TabsTextColor, TabsVariant
} from './types/tabs';

export {
  tabConfigSchema, tabPanelSchema, tabsConfigSchema,
  tabsFormValuesSchema,
  tabsSectionSchema
} from './schemas/tabs';

export type {
  TabConfigSchema, TabPanelSchema, TabsConfigSchema,
  TabsFormValuesSchema,
  TabsSectionSchema
} from './schemas/tabs';
