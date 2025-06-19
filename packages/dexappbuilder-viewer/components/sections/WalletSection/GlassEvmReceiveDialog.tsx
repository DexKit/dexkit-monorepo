import { NETWORK_NAME } from "@dexkit/core/constants/networks";
import { EvmCoin } from "@dexkit/core/types";

import { useIsMobile } from "@dexkit/core";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import EvmReceive from "@dexkit/ui/components/EvmReceive";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Dialog, DialogContent, DialogProps, Divider, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

interface Props {
  dialogProps: DialogProps;
  receiver?: string;
  ENSName?: string;
  chainId?: number;
  defaultCoin?: EvmCoin;
  coins?: EvmCoin[];
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

export default function GlassEvmReceiveDialog({
  dialogProps,
  receiver,
  chainId,
  coins,
  ENSName,
  defaultCoin,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff',
}: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { chainId: walletChainId } = useWeb3React();
  const { onClose } = dialogProps;
  const effectiveChainId = chainId || walletChainId;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
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
            minHeight: '70vh',
            maxHeight: '90vh',
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
          '& .MuiBox-root': {
            '&:has(svg)': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.2)}) !important`,
              backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
              borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
              boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
            },
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
          '& .MuiButton-root': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
            color: `${textColor} !important`,
            borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
            fontWeight: '600 !important',
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)}) !important`,
              backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
              transform: { xs: 'scale(1.02)', sm: 'translateY(-1px) scale(1.02)', md: 'translateY(-2px) scale(1.03)' },
              boxShadow: `0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
            },
          },
          '& .MuiAutocomplete-root': {
            '& .MuiAutocomplete-inputRoot': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.12)}) !important`,
              backdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) !important`,
            },
          },
          '& .MuiPaper-root.MuiAutocomplete-paper': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
            borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 4, 0.6)}) inset`,
          },
          '& .MuiListItem-root': {
            color: `${textColor} !important`,
            '&:hover': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.03, 0.18)}) !important`,
              backdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
            },
          },
          '& .MuiChip-root': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.12)}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) !important`,
            color: `${textColor} !important`,
            '& .MuiChip-label': {
              color: `${textColor} !important`,
            },
          },
        },
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage
            id="receive.on.network.value"
            defaultMessage="Receive on {network}"
            values={{
              network: NETWORK_NAME(effectiveChainId),
            }}
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
        <EvmReceive
          receiver={receiver}
          chainId={effectiveChainId}
          coins={coins}
          defaultCoin={defaultCoin}
          ENSName={ENSName}
        />
      </DialogContent>
    </GlassDialog>
  );
} 