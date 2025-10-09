import { Tab, TabProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ComponentType } from "react";

export const TradeWidgetTabAlt: ComponentType<TabProps> = styled(Tab)<TabProps>(({ theme }) => {
  return {
    "&.Mui-selected": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.lighten(theme.palette.background.paper, 0.2)
          : theme.darken(theme.palette.background.paper, 0.1),
      color: theme.palette.mode === "dark"
        ? theme.palette.text.primary
        : theme.palette.text.primary,
      fontWeight: 600,
    },
    "&:not(.Mui-selected)": {
      color: theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
      fontWeight: 500,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
  };
});

export default TradeWidgetTabAlt;
