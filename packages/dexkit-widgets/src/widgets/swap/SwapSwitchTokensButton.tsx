import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { IconButton, IconButtonProps } from "@mui/material";

export interface SwapSwitchTokensButtonProps {
  IconButtonProps: IconButtonProps;
}

export default function SwapSwitchTokensButton({
  IconButtonProps,
}: SwapSwitchTokensButtonProps) {
  return (
    <IconButton
      {...IconButtonProps}
      sx={(theme) => ({
        borderRadius: (theme.shape.borderRadius as any) / 2,
        backgroundColor: "background.paper",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        "&:hover": {
          backgroundColor: theme.darken(theme.palette.background.paper, 0.15),
        },
      })}
    >
      <ArrowDownwardIcon />
    </IconButton>
  );
}
