import { MarkdownRenderer } from '@dexkit/ui/components';
import * as Icons from '@mui/icons-material';
import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import type { TabsConfig } from '../../types/tabs';

interface TabsSectionProps {
  settings: TabsConfig;
  className?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  orientation?: 'horizontal' | 'vertical';
  contentFontSize?: number;
  contentFontColor?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  orientation = 'horizontal',
  contentFontSize = 16,
  contentFontColor,
  ...other
}: any) => {
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
            fontSize: `${contentFontSize}px`,
            margin: '0 !important',
            padding: '0 !important',
            minHeight: 'auto !important',
            height: 'auto !important',
            ...(contentFontColor && { color: contentFontColor }),
            ...(orientation === 'vertical' && {
              height: '100%',
              overflow: 'auto',
            }),
          }}
        >
          {typeof children === 'string' ? (
            <MarkdownRenderer
              content={children}
              sx={{
                fontSize: `${contentFontSize}px`,
                margin: '0 !important',
                padding: '0 !important',
                minHeight: 'auto !important',
                height: 'auto !important',
                ...(contentFontColor && { color: contentFontColor }),
              }}
            />
          ) : (
            children
          )}
        </Box>
      )}
    </div>
  );
};

const TabsSection: React.FC<TabsSectionProps> = ({ settings, className }: any) => {

  const {
    tabs = [],
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
    borderRadius,
    elevation = 0,
    padding,
    backgroundColor,
    tabFontSize = 14,
    contentFontSize = 16,
    tabFontColor,
    contentFontColor,
    indicatorCustomColor,
    sx,
    tabsProps,
  } = settings;

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const a11yProps = useCallback((index: number) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }), []);

  const renderTabIcon = (iconName?: string) => {
    if (!iconName) return undefined;
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType;
    return IconComponent ? <IconComponent /> : undefined;
  };

  const renderTabLabel = (label: string, wrapped?: boolean) => {
    return wrapped ? (
      <Typography variant="caption" component="div" sx={{
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: 1.5,
        display: 'block',
        width: '100%',
        overflow: 'visible',
        textOverflow: 'unset',
      }}>
        {label}
      </Typography>
    ) : (
      <Box component="span" sx={{
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: 1.5,
        display: 'block',
        width: '100%',
        overflow: 'visible',
        textOverflow: 'unset',
        fontFamily: 'inherit',
        fontSize: 'inherit',
      }}>
        {label}
      </Box>
    );
  };

  const containerSx = {
    width: fullWidth ? '100%' : 'auto',
    ...(backgroundColor && { backgroundColor }),
    ...(orientation === 'vertical' && {
      flexGrow: 1,
      display: 'flex',
      minHeight: 0,
      overflow: 'visible',
      width: '100%',
      maxWidth: '100%',
    }),
    ...sx,
  };

  const content = (
    <>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        orientation={orientation}
        variant={fullWidth ? 'fullWidth' : variant}
        indicatorColor={indicatorCustomColor ? 'primary' : indicatorColor}
        textColor={textColor}
        centered={centered}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        scrollButtons={scrollButtons}
        selectionFollowsFocus={selectionFollowsFocus}
        visibleScrollbar={visibleScrollbar}
        aria-label="tabs navigation"
        sx={{
          borderBottom: orientation === 'horizontal' ? 1 : 0,
          borderRight: orientation === 'vertical' ? 1 : 0,
          borderColor: 'divider',
          minHeight: 'auto !important',
          margin: '0 !important',
          padding: '0 !important',
          '&.MuiTabs-root': {
            minHeight: '0 !important',
            margin: '0 !important',
            padding: '0 !important',
          },
          '&.css-1mlc39t-MuiTabs-root': {
            minHeight: '0 !important',
            margin: '0 !important',
            padding: '0 !important',
          },
          '& .MuiTabs-flexContainer': {
            minHeight: 'auto !important',
            margin: '0 !important',
            padding: '0 !important',
          },
          '& .MuiTabs-indicator': {
            ...(indicatorCustomColor && {
              backgroundColor: indicatorCustomColor,
            }),
            ...(orientation === 'vertical' && { display: 'none' }),
          },
          '& .MuiTab-root': {
            fontSize: `${tabFontSize}px`,
            minHeight: '36px !important',
            paddingTop: '12px !important',
            paddingBottom: '8px !important',
            paddingLeft: '16px !important',
            paddingRight: '16px !important',
            margin: '0 !important',
            ...(tabFontColor && { color: tabFontColor }),
          },
          ...(orientation === 'vertical' && {
            minWidth: 350,
            maxWidth: 500,
            width: '100%',
            height: 'fit-content',
            '& .MuiTabs-flexContainer': {
              alignItems: 'stretch',
              height: 'fit-content',
              flexDirection: 'column',
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              maxHeight: 'none',
              height: 'fit-content',
              minHeight: 60,
              padding: '16px 24px',
              justifyContent: 'flex-start',
              textAlign: 'left',
              fontSize: `${tabFontSize + 3}px`,
              fontWeight: 500,
              alignItems: 'flex-start',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflow: 'visible',
              lineHeight: 1.5,
              width: '100%',
              maxWidth: '100%',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              ...(tabFontColor && { color: tabFontColor }),
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
              '&.Mui-selected': {
                fontWeight: 700,
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderRight: '4px solid',
                borderRightColor: indicatorCustomColor || 'primary.main',
                ...(tabFontColor && { color: tabFontColor }),
              },
            },
          }),
          ...(borderRadius && { borderRadius }),
          ...(padding && { padding }),
          mb: 0,
        }}
        {...tabsProps}
      >
        {tabs.map((tab: any, index: any) => {
          const icon = renderTabIcon(tab.icon);
          const label = renderTabLabel(tab.label, tab.wrapped);

          return (
            <Tab
              key={tab.id}
              label={label}
              icon={icon}
              iconPosition={orientation === 'vertical' ? 'start' : (tab.iconPosition || 'top')}
              disabled={tab.disabled || false}
              wrapped={tab.wrapped || false}
              value={index}
              sx={{
                textTransform: 'none',
                minHeight: 36,
                fontSize: `${tabFontSize}px`,
                paddingTop: '12px',
                paddingBottom: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                margin: '0 !important',
                ...(tabFontColor && { color: tabFontColor }),
                ...(orientation === 'vertical' && {
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                  fontSize: `${tabFontSize + 3}px`,
                  fontWeight: 500,
                  minHeight: 60,
                  maxHeight: 'none',
                  height: 'fit-content',
                  padding: '16px 24px',
                  width: '100%',
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflow: 'visible',
                  lineHeight: 1.5,
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  ...(tabFontColor && { color: tabFontColor }),
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                  '& .MuiTab-iconWrapper': {
                    marginBottom: 0,
                    marginRight: 3,
                    fontSize: '1.3em',
                    alignSelf: 'flex-start',
                    marginTop: '3px',
                    flexShrink: 0,
                  },
                  '&.Mui-selected': {
                    fontWeight: 700,
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    borderRight: '4px solid',
                    borderRightColor: indicatorCustomColor || 'primary.main',
                    color: 'primary.main',
                    ...(tabFontColor && { color: tabFontColor }),
                  },
                }),
                '&.Mui-selected': {
                  fontWeight: 600,
                  ...(tabFontColor && { color: tabFontColor }),
                },
                ...tab.sx,
              }}
              {...a11yProps(index)}
              {...tab.tabProps}
            />
          );
        })}
      </Tabs>

      <Box
        className="tabs-panels-override"
        sx={{
          ...(orientation === 'vertical' && {
            flexGrow: 1,
            ml: 2,
            width: '100%',
            overflow: 'visible',
          }),
          ...(orientation === 'horizontal' && {
            mt: 0,
            width: '100%',
          }),
          margin: '0 !important',
          padding: '0 !important',
          minHeight: 'auto !important',
          height: 'auto !important',
          '&.MuiBox-root': {
            padding: '0 !important',
            margin: '0 !important',
            minHeight: '0 !important',
          },
          '&.css-vdn3ib': {
            padding: '0 !important',
            margin: '0 !important',
            minHeight: '0 !important',
          },
        }}
      >
        {tabs.map((tab: any, index: any) => (
          <TabPanel
            key={tab.id}
            value={activeTab}
            index={index}
            orientation={orientation}
            contentFontSize={contentFontSize}
            contentFontColor={contentFontColor}
          >
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    </>
  );

  if (elevation > 0) {
    return (
      <Container
        maxWidth="lg"
        className="tabs-container-override"
        sx={{
          py: '0 !important',
          px: '0 !important',
          m: '0 !important',
          minHeight: '0 !important',
          height: 'fit-content !important',
          '&.MuiContainer-root': {
            padding: '0 !important',
            margin: '0 !important',
            minHeight: '0 !important',
          },
          '&.MuiContainer-maxWidthLg': {
            padding: '0 !important',
            margin: '0 !important',
            minHeight: '0 !important',
          },
          '&.css-noy6zj-MuiContainer-root': {
            padding: '0 !important',
            margin: '0 !important',
            minHeight: '0 !important',
          },
        }}
      >
        <Paper
          elevation={elevation}
          className={`${className} tabs-paper-override`}
          sx={{
            ...containerSx,
            minHeight: '0 !important',
            height: 'fit-content !important',
            margin: '0 !important',
            padding: '0 !important',
            '&.MuiPaper-root': {
              padding: '0 !important',
              margin: '0 !important',
              minHeight: '0 !important',
            },
            '&.MuiPaper-outlined': {
              padding: '0 !important',
              margin: '0 !important',
              minHeight: '0 !important',
            },
            '&.MuiPaper-rounded': {
              padding: '0 !important',
              margin: '0 !important',
              minHeight: '0 !important',
            },
            '&.css-485lta-MuiPaper-root': {
              padding: '0 !important',
              margin: '0 !important',
              minHeight: '0 !important',
            },
            ...(orientation === 'vertical' && {
              display: 'flex',
            }),
          }}
        >
          {content}
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      className="tabs-container-override"
      sx={{
        py: '0 !important',
        px: '0 !important',
        m: '0 !important',
        minHeight: '0 !important',
        height: 'fit-content !important',
        '&.MuiContainer-root': {
          padding: '0 !important',
          margin: '0 !important',
          minHeight: '0 !important',
        },
        '&.MuiContainer-maxWidthLg': {
          padding: '0 !important',
          margin: '0 !important',
          minHeight: '0 !important',
        },
        '&.css-noy6zj-MuiContainer-root': {
          padding: '0 !important',
          margin: '0 !important',
          minHeight: '0 !important',
        },
      }}
    >
      <Box
        className={`${className} tabs-box-override`}
        sx={{
          ...containerSx,
          minHeight: '0 !important',
          height: 'fit-content !important',
          margin: '0 !important',
          padding: '0 !important',
          '&.MuiBox-root': {
            padding: '0 !important',
            margin: '0 !important',
            minHeight: '0 !important',
          },
          '&.css-vdn3ib': {
            padding: '0 !important',
            margin: '0 !important',
            minHeight: '0 !important',
          },
          ...(orientation === 'vertical' && {
            display: 'flex',
          }),
        }}
      >
        {content}
      </Box>
    </Container>
  );
};

export default TabsSection; 