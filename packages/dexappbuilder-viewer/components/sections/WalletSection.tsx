import EvmWalletContainer from "@dexkit/ui/modules/wallet/components/containers/EvmWalletContainer";
import { WalletPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { Container, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import CustomEvmWalletContainer from "./WalletSection/CustomEvmWalletContainer";
import GlassEvmWalletContainer from "./WalletSection/GlassEvmWalletContainer";

interface Props {
  section: WalletPageSection;
}

export function WalletSection({ section }: Props) {
  const theme = useTheme();
  const { variant, glassSettings, customSettings } = section.settings || {};

  const renderDefaultVariant = () => {
    return (
      <Box py={4}>
        <Container>
          <EvmWalletContainer />
        </Container>
      </Box>
    );
  };

  const renderGlassVariant = () => {
    const blurIntensity = glassSettings?.blurIntensity || 40;
    const glassOpacity = glassSettings?.glassOpacity || 0.10;
    const textColor = glassSettings?.textColor || theme.palette.text.primary;
    const hideNFTs = glassSettings?.hideNFTs || false;
    const hideActivity = glassSettings?.hideActivity || false;
    const removePadding = glassSettings?.removePadding || false;
    const customPadding = glassSettings?.customPadding;

    const getContainerBackground = () => {
      if (glassSettings?.disableBackground) {
        return 'transparent';
      }

      if (glassSettings?.backgroundType === 'image' && glassSettings?.backgroundImage) {
        const background = `url(${glassSettings.backgroundImage})`;
        return background;
      } else if (glassSettings?.backgroundType === 'solid') {
        const background = glassSettings.backgroundColor || theme.palette.background.default;
        return background;
      } else {
        const from = glassSettings?.gradientStartColor || theme.palette.background.default;
        const to = glassSettings?.gradientEndColor || theme.palette.background.paper;
        const direction = glassSettings?.gradientDirection || 'to bottom';

        const directionMap: Record<string, string> = {
          'to bottom': '180deg',
          'to top': '0deg',
          'to right': '90deg',
          'to left': '270deg',
          'to bottom right': '135deg',
          'to bottom left': '225deg',
        };
        const gradientDirection = directionMap[direction] || '180deg';
        const background = `linear-gradient(${gradientDirection}, ${from}, ${to})`;
        return background;
      }
    };

    const containerStyle = {
      minHeight: '100vh',
      background: getContainerBackground(),
      backgroundSize: glassSettings?.backgroundSize || 'cover',
      backgroundPosition: glassSettings?.backgroundPosition || 'center',
      backgroundRepeat: glassSettings?.backgroundRepeat || 'no-repeat',
      backgroundAttachment: glassSettings?.backgroundAttachment || 'scroll',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    const glassmorphismBase = {
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
      isolation: 'isolate',
      position: 'relative' as const,
      zIndex: 1,
    };

    const getPaddingStyles = () => {
      if (removePadding) {
        return {
          p: 0,
        };
      }

      if (customPadding) {
        return {
          pt: customPadding.top !== undefined ? customPadding.top : { xs: 3, sm: 4, md: 5 },
          pb: customPadding.bottom !== undefined ? customPadding.bottom : { xs: 3, sm: 4, md: 5 },
          pl: customPadding.left !== undefined ? customPadding.left : 0,
          pr: customPadding.right !== undefined ? customPadding.right : 0,
        };
      }

      return {
        py: { xs: 3, sm: 4, md: 5 },
      };
    };

    const walletContainerStyles = {
      ...getPaddingStyles(),
      position: 'relative' as const,
      zIndex: 2,
      '& .MuiContainer-root': {
        position: 'relative' as const,
        zIndex: 2,
      },
      '& .MuiCard-root': {
        ...glassmorphismBase,
        borderRadius: { xs: '16px !important', sm: '18px !important', md: '20px !important' },
        overflow: 'hidden !important',
        '&:hover': {
          transform: { xs: 'scale(1.005)', sm: 'translateY(-1px) scale(1.005)', md: 'translateY(-2px) scale(1.01)' },
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(200%) brightness(1.08) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(200%) brightness(1.08) !important`,
          boxShadow: `
            0 12px 40px rgba(0, 0, 0, 0.15),
            0 3px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 5, 0.7)}) inset,
            0 -3px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset
          `,
        },
      },
      '& .MuiCardContent-root': {
        backgroundColor: 'transparent !important',
        padding: { xs: '20px !important', sm: '24px !important', md: '28px !important' },
      },
      '& .MuiTypography-root': {
        color: `${textColor} !important`,
        fontWeight: '500',
        fontSize: { xs: '14px', sm: '15px', md: '16px' },
        lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
        textShadow: textColor.includes('255, 255, 255')
          ? '0 1px 2px rgba(0, 0, 0, 0.3)'
          : '0 1px 2px rgba(255, 255, 255, 0.3)',
        position: 'relative' as const,
        zIndex: 2,
      },
      '& .MuiButton-root': {
        position: 'relative' as const,
        zIndex: 2,
        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
        fontSize: { xs: '14px', sm: '15px', md: '16px' },
        fontWeight: '600',
        minHeight: { xs: '44px', sm: '48px', md: '52px' },
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        isolation: 'isolate',
        '&.MuiButton-contained': {
          backgroundColor: `${textColor} !important`,
          color: '#000000 !important',
          backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
          boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
          '&:hover': {
            backgroundColor: `${textColor} !important`,
            color: '#000000 !important',
            transform: { xs: 'scale(1.02)', sm: 'translateY(-1px) scale(1.02)', md: 'translateY(-2px) scale(1.03)' },
            backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 4, 0.5)}) inset`,
          },
          '&:active': {
            transform: { xs: 'scale(0.98)', sm: 'translateY(0) scale(0.98)', md: 'translateY(0) scale(0.97)' },
          },
        },
        '&.MuiButton-outlined, &:not(.MuiButton-contained)': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.1)}) !important`,
          color: `${textColor} !important`,
          backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
          '&:hover': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.15)}) !important`,
            color: `${textColor} !important`,
            transform: { xs: 'scale(1.01)', sm: 'translateY(-0.5px) scale(1.01)', md: 'translateY(-1px) scale(1.02)' },
            backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
            boxShadow: `0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
          },
          '&:active': {
            transform: { xs: 'scale(0.99)', sm: 'translateY(0) scale(0.99)', md: 'translateY(0) scale(0.98)' },
          },
        },
      },

      '& .MuiTabs-root': {
        '& .MuiTab-root': {
          color: `${textColor} !important`,
          fontWeight: '500',
          fontSize: { xs: '14px', sm: '15px', md: '16px' },
          textTransform: 'none',
          minHeight: { xs: '44px', sm: '48px', md: '52px' },
          borderRadius: { xs: '12px', sm: '14px', md: '16px' },
          margin: '0 4px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            color: `${textColor} !important`,
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
            fontWeight: '600',
            transform: 'scale(1.05)',
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
          },
          '&:hover': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
            backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
            transform: 'scale(1.02)',
          },
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      },
      '& .MuiIconButton-root': {
        color: `${textColor} !important`,
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        borderRadius: { xs: '10px !important', sm: '12px !important', md: '14px !important' },
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)}) !important`,
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          transform: { xs: 'scale(1.05)', sm: 'scale(1.08)', md: 'scale(1.1)' },
        },
      },
      '& .MuiChip-root': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        color: `${textColor} !important`,
        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
        fontWeight: '500',
        fontSize: { xs: '13px', sm: '14px', md: '15px' },
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.35)}) !important`,
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          transform: 'scale(1.02)',
        },
      },
      '& .MuiTableContainer-root': {
        ...glassmorphismBase,
        borderRadius: { xs: '16px !important', sm: '18px !important', md: '20px !important' },
        overflow: 'hidden !important',
        '& .MuiTable-root': {
          backgroundColor: 'transparent !important',
        },
      },
      '& .MuiTableHead-root': {
        '& .MuiTableCell-root': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) !important`,
          backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          borderBottom: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
          color: `${textColor} !important`,
          fontWeight: '600',
          fontSize: { xs: '13px', sm: '14px', md: '15px' },
        },
      },
      '& .MuiTableRow-root': {
        '& .MuiTableCell-root': {
          backgroundColor: 'transparent !important',
          borderBottom: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
          color: `${textColor} !important`,
          fontSize: { xs: '14px', sm: '15px', md: '16px' },
          padding: { xs: '12px 8px !important', sm: '16px 12px !important', md: '20px 16px !important' },
        },
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
          backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          transform: 'scale(1.005)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
      '& .MuiAvatar-root': {
        border: `2px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      '& .MuiListItem-root': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        margin: '4px 0 !important',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)}) !important`,
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          transform: { xs: 'scale(1.01)', sm: 'translateY(-1px) scale(1.01)', md: 'translateY(-2px) scale(1.02)' },
          boxShadow: `0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
        },
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            color: `${textColor} !important`,
          },
        },
      },
      '& .MuiCollapse-root': {
        '& .MuiCollapse-wrapper': {
          '& .MuiCollapse-wrapperInner': {
            backgroundColor: 'transparent !important',
          },
        },
      },
      '& .MuiTextField-root, & .MuiOutlinedInput-root, & .MuiInputBase-root': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.12)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) !important`,
        borderRadius: { xs: '10px !important', sm: '12px !important', md: '14px !important' },
        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) inset !important`,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important',
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
        '& .MuiInputAdornment-root .MuiSvgIcon-root': {
          color: `${textColor} !important`,
          opacity: '0.7 !important',
        },
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.03, 0.18)}) !important`,
          backdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
        },
        '&.Mui-focused, &:focus-within': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.2)}) !important`,
          backdropFilter: `blur(${blurIntensity + 3}px) saturate(160%) brightness(1.03) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 3}px) saturate(160%) brightness(1.03) !important`,
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset !important`,
        },
      },
      '& .MuiCard-root, & .MuiPaper-root:not(.MuiDialog-paper):not(.MuiPopover-paper):not(.MuiMenu-paper)': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.12)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) !important`,
        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.25)}) inset !important`,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important',
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.03, 0.18)}) !important`,
          backdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
          transform: 'scale(1.005)',
        },
      },
      '& .MuiTypography-caption:not(.MuiChip-label), & .MuiTypography-body2:not(.MuiChip-label), & .MuiTypography-h4, & .MuiTypography-h5, & .MuiTypography-h6': {
        '&:not(.MuiTableCell-root .MuiTypography-root)': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.1)}) !important`,
          backdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(140%) brightness(1.01) !important`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.2, 0.2)}) !important`,
          borderRadius: { xs: '8px !important', sm: '10px !important', md: '12px !important' },
          padding: { xs: '6px 10px !important', sm: '8px 14px !important', md: '10px 18px !important' },
          color: `${textColor} !important`,
          fontWeight: '500 !important',
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 1.2, 0.2)}) inset !important`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important',
          display: 'inline-block !important',
          margin: { xs: '2px 4px !important', sm: '4px 6px !important', md: '6px 8px !important' },
          '&:hover': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.02, 0.15)}) !important`,
            backdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity + 2}px) saturate(150%) brightness(1.02) !important`,
            transform: 'scale(1.02)',
          },
        },
      },
      '& button[aria-label*="receive"], & button[aria-label*="Receive"]': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        color: `${textColor} !important`,
        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)}) !important`,
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
          transform: { xs: 'scale(1.02)', sm: 'translateY(-1px) scale(1.02)', md: 'translateY(-2px) scale(1.03)' },
        },
      },
      '& .MuiGrid-container .MuiButton-root:not(.MuiButton-contained):not(.MuiButton-text)': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        color: `${textColor} !important`,
        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
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
      '& .MuiButton-root:has(.MuiAvatar-root)': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        color: `${textColor} !important`,
        borderRadius: { xs: '8px !important', sm: '10px !important', md: '12px !important' },
        padding: { xs: '4px 8px !important', sm: '5px 10px !important', md: '6px 12px !important' },
        minHeight: { xs: '28px !important', sm: '32px !important', md: '36px !important' },
        maxHeight: { xs: '28px !important', sm: '32px !important', md: '36px !important' },
        fontSize: { xs: '0.75rem !important', sm: '0.8rem !important', md: '0.85rem !important' },
        fontWeight: '600 !important',
        lineHeight: '1.2 !important',
        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiAvatar-root': {
          width: { xs: '16px !important', sm: '18px !important', md: '20px !important' },
          height: { xs: '16px !important', sm: '18px !important', md: '20px !important' },
          marginRight: { xs: '4px !important', sm: '6px !important', md: '8px !important' },
        },
        '& .MuiButton-startIcon': {
          marginLeft: '0 !important',
          marginRight: { xs: '4px !important', sm: '6px !important', md: '8px !important' },
        },
        '&:hover': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)}) !important`,
          backdropFilter: `blur(${blurIntensity + 3}px) saturate(160%) brightness(1.03) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 3}px) saturate(160%) brightness(1.03) !important`,
          transform: { xs: 'scale(1.01)', sm: 'translateY(-1px) scale(1.01)', md: 'translateY(-1px) scale(1.02)' },
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2.5, 0.35)}) inset`,
        },
      },
      '& .MuiStack-root:has(.MuiIconButton-root) .MuiTypography-h5': {
        fontSize: { xs: '2rem !important', sm: '2.5rem !important', md: '3rem !important' },
        fontWeight: '700 !important',
        lineHeight: '1.1 !important',
        color: `${textColor} !important`,
        textShadow: `0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 0.5, 0.15)})`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'block !important',
        '&:hover': {
          transform: 'scale(1.02)',
          textShadow: `0 3px 12px rgba(0, 0, 0, 0.15), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 0.7, 0.2)})`,
        },
      },
      '& .MuiButton-outlined:not(:has(.MuiAvatar-root))': {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
        color: `${textColor} !important`,
        borderRadius: { xs: '12px !important', sm: '14px !important', md: '16px !important' },
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
    };

    return (
      <>
        {removePadding ? (
          <Box sx={{
            width: '100%',
            height: '100vh',
            minHeight: '100vh',
            background: getContainerBackground(),
            backgroundSize: glassSettings?.backgroundSize || 'cover',
            backgroundPosition: glassSettings?.backgroundPosition || 'center',
            backgroundRepeat: glassSettings?.backgroundRepeat || 'no-repeat',
            backgroundAttachment: glassSettings?.backgroundAttachment || 'scroll',
            position: 'relative' as const,
            overflow: 'hidden' as const,
          }}>
            <GlassEvmWalletContainer
              blurIntensity={blurIntensity}
              glassOpacity={glassOpacity}
              textColor={textColor}
              hideNFTs={hideNFTs}
              hideActivity={hideActivity}
              hideSwapAction={glassSettings?.hideSwapAction}
              hideExchangeAction={glassSettings?.hideExchangeAction}
              hideSendAction={glassSettings?.hideSendAction}
              customSettings={customSettings}
              backgroundColor={glassSettings?.backgroundColor}
              backgroundImage={glassSettings?.backgroundImage}
              backgroundSize={glassSettings?.backgroundSize}
              backgroundPosition={glassSettings?.backgroundPosition}
              backgroundRepeat={glassSettings?.backgroundRepeat}
              backgroundType={glassSettings?.backgroundType}
              gradientStartColor={glassSettings?.gradientStartColor}
              gradientEndColor={glassSettings?.gradientEndColor}
              gradientDirection={glassSettings?.gradientDirection}
              swapVariant={customSettings?.swapConfig?.variant}
              networkModalTextColor={glassSettings?.networkModalTextColor || '#fff'}
              receiveModalTextColor={glassSettings?.receiveModalTextColor || '#fff'}
              sendModalTextColor={glassSettings?.sendModalTextColor || '#fff'}
              scanModalTextColor={glassSettings?.scanModalTextColor || '#fff'}
              importTokenModalTextColor={glassSettings?.importTokenModalTextColor || '#fff'}
            />
          </Box>
        ) : (
          <Box sx={containerStyle}>
            <Box sx={walletContainerStyles}>
              <Container>
                <GlassEvmWalletContainer
                  blurIntensity={blurIntensity}
                  glassOpacity={glassOpacity}
                  textColor={textColor}
                  hideNFTs={hideNFTs}
                  hideActivity={hideActivity}
                  hideSwapAction={glassSettings?.hideSwapAction}
                  hideExchangeAction={glassSettings?.hideExchangeAction}
                  hideSendAction={glassSettings?.hideSendAction}
                  customSettings={customSettings}
                  backgroundColor={glassSettings?.backgroundColor}
                  backgroundImage={glassSettings?.backgroundImage}
                  backgroundSize={glassSettings?.backgroundSize}
                  backgroundPosition={glassSettings?.backgroundPosition}
                  backgroundRepeat={glassSettings?.backgroundRepeat}
                  backgroundType={glassSettings?.backgroundType}
                  gradientStartColor={glassSettings?.gradientStartColor}
                  gradientEndColor={glassSettings?.gradientEndColor}
                  gradientDirection={glassSettings?.gradientDirection}
                  swapVariant={customSettings?.swapConfig?.variant}
                  networkModalTextColor={glassSettings?.networkModalTextColor || '#fff'}
                  receiveModalTextColor={glassSettings?.receiveModalTextColor || '#fff'}
                  sendModalTextColor={glassSettings?.sendModalTextColor || '#fff'}
                  scanModalTextColor={glassSettings?.scanModalTextColor || '#fff'}
                  importTokenModalTextColor={glassSettings?.importTokenModalTextColor || '#fff'}
                />
              </Container>
            </Box>
          </Box>
        )}
      </>
    );
  };

  const renderCustomVariant = () => {
    const removePadding = customSettings?.removePadding || false;
    const customPadding = customSettings?.customPadding;

    const getPaddingStyles = () => {
      if (removePadding) {
        return {
          p: 0,
        };
      }

      if (customPadding) {
        return {
          pt: customPadding.top !== undefined ? customPadding.top : 4,
          pb: customPadding.bottom !== undefined ? customPadding.bottom : 4,
          pl: customPadding.left !== undefined ? customPadding.left : 0,
          pr: customPadding.right !== undefined ? customPadding.right : 0,
        };
      }

      return {
        py: 4,
      };
    };

    return (
      <>
        {removePadding ? (
          <Box sx={{
            width: '100%',
            margin: 0,
            padding: 0
          }}>
            <CustomEvmWalletContainer customSettings={customSettings} removePadding={true} />
          </Box>
        ) : (
          <Box sx={getPaddingStyles()}>
            <Container>
              <CustomEvmWalletContainer customSettings={customSettings} removePadding={false} />
            </Container>
          </Box>
        )}
      </>
    );
  };

  const renderContent = () => {
    switch (variant) {
      case "glass":
        return renderGlassVariant();
      case "custom":
        return renderCustomVariant();
      default:
        return renderDefaultVariant();
    }
  };

  return renderContent();
}

export default WalletSection;
