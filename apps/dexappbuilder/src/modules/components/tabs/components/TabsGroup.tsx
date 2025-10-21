import {
  Box,
  Tabs as MuiTabs,
  Paper,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import type { TabsConfig } from '../types/tabs';
import Tab from './Tab';
import TabPanel from './TabPanel';

interface TabsGroupProps {
  config: TabsConfig;
  editable?: boolean;
}

const TabsGroup = ({ config, editable = false }: TabsGroupProps) => {
  const {
    tabs,
    orientation = 'horizontal',
    variant = 'standard',
    indicatorColor = 'primary',
    textColor = 'primary',
    centered = false,
    allowScrollButtonsMobile = false,
    scrollButtons = 'auto',
    selectionFollowsFocus = false,
    visibleScrollbar = false,
    fullWidth = false,
    borderRadius = 4,
    elevation = 0,
    padding = 16,
    backgroundColor,
    className,
    sx,
    tabsProps,
  } = config;

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = useCallback((event: any, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const a11yProps = useCallback((index: number) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }), []);

  const containerSx = {
    width: fullWidth ? '100%' : 'auto',
    ...(backgroundColor && { backgroundColor }),
    ...(orientation === 'vertical' && {
      flexGrow: 1,
      display: 'flex',
      height: 'auto',
    }),
    ...sx,
  };

  const tabsSx = {
    borderBottom: orientation === 'horizontal' ? 1 : 0,
    borderRight: orientation === 'vertical' ? 1 : 0,
    borderColor: 'divider',
    ...(orientation === 'vertical' && {
      minWidth: 160,
    }),
    ...(borderRadius && { borderRadius }),
    ...(padding && { padding }),
  };

  const content = (
    <>
      <MuiTabs
        value={activeTab}
        onChange={handleTabChange}
        orientation={orientation}
        variant={variant}
        indicatorColor={indicatorColor}
        textColor={textColor}
        centered={centered}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        scrollButtons={scrollButtons}
        selectionFollowsFocus={selectionFollowsFocus}
        visibleScrollbar={visibleScrollbar}
        sx={tabsSx}
        {...tabsProps}
      >
        {tabs.map((tab: any, index: any) => (
          <Tab
            key={tab.id}
            config={tab}
            value={index}
            {...a11yProps(index)}
          />
        ))}
      </MuiTabs>

      <Box
        sx={{
          ...(orientation === 'vertical' && {
            flexGrow: 1,
            ml: 1,
          }),
        }}
      >
        {tabs.map((tab: any, index: any) => (
          <TabPanel
            key={tab.id}
            value={activeTab}
            index={index}
            orientation={orientation}
          >
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    </>
  );

  if (elevation > 0) {
    return (
      <Paper
        elevation={elevation}
        className={className}
        sx={{
          ...containerSx,
          ...(orientation === 'vertical' && {
            display: 'flex',
          }),
        }}
      >
        {content}
      </Paper>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        ...containerSx,
        ...(orientation === 'vertical' && {
          display: 'flex',
        }),
      }}
    >
      {content}
    </Box>
  );
};

export default TabsGroup; 