import { Box, NoSsr, Paper } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";

const AppDrawer = dynamic(() => import("../AppDrawer"));

import { useIsMobile } from "@dexkit/core";
import type { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import { isMobile } from "@dexkit/wallet-connectors/utils/userAgent";
import {
  useAppConfig,
  useAppNFT,
  useDrawerIsOpen,
  useThemeMode,
} from "../../hooks";
import { useNavbarVariant } from "../../hooks/useNavbarVariant";
import BottomBar from "../BottomBar";
import { Footer } from "../Footer";
import Navbar from "../Navbar";
import NavbarAlt from "../NavbarAlt";
import { GlobalDialogs } from "./GlobalDialogs";

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  appConfigProps?: AppConfig;
  isPreview?: boolean;
}

const WrapperLayout = ({ children, appConfig, isPreview }: {
  appConfig: AppConfig;
  children?: React.ReactNode | React.ReactNode[];
  isPreview?: boolean;
}): React.ReactElement => {
  const isDrawerOpen = useDrawerIsOpen();
  const isMobileUI = useIsMobile();
  const { isBottom } = useNavbarVariant(appConfig);

  const handleCloseDrawer = () => isDrawerOpen.setIsOpen(false);
  const mobileView = isMobile || isMobileUI;


  if (isBottom && !mobileView) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "72px",
        }}
      >
        {children}
        <BottomBar appConfig={appConfig} isPreview={isPreview} />
      </Box>
    );
  }

  if (appConfig.menuSettings?.layout?.type === "sidebar" && !mobileView) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          minHeight: "100vh",
        }}
      >
        <Paper
          sx={{
            position: "relative",
            minHeight: "100vh",
            zIndex: 1
          }}
          square
          variant="elevation"
        >
          <Box sx={{
            position: "sticky",
            top: 72,
            zIndex: 1
          }}>
            <AppDrawer
              appConfig={appConfig}
              open={isDrawerOpen.isOpen}
              onClose={handleCloseDrawer}
            />
          </Box>
        </Paper>
        <Box
          style={{
            flex: 1,
            margin: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    );
  }
};

const MainLayout = ({
  children,
  noSsr,
  disablePadding,
  appConfigProps,
  isPreview,
}: Props): React.ReactElement => {
  const isMobileUI = useIsMobile();
  const mobileView = isMobileUI;

  const { mode } = useThemeMode();
  const { setMode } = useColorScheme();

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  const defaultAppConfig = useAppConfig();
  const appNFT = useAppNFT();

  const appConfig = useMemo(() => {
    if (appConfigProps) {
      return appConfigProps;
    } else {
      return defaultAppConfig;
    }
  }, [defaultAppConfig, appConfigProps]);

  const { isBottom } = useNavbarVariant(appConfig);

  // useEffect(() => {
  //   setMode(mode);
  // }, [mode, setMode]);

  const isDrawerOpen = useDrawerIsOpen();

  const handleCloseDrawer = () => isDrawerOpen.setIsOpen(false);



  const render = () => (
    // Temporalmente deshabilitado ErrorBoundary debido a problemas de tipo
    <div>
      {isDrawerOpen.isOpen && (
        <AppDrawer
          open={isDrawerOpen.isOpen}
          onClose={handleCloseDrawer}
          appConfig={appConfig}
        />
      )}

      {!mobileView && appConfig.menuSettings?.layout?.type === "navbar" && appConfig.menuSettings?.layout?.variant === "alt" && <NavbarAlt appConfig={appConfig} isPreview={isPreview} />}
      {!mobileView && appConfig.menuSettings?.layout?.type === "navbar" && appConfig.menuSettings?.layout?.variant !== "alt" && <Navbar appConfig={appConfig} isPreview={isPreview} />}
      {!mobileView && !appConfig.menuSettings?.layout?.type && <Navbar appConfig={appConfig} isPreview={isPreview} />}

      <WrapperLayout appConfig={appConfig} isPreview={isPreview}>
        {mobileView && appConfig.menuSettings?.layout?.type === "navbar" && appConfig.menuSettings?.layout?.variant !== "alt" && <Navbar appConfig={appConfig} isPreview={isPreview} />}
        {mobileView && !appConfig.menuSettings?.layout?.type && <Navbar appConfig={appConfig} isPreview={isPreview} />}
        <Box sx={{ flex: 1 }} py={disablePadding ? 0 : 4}>
          <GlobalDialogs />
          <div>
            {children}
          </div>
        </Box>

        {!isBottom && (
          <Box
            className="preview-footer"
            sx={{
              position: "relative",
              zIndex: 10
            }}
          >
            <Footer appConfig={appConfig} isPreview={isPreview} appNFT={appNFT} />
          </Box>
        )}
      </WrapperLayout>
    </div>
  );

  if (noSsr) {
    return <NoSsr>{render()}</NoSsr>;
  }

  return render();
};

export default MainLayout;
