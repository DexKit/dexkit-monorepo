import { truncateAddress } from '@dexkit/core/utils/blockchain';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { memo } from 'react';

interface Props {
  recipient: string;
  amountPercentage: number;
  onRemove?: (index: number) => void;
  index: number;
}

export function FeesSectionItem({
  index,
  onRemove,
  amountPercentage,
  recipient,
}: Props) {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <Paper sx={{ px: 2, py: 1 }}>
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        alignContent="center"
        justifyContent="space-between"
      >
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          alignContent="center"
        >
          <Typography variant="body1">{amountPercentage}%</Typography>
          <Typography variant="body1">{truncateAddress(recipient)}</Typography>
        </Stack>
        <IconButton size="small" onClick={handleRemove}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}

export default memo(FeesSectionItem);
