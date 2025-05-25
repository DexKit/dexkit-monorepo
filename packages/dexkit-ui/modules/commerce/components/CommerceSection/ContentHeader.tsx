import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

export interface ContentHeaderProps {
  title: React.ReactNode;
  onBack: () => void;
}

export default function ContentHeader({ onBack, title }: ContentHeaderProps) {
  return (
    <Box>
      <Stack alignItems="center" direction="row" spacing={1}>
        <IconButton color="primary" onClick={onBack}>
          <ArrowBack color="inherit" />
        </IconButton>
        <Typography variant="h5">{title}</Typography>
      </Stack>
    </Box>
  );
}
