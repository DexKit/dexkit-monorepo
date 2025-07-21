import type { TabProps as MuiTabProps, TabsProps as MuiTabsProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

export interface TabConfig {
  id: string;
  label: string;
  content: string;
  icon?: string;
  iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  disabled?: boolean;
  wrapped?: boolean;
  sx?: SxProps<Theme>;
  tabProps?: Partial<MuiTabProps>;
}

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsVariant = 'standard' | 'scrollable' | 'fullWidth';
export type TabsIndicatorColor = 'primary' | 'secondary';
export type TabsTextColor = 'primary' | 'secondary' | 'inherit';

export interface TabsConfig {
  id: string;
  tabs: TabConfig[];
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  indicatorColor?: TabsIndicatorColor;
  textColor?: TabsTextColor;
  centered?: boolean;
  allowScrollButtonsMobile?: boolean;
  scrollButtons?: boolean | 'auto';
  selectionFollowsFocus?: boolean;
  visibleScrollbar?: boolean;
  fullWidth?: boolean;
  borderRadius?: number;
  elevation?: number;
  padding?: number;
  backgroundColor?: string;
  tabFontSize?: number;
  contentFontSize?: number;
  tabFontColor?: string;
  contentFontColor?: string;
  indicatorCustomColor?: string;
  className?: string;
  sx?: SxProps<Theme>;
  tabsProps?: Partial<MuiTabsProps>;
}

export interface TabsFormValues {
  tabs: Array<Omit<TabConfig, 'id'> & { tempId?: string }>;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  indicatorColor?: TabsIndicatorColor;
  textColor?: TabsTextColor;
  centered?: boolean;
  allowScrollButtonsMobile?: boolean;
  scrollButtons?: boolean | 'auto';
  selectionFollowsFocus?: boolean;
  visibleScrollbar?: boolean;
  fullWidth?: boolean;
  borderRadius?: number;
  elevation?: number;
  padding?: number;
  backgroundColor?: string;
  tabFontSize?: number;
  contentFontSize?: number;
  tabFontColor?: string;
  contentFontColor?: string;
  indicatorCustomColor?: string;
  className?: string;
  sx?: SxProps<Theme>;
  tabsProps?: Partial<MuiTabsProps>;
}

export interface TabsSection {
  id: string;
  type: 'tabs';
  title: string;
  settings: TabsConfig;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  orientation?: TabsOrientation;
}

export type {
  MuiTabProps, MuiTabsProps
};

