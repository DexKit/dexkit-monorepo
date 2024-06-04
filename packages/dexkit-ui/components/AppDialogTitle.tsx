import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

interface Props {
  title?: string | React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  onClose?: () => void;
  disableClose?: boolean;
  hideCloseButton?: boolean;
}

export function AppDialogTitle({
  title,
  icon,
  onClose,
  disableClose,
  hideCloseButton,
}: Props) {
  return (
    <DialogTitle
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        display: "flex",
        justifyContent: "space-between",
        px: 3,
        py: 1.5,
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        alignContent="center"
      >
        {icon}
        <Typography variant="inherit">{title}</Typography>
      </Stack>
      {onClose && !hideCloseButton && (
        <IconButton size="small" disabled={disableClose} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}
