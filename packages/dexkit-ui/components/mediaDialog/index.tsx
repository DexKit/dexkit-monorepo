import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  InputAdornment,
  Skeleton,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  useDeleteAccountFile,
  useEditAccountFile,
  useGetAccountFiles,
  useUploadAccountFile,
} from "../../modules/file/hooks";
import { AppDialogTitle } from "../AppDialogTitle";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import AppConfirmDialog from "../AppConfirmDialog";
import DeleteImageDialog from "./DeleteImageDialog";

import EditIcon from "@mui/icons-material/Edit";
import { MAX_ACCOUNT_FILE_UPLOAD_SIZE } from "../../constants";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { AccountFile } from "../../modules/file/types";

import { DexkitApiProvider } from "@dexkit/core/providers";
import { truncateText } from "@dexkit/core/utils/text";
import { myAppsApi } from "../../constants/api";
import { useWalletConnect } from "../../hooks/wallet";
import { ConnectButton } from "../ConnectButton";
import GenerateImagesDialog from "../dialogs/GenerateImagesDialog";

interface Props {
  dialogProps: DialogProps;
  defaultPrompt?: string;
  defaultAITab?: string;
  showAIGenerator?: boolean;
  onConfirmSelectFile?: (file: AccountFile) => void;
  accept?: string;
}

const CustomImage = styled("img")(({ theme }) => ({
  height: "100%",
  width: theme.spacing(24),
  borderRadius: theme.shape.borderRadius,
}));

const CustomFileImage = styled("img")(({ theme }) => ({
  height: "100%",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  aspectRatio: "1/1",
}));

const CustomButton = styled(ButtonBase)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignCOntent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.20)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.10)",
  },
  "&:hover .btn": {},
}));

