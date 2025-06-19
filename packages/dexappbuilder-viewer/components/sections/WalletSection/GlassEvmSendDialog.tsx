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
            backdropFilter: `blur(${blurIntensity * 0.5}px)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.2})`,
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
          },

          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
              backdropFilter: `blur(${blurIntensity * 0.6}px)`,
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
            '& .MuiOutlinedInput-root': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
              backdropFilter: `blur(${blurIntensity * 0.6}px)`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: textColor,

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

          '& .MuiPaper-root.MuiAutocomplete-paper': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.95})`,
            backdropFilter: `blur(${blurIntensity}px) saturate(180%)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',

            '& .MuiAutocomplete-listbox': {
              '& .MuiAutocomplete-option': {
                color: textColor,
                borderRadius: '8px',
                margin: '2px 4px',
                transition: 'all 0.2s ease-in-out',

                '&:hover': {
                  background: `rgba(255, 255, 255, ${glassOpacity * 0.6})`,
                  transform: 'translateX(4px)',
                },

                '&.Mui-focused': {
                  background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
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
            background: `linear-gradient(135deg, rgba(59, 81, 247, 0.9), rgba(8, 30, 196, 0.9))`,
            color: '#ffffff',

            '&:hover': {
              background: `linear-gradient(135deg, rgba(59, 81, 247, 1), rgba(8, 30, 196, 1))`,
              boxShadow: '0 8px 25px rgba(59, 81, 247, 0.4)',
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
            borderRadius: '8px',
            margin: '2px 0',
            transition: 'all 0.2s ease-in-out',

            '&:hover': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.6})`,
              transform: 'translateX(4px)',
            },

            '& .MuiListItemText-primary': {
              color: textColor,
              fontWeight: 500,
            },

            '& .MuiListItemText-secondary': {
              color: `${textColor}CC`,
            },
          },

          '& .MuiTypography-root': {
            color: textColor,
          },

          '& .MuiDivider-root': {
            borderColor: `rgba(255, 255, 255, 0.1)`,
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