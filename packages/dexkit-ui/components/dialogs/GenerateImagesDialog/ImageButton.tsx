import CheckCircle from "@mui/icons-material/CheckCircle";
import MoreVert from "@mui/icons-material/MoreVert";
import { Box, CardActionArea, IconButton, Paper } from "@mui/material";

export interface ImageButtonProps {
  selected?: boolean;
  selectable?: boolean;
  src: string;
  disabled?: boolean;
  onSelect: (url: string) => void;
  onOpenMenu: (url: string, anchorEl: HTMLElement | null) => void;
}

export default function ImageButton({
  selected,
  src,
  onSelect,
  onOpenMenu,
  selectable,
  disabled,
}: ImageButtonProps) {
  const renderContent = () => {
    return (
      <>
        <img
          src={src}
          style={{
            display: "block",
            filter: selected && selectable ? "grayscale(50%)" : undefined,
            width: "100%",
            aspectRatio: "1/1",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            right: (theme) => theme.spacing(1),
            top: (theme) => theme.spacing(1),
            color: (theme) => theme.palette.primary.main,
            filter: "opacity(80%)",
          }}
        >
          {selected && selectable && <CheckCircle />}
          {!selectable && (
            <IconButton
              size="small"
              onClick={(e: any) => onOpenMenu(src, e.currentTarget)}
              sx={{
                backgroundColor: (theme) => theme.palette.common.white,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.common.white,
                },
              }}
            >
              <MoreVert color="primary" />
            </IconButton>
          )}
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Paper
        sx={{
          borderWidth: selected && selectable ? (theme) => 1 : undefined,
          borderColor:
            selected && selectable
              ? (theme) => theme.palette.primary.main
              : undefined,
        }}
      >
        {selectable ? (
          <CardActionArea disabled={disabled} onClick={() => onSelect(src)}>
            {renderContent()}{" "}
          </CardActionArea>
        ) : (
          renderContent()
        )}
      </Paper>
    </Box>
  );
}
