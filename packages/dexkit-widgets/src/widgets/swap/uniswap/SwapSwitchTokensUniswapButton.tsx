import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { IconButton, IconButtonProps } from "@mui/material";

export interface SwapSwitchTokensButtonProps {
  IconButtonProps: IconButtonProps;
}

export default function SwapSwitchTokensUniswapButton({
  IconButtonProps,
}: SwapSwitchTokensButtonProps) {
  return (
    <IconButton
      {...IconButtonProps}
      sx={(theme) => ({
        borderRadius: (theme.shape.borderRadius as any) / 2,
        backgroundColor: "background.paper",
        borderWidth: 4,
        borderStyle: "solid",
        borderColor: theme.palette.background.default,
        "&:hover": {
          backgroundColor: theme.darken(theme.palette.background.paper, 0.15),
        },
        fontSize: "1rem",
      })}
    >
      <ArrowDownwardIcon fontSize="inherit" />
    </IconButton>
  );
}
