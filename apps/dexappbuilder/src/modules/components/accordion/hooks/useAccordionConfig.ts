import { useCallback, useState } from 'react';
import { AccordionItem, AccordionSettings, defaultAccordionItem, defaultAccordionSettings, MultiAccordionConfig } from '../types/accordion';

export function useAccordionConfig(initialConfig?: Partial<MultiAccordionConfig>) {
  const [config, setConfig] = useState<MultiAccordionConfig>({
    accordions: [],
    settings: {
      ...defaultAccordionSettings,
      ...initialConfig?.settings,
    },
    ...initialConfig,
  });

  const addAccordion = useCallback((accordion: Omit<AccordionItem, 'id'>) => {
    const newAccordion: AccordionItem = {
      ...defaultAccordionItem,
      ...accordion,
      id: `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setConfig((prev: any) => ({
      ...prev,
      accordions: [...prev.accordions, newAccordion],
    }));

    return newAccordion.id;
  }, []);

  const updateAccordion = useCallback((accordionId: string, updates: Partial<AccordionItem>) => {
    setConfig((prev: any) => ({
      ...prev,
      accordions: prev.accordions.map((accordion: any) =>
        accordion.id === accordionId ? { ...accordion, ...updates } : accordion
      ),
    }));
  }, []);

  const removeAccordion = useCallback((accordionId: string) => {
    setConfig((prev: any) => ({
      ...prev,
      accordions: prev.accordions.filter((accordion: any) => accordion.id !== accordionId),
      settings: {
        ...prev.settings,
        defaultExpanded: prev.settings.defaultExpanded?.filter((id: any) => id !== accordionId),
        expandedIds: prev.settings.expandedIds?.filter((id: any) => id !== accordionId),
      },
    }));
  }, []);

  const moveAccordion = useCallback((fromIndex: number, toIndex: number) => {
    setConfig((prev: any) => {
      const newAccordions = [...prev.accordions];
      const [movedAccordion] = newAccordions.splice(fromIndex, 1);
      newAccordions.splice(toIndex, 0, movedAccordion);

      return {
        ...prev,
        accordions: newAccordions,
      };
    });
  }, []);

  const duplicateAccordion = useCallback((accordionId: string) => {
    const accordion = config.accordions.find((acc: any) => acc.id === accordionId);
    if (!accordion) return null;

    const duplicatedAccordion: AccordionItem = {
      ...accordion,
      id: `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${accordion.title} (Copy)`,
    };

    setConfig((prev: any) => ({
      ...prev,
      accordions: [...prev.accordions, duplicatedAccordion],
    }));

    return duplicatedAccordion.id;
  }, [config.accordions]);

  const updateSettings = useCallback((updates: Partial<AccordionSettings>) => {
    setConfig((prev: any) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const toggleAccordionExpansion = useCallback((accordionId: string) => {
    setConfig((prev: any) => {
      const isExpanded = prev.settings.expandedIds?.includes(accordionId) ||
        prev.settings.defaultExpanded?.includes(accordionId);

      let newExpandedIds: string[];

      if (isExpanded) {
        newExpandedIds = (prev.settings.expandedIds || prev.settings.defaultExpanded || [])
          .filter((id: any) => id !== accordionId);
      } else {
        const currentExpanded = prev.settings.expandedIds || prev.settings.defaultExpanded || [];

        if (prev.settings.allowMultiple) {
          newExpandedIds = [...currentExpanded, accordionId];
        } else {
          newExpandedIds = [accordionId];
        }
      }

      return {
        ...prev,
        settings: {
          ...prev.settings,
          expandedIds: newExpandedIds,
        },
      };
    });
  }, []);

  const setDefaultExpanded = useCallback((accordionIds: string[]) => {
    setConfig((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        defaultExpanded: accordionIds,
      },
    }));
  }, []);

  const resetExpansion = useCallback(() => {
    setConfig((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        expandedIds: [...(prev.settings.defaultExpanded || [])],
      },
    }));
  }, []);

  const clearExpansion = useCallback(() => {
    setConfig((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        expandedIds: [],
      },
    }));
  }, []);

  const expandAll = useCallback(() => {
    if (!config.settings.allowMultiple) {
      console.warn('Cannot expand all accordions when allowMultiple is false');
      return;
    }

    setConfig((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        expandedIds: prev.accordions.map((acc: any) => acc.id),
      },
    }));
  }, [config.settings.allowMultiple]);

  const getExpandedAccordions = useCallback(() => {
    const expandedIds = config.settings.expandedIds || config.settings.defaultExpanded || [];
    return config.accordions.filter((accordion: any) => expandedIds.includes(accordion.id));
  }, [config.accordions, config.settings.expandedIds, config.settings.defaultExpanded]);

  const getAccordionById = useCallback((accordionId: string) => {
    return config.accordions.find((accordion: any) => accordion.id === accordionId);
  }, [config.accordions]);

  const validateConfig = useCallback(() => {
    const errors: string[] = [];

    const ids = config.accordions.map((acc: any) => acc.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      errors.push('Duplicate accordion IDs found');
    }

    if (config.settings.defaultExpanded) {
      const accordionIds = new Set(ids);
      const invalidIds = config.settings.defaultExpanded.filter((id: any) => !accordionIds.has(id));
      if (invalidIds.length > 0) {
        errors.push(`Default expanded IDs not found: ${invalidIds.join(', ')}`);
      }
    }

    if (!config.settings.allowMultiple &&
      config.settings.defaultExpanded &&
      config.settings.defaultExpanded.length > 1) {
      errors.push('Cannot have multiple default expanded accordions when allowMultiple is false');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [config]);

  return {
    config,
    setConfig,
    addAccordion,
    updateAccordion,
    removeAccordion,
    moveAccordion,
    duplicateAccordion,
    getAccordionById,
    updateSettings,
    toggleAccordionExpansion,
    setDefaultExpanded,
    resetExpansion,
    clearExpansion,
    expandAll,
    getExpandedAccordions,
    validateConfig,
  };
} 