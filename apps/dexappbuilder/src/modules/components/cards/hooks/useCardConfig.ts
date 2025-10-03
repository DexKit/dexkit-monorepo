import { useCallback, useState } from 'react';
import { Layout as GridLayout } from 'react-grid-layout';
import { CardGridItem, MultiCardConfig } from '../types/card';

export function useCardConfig(initialConfig?: Partial<MultiCardConfig>) {
  const [config, setConfig] = useState<MultiCardConfig>({
    cards: [],
    gridSettings: {
      cols: 12,
      rowHeight: 150,
      margin: [10, 10],
      containerPadding: [10, 10],
      compactType: 'vertical',
      allowOverlap: false,
      preventCollision: false,
      isDraggable: true,
      isResizable: true,
    },
    responsive: {
      breakpoints: {
        lg: 1200,
        md: 996,
        sm: 768,
        xs: 480,
        xxs: 0,
      },
      cols: {
        lg: 12,
        md: 10,
        sm: 6,
        xs: 4,
        xxs: 2,
      },
    },
    ...initialConfig,
  });

  const addCard = useCallback((card: Omit<CardGridItem, 'id'>) => {
    const newCard: CardGridItem = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      layout: {
        ...card.layout,
        x: card.layout?.x ?? 0,
        y: card.layout?.y ?? 0,
        w: card.layout?.w ?? 3,
        h: card.layout?.h ?? 2,
      },
    };

    setConfig((prev: any) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));

    return newCard.id;
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<CardGridItem>) => {
    setConfig((prev: any) => ({
      ...prev,
      cards: prev.cards.map((card: any) =>
        card.id === cardId ? { ...card, ...updates } : card
      ),
    }));
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setConfig((prev: any) => ({
      ...prev,
      cards: prev.cards.filter((card: any) => card.id !== cardId),
    }));
  }, []);

  const updateCardLayout = useCallback((cardId: string, layout: CardGridItem['layout']) => {
    setConfig((prev: any) => ({
      ...prev,
      cards: prev.cards.map((card: any) =>
        card.id === cardId ? { ...card, layout } : card
      ),
    }));
  }, []);

  const updateGridSettings = useCallback((updates: Partial<MultiCardConfig['gridSettings']>) => {
    setConfig((prev: any) => ({
      ...prev,
      gridSettings: { ...prev.gridSettings, ...updates },
    }));
  }, []);

  const onLayoutChange = useCallback((layout: GridLayout[]) => {
    setConfig((prev: any) => ({
      ...prev,
      cards: prev.cards.map((card: any) => {
        const layoutItem = layout.find((l: any) => l.i === card.id);
        if (layoutItem) {
          return {
            ...card,
            layout: {
              ...card.layout,
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h,
            },
          };
        }
        return card;
      }),
    }));
  }, []);

  const getGridLayout = useCallback((): GridLayout[] => {
    return config.cards.map((card: any) => ({
      i: card.id,
      x: card.layout.x,
      y: card.layout.y,
      w: card.layout.w,
      h: card.layout.h,
      minW: card.layout.minW,
      maxW: card.layout.maxW,
      minH: card.layout.minH,
      maxH: card.layout.maxH,
      static: card.layout.static || false,
      isDraggable: card.layout.isDraggable ?? config.gridSettings.isDraggable,
      isResizable: card.layout.isResizable ?? config.gridSettings.isResizable,
    }));
  }, [config.cards, config.gridSettings]);

  return {
    config,
    setConfig,
    addCard,
    updateCard,
    removeCard,
    updateCardLayout,
    updateGridSettings,
    onLayoutChange,
    getGridLayout,
  };
} 