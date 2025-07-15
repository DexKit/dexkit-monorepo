export interface CardAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface CardProps {
  title: string;
  description?: string;
  image?: string;
  actions?: CardAction[];
  sx?: object;
} 