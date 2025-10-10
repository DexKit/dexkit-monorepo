import { useIsMobile } from "@dexkit/core";
import { AppDialogTitle } from "@dexkit/ui/components";
import QrCodeScanner from "@dexkit/ui/components/QrCodeScanner";
import VideoCall from "@mui/icons-material/VideoCall";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  GlobalStyles,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import QrScanner from "qr-scanner";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

export interface GlassScanWalletQrCodeDialogProps {
  DialogProps: DialogProps;
  onResult: (result: string) => void;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

export default function GlassScanWalletQrCodeDialog({
  DialogProps,
  onResult,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff'
}: GlassScanWalletQrCodeDialogProps) {
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [camera, setCamera] = useState<string>();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const requestCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(async function (stream) {
        let cameras = await QrScanner.listCameras();

        setCameras(cameras);

        if (cameras.length > 0) {
          setCamera(cameras[0].id);
        }
      })
      .catch(function (error) {
        console.error("Error accessing the camera: ", error);
      });
  };

  useEffect(() => {
    (async () => {
      let cameras = await QrScanner.listCameras();

      setCameras(cameras);
    })();
  }, []);

  useEffect(() => {
    if (cameras.length > 0) {
      setCamera(cameras[0].id);
    }
  }, [cameras]);

  return (
    <>
      <GlobalStyles
        styles={{
          '.MuiPopover-root .MuiPaper-root': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.95}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%) !important`,
            border: '1px solid rgba(255, 255, 255, 0.3) !important',
            borderRadius: '16px !important',
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.4) !important,
              inset 0 1px 0 rgba(255, 255, 255, 0.3) !important,
              inset 0 -1px 0 rgba(255, 255, 255, 0.1) !important
            `,
          },
          '.MuiMenu-paper': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.95}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%) !important`,
            border: '1px solid rgba(255, 255, 255, 0.3) !important',
            borderRadius: '16px !important',
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.4) !important,
              inset 0 1px 0 rgba(255, 255, 255, 0.3) !important,
              inset 0 -1px 0 rgba(255, 255, 255, 0.1) !important
            `,
          },
          '.MuiMenu-list': {
            padding: '8px !important',
          },
          '.MuiMenuItem-root': {
            color: `${textColor} !important`,
            borderRadius: '12px !important',
            margin: '2px 0 !important',
            padding: '12px 16px !important',
            fontWeight: '500 !important',
            transition: 'all 0.3s ease-in-out !important',
            background: 'transparent !important',
          },
          '.MuiMenuItem-root:hover': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.8}) !important`,
            transform: 'translateX(4px) scale(1.02) !important',
            boxShadow: `
              0 4px 12px rgba(0, 0, 0, 0.2) !important,
              inset 0 1px 0 rgba(255, 255, 255, 0.3) !important
            `,
          },
          '.MuiMenuItem-root.Mui-selected': {
            background: `rgba(255, 255, 255, ${glassOpacity * 1.0}) !important`,
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.15) !important,
              inset 0 1px 0 rgba(255, 255, 255, 0.4) !important
            `,
          },
          '.MuiMenuItem-root.Mui-selected:hover': {
            background: `rgba(255, 255, 255, ${glassOpacity * 1.2}) !important`,
            transform: 'translateX(4px) scale(1.02) !important',
          },
          '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none !important',
            borderColor: 'transparent !important',
          },
          '.MuiOutlinedInput-root.Mui-focused': {
            border: '1px solid rgba(255, 255, 255, 0.5) !important',
            borderColor: 'rgba(255, 255, 255, 0.5) !important',
          },
          '.MuiSelect-select:focus': {
            borderColor: 'transparent !important',
            outline: 'none !important',
          },
          '.MuiFormControl-root .MuiOutlinedInput-root:focus-within': {
            border: '1px solid rgba(255, 255, 255, 0.5) !important',
            borderColor: 'rgba(255, 255, 255, 0.5) !important',
          },
        }}
      />
      <Dialog
        {...DialogProps}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            background: `rgba(255, 255, 255, ${glassOpacity})`,
            backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: isMobile ? 0 : '16px',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1)
            `,

            [theme.breakpoints.down('sm')]: {
              margin: theme.spacing(1),
              borderRadius: theme.spacing(2),
              maxHeight: 'calc(100vh - 32px)',
              width: 'calc(100vw - 32px)',
              maxWidth: 'calc(100vw - 32px)',
              minHeight: 'calc(100vh - 32px)',
            },

            [theme.breakpoints.down(400)]: {
              margin: 0,
              borderRadius: 0,
              maxHeight: '100vh',
              height: '100vh',
              width: '100vw',
              maxWidth: '100vw',
              minHeight: '100vh',
            },

            [theme.breakpoints.between('sm', 'md')]: {
              margin: theme.spacing(2),
              borderRadius: theme.spacing(2.5),
              maxWidth: '520px',
              minWidth: '450px',
              minHeight: '580px',
              maxHeight: 'calc(100vh - 64px)',
            },

            [theme.breakpoints.up('lg')]: {
              margin: theme.spacing(3),
              borderRadius: theme.spacing(3),
              maxWidth: '600px',
              minWidth: '520px',
              minHeight: '620px',
              maxHeight: 'calc(100vh - 96px)',
            },

            ...(isMobile && {
              margin: 0,
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              borderRadius: 0,
            }),
            ...(!isMobile && {
              maxWidth: '500px',
              minHeight: '550px',
            }),

            '& .MuiDialogTitle-root': {
              background: 'transparent',
              color: textColor,
              fontWeight: 600,
              borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
            },

            '& .MuiIconButton-root': {
              color: textColor,
              background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
              backdropFilter: `blur(${blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${blurIntensity}px)`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s ease-in-out',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              '&:hover': {
                background: `rgba(255, 255, 255, ${glassOpacity * 1.2})`,
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                backdropFilter: `blur(${blurIntensity}px)`,
                WebkitBackdropFilter: `blur(${blurIntensity}px)`,
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            },

            '& .MuiFormControl-root': {
              '& .MuiOutlinedInput-root': {
                background: `rgba(255, 255, 255, ${glassOpacity * 0.9}) !important`,
                backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%) !important`,
                WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%) !important`,
                border: '1px solid rgba(255, 255, 255, 0.3) !important',
                borderRadius: '14px !important',
                color: `${textColor} !important`,
                transition: 'all 0.3s ease-in-out !important',
                boxShadow: `
                  0 4px 16px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                `,

                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none !important',
                },

                '&:hover': {
                  background: `rgba(255, 255, 255, ${glassOpacity * 1.2}) !important`,
                  transform: 'translateY(-2px) !important',
                  boxShadow: `
                    0 6px 20px rgba(0, 0, 0, 0.2) !important,
                    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important,
                    inset 0 -1px 0 rgba(255, 255, 255, 0.15) !important
                  `,

                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none !important',
                  },
                },

                '&.Mui-focused': {
                  background: `rgba(255, 255, 255, ${glassOpacity * 1.3}) !important`,
                  border: '1px solid rgba(255, 255, 255, 0.5) !important',
                  boxShadow: `
                    0 0 0 2px rgba(255, 255, 255, 0.4) !important,
                    0 8px 25px rgba(0, 0, 0, 0.25) !important,
                    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important
                  `,

                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none !important',
                    borderColor: 'transparent !important',
                  },

                  '&:before': {
                    border: 'none !important',
                    borderColor: 'transparent !important',
                  },

                  '&:after': {
                    border: 'none !important',
                    borderColor: 'transparent !important',
                  },
                },

                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none !important',
                  borderColor: 'transparent !important',
                },

                '& .MuiSelect-select': {
                  color: `${textColor} !important`,
                  fontWeight: '500 !important',
                  padding: '14px 16px !important',
                },

                '& .MuiSelect-icon': {
                  color: `${textColor} !important`,
                  opacity: '0.8 !important',
                },
              },
            },

            '& .MuiButton-root': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.9})`,
              backdropFilter: `blur(${blurIntensity}px)`,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: textColor,
              fontWeight: 600,
              textTransform: 'none',
              padding: '12px 24px',
              transition: 'all 0.2s ease-in-out',

              '&:hover': {
                background: `rgba(255, 255, 255, ${glassOpacity * 1.2})`,
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
              },

              '&:active': {
                transform: 'translateY(0px)',
              },
            },

            '& .MuiButton-contained': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.2}) !important`,
              backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(120%) !important`,
              border: '1px solid rgba(255, 255, 255, 0.4) !important',
              borderRadius: '14px !important',
              color: `${textColor} !important`,
              fontWeight: '600 !important',
              textTransform: 'none !important',
              padding: '14px 32px !important',
              fontSize: '1rem !important',
              transition: 'all 0.3s ease-in-out !important',
              boxShadow: `
                0 6px 20px rgba(0, 0, 0, 0.25) !important,
                inset 0 1px 0 rgba(255, 255, 255, 0.4) !important,
                inset 0 -1px 0 rgba(255, 255, 255, 0.15) !important
              `,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',

              '&:hover': {
                background: `rgba(255, 255, 255, ${glassOpacity * 1.5}) !important`,
                transform: 'translateY(-3px) scale(1.02) !important',
                boxShadow: `
                  0 10px 35px rgba(0, 0, 0, 0.35) !important,
                  inset 0 1px 0 rgba(255, 255, 255, 0.5) !important,
                  inset 0 -1px 0 rgba(255, 255, 255, 0.2) !important
                `,
              },

              '&:active': {
                transform: 'translateY(-1px) scale(1.0) !important',
                transition: 'all 0.1s ease-in-out !important',
              },

              '&.Mui-disabled': {
                background: `rgba(255, 255, 255, ${glassOpacity * 0.6}) !important`,
                color: `rgba(255, 255, 255, 0.5) !important`,
                opacity: '0.6 !important',
              },
            },

            '& .MuiTypography-root': {
              color: textColor,
            },

            '& .MuiDivider-root': {
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)})`,
            },

            '& .MuiSvgIcon-root': {
              color: textColor,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
            },

            '& .qr-scanner-container': {
              borderRadius: '16px',
              overflow: 'hidden',
              border: `2px solid rgba(255, 255, 255, 0.3)`,
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              background: `rgba(0, 0, 0, 0.1)`,

              '& video': {
                borderRadius: '14px',
              },
            },

            '& .camera-permission-area': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.2})`,
              backdropFilter: `blur(${blurIntensity}px)`,
              borderRadius: '16px',
              padding: theme.spacing(3),
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center',
            },
          },
        }}
      >
        <AppDialogTitle
          title={
            <FormattedMessage id="scan.wallet" defaultMessage="Scan wallet" />
          }
          onClose={handleClose}
          sx={{
            px: isMobile ? theme.spacing(2) : theme.spacing(3),
            py: isMobile ? theme.spacing(1.5) : theme.spacing(2),
            color: textColor,
            fontWeight: 600,

            '& .MuiTypography-root': {
              fontSize: '1.25rem',
            },

            [theme.breakpoints.down('sm')]: {
              px: theme.spacing(1.5),
              py: theme.spacing(1.2),
              '& .MuiTypography-root': {
                fontSize: '1.1rem',
              },
            },

            [theme.breakpoints.down(400)]: {
              px: theme.spacing(1),
              py: theme.spacing(1),
              '& .MuiTypography-root': {
                fontSize: '1rem',
              },
            },

            [theme.breakpoints.up('lg')]: {
              px: theme.spacing(3.5),
              py: theme.spacing(2.5),
              '& .MuiTypography-root': {
                fontSize: '1.4rem',
              },
            },
          }}
        />
        <Divider />
        <DialogContent
          sx={{
            px: isMobile ? theme.spacing(2) : theme.spacing(3),
            paddingTop: isMobile ? theme.spacing(2) : theme.spacing(3),
            paddingBottom: isMobile ? theme.spacing(1) : theme.spacing(2),

            [theme.breakpoints.down('sm')]: {
              px: theme.spacing(1.5),
              paddingTop: theme.spacing(1.5),
              paddingBottom: theme.spacing(1),
            },

            [theme.breakpoints.down(400)]: {
              px: theme.spacing(1),
              paddingTop: theme.spacing(1),
              paddingBottom: theme.spacing(1),
            },

            [theme.breakpoints.up('lg')]: {
              px: theme.spacing(4),
              paddingTop: theme.spacing(4),
              paddingBottom: theme.spacing(2),
            },
          }}
        >
          <Stack spacing={2}>
            <Select
              value={camera || ""}
              onChange={(e: SelectChangeEvent<string>) =>
                setCamera(e.target.value)
              }
              variant="outlined"
              fullWidth
            >
              {cameras.map((camera: any) => (
                <MenuItem key={camera.id} value={camera.id}>
                  {camera.label}
                </MenuItem>
              ))}
            </Select>

            {camera && cameras.length > 0 ? (
              <Box className="qr-scanner-container">
                <QrCodeScanner cameraId={camera} key={camera} onResult={onResult} />
              </Box>
            ) : (
              <Stack
                justifyContent="center"
                alignItems="center"
                spacing={2}
                className="camera-permission-area"
                sx={{ minHeight: '300px' }}
              >
                <VideoCall sx={{ fontSize: '4rem', opacity: 0.8 }} />
                <Box>
                  <Typography align="center" variant="h5" sx={{ mb: 1 }}>
                    <FormattedMessage
                      id="camera.permission"
                      defaultMessage="Camera Permission"
                    />
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    sx={{ opacity: 0.8 }}
                  >
                    <FormattedMessage
                      id="camera.permission.message"
                      defaultMessage="Please grant permission to continue."
                    />
                  </Typography>
                </Box>

                <Button onClick={requestCameraAccess} variant="contained" size="large">
                  <FormattedMessage
                    id="grang.access"
                    defaultMessage="Grant access"
                  />
                </Button>
              </Stack>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
} 