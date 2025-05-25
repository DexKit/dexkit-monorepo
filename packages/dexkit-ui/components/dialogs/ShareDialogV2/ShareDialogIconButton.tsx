import { Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

export interface ShareDialogIconButtonProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  onClick: () => void;
}

export default function ShareDialogIconButton({
  icon,
  title,
  onClick,
}: ShareDialogIconButtonProps) {
  return (
    <Stack alignItems="center">
      <Box>
        <IconButton onClick={onClick}>{icon}</IconButton>
      </Box>
      <Typography textAlign="center" variant="caption">
        {title}
      </Typography>
    </Stack>
  );
}
