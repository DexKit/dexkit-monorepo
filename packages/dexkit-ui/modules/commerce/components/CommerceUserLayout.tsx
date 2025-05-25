import { Grid } from "@mui/material";

import { DexkitApiProvider } from "@dexkit/core/providers";
import { MouseEvent, useState } from "react";
import { myAppsApi } from "../../../constants/api";

export interface CommerceUserLayoutProps {
  children: React.ReactNode;
}

function CommerceUserLayoutComponent({ children }: CommerceUserLayoutProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleToggleNotifications = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </>
  );
}

export default function CommerceUserLayout({
  children,
}: CommerceUserLayoutProps) {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <CommerceUserLayoutComponent children={children} />
    </DexkitApiProvider.Provider>
  );
}
