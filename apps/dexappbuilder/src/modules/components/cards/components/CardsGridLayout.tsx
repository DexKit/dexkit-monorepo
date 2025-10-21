import { Box } from '@mui/material';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { MultiCardConfig } from '../types/card';
import Card from './Card';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CardsGridLayoutProps {
  config: MultiCardConfig;
  onLayoutChange?: (layout: any[], allLayouts: any) => void;
  editable?: boolean;
}

export const CardsGridLayout = ({
  config,
  onLayoutChange,
  editable = false,
}: CardsGridLayoutProps) => {
  const { cards, gridSettings, responsive } = config;

  const layouts = React.useMemo(() => {
    const layout = cards.map(card => ({
      i: card.id,
      x: card.layout.x,
      y: card.layout.y,
      w: card.layout.w,
      h: card.layout.h,
      minW: card.layout.minW || 2,
      maxW: card.layout.maxW || 6,
      minH: card.layout.minH || 2,
      maxH: card.layout.maxH || 4,
      static: !editable || card.layout.static || false,
      isDraggable: editable && (card.layout.isDraggable ?? gridSettings.isDraggable),
      isResizable: editable && (card.layout.isResizable ?? gridSettings.isResizable),
    }));

    if (responsive) {
      return Object.keys(responsive.cols).reduce((acc, breakpoint) => {
        acc[breakpoint] = layout;
        return acc;
      }, {} as any);
    }

    return { lg: layout };
  }, [cards, editable, gridSettings, responsive]);

  const breakpoints = responsive?.breakpoints || { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = responsive?.cols || {
    lg: gridSettings.cols,
    md: Math.min(gridSettings.cols, 10),
    sm: Math.min(gridSettings.cols, 6),
    xs: Math.min(gridSettings.cols, 4),
    xxs: Math.min(gridSettings.cols, 2)
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 200,
        '& .react-grid-item': {
          transition: 'all 200ms ease',
          '&.react-grid-item.resizing': {
            transition: 'none',
          },
          '&.react-grid-item.dragging': {
            transition: 'none',
          },
        },
        '& .react-resizable-handle': {
          display: editable ? 'block' : 'none',
        },
      }}
    >
      <ResponsiveGridLayout
        className="cards-grid-layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={gridSettings.rowHeight}
        margin={gridSettings.margin}
        containerPadding={gridSettings.containerPadding}
        compactType={gridSettings.compactType}
        allowOverlap={gridSettings.allowOverlap}
        preventCollision={gridSettings.preventCollision}
        isDraggable={editable && gridSettings.isDraggable}
        isResizable={editable && gridSettings.isResizable}
        onLayoutChange={onLayoutChange}
        draggableCancel=".card-action-button"
      >
        {cards.map(card => (
          <Box
            key={card.id}
            sx={{
              height: '100%',
              cursor: editable ? 'move' : 'default',
            }}
          >
            <Card
              id={card.id}
              title={card.title}
              description={card.description}
              image={card.image}
              imageFile={card.imageFile}
              actions={card.actions?.map(action => ({
                ...action,
                onClick: editable ? undefined : action.onClick,
              }))}
              sx={{
                height: '100%',
                cursor: editable ? 'move' : 'default',
                '& .MuiButton-root': {
                  className: 'card-action-button',
                },
                ...card.sx,
              }}
            />
          </Box>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
}; 