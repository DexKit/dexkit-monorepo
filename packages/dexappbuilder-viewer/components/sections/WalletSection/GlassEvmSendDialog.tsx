import { useIsMobile } from "@dexkit/core";
import { AppDialogTitle } from "@dexkit/ui/components";
import EvmTransferCoin, { EvmTransferCoinProps } from "@dexkit/ui/modules/evm-transfer-coin/components/EvmTransferCoin";
import { Dialog, DialogContent, DialogProps, Divider, useTheme } from "@mui/material";
import { FormattedMessage } from "react-intl";

interface Props {
  dialogProps: DialogProps;
  params: EvmTransferCoinProps;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

export default function GlassEvmSendDialog({
  dialogProps,
  params,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff'
}: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();

  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog
      {...dialogProps}
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
          },

          [theme.breakpoints.down(400)]: {
            margin: 0,
            borderRadius: 0,
            maxHeight: '100vh',
            height: '100vh',
            width: '100vw',
            maxWidth: '100vw',
          },

          [theme.breakpoints.between('sm', 'md')]: {
            margin: theme.spacing(2),
            borderRadius: theme.spacing(2.5),
            maxWidth: '480px',
            minWidth: '400px',
          },

          [theme.breakpoints.up('lg')]: {
            margin: theme.spacing(3),
            borderRadius: theme.spacing(3),
            maxWidth: '520px',
            minWidth: '480px',
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

          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
              backdropFilter: `blur(${blurIntensity}px)`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: textColor,
              transition: 'all 0.2s ease-in-out',

              '& fieldset': {
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

              '& input': {
                color: textColor,
                '&::placeholder': {
                  color: `${textColor}CC`,
                },
              },
            },

            '& .MuiInputLabel-root': {
              color: textColor,
              fontWeight: 500,
              '&.Mui-focused': {
                color: textColor,
              },
              '&.MuiInputLabel-shrunk': {
                color: textColor,
              },
            },
          },

          '& .MuiAutocomplete-root': {
            '& .MuiAutocomplete-inputRoot': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
              backdropFilter: `blur(${blurIntensity}px)`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: textColor,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

              '& fieldset': {
                border: 'none',
              },

              '&:hover': {
                background: `rgba(255, 255, 255, ${glassOpacity * 1.1})`,
                transform: 'translateY(-1px)',
              },

              '&.Mui-focused': {
                background: `rgba(255, 255, 255, ${glassOpacity * 1.2})`,
                boxShadow: `0 0 0 2px ${textColor}40`,
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                borderBottom: 'none',
              },

              '& input': {
                color: textColor,
                '&::placeholder': {
                  color: `${textColor}CC`,
                },
              },
            },

