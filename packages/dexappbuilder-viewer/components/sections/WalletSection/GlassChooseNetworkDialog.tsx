import { useIsMobile } from "@dexkit/core";
import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Network } from "@dexkit/core/types";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import { useActiveChainIds } from "@dexkit/ui/hooks/blockchain";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Stack,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

interface Props {
  dialogProps: DialogProps;
  onChange: (chainId: number) => void;
  selectedChainId?: ChainId;
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
    maxHeight: 'calc(100vh - 64px)',

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
      margin: theme.spacing(3),
      borderRadius: theme.spacing(3),
      maxHeight: 'calc(100vh - 96px)',
      minWidth: '400px',
    },

    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(4),
      borderRadius: theme.spacing(3.5),
      maxHeight: 'calc(100vh - 128px)',
      minWidth: '480px',
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

    [theme.breakpoints.down(400)]: {
      background: 'rgba(0, 0, 0, 0.7)',
    },
  },
}));

const GlassDialogContent = styled(DialogContent)<{
  glassOpacity: number;
  textColor: string;
}>(({ theme, glassOpacity, textColor }) => ({
  padding: theme.spacing(1),
  color: textColor,

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
  },

  [theme.breakpoints.down(400)]: {
    padding: theme.spacing(0.5),
    paddingTop: 0,
  },

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(1.5),
  },

  '& .MuiList-root': {
    padding: 0,
    background: 'transparent',
  },
}));

const GlassListItemButton = styled(ListItemButton)<{
  glassOpacity: number;
  textColor: string;
}>(({ theme, glassOpacity, textColor }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(0.5),
  borderRadius: theme.spacing(1.5),
  color: textColor,
  background: 'transparent',
  border: `1px solid rgba(255, 255, 255, ${glassOpacity * 0.3})`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    margin: theme.spacing(0.3),
    borderRadius: theme.spacing(1.2),
  },

  [theme.breakpoints.down(400)]: {
    padding: theme.spacing(1.2),
    margin: theme.spacing(0.2),
    borderRadius: theme.spacing(1),
  },

  [theme.breakpoints.between('sm', 'md')]: {
    padding: theme.spacing(2.2),
    margin: theme.spacing(0.6),
  },

  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(2.5),
    margin: theme.spacing(0.7),
    borderRadius: theme.spacing(1.8),
  },

  '&:hover': {
    background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})`,
    transform: 'translateY(-2px)',
    boxShadow: `
      0 8px 25px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})`,

    [theme.breakpoints.down('sm')]: {
      transform: 'translateY(-1px)',
    },
  },

  '&.Mui-selected': {
    background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.5)})`,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)})`,
    boxShadow: `
      0 8px 25px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3)
    `,

    '&:hover': {
      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})`,
    },
  },

  '& .MuiListItemText-primary': {
    color: textColor,
    fontWeight: 600,
    fontSize: '1rem',

    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },

    [theme.breakpoints.down(400)]: {
      fontSize: '0.85rem',
    },

    [theme.breakpoints.up('lg')]: {
      fontSize: '1.1rem',
    },
  },

  '& .MuiListItemText-secondary': {
    color: `${textColor}CC`,
    fontSize: '0.875rem',

    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },

    [theme.breakpoints.down(400)]: {
      fontSize: '0.75rem',
    },

    [theme.breakpoints.up('lg')]: {
      fontSize: '0.9rem',
    },
  },
}));

