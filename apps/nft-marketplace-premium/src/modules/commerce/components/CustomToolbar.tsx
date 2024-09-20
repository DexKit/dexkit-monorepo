import Delete from '@mui/icons-material/Delete';
import { Box, Button } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { FormattedMessage } from 'react-intl';

export interface CustomToolbarProps extends GridToolbarContainerProps {
  onDelete: () => void;
  showDelete: boolean;
}

export default function CustomToolbar({
  onDelete,
  showDelete,
}: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flexGrow: 1 }} />
      {showDelete && (
        <Button
          size="small"
          variant="outlined"
          onClick={onDelete}
          color="error"
          startIcon={<Delete />}
        >
          <FormattedMessage id="delete" defaultMessage="Delete" />
        </Button>
      )}

      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}
