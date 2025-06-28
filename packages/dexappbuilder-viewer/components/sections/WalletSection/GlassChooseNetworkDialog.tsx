import { useIsMobile } from "@dexkit/core";
import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Network } from "@dexkit/core/types";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import { useActiveChainIds } from "@dexkit/ui/hooks/blockchain";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Stack,
  TextField,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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

  '& .MuiDivider-root': {
    borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)})`,
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
    background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.45, 0.8)})`,
    backdropFilter: 'blur(15px) saturate(200%) brightness(115%)',
    WebkitBackdropFilter: 'blur(15px) saturate(200%) brightness(115%)',
    color: textColor,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.5, 0.95)})`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 4px 16px rgba(255, 255, 255, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.6),
      inset 0 -2px 0 rgba(255, 255, 255, 0.2),
      inset 0 0 20px rgba(255, 255, 255, 0.1)
    `,
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 30%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
      pointerEvents: 'none',
      borderRadius: 'inherit',
    },

    '&:hover': {
      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.55, 0.9)})`,
      backdropFilter: 'blur(18px) saturate(220%) brightness(125%)',
      WebkitBackdropFilter: 'blur(18px) saturate(220%) brightness(125%)',
      boxShadow: `
        0 12px 40px rgba(0, 0, 0, 0.25),
        0 6px 20px rgba(255, 255, 255, 0.4),
        inset 0 3px 0 rgba(255, 255, 255, 0.7),
        inset 0 -3px 0 rgba(255, 255, 255, 0.3),
        inset 0 0 25px rgba(255, 255, 255, 0.15)
      `,
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

const GlassTextField = styled(TextField)<{
  glassOpacity: number;
  textColor: string;
}>(({ theme, glassOpacity, textColor }) => ({
  '& .MuiOutlinedInput-root': {
    background: `rgba(255, 255, 255, ${Math.min(glassOpacity * 0.8, 0.2)})`,
    backdropFilter: `blur(10px) saturate(150%)`,
    WebkitBackdropFilter: `blur(10px) saturate(150%)`,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})`,
    borderRadius: theme.spacing(1.5),
    color: textColor,
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.3)})`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})`,
    },

    '&.Mui-focused': {
      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)})`,
      boxShadow: `0 0 0 2px rgba(255, 255, 255, ${Math.min(glassOpacity * 0.5, 0.2)})`,
    },

    '& fieldset': {
      border: 'none',
    },

    '& input': {
      color: textColor,
      '&::placeholder': {
        color: `${textColor}CC`,
        opacity: 1,
      },
    },
  },

  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      color: `${textColor}CC`,
    },
    '& .MuiIconButton-root': {
      color: `${textColor}CC`,
      '&:hover': {
        background: `rgba(255, 255, 255, ${Math.min(glassOpacity * 0.5, 0.2)})`,
        color: textColor,
      },
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
  const { formatMessage } = useIntl();

  const [chainId, setChainId] = useState<number | undefined>(selectedChainId);
  const [searchTerm, setSearchTerm] = useState("");

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

  const availableNetworks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((k) => Number(k) !== selectedChainId)
      .filter((k) => activeChainIds.includes(Number(k)))
      .filter((k) => !NETWORKS[parseInt(k)].testnet)
      .map((key) => ({ key, network: NETWORKS[parseInt(key)] as Network }));
  }, [activeChainIds, selectedChainId]);

  const filteredNetworks = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableNetworks;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return availableNetworks.filter(({ network }: { network: Network }) =>
      network.name.toLowerCase().includes(lowercaseSearch) ||
      network.symbol.toLowerCase().includes(lowercaseSearch)
    );
  }, [availableNetworks, searchTerm]);

  const showSearchBar = availableNetworks.length > 10;

  const handleClearSearch = () => {
    setSearchTerm("");
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

          '& .MuiIconButton-root': {
            color: `${textColor} !important`,
            background: `rgba(255, 255, 255, ${glassOpacity * 0.8}) !important`,
            backdropFilter: `blur(${blurIntensity * 0.5}px) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px) !important`,
            border: '1px solid rgba(255, 255, 255, 0.2) !important',
            transition: 'all 0.2s ease-in-out !important',
            borderRadius: '50% !important',
            width: '32px !important',
            height: '32px !important',
            '&:hover': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.2}) !important`,
              transform: 'scale(1.05) !important',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2) !important',
              backdropFilter: `blur(${blurIntensity * 0.7}px) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity * 0.7}px) !important`,
            },
            '&:active': {
              transform: 'scale(0.98) !important',
            },
          }
        }}
      />
      <Divider />
      <GlassDialogContent
        glassOpacity={glassOpacity}
        textColor={textColor}
      >
        <Stack spacing={2}>
          {showSearchBar && (
            <Box sx={{ p: 2, pb: 0 }}>
              <GlassTextField
                fullWidth
                size="small"
                placeholder={formatMessage({
                  id: "search.networks",
                  defaultMessage: "Search networks..."
                })}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                glassOpacity={glassOpacity}
                textColor={textColor}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
          <List disablePadding>
            {filteredNetworks.map(({ key, network }: { key: string, network: Network }, index: number) => (
              <GlassListItemButton
                selected={network.chainId === chainId}
                key={index}
                onClick={() => handleSelectNetwork(network.chainId)}
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
                      src={network.imageUrl}
                      textColor={textColor}
                      alt={network.name}
                    />
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={network.name}
                  secondary={network.symbol}
                />
                <ListItemSecondaryAction>
                  <GlassRadio
                    name="chainId"
                    checked={network.chainId === chainId}
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