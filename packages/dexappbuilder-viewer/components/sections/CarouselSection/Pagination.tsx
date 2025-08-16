import { Stack } from '@mui/material';
import PaginationDot from './PaginationDot';

export interface PaginationProps {
  dots: number;
  index: number;
  onChangeIndex: (index: number) => void;
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

export default function Pagination({
  onChangeIndex,
  index,
  dots,
  pagination,
}: PaginationProps) {

  return (
    <Stack
      spacing={pagination?.spacing || 0.5}
      direction="row"
      alignItems="center"
      justifyContent={
        pagination?.alignment === 'start' ? 'flex-start' :
          pagination?.alignment === 'end' ? 'flex-end' : 'center'
      }
      sx={{
        position: 'absolute',
        [pagination?.position || 'bottom']: pagination?.position === 'left' || pagination?.position === 'right' ? 16 : 16,
        [pagination?.position === 'left' || pagination?.position === 'right' ? 'top' : 'left']:
          pagination?.alignment === 'start' ? 16 :
            pagination?.alignment === 'end' ? 'auto' :
              '50%',
        [pagination?.position === 'left' || pagination?.position === 'right' ? 'top' : 'right']:
          pagination?.alignment === 'end' ? 16 : 'auto',
        transform: pagination?.position === 'left' || pagination?.position === 'right'
          ? 'translateY(-50%)'
          : pagination?.alignment === 'start' || pagination?.alignment === 'end'
            ? 'none'
            : 'translateX(-50%)',
        zIndex: 2,
        '@media (max-width: 600px)': {
          spacing: (pagination?.spacing || 0.5) * 0.5,
        },
        '@media (max-width: 480px)': {
          spacing: (pagination?.spacing || 0.5) * 0.25,
        },
      }}
    >
      {new Array(dots).fill(null).map((_, i: number) => (
        <PaginationDot
          active={index === i}
          onClick={() => onChangeIndex(i)}
          key={i}
          pagination={pagination}
        />
      ))}
    </Stack>
  );
}
