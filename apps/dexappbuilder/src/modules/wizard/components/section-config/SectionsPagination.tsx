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

export interface SectionsPaginationProps {
  pageSize: number;
  page: number;
  count: number;
  from: number;
  pageCount: number;
  to: number;
  onChange: (pageSize: number) => void;
  onChangePage: (page: number) => void;
}

export default function SectionsPagination({
  pageSize,
  page,
  count,
  pageCount,
  from,
  to,
  onChange,
  onChangePage,
}: SectionsPaginationProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      justifyContent="flex-end"
    >
      <Typography variant="body1">
        <FormattedMessage id="rows.per.page" defaultMessage="Rows per page:" />
      </Typography>
      <Select
        size="small"
        variant="standard"
        value={pageSize}
        input={<Input disableUnderline />}
        onChange={(e: SelectChangeEvent<number>) =>
          onChange(e.target.value as number)
        }
      >
        {PAGE_SIZES.map((size, index) => (
          <MenuItem value={size} key={index}>
            {size}
          </MenuItem>
        ))}
      </Select>
      <Typography>
        <FormattedMessage
          id="one.of.sections"
          defaultMessage="{from} - {to} of {total} sections"
          values={{
            total: count,
            from,
            to,
          }}
        />
      </Typography>
      <IconButton
        size="small"
        disabled={page === 0}
        onClick={() => onChangePage(page - 1)}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        size="small"
        disabled={shouldDisableNextButton(count, pageSize, page)}
        onClick={() => onChangePage(page + 1)}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </Stack>
  );
}