export default function MediaDialog({
  dialogProps,
  onConfirmSelectFile,
  showAIGenerator,
  defaultPrompt,
  defaultAITab,
  accept = "image/*, audio/*, video/*",
}: Props) {
  const { onClose } = dialogProps;
  const { isActive } = useWeb3React();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState<string>();
  const [sortCreatedAt, setSortCreatedAt] = useState("desc");

  const filesQuery = useGetAccountFiles({
    skip: page * 20,
    search,
    sort: ["createdAt", sortCreatedAt],
  });

  const handleChangeSortBy = (event: SelectChangeEvent) => {
    setSortCreatedAt(event.target.value);
  };

  const [file, setFile] = useState<File>();

  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [editFileName, setEditFileName] = useState<number | undefined>();
  const [newFileName, setNewFileName] = useState<string | undefined>();
  const [showDeleteImageDialog, setShowDeleteImageDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<AccountFile>();
  const { fileUploadMutation, fileUploadProgress } = useUploadAccountFile();
  const deleteFileMutation = useDeleteAccountFile();
  const editFileMutation = useEditAccountFile();

  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (file) {
      if (imgRef.current) {
        imgRef.current.src = URL.createObjectURL(file);
      }
    }
  }, [file]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setSearch(undefined);
    setSelectedFile(undefined);
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files.length > 0) {
      let file = e.target.files[0];

      setFile(file);
    } else {
    }
  }, []);

  const getFilteredFiles = () => {
    if (!filesQuery.data?.files) return [];

    if (accept.includes('video/') && accept.includes('audio/') && !accept.includes('image/')) {
      return filesQuery.data.files.filter(file => {
        const mimeType = file.mimeType || '';
        return mimeType.startsWith('video/') || mimeType.startsWith('audio/');
      });
    }

    if (accept.includes('image/') && !accept.includes('video/') && !accept.includes('audio/')) {
      return filesQuery.data.files.filter(file => {
        const mimeType = file.mimeType || '';
        return mimeType.startsWith('image/');
      });
    }

    return filesQuery.data.files;
  };

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    inputRef.current?.click();
  }, [inputRef]);

  const { connectWallet } = useWalletConnect();

  const onUploadFile = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fileUploadMutation.mutate(formData, {
        onSuccess: (response) => {
          if (response?.data && onConfirmSelectFile) {
            onConfirmSelectFile(response.data);
            onClose?.({}, "backdropClick");
          }
          fileUploadMutation.reset();
          setFile(undefined);
          filesQuery.refetch();
        },
        onError: (error: any) => {
        }
      });
    }
  };
  const handleDeleteFile = () => {
    if (selectedFile) {
      setShowDeleteImageDialog(true);
      setShowConfirmRemove(false);
      deleteFileMutation.mutate(selectedFile.id, {
        onSuccess: () => filesQuery.refetch(),
      });
    }
  };

  const handleEditFile = async () => {
    if (selectedFile && newFileName) {
      setShowConfirmEdit(false);
      await editFileMutation.mutateAsync(
        { id: selectedFile.id, newFileName: newFileName },
        {
          onSuccess: () => filesQuery.refetch(),
        }
      );
      setNewFileName(undefined);
      setEditFileName(undefined);
    }
  };

  const handleCloseDeleteFile = () => {
    setShowDeleteImageDialog(false);
  };

  const handleShowConfirmRemoveClose = () => {
    setShowConfirmRemove(false);
  };

  const handleShowConfirmEditClose = () => {
    setShowConfirmEdit(false);
  };

  const handleConfirmSelectedFile = () => {
    if (selectedFile && onConfirmSelectFile) {
      onConfirmSelectFile(selectedFile), handleClose();
    }
  };

  const [showAiImgGen, setShowAiImgGen] = useState(showAIGenerator || false);

  const [tab, setTab] = useState<string>(defaultAITab || "select");
  const [aiImage, setAiImage] = useState<string>();

  const handleShowImageGeneratorDialog = (tab: string) => {
    setTab(tab);
    setShowAiImgGen(true);
  };

  const handleCloseImageGeneratorDialog = () => {
    setShowAiImgGen(false);
    setAiImage(undefined);
    filesQuery.refetch();
  };

  const handleOpenAI = useCallback(
    (url: string) => {
      handleShowImageGeneratorDialog("select");
      setAiImage(url);
    },
    [handleShowImageGeneratorDialog]
  );

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          fullWidth: true,
          maxWidth: "sm",
          onClose: handleShowConfirmRemoveClose,
          open: showConfirmRemove,
          sx: {
            zIndex: 10001,
          },
        }}
        onConfirm={handleDeleteFile}
        title={
          <FormattedMessage id="remove.image" defaultMessage="Remove Image" />
        }
      >
        <FormattedMessage
          id="do.you.really.want.to.delete.this.image"
          defaultMessage="Do you really want to delete this image?"
        />
      </AppConfirmDialog>
      <AppConfirmDialog
        DialogProps={{
          fullWidth: true,
          maxWidth: "sm",
          onClose: handleShowConfirmEditClose,
          open: showConfirmEdit,
          sx: {
            zIndex: 10001,
          },
        }}
        onConfirm={handleEditFile}
        title={
          <FormattedMessage
            id="edit.image.name"
            defaultMessage="Edit image name"
          />
        }
      >
        <FormattedMessage
          id="do.you.really.want.to.edit.this.image"
          defaultMessage="Do you really want to edit this image?"
        />
      </AppConfirmDialog>
      <DeleteImageDialog
        dialogProps={{
          open: showDeleteImageDialog,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleCloseDeleteFile,
        }}
        isLoading={deleteFileMutation.isLoading}
        isSuccess={deleteFileMutation.isSuccess}
        error={deleteFileMutation.error}
      />
      <Dialog
        {...dialogProps}
        onClose={handleClose}
        sx={{
          zIndex: 10000,
          ...dialogProps.sx,
        }}
      >
        <AppDialogTitle
          icon={<BrowseGalleryIcon />}
          title={<FormattedMessage id="gallery" defaultMessage="Gallery 1" />}
          onClose={handleClose}
        />
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box sx={{ pr: 2 }} justifyContent={"flex-end"} display={"flex"}>
                <input
                  onChange={handleChange}
                  type="file"
                  hidden
                  ref={inputRef}
                  accept={accept}
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  {isActive ? (
                    <Button variant="contained" onClick={handleClick}>
                      <FormattedMessage
                        id="add.media"
                        defaultMessage="Add Media"
                      />
                    </Button>
                  ) : (
                    <ConnectButton variant="contained" />
                  )}
                  <Button
                    onClick={() => handleShowImageGeneratorDialog("generator")}
                    variant="outlined"
                    startIcon={<AutoFixHighIcon />}
                  >
                    <FormattedMessage
                      id="ai.generator"
                      defaultMessage="AI Generator"
                    />
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            {file && (
              <Grid size={12}>
                <Box display="flex" justifyContent="center">
                  <Stack
                    spacing={2}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        flex: 1,
                        p: 2,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "light"
                            ? theme.palette.grey[300]
                            : alpha(theme.palette.common.white, 0.2),
                        borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                      }}
                    >
                      {file.type?.startsWith('video/') ? (
                        <Box
                          component="video"
                          src={URL.createObjectURL(file)}
                          sx={{
                            height: (theme) => theme.spacing(22),
                            width: "100%",
                            objectFit: "contain",
                            borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                          }}
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : file.type?.startsWith('audio/') ? (
                        <Box
                          sx={{
                            height: (theme) => theme.spacing(22),
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          }}
                        >
                          <Typography variant="h2" color="white">♪</Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            backgroundImage: `url("${URL.createObjectURL(file)}")`,
                            height: (theme) => theme.spacing(22),
                            width: "100%",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                          pointerEvents: "none",
                        }}
                      />
                    </Box>
                    <Stack spacing={2} direction={"row"}>
                      <Box sx={{ position: 'relative', minWidth: '120px' }}>
                        <Button
                          color="primary"
                          variant="contained"
                          disabled={
                            fileUploadMutation.isPending ||
                            fileUploadMutation.isSuccess ||
                            file?.size > MAX_ACCOUNT_FILE_UPLOAD_SIZE
                          }
                          onClick={onUploadFile}
                          startIcon={
                            fileUploadMutation.isPending && (
                              <CircularProgress color="inherit" size="1rem" />
                            )
                          }
                          sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: '100%',
                            '& .progress-bar': {
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              height: '100%',
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                              transition: 'width 0.3s ease',
                              zIndex: 1,
                            },
                            '& .progress-text': {
                              position: 'relative',
                              zIndex: 2,
                            }
                          }}
                        >
                          {fileUploadMutation.isPending && (
                            <Box
                              className="progress-bar"
                              sx={{ width: `${fileUploadProgress}%` }}
                            />
                          )}

                          <Box className="progress-text">
                            {fileUploadMutation.isPending && (
                              <>
                                <FormattedMessage
                                  id="uploading"
                                  defaultMessage="Uploading"
                                />{" "}
                                {fileUploadProgress}%
                              </>
                            )}

                            {fileUploadMutation.isSuccess && (
                              <>
                                <FormattedMessage
                                  id="uploaded"
                                  defaultMessage="Uploaded"
                                />{" "}
                                ✓
                              </>
                            )}

                            {fileUploadMutation.isError && (
                              <>
                                <FormattedMessage
                                  id="error.try.again"
                                  defaultMessage="Error. Try again?"
                                />
                              </>
                            )}

                            {fileUploadMutation.isIdle && (
                              <FormattedMessage id="upload" defaultMessage="Upload" />
                            )}
                          </Box>
                        </Button>
                      </Box>

                      <Button
                        color="warning"
                        variant="contained"
                        onClick={() => {
                          setFile(undefined);
                          fileUploadMutation.reset();
                        }}
                      >
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                      </Button>
                    </Stack>
                    <Box>
                      <Typography
                        variant={"body1"}
                        sx={{
                          color:
                            file?.size > MAX_ACCOUNT_FILE_UPLOAD_SIZE
                              ? "error.main"
                              : undefined,
                        }}
                      >
                        <FormattedMessage
                          id="max.file.size"
                          defaultMessage="Max file size: 50 Mb"
                        />
                      </Typography>
                    </Box>
                    {fileUploadMutation.isError && (
                      <Box sx={{ p: 2 }}>
                        <FormattedMessage id="reason" defaultMessage="Reason" />:{" "}
                        {`${(fileUploadMutation.error as any)?.response?.data
                          ?.message}`}
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Grid>
            )}
            <Grid size={12}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="select-order-by-date">
                    <FormattedMessage
                      id={"sort.by"}
                      defaultMessage={"Sort by"}
                    />
                  </InputLabel>
                  <Select
                    labelId="select-order-by-date"
                    id="demo-simple-select-helper"
                    value={sortCreatedAt}
                    label={
                      <FormattedMessage
                        id={"sort.by"}
                        defaultMessage={"Sort by"}
                      />
                    }
                    onChange={handleChangeSortBy}
                  >
                    <MenuItem value={"desc"}>
                      <FormattedMessage
                        id={"most.recent"}
                        defaultMessage={"Most recent"}
                      />
                    </MenuItem>
                    <MenuItem value={"asc"}>
                      <FormattedMessage
                        id={"least.recent"}
                        defaultMessage={"Least recent"}
                      />
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label={
                    <FormattedMessage id="search" defaultMessage="Search" />
                  }
                  onChange={(ev: any) => setSearch(ev.currentTarget.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                />
              </Box>
            </Grid>
            {!file && (
              <Grid size={12}>
                <Box display="flex" justifyContent="center">
                  {filesQuery.isSuccess && getFilteredFiles().length === 0 && (
                    <Stack
                      spacing={2}
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <CustomButton onClick={handleClick}>
                        <FormattedMessage
                          id="add.media"
                          defaultMessage="Add media"
                        />
                      </CustomButton>
                      {!search ? (
                        <>
                          <Typography>
                            <FormattedMessage
                              id="empty.gallery.start.adding.images"
                              defaultMessage="Empty gallery. Start adding images."
                            />
                          </Typography>
                          <Typography variant={"body1"}>
                            <FormattedMessage
                              id="max.file.size"
                              defaultMessage="Max file size: 50 Mb"
                            />
                          </Typography>
                        </>
                      ) : (
                        <Typography>
                          <FormattedMessage
                            id="no.images.found.with.that.name"
                            defaultMessage="No images found with that name."
                          />
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Box>
              </Grid>
            )}
            {!isActive && (
              <Grid size={12}>
                <Box display="flex" justifyContent="center">
                  <Stack
                    spacing={2}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                  >
                    <CustomButton onClick={connectWallet}>
                      <FormattedMessage
                        id="connect.wallet"
                        defaultMessage="Connect wallet"
                      />
                    </CustomButton>
                    <Typography>
                      <FormattedMessage
                        id="connect.wallet.to.see.or.upload.images"
                        defaultMessage="Connect wallet to see or upload images."
                      />
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            )}

            {filesQuery.isLoading && (
              <Grid size={12}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                    <Skeleton>
                      <CustomImage alt={""} src={""} />
                    </Skeleton>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                    <Skeleton>
                      <CustomImage alt={""} src={""} />
                    </Skeleton>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                    <Skeleton>
                      <CustomImage alt={""} src={""} />
                    </Skeleton>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                    <Skeleton>
                      <CustomImage alt={""} src={""} />
                    </Skeleton>
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid size={12}>
              <Grid container spacing={2}>
                {getFilteredFiles().map((f, key) => (
                  <Grid size={{ xs: 6, sm: 3, md: 2 }} key={key}>
                    <Stack
                      spacing={2}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <ButtonBase
                        sx={{
                          borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.grey[300]
                              : alpha(theme.palette.common.white, 0.2),
                        }}
                        onClick={() =>
                          selectedFile
                            ? selectedFile.id === f.id
                              ? setSelectedFile(undefined)
                              : setSelectedFile(f)
                            : setSelectedFile(f)
                        }
                      >
                        <Box
                          sx={(theme) => ({
                            position: "relative",
                            height: (theme) => theme.spacing(16),
                            [theme.breakpoints.up("sm")]: {
                              height: (theme) => theme.spacing(20),
                            },
                            [theme.breakpoints.up("lg")]: {
                              height: (theme) => theme.spacing(22),
                            },
                            p: 2,
                            border:
                              selectedFile?.id === f.id
                                ? `2px solid ${theme.palette.primary.main}`
                                : undefined,
                            borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                          })}
                        >
                          {f.mimeType?.startsWith('video/') ? (
                            <Box
                              component="video"
                              src={f.url}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                aspectRatio: "1/1",
                                borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                              }}
                              muted
                              autoPlay
                              loop
                              playsInline
                            />
                          ) : f.mimeType?.startsWith('audio/') ? (
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                aspectRatio: "1/1",
                                borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              }}
                            >
                              <Typography variant="h4" color="white">♪</Typography>
                            </Box>
                          ) : (
                            <Box
                              sx={(theme) => ({
                                borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                                backgroundImage: `url("${f.url}")`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                width: "100%",
                                height: "100%",
                                aspectRatio: "1/1",
                              })}
                            />
                          )}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor:
                                selectedFile?.id === f.id
                                  ? "rgba(0, 0, 0, 0.3)"
                                  : undefined,
                            }}
                          />
                          {selectedFile?.id === f.id && (
                            <CheckCircleIcon
                              color="primary"
                              sx={{
                                position: "absolute",
                                right: (theme) => theme.spacing(1),
                                top: (theme) => theme.spacing(1),
                              }}
                            />
                          )}
                        </Box>
                      </ButtonBase>
                      <Stack
                        spacing={1}
                        direction={{ sm: "row" }}
                        justifyContent="space-between"
                        alignContent="center"
                        alignItems="center"
                      >
                        <Box>
                          {editFileName === f.id ? (
                            <>
                              <TextField
                                defaultValue={f?.name}
                                onChange={(event: any) =>
                                  setNewFileName(event.currentTarget.value)
                                }
                              />
                              <Stack direction="row" alignItems="center">
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  onClick={() => setShowConfirmEdit(true)}
                                >
                                  <CheckIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="clear"
                                  size="small"
                                  onClick={() => setEditFileName(undefined)}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </Stack>
                            </>
                          ) : f?.name.length > 10 ? (
                            <Typography variant="caption">
                              {truncateText(f?.name, 10)}
                            </Typography>
                          ) : (
                            <Typography variant="caption">{f?.name}</Typography>
                          )}
                        </Box>
                        {selectedFile?.id === f.id && !editFileName && (
                          <Stack spacing={0.5} direction="row">
                            <Tooltip
                              title={
                                <FormattedMessage
                                  id="delete"
                                  defaultMessage="Delete"
                                />
                              }
                            >
                              <IconButton
                                size="small"
                                aria-label="delete"
                                onClick={() => setShowConfirmRemove(true)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip
                              title={
                                <FormattedMessage
                                  id="edit"
                                  defaultMessage="Edit"
                                />
                              }
                            >
                              <IconButton
                                size="small"
                                aria-label="edit"
                                onClick={() => setEditFileName(f.id)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip
                              title={
                                <FormattedMessage id="AI" defaultMessage="AI" />
                              }
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleOpenAI(selectedFile.url)}
                                aria-label="ai"
                              >
                                <AutoFixHighIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size={12}>
              <Box display="flex" justifyContent="flex-end">
                {filesQuery.isSuccess &&
                  getFilteredFiles().length > 0 && (
                    <Pagination
                      page={page + 1}
                      onChange={(_ev, _page) => setPage(_page - 1)}
                      count={
                        Math.floor(
                          filesQuery?.data?.total / filesQuery?.data?.take
                        ) + 1
                      }
                    />
                  )}
              </Box>
            </Grid>
          </Grid>
          {/*selectedFile && (
              <Grid size={3}>
                <Typography>
                  <FormattedMessage id="name" defaultMessage="Name" />
                </Typography>
                <Typography>{selectedFile?.name}</Typography>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => setShowConfirmRemove(true)}
                >
                  <FormattedMessage id="delete" defaultMessage="Delete" />
                </Button>
              </Grid>
            )*/}
        </DialogContent>
        <DialogActions>
          {selectedFile && (
            <Box sx={{ pr: 1 }}>
              <Typography>{selectedFile?.name}</Typography>
            </Box>
          )}

          <Button
            color="primary"
            variant="contained"
            onClick={handleConfirmSelectedFile}
            disabled={!selectedFile}
          >
            <FormattedMessage id="select.image" defaultMessage="Select Image" />
          </Button>
          <Button onClick={handleClose}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </DialogActions>
      </Dialog>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {showAiImgGen && (
          <GenerateImagesDialog
            DialogProps={{
              open: showAiImgGen,
              maxWidth: "xl",
              fullWidth: true,
              onClose: handleCloseImageGeneratorDialog,
              sx: {
                zIndex: 10001, // Mayor que la galería (10000)
              },
            }}
            image={aiImage}
            tab={tab}
            defaultPrompt={defaultPrompt}
          />
        )}
      </DexkitApiProvider.Provider>
    </>
  );
}
