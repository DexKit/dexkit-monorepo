import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import ImageButton from "./ImageButton";

import CancelIcon from "@mui/icons-material/Cancel";
import SelectAllIcon from "@mui/icons-material/SelectAll";

import DeselectIcon from "@mui/icons-material/Deselect";

import SaveIcon from "@mui/icons-material/Save";
import { useSnackbar } from "notistack";
import { useGenerateImageContext, useSaveImages } from "../../../hooks/ai";
export interface VariantsGridProps {
  gridSize: number;
  amount: number;
  isLoading?: boolean;
  images: string[];
  disabled?: boolean;
  onMenuOption: (opt: string, { url }: { url: string }) => void;
}

export default function VariantsGrid({
  gridSize,
  isLoading,
  amount,
  images,
  disabled,
  onMenuOption,
}: VariantsGridProps) {
  const [selectable, setSelectable] = useState(false);
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const selectedImages: string[] = useMemo(() => {
    return Object.keys(selected)
      .map((key) => (selected[key] ? key : undefined))
      .filter((r) => r !== undefined) as string[];
  }, [selected]);

  const { isLoading: isSavingImages, mutateAsync: saveImages } =
    useSaveImages();

  const [selectedUrl, setSelectedUrl] = useState<string>();

  const handleSelect = useCallback((img: string) => {
    setSelected((selected: any) => {
      const newSelected = { ...selected };

      if (newSelected[img]) {
        newSelected[img] = false;

        const selectedImages = Object.keys(newSelected)
          .map((key) => (newSelected[key] ? key : undefined))
          .filter((r) => r !== undefined) as string[];

        if (selectedImages.length === 0) {
          setSelectable(false);
        }
      } else {
        newSelected[img] = true;
      }

      return newSelected;
    });
  }, []);

  const handleOpenMenu = useCallback(
    (url: string, anchorEl: HTMLElement | null) => {
      setAnchorEl(anchorEl);
      setSelectedUrl(url);
    },
    []
  );

  const handleCloseMenu = () => {
    setSelectedUrl(undefined);
    setAnchorEl(null);
  };

  const handleMenuSelect = () => {
    setSelectable(true);
    handleCloseMenu();
    if (selectedUrl) {
      handleSelect(selectedUrl);
    }
  };

  const isAllSelected = useMemo(() => {
    return (
      Object.keys(selected)
        .map((k) => Boolean(selected[k]))
        .filter((k) => k).length === images.length
    );
  }, [images.length, selected]);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelected({});
      return;
    }

    let result = images.reduce((prev: any, curr) => {
      prev[curr] = true;

      return prev;
    }, {});

    setSelected(result);
  }, [images, isAllSelected]);

  const handleCancel = useCallback(() => {
    setSelected({});
    setSelectable(false);
  }, []);

  const { addSavedImages } = useGenerateImageContext();

  const { enqueueSnackbar } = useSnackbar();

  const handleSave = useCallback(async () => {
    try {
      await saveImages({ urls: selectedImages });
      addSavedImages(selectedImages);
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }

    setSelectable(false);
    setSelected({});
  }, [selectedImages]);

  const handleVariant = () => {
    if (selectedUrl) {
      onMenuOption("variant", { url: selectedUrl });
      handleCloseMenu();
    }
  };

  const handleEdit = () => {
    if (selectedUrl) {
      onMenuOption("edit", { url: selectedUrl });
      handleCloseMenu();
    }
  };

  return (
    <>
      <Menu
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={handleMenuSelect}>
          <FormattedMessage id="select" defaultMessage="Select" />
        </MenuItem>
        <MenuItem onClick={handleVariant}>
          <FormattedMessage
            id="generate.variant"
            defaultMessage="Generate variant"
          />
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </MenuItem>
      </Menu>
      <Box sx={{ height: "100%" }}>
        <Stack spacing={2} sx={{ height: "100%" }}>
          {selectable && (
            <>
              <Box>
                <Stack justifyContent="flex-end" direction="row" spacing={1}>
                  <Tooltip
                    title={<FormattedMessage id="save" defaultMessage="Save" />}
                  >
                    <IconButton
                      disabled={isSavingImages}
                      onClick={handleSave}
                      size="small"
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      isAllSelected ? (
                        <FormattedMessage
                          id="deselect.all"
                          defaultMessage="Deselect All"
                        />
                      ) : (
                        <FormattedMessage
                          id="select.all"
                          defaultMessage="Select All"
                        />
                      )
                    }
                  >
                    <IconButton
                      disabled={isSavingImages}
                      onClick={handleSelectAll}
                      size="small"
                    >
                      {isAllSelected ? <DeselectIcon /> : <SelectAllIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      <FormattedMessage id="cancel" defaultMessage="Cancel" />
                    }
                  >
                    <IconButton
                      disabled={isSavingImages}
                      onClick={handleCancel}
                      size="small"
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              {isSavingImages ? (
                <LinearProgress variant="indeterminate" />
              ) : (
                <Divider />
              )}
            </>
          )}
          <Box sx={{ height: "100%" }}>
            {images.length > 0 && (
              <Grid spacing={2} container justifyContent="center">
                {images.map((img: string, index: number) => (
                  <Grid key={index} size={{ xs: 12, sm: gridSize }}>
                    <ImageButton
                      src={img}
                      onOpenMenu={handleOpenMenu}
                      selected={selected[img]}
                      onSelect={handleSelect}
                      selectable={selectable}
                      disabled={disabled || isSavingImages}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {images.length === 0 && !isLoading && (
              <Paper sx={{ p: 2, height: "100%" }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <Grid>
                    <Box>
                      <Stack spacing={2} alignItems="center">
                        <ImageNotSupportedIcon
                          fontSize="large"
                          color="primary"
                        />
                        <Box>
                          <Typography variant="h5" align="center">
                            <FormattedMessage
                              id="no.images"
                              defaultMessage="No Images"
                            />
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="body1"
                            align="center"
                          >
                            <FormattedMessage
                              id="images.notGenerated"
                              defaultMessage="You haven't generated any images yet. Start generating images now to make the most out of our service."
                            />
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
            {isLoading && (
              <Box>
                <Grid spacing={2} container justifyContent="center">
                  {new Array(amount).fill(null).map((_, index: number) => (
                    <Grid key={index} size={{ xs: 12, sm: gridSize }}>
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          aspectRatio: "1/1",
                          width: "100%",
                          minHeight: (theme) => theme.spacing(20),
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
}
