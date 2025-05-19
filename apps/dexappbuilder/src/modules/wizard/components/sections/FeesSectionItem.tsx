import { truncateAddress } from '@dexkit/core/utils/blockchain';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import { memo } from 'react';

interface Props {
  recipient: string;
  amountPercentage: number;
  onRemove?: (index: number) => void;
  index: number;
  isMobile?: boolean;
}

export function FeesSectionItem({
  index,
  onRemove,
  amountPercentage,
  recipient,
  isMobile,
}: Props) {
  const theme = useTheme();

  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <Paper sx={{ px: isMobile ? theme.spacing(1.5) : theme.spacing(2), py: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}>
      <Stack
        spacing={isMobile ? theme.spacing(1) : theme.spacing(2)}
        direction="row"
        alignItems="center"
        alignContent="center"
        justifyContent="space-between"
      >
        <Stack
          spacing={isMobile ? theme.spacing(0.5) : theme.spacing(1)}
          direction="row"
          alignItems="center"
          alignContent="center"
        >
          <Typography variant={isMobile ? "body2" : "body1"}>
            {amountPercentage}%
          </Typography>
          <Typography variant={isMobile ? "body2" : "body1"} sx={{ wordBreak: 'break-all' }}>
            {truncateAddress(recipient)}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={handleRemove}>
          <CloseIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Stack>
    </Paper>
  );
}

export default memo(FeesSectionItem);
