import { Box, Typography } from '@mui/material';
import React from 'react';
import type { TabPanelProps } from '../types/tabs';

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  orientation = 'horizontal',
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            ...(orientation === 'vertical' && {
              height: '100%',
              overflow: 'auto',
            }),
          }}
        >
          {typeof children === 'string' ? (
            <Typography component="div">{children}</Typography>
          ) : (
            children
          )}
        </Box>
      )}
    </div>
  );
};

export default TabPanel; 