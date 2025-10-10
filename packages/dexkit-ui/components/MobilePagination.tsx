import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export interface MobilePaginationProps {
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  pageSizeOptions?: number[];
}

export default function MobilePagination({
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25],
}: MobilePaginationProps) {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [inputPage, setInputPage] = useState<string>('');

  const totalPages = Math.ceil(totalRows / pageSize);
  const currentPage = page + 1; // DataGrid usa índice basado en 0
  const fromRow = page * pageSize + 1;
  const toRow = Math.min((page + 1) * pageSize, totalRows);

  const handleFirstPage = () => {
    onPageChange(0);
  };

  const handleLastPage = () => {
    onPageChange(totalPages - 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber - 1);
      setInputPage('');
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    if (!isNaN(newPageSize) && pageSizeOptions.includes(newPageSize)) {
      onPageSizeChange(newPageSize);
      // Ajustar página si es necesario
      const newTotalPages = Math.ceil(totalRows / newPageSize);
      if (page >= newTotalPages) {
        onPageChange(Math.max(0, newTotalPages - 1));
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        p: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.divider}`,
        width: '100%',
      }}
    >
      {/* Información de registros */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage
            id="pagination.showing"
            defaultMessage="Showing {from}-{to} of {total}"
            values={{
              from: fromRow,
              to: toRow,
              total: totalRows,
            }}
          />
        </Typography>

        {/* Selector de items por página */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              id="pagination.items.per.page"
              defaultMessage="Items"
            />
            :
          </Typography>
          <TextField
            select
            size="small"
            value={pageSize}
            onChange={handlePageSizeChange}
            SelectProps={{
              native: true,
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: theme.typography.caption.fontSize,
                minHeight: theme.spacing(4),
              },
              '& .MuiSelect-select': {
                py: theme.spacing(0.5),
                px: theme.spacing(1),
              },
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        </Stack>
      </Stack>

      {/* Controles de navegación */}
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        {/* Botón primera página */}
        <IconButton
          onClick={handleFirstPage}
          disabled={page === 0}
          aria-label={formatMessage({
            id: 'pagination.first.page',
            defaultMessage: 'First page',
          })}
          sx={{
            minWidth: theme.spacing(5.5),
            minHeight: theme.spacing(5.5),
            touchAction: 'manipulation',
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <FirstPage />
        </IconButton>

        {/* Botón página anterior */}
        <IconButton
          onClick={handlePreviousPage}
          disabled={page === 0}
          aria-label={formatMessage({
            id: 'pagination.previous.page',
            defaultMessage: 'Previous page',
          })}
          sx={{
            minWidth: theme.spacing(5.5),
            minHeight: theme.spacing(5.5),
            touchAction: 'manipulation',
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Input para saltar a página */}
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{
            px: theme.spacing(1),
          }}
        >
          <TextField
            size="small"
            type="number"
            value={inputPage}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
            onBlur={handleGoToPage}
            placeholder={String(currentPage)}
            inputProps={{
              min: 1,
              max: totalPages,
              'aria-label': formatMessage({
                id: 'pagination.go.to.page',
                defaultMessage: 'Go to page',
              }),
              style: {
                textAlign: 'center',
              },
            }}
            sx={{
              width: theme.spacing(8),
              '& .MuiInputBase-root': {
                fontSize: theme.typography.body2.fontSize,
                minHeight: theme.spacing(5.5),
                touchAction: 'manipulation',
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
              {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            / {totalPages}
          </Typography>
        </Stack>

        {/* Botón página siguiente */}
        <IconButton
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
          aria-label={formatMessage({
            id: 'pagination.next.page',
            defaultMessage: 'Next page',
          })}
          sx={{
            minWidth: theme.spacing(5.5),
            minHeight: theme.spacing(5.5),
            touchAction: 'manipulation',
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <ChevronRight />
        </IconButton>

        {/* Botón última página */}
        <IconButton
          onClick={handleLastPage}
          disabled={page >= totalPages - 1}
          aria-label={formatMessage({
            id: 'pagination.last.page',
            defaultMessage: 'Last page',
          })}
          sx={{
            minWidth: theme.spacing(5.5),
            minHeight: theme.spacing(5.5),
            touchAction: 'manipulation',
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <LastPage />
        </IconButton>
      </Stack>

      {/* Indicador de página actual (más visible) */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        <FormattedMessage
          id="pagination.page.of"
          defaultMessage="Page {current} of {total}"
          values={{
            current: currentPage,
            total: totalPages,
          }}
        />
      </Typography>
    </Box>
  );
}

