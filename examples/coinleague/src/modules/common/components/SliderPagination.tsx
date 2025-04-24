import { Box, Stack } from '@mui/material';
import { useMobile } from '../hooks/misc';
import SliderPaginationDot from './SliderPaginationDot';

interface SliderPaginationProps {
  index: number;
  dots: number;
  onSelectIndex(index: number): void;
}

export const SliderPagination = (props: SliderPaginationProps) => {
  const { dots, index, onSelectIndex } = props;

  const isMobile = useMobile();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={{ sm: 'flex-start', xs: 'center' }}
    >
      {new Array(dots).fill(null).map((_, itemIndex) => (
        <Box
          key={itemIndex}
          onClick={() => {
            onSelectIndex(itemIndex);
          }}
          sx={{
            cursor: 'pointer',
            marginRight: (theme: any) => theme.spacing(1),
            '&:last-child': {
              marginRight: 0,
            },
          }}
        >
          <SliderPaginationDot active={itemIndex === index} />
        </Box>
      ))}
    </Stack>
  );
};

export default SliderPagination;
