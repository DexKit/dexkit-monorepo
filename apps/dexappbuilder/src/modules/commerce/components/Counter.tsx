import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Remove from '@mui/icons-material/Remove';
import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useMemo } from 'react';

export interface CounterProps {
  onAction: ({ amount }: { amount: number; action: string }) => void;
  amount: number;
  limit: number;
}

export default function Counter({ onAction, amount, limit }: CounterProps) {
  const handleChange = (e: SelectChangeEvent<number>) => {
    onAction({ action: 'set', amount: e.target.value as number });
  };

  const selectOptions = useMemo(() => {
    return new Array(limit).fill(null);
  }, [limit]);

  return (
    <Stack spacing={0.5} direction="row" alignItems="center">
      <IconButton
        disabled={amount + 1 > limit}
        onClick={() => onAction({ action: 'add', amount: 1 })}
      >
        <Add />
      </IconButton>
      <Select variant="standard" value={amount} onChange={handleChange}>
        {selectOptions.map((_, index) => (
          <MenuItem key={index + 1} value={index + 1}>
            {index + 1}
          </MenuItem>
        ))}
      </Select>
      <IconButton onClick={() => onAction({ action: 'remove', amount: 1 })}>
        {amount - 1 === 0 ? <Delete /> : <Remove />}
      </IconButton>
    </Stack>
  );
}
