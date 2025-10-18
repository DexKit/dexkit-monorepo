import * as Icons from '@mui/icons-material';
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Accordion as MuiAccordion,
  Stack,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { AccordionItem, AccordionSettings } from '../types/accordion';

interface StyledAccordionProps {
  customBorderRadius?: number;
  customElevation?: number;
}

const StyledAccordion = styled(MuiAccordion, {
  shouldForwardProp: (prop) => prop !== 'customBorderRadius' && prop !== 'customElevation',
})<StyledAccordionProps>(({ theme, customBorderRadius, customElevation }) => ({
  ...(customBorderRadius !== undefined && {
    borderRadius: `${customBorderRadius}px !important`,
    '&:first-of-type': {
      borderTopLeftRadius: `${customBorderRadius}px !important`,
      borderTopRightRadius: `${customBorderRadius}px !important`,
    },
    '&:last-of-type': {
      borderBottomLeftRadius: `${customBorderRadius}px !important`,
      borderBottomRightRadius: `${customBorderRadius}px !important`,
    },
  }),
  ...(customElevation !== undefined && {
    boxShadow: theme.shadows[Math.min(Math.max(customElevation, 0), 24) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24],
  }),
}));

const StyledAccordionSummary = styled(AccordionSummary, {
  shouldForwardProp: (prop) => prop !== 'iconPosition',
})<{ iconPosition?: 'start' | 'end' }>(({ iconPosition }) => ({
  flexDirection: iconPosition === 'start' ? 'row' : 'row-reverse',
  ...(iconPosition === 'start' && {
    '& .MuiAccordionSummary-expandIconWrapper': {
      marginRight: 8,
      marginLeft: 0,
    },
  }),
}));

interface AccordionProps {
  accordion: AccordionItem;
  settings: AccordionSettings;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
  index?: number;
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;

  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : null;
};

export const Accordion = ({
  accordion,
  settings,
  expanded = false,
  onChange,
  index = 0,
}: AccordionProps) => {
  const {
    id,
    title,
    content,
    summary,
    disabled = false,
    actions = [],
    titleVariant,
    contentVariant,
    ariaControls,
    sx,
    summaryProps,
    detailsProps,
    expandIcon,
  } = accordion;

  const {
    variant = 'elevation',
    square = false,
    disableGutters = false,
    unmountOnExit = false,
    headingComponent = 'h3',
    transitionDuration = 'auto',
    elevation = 1,
    borderRadius,
    defaultExpandIcon = 'ExpandMore',
    iconPosition = 'end',
    hideExpandIcon = false,
    defaultTitleVariant = 'h6',
    defaultContentVariant = 'body1',
    disableRipple = false,
    focusRipple = true,
    actionsPlacement = 'details',
    actionsAlignment = 'left',
    className,
  } = settings;

  const handleChange = (_event: any, isExpanded: boolean) => {
    onChange?.(isExpanded);
  };

  const expandIconComponent = getIconComponent(expandIcon || defaultExpandIcon);

  const renderActions = (placement: 'summary' | 'details') => {
    if (!actions.length || (actionsPlacement !== placement && actionsPlacement !== 'both')) {
      return null;
    }

    return (
      <Stack
        direction="row"
        spacing={1}
        justifyContent={actionsAlignment}
        sx={{ mt: placement === 'details' ? 2 : 0 }}
      >
        {actions.map((action, actionIndex) => {
          const startIcon = getIconComponent(action.startIcon);
          const endIcon = getIconComponent(action.endIcon);

          const handleActionClick = (event: any) => {
            event.stopPropagation();
            if (action.onClick) {
              action.onClick();
            } else if (action.href) {
              window.open(action.href, '_blank');
            }
          };

          return (
            <Button
              key={`${id}-action-${actionIndex}`}
              variant={action.variant || 'text'}
              color={action.color || 'primary'}
              size={action.size || 'medium'}
              disabled={action.disabled}
              startIcon={startIcon}
              endIcon={endIcon}
              onClick={handleActionClick}
              sx={{ minWidth: 'auto' }}
            >
              {action.label}
            </Button>
          );
        })}
      </Stack>
    );
  };

  return (
    <StyledAccordion
      expanded={expanded}
      onChange={handleChange}
      disabled={disabled}
      variant={variant}
      square={square}
      disableGutters={disableGutters}
      customBorderRadius={borderRadius}
      customElevation={elevation}
      className={className}
      TransitionProps={{
        unmountOnExit,
        ...(typeof transitionDuration === 'number' && { timeout: transitionDuration }),
      }}
      sx={sx}
    >
      <StyledAccordionSummary
        expandIcon={!hideExpandIcon ? expandIconComponent : null}
        aria-controls={ariaControls || `${id}-content`}
        id={`${id}-header`}
        iconPosition={iconPosition}
        disableRipple={disableRipple}
        focusRipple={focusRipple}
        {...summaryProps}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant={titleVariant || defaultTitleVariant}
            component="span"
            sx={{ fontWeight: 'medium' }}
          >
            {title}
          </Typography>
          {summary && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {summary}
            </Typography>
          )}
          {renderActions('summary')}
        </Box>
      </StyledAccordionSummary>

      <AccordionDetails {...detailsProps}>
        <Typography
          variant={contentVariant || defaultContentVariant}
          component="div"
          sx={{ whiteSpace: 'pre-wrap' }}
        >
          {content}
        </Typography>
        {renderActions('details')}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default Accordion; 