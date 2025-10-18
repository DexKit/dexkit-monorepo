import { useIsMobile } from "@dexkit/core";
import { copyToClipboard } from "@dexkit/core/utils";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import { ShareType } from "@dexkit/ui/modules/commerce/components/containers/types";
import { generateShareLink } from "@dexkit/ui/modules/commerce/components/containers/utils";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LinkIcon from "@mui/icons-material/Link";
import ShareIcon from "@mui/icons-material/Share";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";

import { FormattedMessage, useIntl } from "react-intl";

const XIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

interface Props {
  dialogProps: DialogProps;
  url?: string;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

const GlassDialog = styled(Dialog)<{
  blurIntensity: number;
  glassOpacity: number;
}>(({ theme, blurIntensity, glassOpacity }) => ({
  '& .MuiDialog-paper': {
    background: `rgba(255, 255, 255, ${glassOpacity})`,
    backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
    WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.8)})`,
    borderRadius: theme.spacing(2.5),
    boxShadow: `
      0 25px 50px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    position: 'relative',
    overflow: 'hidden',
    margin: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      borderRadius: theme.spacing(2),
      maxHeight: 'calc(100vh - 32px)',
      width: 'calc(100vw - 32px)',
      maxWidth: 'calc(100vw - 32px)',
    },

    [theme.breakpoints.down(400)]: {
      margin: theme.spacing(0.5),
      borderRadius: theme.spacing(1.5),
      maxHeight: 'calc(100vh - 16px)',
      width: 'calc(100vw - 16px)',
      maxWidth: 'calc(100vw - 16px)',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
      pointerEvents: 'none',
      zIndex: 0,
    },

    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  },

  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(8px) brightness(0.7)',
    WebkitBackdropFilter: 'blur(8px) brightness(0.7)',
    background: 'rgba(0, 0, 0, 0.5)',
  },
}));

const socialShareOptions = [
  {
    value: "telegram",
    title: <FormattedMessage id="telegram" defaultMessage="Telegram" />,
    icon: <TelegramIcon />,
    color: "#0088cc",
  },
  {
    value: "whatsapp",
    title: <FormattedMessage id="whatsapp" defaultMessage="WhatsApp" />,
    icon: <WhatsAppIcon />,
    color: "#25d366",
  },
  {
    value: "facebook",
    title: <FormattedMessage id="facebook" defaultMessage="Facebook" />,
    icon: <FacebookIcon />,
    color: "#1877f2",
  },
  {
    value: "x",
    title: <FormattedMessage id="x" defaultMessage="X" />,
    icon: <XIcon />,
    color: "#000000",
  },
  {
    value: "email",
    title: <FormattedMessage id="email" defaultMessage="Email" />,
    icon: <EmailIcon />,
    color: "#ea4335",
  },
  {
    value: "copy",
    title: <FormattedMessage id="copy.link" defaultMessage="Copy link" />,
    icon: <LinkIcon />,
    color: "#6c757d",
  },
];

