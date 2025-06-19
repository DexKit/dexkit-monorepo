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
            minHeight: '650px',
            maxHeight: 'calc(100vh - 64px)',
          },

          [theme.breakpoints.up('lg')]: {
            margin: theme.spacing(3),
            borderRadius: theme.spacing(3),
            maxWidth: '600px',
            minWidth: '520px',
            minHeight: '700px',
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
            minHeight: '600px',
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
            backdropFilter: `blur(${blurIntensity * 0.5}px)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.2})`,
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
          },

          '& .MuiSelect-root': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
            backdropFilter: `blur(${blurIntensity * 0.6}px)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: textColor,
            transition: 'all 0.2s ease-in-out',

            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },

            '&:hover': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.1})`,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },

            '&.Mui-focused': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.2})`,
              boxShadow: `0 0 0 2px ${textColor}40`,
            },

            '& .MuiSelect-select': {
              color: textColor,
            },

            '& .MuiSelect-icon': {
              color: textColor,
            },
          },

          '& .MuiPaper-root.MuiMenu-paper': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.95})`,
            backdropFilter: `blur(${blurIntensity}px) saturate(180%)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',

            '& .MuiMenuItem-root': {
              color: textColor,
              borderRadius: '8px',
              margin: '2px 4px',
              transition: 'all 0.2s ease-in-out',

              '&:hover': {
                background: `rgba(255, 255, 255, ${glassOpacity * 0.6})`,
                transform: 'translateX(4px)',
              },

              '&.Mui-selected': {
                background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
                '&:hover': {
                  background: `rgba(255, 255, 255, ${glassOpacity * 0.9})`,
                },
              },
            },
          },

          '& .MuiButton-root': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.9})`,
            backdropFilter: `blur(${blurIntensity * 0.7}px)`,
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
            background: `linear-gradient(135deg, rgba(59, 81, 247, 0.9), rgba(8, 30, 196, 0.9))`,
            color: '#ffffff',

            '&:hover': {
              background: `linear-gradient(135deg, rgba(59, 81, 247, 1), rgba(8, 30, 196, 1))`,
              boxShadow: '0 8px 25px rgba(59, 81, 247, 0.4)',
            },
          },

          '& .MuiTypography-root': {
            color: textColor,
          },

          '& .MuiDivider-root': {
            borderColor: `rgba(255, 255, 255, 0.1)`,
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

          '& .MuiStack-root': {
            '& .MuiBox-root': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
              backdropFilter: `blur(${blurIntensity * 0.3}px)`,
              borderRadius: '12px',
              padding: theme.spacing(2),
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },

          '& .camera-permission-area': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.2})`,
            backdropFilter: `blur(${blurIntensity * 0.4}px)`,
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
          [theme.breakpoints.down('sm')]: {
            px: theme.spacing(1.5),
            py: theme.spacing(1.2),
            '& .MuiTypography-root': {
              fontSize: '1.2rem',
            },
          },

          [theme.breakpoints.down(400)]: {
            px: theme.spacing(1),
            py: theme.spacing(1),
            '& .MuiTypography-root': {
              fontSize: '1.1rem',
            },
          },

          [theme.breakpoints.up('lg')]: {
            px: theme.spacing(4),
            py: theme.spacing(2.5),
          },
        }}
      />
      <Divider />
      <DialogContent
        sx={{
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(2) : theme.spacing(3),
          '&.MuiDialogContent-root': {
            paddingTop: isMobile ? theme.spacing(2) : theme.spacing(3),
          },

          [theme.breakpoints.down('sm')]: {
            px: theme.spacing(1.5),
            py: theme.spacing(1.5),
            '&.MuiDialogContent-root': {
              paddingTop: theme.spacing(1.5),
            },
          },

          [theme.breakpoints.down(400)]: {
            px: theme.spacing(1),
            py: theme.spacing(1),
            '&.MuiDialogContent-root': {
              paddingTop: theme.spacing(1),
            },
          },

          [theme.breakpoints.up('lg')]: {
            px: theme.spacing(4),
            py: theme.spacing(4),
            '&.MuiDialogContent-root': {
              paddingTop: theme.spacing(4),
            },
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
            {cameras.map((camera) => (
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
  );
} 