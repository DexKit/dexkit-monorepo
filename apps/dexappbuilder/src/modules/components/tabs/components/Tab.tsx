import * as Icons from '@mui/icons-material';
import { Tab as MuiTab, Typography } from '@mui/material';
import React from 'react';
import type { TabConfig } from '../types/tabs';

interface TabProps {
  config: TabConfig;
  value: number;
}

const Tab = ({ config, value }: TabProps) => {
  const {
    label,
    icon,
    iconPosition = 'top',
    disabled = false,
    wrapped = false,
    sx,
    tabProps,
  } = config;

  const IconComponent = icon && Icons[icon as keyof typeof Icons] as any;

  const renderIcon = IconComponent ? <IconComponent /> : undefined;

  const renderLabel = wrapped ? (
    <Typography variant="caption" component="span">
      {label}
    </Typography>
  ) : label;

  return (
    <MuiTab
      label={renderLabel}
      icon={renderIcon}
      iconPosition={iconPosition}
      disabled={disabled}
      wrapped={wrapped}
      value={value}
      sx={{
        textTransform: 'none',
        minHeight: 48,
        '&.Mui-selected': {
          fontWeight: 600,
        },
        ...sx,
      }}
      {...tabProps}
    />
  );
};

export default Tab; 