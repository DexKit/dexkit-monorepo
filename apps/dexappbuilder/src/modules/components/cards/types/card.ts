
export interface CardAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface CardProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  imageFile?: File;
  actions?: CardAction[];
  sx?: object;
}

export interface CardGridItem extends CardProps {
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  };
}

export interface MultiCardConfig {
  cards: CardGridItem[];
  gridSettings: {
    cols: number;
    rowHeight: number;
    margin: [number, number];
    containerPadding: [number, number];
    compactType: 'vertical' | 'horizontal' | null;
    allowOverlap?: boolean;
    preventCollision?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  };
  responsive?: {
    breakpoints: Record<string, number>;
    cols: Record<string, number>;
  };
} 