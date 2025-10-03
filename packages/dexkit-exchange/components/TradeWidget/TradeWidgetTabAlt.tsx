import { Tab } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TradeWidgetTabAlt = styled(Tab)(({ theme }) => {
  return {
    "&.Mui-selected": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.lighten(theme.palette.background.paper, 0.2)
          : theme.darken(theme.palette.background.paper, 0.1),
    },
  };
});

export default TradeWidgetTabAlt;
