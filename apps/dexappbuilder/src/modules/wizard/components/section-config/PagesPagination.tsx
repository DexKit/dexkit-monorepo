import { useIsMobile } from '@dexkit/core';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  IconButton,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
const PAGE_SIZES = [5, 10, 25, 50];

function shouldDisableNextButton(
  totalItems: number,
  pageSize: number,
  currentPage: number
): boolean {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / pageSize) - 1;

  // Check if the current page is the last page
  return currentPage >= totalPages;
}

export interface PagesPaginationProps {
  pageSize: number;
  page: number;
  count: number;
  from: number;
  pageCount: number;
  to: number;
  onChange: (pageSize: number) => void;
  onChangePage: (page: number) => void;
}

export default function PagesPagination({
  pageSize,
  page,
  count,
  pageCount,
  from,
  to,
  onChange,
  onChangePage,
}: PagesPaginationProps) {
  const isMobile = useIsMobile();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={isMobile ? 0.1 : 0.5}
      justifyContent="flex-start"
      sx={{
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        '& > *': {
          fontSize: isMobile ? '0.75rem' : 'inherit'
        },
        mt: isMobile ? 0.25 : 0.5,
        pl: 0,
        ml: -1
      }}
    >
      <Typography variant={isMobile ? "caption" : "body1"} sx={{ mr: isMobile ? 0.1 : 0.25 }}>
        <FormattedMessage
          id={isMobile ? "rows.per.page.short" : "rows.per.page"}
          defaultMessage={isMobile ? "Rows:" : "Rows per page:"}
        />
      </Typography>
      <Select
        size="small"
        variant="standard"
        value={pageSize}
        input={<Input disableUnderline />}
        onChange={(e: SelectChangeEvent<number>) =>
          onChange(e.target.value as number)
        }
        sx={{
          minWidth: isMobile ? 35 : 55,
          mr: isMobile ? 0.25 : 0.5,
          '& .MuiSelect-select': {
            py: isMobile ? 0.1 : 'inherit',
            px: isMobile ? 0.1 : 'inherit'
          }
        }}
      >
        {PAGE_SIZES.map((size, index) => (
          <MenuItem value={size} key={index}>
            {size}
          </MenuItem>
        ))}
      </Select>
      <Typography variant={isMobile ? "caption" : "body2"}>
        {isMobile ? (
          `${from}-${to}/${count}`
        ) : (
          <FormattedMessage
            id="one.of.items"
            defaultMessage="{from} - {to} of {total} pages"
            values={{
              total: count,
              from,
              to,
            }}
          />
        )}
      </Typography>
      <Stack direction="row" spacing={0}>
        <IconButton
          size="small"
          disabled={page === 0}
          onClick={() => onChangePage(page - 1)}
          sx={{ p: isMobile ? 0.1 : 0.25 }}
        >
          <KeyboardArrowLeftIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton
          size="small"
          disabled={shouldDisableNextButton(count, pageSize, page)}
          onClick={() => onChangePage(page + 1)}
          sx={{ p: isMobile ? 0.1 : 0.25 }}
        >
          <KeyboardArrowRightIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Stack>
    </Stack>
  );
}
