import { AccordionPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { MarkdownRenderer } from '@dexkit/ui/components';
import * as Icons from '@mui/icons-material';
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Accordion as MuiAccordion,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';

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

interface Props {
  section: AccordionPageSection;
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;

  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : null;
};

export default function AccordionSection({ section }: Props) {
  const { accordions, settings } = section.settings;
  const {
    variant = 'elevation',
    square = false,
    disableGutters = false,
    defaultExpanded = [],
    allowMultiple = false,
    unmountOnExit = false,
    headingComponent = 'h3',
    transitionDuration = 'auto',
    spacing = 1,
    fullWidth = true,
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
    sx,
  } = settings;

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(settings.expandedIds || defaultExpanded);
  });

  const handleAccordionChange = useCallback(
    (accordionId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      const newExpandedIds = new Set(expandedIds);

      if (isExpanded) {
        if (!allowMultiple) {
          newExpandedIds.clear();
        }
        newExpandedIds.add(accordionId);
      } else {
        newExpandedIds.delete(accordionId);
      }

      setExpandedIds(newExpandedIds);

      if (settings.onChange) {
        settings.onChange(accordionId, isExpanded);
      }
    },
    [allowMultiple, expandedIds, settings.onChange]
  );

  const renderActions = (accordion: any, placement: 'summary' | 'details') => {
    if (!accordion.actions?.length || (actionsPlacement !== placement && actionsPlacement !== 'both')) {
      return null;
    }

    return (
      <Stack
        direction="row"
        spacing={1}
        justifyContent={actionsAlignment}
        sx={{ mt: placement === 'details' ? 2 : 0 }}
      >
        {accordion.actions.map((action: any, actionIndex: number) => {
          const startIcon = getIconComponent(action.startIcon);
          const endIcon = getIconComponent(action.endIcon);

          const handleActionClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            if (action.onClick) {
              action.onClick();
            } else if (action.href) {
              window.open(action.href, '_blank');
            }
          };

          return (
            <Button
              key={`${accordion.id}-action-${actionIndex}`}
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

  if (!accordions || accordions.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          width: fullWidth ? '100%' : 'auto',
          ...sx,
        }}
        className={className}
      >
        <Stack spacing={spacing}>
          {accordions.map((accordion, index) => {
            const expandIconComponent = getIconComponent(accordion.expandIcon || defaultExpandIcon);
            const isExpanded = expandedIds.has(accordion.id);

            return (
              <StyledAccordion
                key={accordion.id}
                expanded={isExpanded}
                onChange={handleAccordionChange(accordion.id)}
                disabled={accordion.disabled || false}
                variant={variant}
                square={square}
                disableGutters={disableGutters}
                customBorderRadius={borderRadius}
                customElevation={elevation}
                TransitionProps={{
                  unmountOnExit,
                  ...(typeof transitionDuration === 'number' && { timeout: transitionDuration }),
                }}
                sx={accordion.sx}
              >
                <StyledAccordionSummary
                  expandIcon={!hideExpandIcon ? expandIconComponent : null}
                  aria-controls={accordion.ariaControls || `${accordion.id}-content`}
                  id={`${accordion.id}-header`}
                  iconPosition={iconPosition}
                  disableRipple={disableRipple}
                  focusRipple={focusRipple}
                  {...accordion.summaryProps}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant={accordion.titleVariant || defaultTitleVariant}
                      component="span"
                      sx={{ fontWeight: 'medium' }}
                    >
                      {accordion.title}
                    </Typography>
                    {accordion.summary && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {accordion.summary}
                      </Typography>
                    )}
                    {renderActions(accordion, 'summary')}
                  </Box>
                </StyledAccordionSummary>

                <AccordionDetails {...accordion.detailsProps}>
                  <MarkdownRenderer
                    content={accordion.content}
                    variant={accordion.contentVariant || defaultContentVariant}
                    sx={{ whiteSpace: 'pre-wrap' }}
                  />
                  {renderActions(accordion, 'details')}
                </AccordionDetails>
              </StyledAccordion>
            );
          })}
        </Stack>
      </Box>
    </Container>
  );
} 