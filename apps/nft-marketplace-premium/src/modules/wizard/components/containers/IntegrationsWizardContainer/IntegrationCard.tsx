import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import React, { Suspense } from 'react';

export interface IntegrationCardProps {
  children: React.ReactNode;
  title: React.ReactNode;
  active?: boolean;
  onActivate: (active: boolean) => void;
}

export default function IntegrationCard({
  children,
  active,
  onActivate,
  title,
}: IntegrationCardProps) {
  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          <Switch checked={active} onClick={() => onActivate(!active)} />
        </Stack>
      </Box>
      {active && (
        <Collapse in>
          <Divider />
          <CardContent>
            <Suspense
              fallback={
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  direction="row"
                  sx={{ py: 2 }}
                >
                  <CircularProgress color="primary" size="2rem" />
                </Stack>
              }
            >
              {children}
            </Suspense>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}