export default function GlassShareDialog({
  dialogProps,
  url,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff',
}: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const handleCopy = () => {
    if (url !== undefined) {
      copyToClipboard(url);
      enqueueSnackbar(
        <FormattedMessage id="link.copied" defaultMessage="Link copied" />,
        { variant: "success" }
      );
    }
  };

  const handleShareOption = (value: string) => {
    if (!url) return;

    if (value === "copy") {
      handleCopy();
      return;
    }

    const msg = formatMessage({
      id: "share.payment.request",
      defaultMessage: "Payment request link: {url}",
    }, { url });

    try {
      const shareLink = generateShareLink(msg, url, value as ShareType);
      window.open(shareLink, "_blank");
    } catch (error) {
      console.error("Error generating share link:", error);
    }
  };

  const glassmorphismStyles = {
    backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
    backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05) !important`,
    WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05) !important`,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 4, 0.6)}) inset,
      0 -2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <GlassDialog
      {...dialogProps}
      fullScreen={isMobile}
      blurIntensity={blurIntensity}
      glassOpacity={glassOpacity}
      PaperProps={{
        sx: {
          ...glassmorphismStyles,
          ...(isMobile && {
            margin: 0,
            borderRadius: 0,
            maxHeight: '100%',
            height: '100%',
          }),
          ...(!isMobile && {
            minHeight: 'auto',
            maxHeight: '80vh',
            borderRadius: { xs: '16px', sm: '18px', md: '20px' },
          }),
          '& .MuiDialogTitle-root': {
            backgroundColor: 'transparent !important',
            color: `${textColor} !important`,
            fontWeight: '600 !important',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            textShadow: textColor.includes('255, 255, 255')
              ? '0 1px 2px rgba(0, 0, 0, 0.3)'
              : '0 1px 2px rgba(255, 255, 255, 0.3)',
          },
          '& .MuiDialogContent-root': {
            backgroundColor: 'transparent !important',
            color: `${textColor} !important`,
          },
          '& .MuiDivider-root': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) !important`,
            opacity: 0.7,
          },
          '& .MuiTypography-root': {
            color: `${textColor} !important`,
            textShadow: textColor.includes('255, 255, 255')
              ? '0 1px 2px rgba(0, 0, 0, 0.3)'
              : '0 1px 2px rgba(255, 255, 255, 0.3)',
          },
          '& .MuiTextField-root, & .MuiOutlinedInput-root, & .MuiInputBase-root': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.12)}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) !important`,
            borderRadius: { xs: '10px !important', sm: '12px !important', md: '14px !important' },
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) inset !important`,
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none !important',
            },
            '& .MuiInputBase-input, & input': {
              color: `${textColor} !important`,
              backgroundColor: 'transparent !important',
              '&::placeholder': {
                color: `${textColor} !important`,
                opacity: '0.7 !important',
              },
            },
            '& .MuiInputLabel-root': {
              color: `${textColor} !important`,
              opacity: '0.8 !important',
            },
          },
        },
      }}
    >
      <AppDialogTitle
        icon={<ShareIcon />}
        title={
          <FormattedMessage
            id="share"
            defaultMessage="Share"
            description="Share dialog title"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent
        sx={{
          p: isMobile ? theme.spacing(2) : theme.spacing(3),
          overflow: 'auto',
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: `${textColor} !important`,
                fontWeight: '600 !important',
                mb: 2,
                textAlign: 'center',
              }}
            >
              <FormattedMessage
                id="share.via"
                defaultMessage="Share via"
              />
            </Typography>
            <Grid container spacing={1.5} justifyContent="center">
              {socialShareOptions.map((option) => (
                <Grid key={option.value}>
                  <Box sx={{ textAlign: 'center' }}>
                    <IconButton
                      onClick={() => handleShareOption(option.value)}
                      sx={{
                        width: { xs: 48, sm: 56, md: 64 },
                        height: { xs: 48, sm: 56, md: 64 },
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)}) !important`,
                        backdropFilter: `blur(${blurIntensity}px) saturate(160%) brightness(1.03) !important`,
                        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(160%) brightness(1.03) !important`,
                        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.4)}) !important`,
                        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
                        color: option.value === 'copy' ? `${textColor} !important` : `${option.color} !important`,
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        mb: 1,

                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)`,
                          pointerEvents: 'none',
                          borderRadius: 'inherit',
                          zIndex: 0,
                        },

                        '& > *': {
                          position: 'relative',
                          zIndex: 1,
                        },

                        '&:hover': {
                          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.35)}) !important`,
                          backdropFilter: `blur(${blurIntensity + 5}px) saturate(180%) brightness(1.08) !important`,
                          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(180%) brightness(1.08) !important`,
                          boxShadow: `
                            0 8px 25px rgba(0, 0, 0, 0.15),
                            inset 0 2px 0 rgba(255, 255, 255, 0.4),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                          `,

                          '&::before': {
                            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 40%, rgba(255, 255, 255, 0.15) 100%)`,
                          },
                        },
                      }}
                    >
                      {option.icon}
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        color: `${textColor} !important`,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontWeight: '500 !important',
                        display: 'block',
                        textAlign: 'center',
                        opacity: 0.9,
                      }}
                    >
                      {option.title}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: `${textColor} !important`,
                fontWeight: '600 !important',
                mb: 1.5,
              }}
            >
              <FormattedMessage
                id="payment.link"
                defaultMessage="Payment link"
              />
            </Typography>
            <TextField
              fullWidth
              value={url}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <CopyIconButton
                      iconButtonProps={{
                        onClick: handleCopy,
                        size: "small",
                        sx: {
                          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.2)}) !important`,
                          backdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.02) !important`,
                          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.02) !important`,
                          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) !important`,
                          borderRadius: { xs: '6px !important', sm: '8px !important', md: '10px !important' },
                          color: `${textColor} !important`,
                          '&:hover': {
                            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)}) !important`,
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                      tooltip={formatMessage({
                        id: "copy",
                        defaultMessage: "Copy",
                        description: "Copy text",
                      })}
                      activeTooltip={formatMessage({
                        id: "copied",
                        defaultMessage: "Copied!",
                        description: "Copied text",
                      })}
                    >
                      <FileCopyIcon fontSize="small" />
                    </CopyIconButton>
                  </InputAdornment>
                ),
                sx: {
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontFamily: 'monospace',
                },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
    </GlassDialog>
  );
} 