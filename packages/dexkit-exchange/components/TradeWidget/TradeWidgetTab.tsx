import { Tab, darken, lighten } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TradeWidgetTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  borderRadius: theme.shape.borderRadius,
  "&.Mui-selected": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? lighten(theme.palette.background.default, 0.2)
        : darken(theme.palette.background.default, 0.05),
  },
}));

export default TradeWidgetTab;
