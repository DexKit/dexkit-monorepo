import { Box } from '@mui/material';

export interface PaginationDotProps {
  active: boolean;
  onClick: () => void;
  pagination?: {
    show?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    alignment?: 'start' | 'center' | 'end';
    size?: 'small' | 'medium' | 'large';
    spacing?: number;
    activeColor?: string;
    inactiveColor?: string;
    activeSize?: number;
    inactiveSize?: number;
    activeOpacity?: number;
    inactiveOpacity?: number;
    showNumbers?: boolean;
    showProgress?: boolean;
    customStyle?: 'dots' | 'bars' | 'lines' | 'circles' | 'squares';
    animation?: 'fade' | 'scale' | 'slide' | 'bounce' | 'none';
  };
}

export default function PaginationDot({ active, onClick, pagination }: PaginationDotProps) {

  const getDotStyle = () => {
    const sizeMultiplier = pagination?.size === 'small' ? 0.8 : pagination?.size === 'large' ? 1.4 : 1.0;
    const activeSize = (pagination?.activeSize || 8) * sizeMultiplier;
    const inactiveSize = (pagination?.inactiveSize || 6) * sizeMultiplier;
    const size = active ? activeSize : inactiveSize;
    const color = active
      ? pagination?.activeColor || '#1976d2'
      : pagination?.inactiveColor || '#757575';
    const opacity = active
      ? pagination?.activeOpacity || 1
      : pagination?.inactiveOpacity || 0.5;

    const baseStyle = {
      cursor: 'pointer',
      transition: pagination?.animation && pagination.animation !== 'none' ? 'none' : 'all 0.3s ease',
      opacity,
      '@media (max-width: 600px)': {
        transform: 'scale(0.8)',
      },
    };

    switch (pagination?.customStyle) {
      case 'bars':
        return {
          ...baseStyle,
          width: size * 2,
          height: size,
          backgroundColor: color,
          borderRadius: size / 4,
        };
      case 'lines':
        return {
          ...baseStyle,
          width: size * 3,
          height: size / 2,
          backgroundColor: color,
          borderRadius: size / 4,
        };
      case 'circles':
        return {
          ...baseStyle,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: '50%',
          border: `2px solid ${color}`,
        };
      case 'squares':
        return {
          ...baseStyle,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: 0,
        };
      case 'dots':
      default:
        return {
          ...baseStyle,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: '50%',
        };
    }
  };

  const getAnimation = () => {
    if (!pagination?.animation || pagination.animation === 'none') return {};

    const animationDuration = '0.3s';

    switch (pagination.animation) {
      case 'fade':
        return {
          animation: active ? 'fadeIn' : 'fadeOut',
          animationDuration,
          animationFillMode: 'forwards',
        };
      case 'scale':
        return {
          animation: active ? 'scaleIn' : 'scaleOut',
          animationDuration,
          animationFillMode: 'forwards',
        };
      case 'slide':
        return {
          animation: active ? 'slideIn' : 'slideOut',
          animationDuration,
          animationFillMode: 'forwards',
        };
      case 'bounce':
        return {
          animation: active ? 'bounceIn' : 'bounceOut',
          animationDuration,
          animationFillMode: 'forwards',
        };
      default:
        return {};
    }
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        ...getDotStyle(),
        ...getAnimation(),
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        '@keyframes fadeOut': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
        '@keyframes scaleIn': {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1.2)' },
        },
        '@keyframes scaleOut': {
          '0%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(0.8)' },
        },
        '@keyframes slideIn': {
          '0%': { transform: 'translateX(-20px) scale(0.8)' },
          '100%': { transform: 'translateX(0) scale(1)' },
        },
        '@keyframes slideOut': {
          '0%': { transform: 'translateX(0) scale(1)' },
          '100%': { transform: 'translateX(-20px) scale(0.8)' },
        },
        '@keyframes bounceIn': {
          '0%': { transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        '@keyframes bounceOut': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.8)' },
        },
      }}
    />
  );
}
