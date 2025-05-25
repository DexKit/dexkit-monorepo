import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import { ButtonBase, Grid, styled } from "@mui/material";

const CustomImage = styled("img")(({ theme }) => ({
  height: "auto",
  width: "100%",
  objectFit: "cover",
  aspectRatio: "1/1",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[200]}`,

  backgroundColor: theme.palette.background.paper,
}));

export interface ProductImageListProps {
  images: string[];
  onClick: () => void;
}

export default function ProductImageList({
  images,
  onClick,
}: ProductImageListProps) {
  return (
    <Grid container spacing={2}>
      {images.map((img, key) => (
        <Grid xs={3} item key={key}>
          <CustomImage src={img} />
        </Grid>
      ))}
      <Grid item xs={3}>
        <ButtonBase
          onClick={onClick}
          sx={(theme) => ({
            p: 2,
            width: "100%",
            hegiht: "100%",
            aspectRatio: "1/1",
            borderRadius: theme.shape.borderRadius / 2,
            border: `1px solid ${theme.palette.grey[200]}`,

            backgroundColor: theme.palette.background.paper,
          })}
        >
          <ImageSearchIcon />
        </ButtonBase>
      </Grid>
    </Grid>
  );
}