const GlassAvatar = styled(Avatar)<{ textColor: string }>(({ theme, textColor }) => ({
  width: '32px !important',
  height: '32px !important',
  border: `1px solid ${textColor}30`,
  boxShadow: `
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  [theme.breakpoints.down('sm')]: {
    width: '28px !important',
    height: '28px !important',
  },

  [theme.breakpoints.down(400)]: {
    width: '24px !important',
    height: '24px !important',
  },

  [theme.breakpoints.up('lg')]: {
    width: '36px !important',
    height: '36px !important',
  },
}));

const GlassRadio = styled(Radio)<{ textColor: string }>(({ theme, textColor }) => ({
  color: `${textColor}80`,

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.8),
  },

  [theme.breakpoints.down(400)]: {
    padding: theme.spacing(0.6),
  },

  '&.Mui-checked': {
    color: textColor,
  },

  '& .MuiSvgIcon-root': {
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },

    [theme.breakpoints.down(400)]: {
      fontSize: '1.1rem',
    },

    [theme.breakpoints.up('lg')]: {
      fontSize: '1.4rem',
    },
  },
}));

const GlassButton = styled(Button)<{
  glassOpacity: number;
  textColor: string;
  glassVariant?: 'primary' | 'secondary';
}>(({ theme, glassOpacity, textColor, glassVariant = 'secondary' }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1, 2),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.8, 1.6),
    fontSize: '0.85rem',
    borderRadius: theme.spacing(1.2),
  },

  [theme.breakpoints.down(400)]: {
    padding: theme.spacing(0.7, 1.4),
    fontSize: '0.8rem',
    borderRadius: theme.spacing(1),
  },

  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(1.2, 2.5),
    fontSize: '1rem',
    borderRadius: theme.spacing(1.8),
  },

  ...(glassVariant === 'primary' ? {
    background: textColor,
    color: '#000000',
    border: `1px solid ${textColor}`,
    boxShadow: `
      0 6px 20px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,

    '&:hover': {
      background: textColor,
      transform: 'translateY(-2px)',
      boxShadow: `
        0 8px 25px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,

      [theme.breakpoints.down('sm')]: {
        transform: 'translateY(-1px)',
      },
    },
  } : {
    background: `rgba(255, 255, 255, ${glassOpacity})`,
    color: textColor,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.8)})`,
    boxShadow: `
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,

    '&:hover': {
      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)})`,
      transform: 'translateY(-2px)',
      boxShadow: `
        0 6px 20px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,

      [theme.breakpoints.down('sm')]: {
        transform: 'translateY(-1px)',
      },
    },
  }),
}));

const GlassDialogActions = styled(DialogActions)<{
  glassOpacity: number;
}>(({ theme, glassOpacity }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid rgba(255, 255, 255, ${glassOpacity * 0.3})`,
  gap: theme.spacing(1),

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(0.8),
    flexDirection: 'column-reverse',
  },

  [theme.breakpoints.down(400)]: {
    padding: theme.spacing(1),
    gap: theme.spacing(0.6),
  },

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2.5),
    gap: theme.spacing(1.2),
  },

  '& .MuiButton-root': {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
    },
  },
}));

function GlassChooseNetworkDialog({
  dialogProps,
  onChange,
  selectedChainId,
  blurIntensity = 20,
  glassOpacity = 0.25,
  textColor = '#ffffff',
}: Props) {
  const { onClose } = dialogProps;
  const { activeChainIds } = useActiveChainIds();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [chainId, setChainId] = useState<number | undefined>(selectedChainId);

  const handleClose = () => onClose!({}, "backdropClick");

  const handleSwitchNetwork = async () => {
    if (chainId !== undefined) {
      onChange(chainId);
      handleClose();
    }
  };

  const handleSelectNetwork = (id: number) => {
    if (id === chainId) {
      return setChainId(undefined);
    }

    setChainId(id);
  };

  return (
    <GlassDialog
      {...dialogProps}
      fullScreen={isMobile}
      blurIntensity={blurIntensity}
      glassOpacity={glassOpacity}
    >
      <AppDialogTitle
        title={
          <FormattedMessage
            id="select.network"
            defaultMessage="Select Network"
            description="select network dialog title"
          />
        }
        onClose={handleClose}
        sx={{
          color: textColor,
          '& .MuiIconButton-root': {
            color: textColor,
          }
        }}
      />
      <GlassDialogContent
        dividers
        glassOpacity={glassOpacity}
        textColor={textColor}
      >
        <Stack spacing={2}>
          <List disablePadding>
            {Object.keys(NETWORKS)
              .filter((k) => Number(k) !== selectedChainId)
              .filter((k) => activeChainIds.includes(Number(k)))
              .filter((k) => !NETWORKS[parseInt(k)].testnet)
              .map((key: any, index: number) => (
                <GlassListItemButton
                  selected={(NETWORKS[key] as Network).chainId === chainId}
                  key={index}
                  onClick={() =>
                    handleSelectNetwork((NETWORKS[key] as Network).chainId)
                  }
                  glassOpacity={glassOpacity}
                  textColor={textColor}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: (theme) => theme.spacing(6),
                        display: "flex",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <GlassAvatar
                        src={(NETWORKS[key] as Network).imageUrl}
                        textColor={textColor}
                        alt={(NETWORKS[key] as Network).name}
                      />
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={(NETWORKS[key] as Network).name}
                    secondary={(NETWORKS[key] as Network).symbol}
                  />
                  <ListItemSecondaryAction>
                    <GlassRadio
                      name="chainId"
                      checked={(NETWORKS[key] as Network).chainId === chainId}
                      textColor={textColor}
                    />
                  </ListItemSecondaryAction>
                </GlassListItemButton>
              ))}
          </List>
        </Stack>
      </GlassDialogContent>
      <GlassDialogActions glassOpacity={glassOpacity}>
        <GlassButton
          glassVariant="primary"
          onClick={handleSwitchNetwork}
          glassOpacity={glassOpacity}
          textColor={textColor}
        >
          <FormattedMessage
            id="select"
            defaultMessage="Select"
            description="select"
          />
        </GlassButton>
        <GlassButton
          onClick={handleClose}
          glassOpacity={glassOpacity}
          textColor={textColor}
        >
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </GlassButton>
      </GlassDialogActions>
    </GlassDialog>
  );
}

export default GlassChooseNetworkDialog; 