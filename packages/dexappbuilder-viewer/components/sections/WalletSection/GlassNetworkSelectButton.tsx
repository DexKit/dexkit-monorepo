import { ChainId } from "@dexkit/core/constants";
import {
  NETWORK_IMAGE,
  NETWORK_NAME,
  NETWORK_SYMBOL,
} from "@dexkit/core/constants/networks";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import GlassChooseNetworkDialog from "./GlassChooseNetworkDialog";

interface Props {
  chainId?: ChainId;
  onChange: (chainId: ChainId) => void;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
  networkModalTextColor?: string;
}

const GlassButton = styled(Button)<{
  blurIntensity: number;
  glassOpacity: number;
  textColor: string;
}>(({ theme, blurIntensity, glassOpacity, textColor }) => ({
  position: 'relative',
  background: `rgba(255, 255, 255, ${glassOpacity})`,
  backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
  WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.8)})`,
  borderRadius: theme.spacing(2),
  color: textColor,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.85rem',
  padding: theme.spacing(0.75, 1.5),
  minHeight: '36px',
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    padding: theme.spacing(0.6, 1.2),
    minHeight: '32px',
    borderRadius: theme.spacing(1.5),
  },

  [theme.breakpoints.down(400)]: {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 1),
    minHeight: '28px',
    borderRadius: theme.spacing(1.2),
  },

  [theme.breakpoints.between('sm', 'md')]: {
    fontSize: '0.9rem',
    padding: theme.spacing(0.8, 1.6),
    minHeight: '38px',
  },

  [theme.breakpoints.up('lg')]: {
    fontSize: '0.9rem',
    padding: theme.spacing(0.8, 1.8),
    minHeight: '40px',
    borderRadius: theme.spacing(2.2),
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },

  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.9)})`,
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 1)})`,

    [theme.breakpoints.down('sm')]: {
      transform: 'translateY(-1px) scale(1.01)',
    },
  },

  '&:active': {
    transform: 'translateY(-1px) scale(1.01)',

    [theme.breakpoints.down('sm')]: {
      transform: 'scale(0.99)',
    },
  },

  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: theme.spacing(1),

    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(0.8),
    },

    [theme.breakpoints.down(400)]: {
      marginRight: theme.spacing(0.6),
    },
  },
}));

const GlassAvatar = styled(Avatar)<{ textColor: string }>(({ theme, textColor }) => ({
  width: '20px !important',
  height: '20px !important',
  border: `1px solid ${textColor}30`,
  boxShadow: `
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  [theme.breakpoints.down('sm')]: {
    width: '18px !important',
    height: '18px !important',
  },

  [theme.breakpoints.down(400)]: {
    width: '16px !important',
    height: '16px !important',
  },

  [theme.breakpoints.between('sm', 'md')]: {
    width: '22px !important',
    height: '22px !important',
  },

  [theme.breakpoints.up('lg')]: {
    width: '24px !important',
    height: '24px !important',
  },

  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `
      0 6px 20px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3)
    `,

    [theme.breakpoints.down('sm')]: {
      transform: 'scale(1.05)',
    },
  },
}));

export function GlassNetworkSelectButton(props: Props) {
  const {
    onChange,
    chainId,
    blurIntensity = 20,
    glassOpacity = 0.25,
    textColor = '#ffffff',
    networkModalTextColor
  } = props;
  const [showSelectSwapNetworkDialog, setShowSelectSwapNetwork] = useState(false);

  const handleOpenSelectNetworkDialog = () => {
    setShowSelectSwapNetwork(true);
  };

  const handleCloseShowNetworkDialog = () => {
    setShowSelectSwapNetwork(false);
  };

  return (
    <>
      {showSelectSwapNetworkDialog && (
        <GlassChooseNetworkDialog
          dialogProps={{
            open: showSelectSwapNetworkDialog,
            fullWidth: true,
            maxWidth: "sm",
            onClose: handleCloseShowNetworkDialog,
          }}
          selectedChainId={chainId}
          onChange={(newChain) => {
            onChange(newChain);
          }}
          blurIntensity={blurIntensity}
          glassOpacity={glassOpacity}
          textColor={networkModalTextColor || textColor}
        />
      )}

      <GlassButton
        onClick={handleOpenSelectNetworkDialog}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={textColor}
        startIcon={
          <GlassAvatar
            src={NETWORK_IMAGE(chainId)}
            textColor={textColor}
            alt={NETWORK_NAME(chainId) || ""}
          />
        }
      >
        {NETWORK_SYMBOL(chainId) || ""}
      </GlassButton>
    </>
  );
} 