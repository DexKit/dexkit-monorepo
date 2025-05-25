import { Box, Drawer, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface ProductListDrawerProps {
  open?: boolean;
  onClose: () => void;
}

export default function ProductListDrawer({
  open,
  onClose,
}: ProductListDrawerProps) {
  return (
    <Drawer
      open={open}
      anchor="right"
      variant="persistent"
      onClose={onClose}
      sx={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        left: 0,
        height: "100%",
        width: "100%",
        "& .MuiDrawer-paper": {
          width: 200,
          position: "absolute",
          transition: "none !important",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">
          <FormattedMessage id="filters" defaultMessage="Filters" />
        </Typography>
      </Box>
    </Drawer>
  );
}
