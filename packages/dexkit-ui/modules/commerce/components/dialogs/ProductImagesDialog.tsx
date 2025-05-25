import { DeleteOutline } from "@mui/icons-material";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import CheckCircle from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../../../../components";
import useRemoveProductImages from "../../hooks/useRemoveProductImages";

const Image = styled("img")(({ theme }) => ({
  height: "auto",
  width: "100%",
  aspectRatio: "1/1",
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.grey[200]}`,

  backgroundColor: theme.palette.background.paper,
}));

export interface ProductImagesDialogProps {
  open: boolean;
  onClose: () => void;
  images: { imageUrl: string; id: string }[];
  productId?: string;
  onRefetch: () => void;
}

export default function ProductImagesDialog({
  open,
  onClose,
  images,
  productId,
  onRefetch,
}: ProductImagesDialogProps) {
  const [selection, setSelection] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const isSelected = useCallback(
    (id: string) => {
      return selection.includes(id);
    },
    [selection]
  );

  const handleSelect = useCallback(
    (id: string) => {
      return () => {
        if (isSelected(id)) {
          setSelection((prev) => {
            const res = prev.filter((item) => item !== id);

            if (res.length === 0) {
              setIsEdit(false);
            }

            return res;
          });
        } else {
          setSelection((prev) => [...prev, id]);

          if (!isEdit) {
            setIsEdit(true);
          }
        }
      };
    },
    [isEdit, isSelected]
  );

  const { mutateAsync: deleteImages, isLoading: isDeleting } =
    useRemoveProductImages({ productId });

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      await deleteImages({ imageIds: selection });
      enqueueSnackbar(
        <FormattedMessage
          id="images.removed"
          defaultMessage="Images removed"
        />,
        { variant: "success" }
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
    setIsEdit(false);
    onRefetch();
    setSelection([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <AppDialogTitle
        onClose={onClose}
        title={
          <FormattedMessage
            id="product.images"
            defaultMessage="Product images"
          />
        }
        sx={{ px: 4, py: 2 }}
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          {selection.length > 0 && (
            <Grid item xs={12}>
              <Button
                size="small"
                startIcon={
                  isDeleting ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : (
                    <DeleteOutline />
                  )
                }
                onClick={handleDelete}
                variant="outlined"
              >
                <FormattedMessage id="delete" defaultMessage="delete" />
              </Button>
            </Grid>
          )}
          {images.length === 0 && (
            <Grid item xs={12}>
              <Box>
                <Stack spacing={1} alignItems="center">
                  <BrokenImageIcon fontSize="large" />
                  <Box>
                    <Typography textAlign="center" variant="h5">
                      <FormattedMessage
                        id="no.images.alt"
                        defaultMessage="No images"
                      />
                    </Typography>
                    <Typography
                      textAlign="center"
                      variant="body1"
                      color="text.secondary"
                    >
                      <FormattedMessage
                        id="no.images.for.product.this.product"
                        defaultMessage="No images for this product"
                      />
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          )}
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ButtonBase
                sx={{
                  position: "relative",
                }}
                disabled={isDeleting}
                onClick={handleSelect(image.id)}
              >
                <Image
                  src={image.imageUrl}
                  alt={`Product ${index}`}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
                {isEdit && (
                  <Box
                    sx={(theme) => ({
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0, 0.5)",
                      borderRadius: theme.shape.borderRadius / 2,
                      border: `1px solid ${theme.palette.grey[200]}`,
                    })}
                  />
                )}

                {isEdit && isSelected(image.id) && (
                  <Box
                    sx={(theme) => ({
                      position: "absolute",
                      top: theme.spacing(1),
                      right: theme.spacing(1),
                      color: theme.palette.common.white,
                    })}
                  >
                    <CheckCircle />
                  </Box>
                )}
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
