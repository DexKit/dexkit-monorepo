import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/DeleteOutline";
import Remove from "@mui/icons-material/Remove";
import { Box, IconButton, Stack, Typography } from "@mui/material";

export interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete?: () => void;
}

export default function Counter({
  value,
  onIncrement,
  onDecrement,
  onDelete,
}: CounterProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          px: 0.5,
          py: 0.25,
          borderRadius: (theme) => `${theme.shape.borderRadius}px`,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "inline-block",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton size="small" onClick={onDecrement}>
            {<Remove />}
          </IconButton>
          <Typography variant="body1">{value}</Typography>
          <IconButton size="small" onClick={onIncrement}>
            <Add />
          </IconButton>
        </Stack>
      </Box>
      {value > 0 && onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <Delete />
        </IconButton>
      )}
    </Stack>
  );
}
