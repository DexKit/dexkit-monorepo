import type { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  Grid,
  Paper,
  Portal,
  Stack,
  SvgIconTypeMap,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { PageSectionsLayout } from '@dexkit/ui/modules/wizard/types/config';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import React, { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import { SectionRender } from '../section-config/SectionRender';
import { SECTIONS_TYPE_DATA_ICONS } from '../section-config/Sections';

export interface BottomNavActionProps {
  label: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
}

function BottomNavAction({
  label,
  onClick,
  active,
  Icon,
}: BottomNavActionProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onClick}
      TouchRippleProps={{ style: { color: theme.palette.primary.light } }}
      sx={{
        p: 2,
        width: '100%',
        height: '100%',
        backgroundColor: (theme) =>
          active ? alpha(theme.palette.primary.main, 0.05) : undefined,
      }}
    >
      <Stack alignItems="center" spacing={1}>
        {/* {Icon && (
          <Icon fontSize="small" color={active ? 'primary' : undefined} />
        )} */}
        <Typography
          fontWeight={active ? 'bold' : '400'}
          variant="caption"
          color={active ? 'primary.light' : 'inherit'}
        >
          {label}
        </Typography>
      </Stack>
    </ButtonBase>
  );
}

interface Props {
  sections: AppPageSection[];
  layout?: PageSectionsLayout;
}

export function SectionsRenderer({ sections, layout }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState('tab-0');

  const sectionsToRender = sections.map((section, key) => {
    if (isMobile && section?.hideMobile) {
      return null;
    }

    if (!isMobile && section?.hideDesktop) {
      return null;
    }

    return (
      <ErrorBoundary
        key={key}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h6">
              <FormattedMessage
                id="something.went.wrong.with.section.type.contact.support"
                defaultMessage="Oops, something went wrong with section type {sectionType}. Contact support"
                description="Something went wrong error message"
                values={{
                  sectionType: section?.type || ' ',
                }}
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {String(error)}
            </Typography>
            <Button color="primary" onClick={resetErrorBoundary}>
              <FormattedMessage
                id="try.again"
                defaultMessage="Try again"
                description="Try again"
              />
            </Button>
          </Stack>
        )}
      >
        <SectionRender section={section} useLazy={key > 2} />
      </ErrorBoundary>
    );
  });

  const renderMobileTabs = () => {
    if (layout?.type === 'tabs') {
      if (layout.layout?.mobile.position === 'top') {
        return sections.map((section, index) => {
          if (isMobile && section.hideMobile) {
            return null;
          }

          if (!isMobile && section.hideDesktop) {
            return null;
          }

          return (
            <Tab
              key={index}
              label={
                section.name ? section.name : section.title ? section.title : ''
              }
              value={`tab-${index}`}
            />
          );
        });
      }
    }
  };

  const renderDesktopTabs = () => {
    if (layout?.type === 'tabs') {
      if (
        layout.layout?.desktop.position === 'top' ||
        layout.layout?.desktop.position === 'side'
      ) {
        return sections.map((section, index) => {
          if (isMobile && section?.hideMobile) {
            return null;
          }

          if (!isMobile && section?.hideDesktop) {
            return null;
          }

          return (
            <Tab
              key={index}
              label={
                section.name ? section.name : section.title ? section.title : ''
              }
              value={`tab-${index}`}
            />
          );
        });
      }
    }
  };

  const handleSelectTab = useCallback((tab: string) => {
    return () => {
      setTab(tab);
    };
  }, []);

  const renderBottomNavigationActions = () => {
    return sections.map((section, index, arr) => {
      if (isMobile && section?.hideMobile) {
        return null;
      }

      if (!isMobile && section?.hideDesktop) {
        return null;
      }

      return (
        <Box
          key={index}
          sx={{
            minWidth: theme.spacing(18),
            flex: arr.length <= 3 ? 1 : undefined,
          }}
        >
          <BottomNavAction
            label={
              section.name ? section.name : section.title ? section.title : ''
            }
            Icon={SECTIONS_TYPE_DATA_ICONS[section.type]}
            active={tab === `tab-${index}`}
            onClick={handleSelectTab(`tab-${index}`)}
          />
        </Box>
      );
    });
  };

  const renderPanels = () => {
    return sections.map((section, index) => {
      if (isMobile && section?.hideMobile) {
        return null;
      }

      if (!isMobile && section?.hideDesktop) {
        return null;
      }

      return (
        <TabPanel key={index} sx={{ p: 0 }} value={`tab-${index}`}>
          <SectionRender section={section} useLazy={index > 2} />
        </TabPanel>
      );
    });
  };

  if (layout?.type === 'tabs') {
    if (isMobile && layout.layout?.mobile.position === 'bottom') {
      return (
        <TabContext value={tab}>
          {renderPanels()}
          <Portal container={document.body}>
            <Paper
              variant="elevation"
              sx={{
                overflowX: sections.length > 3 ? 'auto' : undefined,
                position: 'sticky',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: (theme) => theme.zIndex.appBar + 1,
              }}
              elevation={3}
            >
              <Stack
                sx={{
                  overflowX: 'auto',
                }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? theme.palette.grey[800]
                          : undefined,
                    }}
                  />
                }
                direction="row"
              >
                {renderBottomNavigationActions()}
              </Stack>
            </Paper>
          </Portal>
        </TabContext>
      );
    }

    return (
      <TabContext value={tab}>
        <Box>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={
                !isMobile && layout.layout?.desktop.position === 'side' ? 3 : 12
              }
            >
              <Tabs
                centered
                variant={isMobile ? 'scrollable' : undefined}
                allowScrollButtonsMobile
                orientation={
                  isMobile
                    ? 'horizontal'
                    : layout.layout?.desktop.position === 'side'
                    ? 'vertical'
                    : 'horizontal'
                }
                onChange={(e, value: string) => {
                  setTab(value);
                }}
                value={tab}
              >
                {isMobile ? renderMobileTabs() : renderDesktopTabs()}
              </Tabs>
            </Grid>
            <Grid
              item
              xs={12}
              sm={
                !isMobile && layout.layout?.desktop.position === 'side' ? 9 : 12
              }
            >
              {renderPanels()}
            </Grid>
          </Grid>
        </Box>
      </TabContext>
    );
  }

  return <>{sectionsToRender}</>;
}
