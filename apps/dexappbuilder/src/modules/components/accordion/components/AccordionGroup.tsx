import { Box, Stack } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { MultiAccordionConfig } from '../types/accordion';
import Accordion from './Accordion';

interface AccordionGroupProps {
  config: MultiAccordionConfig;
  onChange?: (config: MultiAccordionConfig) => void;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  config,
  onChange,
}) => {
  const { accordions, settings } = config;
  const {
    defaultExpanded = [],
    allowMultiple = false,
    spacing = 1,
    fullWidth = true,
  } = settings;

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(settings.expandedIds || defaultExpanded);
  });

  const controlledExpandedIds = useMemo(() => {
    if (settings.expandedIds) {
      return new Set(settings.expandedIds);
    }
    return null;
  }, [settings.expandedIds]);

  const isControlled = controlledExpandedIds !== null;
  const currentExpandedIds = isControlled ? controlledExpandedIds : expandedIds;

  const handleAccordionChange = useCallback(
    (accordionId: string, expanded: boolean) => {
      const newExpandedIds = new Set(currentExpandedIds);

      if (expanded) {
        if (!allowMultiple) {
          newExpandedIds.clear();
        }
        newExpandedIds.add(accordionId);
      } else {
        newExpandedIds.delete(accordionId);
      }

      if (!isControlled) {
        setExpandedIds(newExpandedIds);
      }

      if (onChange) {
        const updatedConfig = {
          ...config,
          settings: {
            ...settings,
            expandedIds: Array.from(newExpandedIds),
          },
        };
        onChange(updatedConfig);
      }

      if (settings.onChange) {
        settings.onChange(accordionId, expanded);
      }
    },
    [allowMultiple, currentExpandedIds, isControlled, config, settings, onChange]
  );

  if (!accordions.length) {
    return null;
  }

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : 'auto',
        ...settings.sx,
      }}
      className={settings.className}
    >
      <Stack spacing={spacing}>
        {accordions.map((accordion, index) => (
          <Accordion
            key={accordion.id}
            accordion={accordion}
            settings={settings}
            expanded={currentExpandedIds.has(accordion.id)}
            onChange={(expanded) => handleAccordionChange(accordion.id, expanded)}
            index={index}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default AccordionGroup; 