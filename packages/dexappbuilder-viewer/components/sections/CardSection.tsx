import Card from '@dexkit/dexappbuilder-viewer/components/Card';
import { CardPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box } from '@mui/material';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { usePreviewPlatform } from '../SectionsRenderer';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Props {
  section: CardPageSection;
}

export default function CardSection({ section }: Props) {
  const previewContext = usePreviewPlatform();
  const editable = previewContext?.editable || false;
  const onLayoutChange = previewContext?.onLayoutChange;

  if (!section?.settings || !section.settings.cards || section.settings.cards.length === 0) {
    return null;
  }

  const { cards, gridSettings, responsive } = section.settings;

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
      static: !editable,
      isDraggable: editable,
      isResizable: editable,
    }));

    if (responsive) {
      return Object.keys(responsive.cols).reduce((acc, breakpoint) => {
        acc[breakpoint] = layout;
        return acc;
      }, {} as any);
    }

    return { lg: layout };
  }, [cards, editable, responsive]);

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
        py: 2,
        '& .react-grid-item': {
          transition: editable ? 'all 200ms ease' : 'none',
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
        isDraggable={editable}
        isResizable={editable}
        onLayoutChange={editable ? onLayoutChange : undefined}
      >
        {cards.map(card => {
          return (
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
                }}
              />
            </Box>
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
}
