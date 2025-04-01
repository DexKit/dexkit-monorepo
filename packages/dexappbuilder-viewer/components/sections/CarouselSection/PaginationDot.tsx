import { IconButton } from "@mui/material";

export interface PaginationDotProps {
  active?: boolean;
  onClick: () => void;
}

export default function PaginationDot({ active, onClick }: PaginationDotProps) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        "&:focus": {
          backgroundColor: (theme) =>
            active ? theme.palette.primary.main : undefined,
        },
        borderRadius: "50%",
        borderWidth: active ? 1 : undefined,
        borderStyle: active ? "solid" : undefined,
        width: (theme) => theme.spacing(2),
        height: (theme) => theme.spacing(2),
        borderColor: active ? (theme) => theme.palette.common.white : undefined,
        backgroundColor: (theme) =>
          active ? theme.palette.primary.main : theme.palette.primary.light,
      }}
    />
  );
}
