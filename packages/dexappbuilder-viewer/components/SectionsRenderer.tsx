import type { AppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  ButtonBase,
  Divider,
  Paper,
  Portal,
  Stack,
  SvgIconTypeMap,
  Tab,
  Tabs,
  Typography,
  useTheme
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { PageSectionsLayout } from "@dexkit/ui/modules/wizard/types/config";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React, { createContext, useCallback, useContext, useState } from "react";
import { SECTIONS_TYPE_DATA_ICONS } from "../constants/section";
import { SectionRender } from "./SectionRender";

interface PreviewPlatformContextType {
  previewPlatform?: 'mobile' | 'desktop';
  isMobile: boolean;
  editable?: boolean;
  onLayoutChange?: (layouts: any) => void;
}

const PreviewPlatformContext = createContext<PreviewPlatformContextType | null>(null);

export const usePreviewPlatform = () => {
  const context = useContext(PreviewPlatformContext);
  return context;
};

export interface BottomNavActionProps {
  label: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
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
        width: "100%",
        height: "100%",
        backgroundColor: (theme: any) =>
          active ? theme.alpha(theme.palette.primary.main, 0.05) : undefined,
      }}
    >
      <Stack alignItems="center" spacing={1}>
        {/* {Icon && (
          <Icon fontSize="small" color={active ? 'primary' : undefined} />
        )} */}
        <Typography
          fontWeight={active ? "bold" : "400"}
          variant="caption"
          color={active ? "primary.light" : "inherit"}
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
  previewPlatform?: 'mobile' | 'desktop';
  editable?: boolean;
  onLayoutChange?: (layouts: any) => void;
}

export function SectionsRenderer({ sections, layout, previewPlatform, editable, onLayoutChange }: Props) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = previewPlatform ? previewPlatform === 'mobile' : isMobileDevice;
  const [tab, setTab] = useState("tab-0");

  const sectionsToRender = sections.map((section, key) => {
    if (isMobile && section?.hideMobile) {
      return null;
    }

    if (!isMobile && section?.hideDesktop) {
      return null;
    }

    return (
      <div key={key}>
        <SectionRender section={section} useLazy={key > 2} />
      </div>
    );
  });

  const renderMobileTabs = () => {
    if (layout?.type === "tabs") {
      if (layout.layout?.mobile.position === "top") {
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
                section.name ? section.name : section.title ? section.title : ""
              }
              value={`tab-${index}`}
            />
          );
        });
      }
    }
  };

  const renderDesktopTabs = () => {
    if (layout?.type === "tabs") {
      if (
        layout.layout?.desktop?.position === "top" ||
        layout.layout?.desktop?.position === "side"
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
                section.name ? section.name : section.title ? section.title : ""
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
              section.name ? section.name : section.title ? section.title : ""
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

  if (layout?.type === "tabs") {
    if (isMobile && layout.layout?.mobile.position === "bottom") {
      return (
        <PreviewPlatformContext.Provider value={{ previewPlatform, isMobile, editable, onLayoutChange }}>
          <TabContext value={tab}>
            {renderPanels()}
            <Portal container={document.body}>
              <Paper
                variant="elevation"
                sx={{
                  overflowX: sections.length > 3 ? "auto" : undefined,
                  position: "sticky",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: (theme) => theme.zIndex.appBar + 1,
                }}
                elevation={3}
              >
                <Stack
                  sx={{
                    overflowX: "auto",
                  }}
                  divider={
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
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
        </PreviewPlatformContext.Provider>
      );
    }

    return (
      <PreviewPlatformContext.Provider value={{ previewPlatform, isMobile, editable, onLayoutChange }}>
        <TabContext value={tab}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: layout.layout?.desktop?.position === "side" ? 'row' : 'column' },
                gap: 2
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', sm: !isMobile && layout.layout?.desktop?.position === "side" ? '25%' : '100%' }
                }}
              >
                <Tabs
                  centered
                  variant={isMobile ? "scrollable" : undefined}
                  allowScrollButtonsMobile
                  orientation={
                    isMobile
                      ? "horizontal"
                      : layout.layout?.desktop?.position === "side"
                        ? "vertical"
                        : "horizontal"
                  }
                  onChange={(e, value: string) => {
                    setTab(value);
                  }}
                  value={tab}
                >
                  {isMobile ? renderMobileTabs() : renderDesktopTabs()}
                </Tabs>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', sm: !isMobile && layout.layout?.desktop?.position === "side" ? '75%' : '100%' }
                }}
              >
                {renderPanels()}
              </Box>
            </Box>
          </Box>
        </TabContext>
      </PreviewPlatformContext.Provider>
    );
  }

  return (
    <PreviewPlatformContext.Provider value={{ previewPlatform, isMobile, editable, onLayoutChange }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
          width: '100%',
          minHeight: '100%',
          '& > div': {
            width: '100%'
          }
        }}
      >
        {sectionsToRender}
      </Box>
    </PreviewPlatformContext.Provider>
  );
}