            '& .MuiInputLabel-root': {
              color: textColor,
              fontWeight: 500,
              '&.Mui-focused': {
                color: textColor,
              },
              '&.MuiInputLabel-shrunk': {
                color: textColor,
              },
            },
          },

          '& .MuiPopper-root': {
            position: 'relative !important',
            inset: 'auto !important',
            transform: 'none !important',
          },

          '& .MuiPaper-root.MuiAutocomplete-paper': {
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.85)}) !important`,
            backdropFilter: `blur(${blurIntensity + 10}px) saturate(200%) brightness(115%) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity + 10}px) saturate(200%) brightness(115%) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.7)}) !important`,
            borderTop: 'none !important',
            borderRadius: '0 0 16px 16px !important',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 4px 16px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 -2px 0 rgba(255, 255, 255, 0.1)
            `,
            position: 'relative',
            overflow: 'hidden',
            margin: '0 !important',
            marginBottom: '16px !important',
            width: '100% !important',
            maxHeight: '240px !important',

            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 30%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)',
              pointerEvents: 'none',
              borderRadius: 'inherit',
              zIndex: 0,
            },

            '& .MuiAutocomplete-listbox': {
              position: 'relative',
              zIndex: 1,
              padding: '8px !important',
              maxHeight: '200px !important',
              overflowY: 'auto !important',

              '& .MuiAutocomplete-option': {
                color: `${textColor} !important`,
                borderRadius: '10px !important',
                margin: '2px 0 !important',
                padding: '10px 14px !important',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important',
                background: `rgba(255, 255, 255, ${Math.min(glassOpacity * 0.6, 0.12)}) !important`,
                border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 0.4, 0.2)}) !important`,
                backdropFilter: `blur(${blurIntensity * 0.3}px) saturate(140%) !important`,
                WebkitBackdropFilter: `blur(${blurIntensity * 0.3}px) saturate(140%) !important`,

                '&:hover': {
                  background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)}) !important`,
                  backdropFilter: `blur(${blurIntensity * 0.5}px) saturate(160%) brightness(108%) !important`,
                  WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px) saturate(160%) brightness(108%) !important`,
                  transform: 'scale(1.01) !important',
                  boxShadow: `
                    0 4px 12px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `,
                  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.4)}) !important`,
                },

                '&.Mui-focused': {
                  background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.35)}) !important`,
                  backdropFilter: `blur(${blurIntensity * 0.6}px) saturate(170%) brightness(112%) !important`,
                  WebkitBackdropFilter: `blur(${blurIntensity * 0.6}px) saturate(170%) brightness(112%) !important`,
                  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)}) !important`,
                  boxShadow: `
                    0 6px 16px rgba(0, 0, 0, 0.15),
                    inset 0 2px 0 rgba(255, 255, 255, 0.4)
                  `,
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

            '&.Mui-disabled': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.5})`,
              color: `${textColor}60`,
              transform: 'none',
            },
          },

          '& .MuiButton-contained': {
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.6)}) !important`,
            backdropFilter: `blur(${blurIntensity * 0.8}px) saturate(180%) brightness(120%) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.8}px) saturate(180%) brightness(120%) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)}) !important`,
            borderRadius: '12px !important',
            color: `${textColor} !important`,
            fontWeight: '600 !important',
            textTransform: 'none !important',
            padding: '14px 32px !important',
            fontSize: '1rem !important',
            transition: 'all 0.3s ease-in-out !important',
            boxShadow: `
              0 8px 25px rgba(0, 0, 0, 0.15) !important,
              inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)}) !important,
              inset 0 -1px 0 rgba(255, 255, 255, 0.1) !important
            `,
            textShadow: textColor.includes('255, 255, 255')
              ? '0 1px 2px rgba(0, 0, 0, 0.3)'
              : '0 1px 2px rgba(255, 255, 255, 0.3)',

            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.25, 0.75)}) !important`,
              backdropFilter: `blur(${blurIntensity * 1.0}px) saturate(200%) brightness(130%) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity * 1.0}px) saturate(200%) brightness(130%) !important`,
              transform: 'translateY(-2px) scale(1.02) !important',
              boxShadow: `
                0 12px 35px rgba(0, 0, 0, 0.25) !important,
                inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)}) !important,
                inset 0 -1px 0 rgba(255, 255, 255, 0.15) !important
              `,
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.9)}) !important`,
            },

            '&:active': {
              transform: 'translateY(-1px) scale(1.0) !important',
              transition: 'all 0.15s ease-in-out !important',
            },

            '&.Mui-disabled': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.6}) !important`,
              color: `${textColor}50 !important`,
              opacity: '0.6 !important',
              transform: 'none !important',
              backdropFilter: `blur(${blurIntensity * 0.4}px) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px) !important`,
            },
          },

          '& .MuiChip-root': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
            backdropFilter: `blur(${blurIntensity * 0.5}px)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: textColor,
            borderRadius: '20px',
            transition: 'all 0.2s ease-in-out',

            '&:hover': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.1})`,
              transform: 'scale(1.05)',
            },

            '& .MuiChip-deleteIcon': {
              color: `${textColor}CC`,
              '&:hover': {
                color: textColor,
              },
            },
          },

          '& .MuiAvatar-root': {
            border: `2px solid rgba(255, 255, 255, 0.3)`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },

          '& .MuiListItem-root': {
            borderRadius: '12px !important',
            margin: '4px 0 !important',
            padding: '12px 16px !important',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity * 0.8, 0.15)}) !important`,
            backdropFilter: `blur(${blurIntensity * 0.6}px) saturate(150%) brightness(105%) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.6}px) saturate(150%) brightness(105%) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 0.5, 0.25)}) !important`,
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,

            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.4)}) !important`,
              backdropFilter: `blur(${blurIntensity * 0.9}px) saturate(180%) brightness(115%) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity * 0.9}px) saturate(180%) brightness(115%) !important`,
              transform: 'translateY(-2px) scale(1.02) !important',
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)}) !important`,
              boxShadow: `
                0 6px 20px rgba(0, 0, 0, 0.15),
                inset 0 2px 0 rgba(255, 255, 255, 0.4)
              `,
            },

            '& .MuiListItemText-primary': {
              color: `${textColor} !important`,
              fontWeight: '600 !important',
              textShadow: textColor.includes('255, 255, 255')
                ? '0 1px 2px rgba(0, 0, 0, 0.3)'
                : '0 1px 2px rgba(255, 255, 255, 0.3)',
            },

            '& .MuiListItemText-secondary': {
              color: `${textColor}CC !important`,
              textShadow: textColor.includes('255, 255, 255')
                ? '0 1px 2px rgba(0, 0, 0, 0.2)'
                : '0 1px 2px rgba(255, 255, 255, 0.2)',
            },

            '& .MuiListItemAvatar-root': {
              '& .MuiAvatar-root': {
                border: `2px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)}) !important`,
                boxShadow: `
                  0 4px 12px rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `,
              },
            },
          },

          '& .MuiTypography-root': {
            color: textColor,
          },

          '& .MuiDivider-root': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)})`,
          },

          '& .MuiSkeleton-root': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
            '&::after': {
              background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)`,
            },
          },

          '& .MuiCircularProgress-root': {
            color: textColor,
          },

          '& .MuiInputAdornment-root': {
            '& .MuiIconButton-root': {
              color: `${textColor}70`,
              background: 'transparent',
              border: 'none',

              '&:hover': {
                color: textColor,
                background: `rgba(255, 255, 255, ${glassOpacity * 0.5})`,
              },
            },

            '& .MuiSvgIcon-root': {
              color: `${textColor}70`,
            },
          },
        },
      }}
    >
      <AppDialogTitle
        title={<FormattedMessage id="send" defaultMessage="Send" />}
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
          py: isMobile ? theme.spacing(2) : theme.spacing(3),
          '&.MuiDialogContent-root': {
            paddingTop: isMobile ? theme.spacing(2) : theme.spacing(3),
          },
        }}
      >
        <EvmTransferCoin {...params} />
      </DialogContent>
    </Dialog>
  );
}