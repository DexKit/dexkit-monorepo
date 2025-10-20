export interface AccordionAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  startIcon?: string;
  endIcon?: string;
  disabled?: boolean;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  expanded?: boolean;
  disabled?: boolean;
  actions?: AccordionAction[];
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  contentVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  ariaControls?: string;
  ariaExpanded?: boolean;
  sx?: any;
  summaryProps?: any;
  detailsProps?: any;
  expandIcon?: string;
  collapseIcon?: string;
}

export interface AccordionSettings {
  variant?: 'elevation' | 'outlined';
  square?: boolean;
  disableGutters?: boolean; 
  defaultExpanded?: string[];
  expandedIds?: string[];
  allowMultiple?: boolean;
  unmountOnExit?: boolean;
  headingComponent?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  transitionDuration?: number | 'auto';
  transitionEasing?: string;
  spacing?: number;
  fullWidth?: boolean;
  elevation?: number;
  borderRadius?: number;
  sx?: any;
  actionsPlacement?: 'summary' | 'details' | 'both';
  actionsAlignment?: 'left' | 'center' | 'right';
  defaultExpandIcon?: string;
  defaultCollapseIcon?: string;
  iconPosition?: 'start' | 'end';
  hideExpandIcon?: boolean;
  defaultTitleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  defaultContentVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  disableRipple?: boolean;
  focusRipple?: boolean;
  className?: string;
  onChange?: (accordionId: string, expanded: boolean) => void;
}

export interface MultiAccordionConfig {
  accordions: AccordionItem[];
  settings: AccordionSettings;
}

export interface AccordionPageSection {
  type: 'accordion';
  settings: MultiAccordionConfig;
  name?: string;
}

export const defaultAccordionSettings: AccordionSettings = {
  variant: 'elevation',
  square: false,
  disableGutters: false,
  allowMultiple: false,
  unmountOnExit: false,
  headingComponent: 'h3',
  transitionDuration: 'auto',
  spacing: 1,
  fullWidth: true,
  elevation: 1,
  borderRadius: 4,
  actionsPlacement: 'details',
  actionsAlignment: 'left',
  defaultExpandIcon: 'ExpandMore',
  iconPosition: 'end',
  hideExpandIcon: false,
  defaultTitleVariant: 'h6',
  defaultContentVariant: 'body1',
  disableRipple: false,
  focusRipple: true,
  defaultExpanded: [],
};

export const defaultAccordionItem: Omit<AccordionItem, 'id'> = {
  title: '',
  content: '',
  summary: '',
  expanded: false,
  disabled: false,
  actions: [],
  titleVariant: 'h6',
  contentVariant: 'body1',
  expandIcon: 'ExpandMore',
}; 