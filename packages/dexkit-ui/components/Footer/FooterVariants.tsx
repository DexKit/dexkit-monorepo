// @ts-nocheck
import Facebook from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Reddit from "@mui/icons-material/Reddit";
import YouTube from "@mui/icons-material/YouTube";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  styled,
  SvgIcon,
  Typography,
  useTheme
} from "@mui/material";
import Image from "next/image";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import Link from "@dexkit/ui/components/AppLink";
import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import type {
  AppConfig,
  SocialMedia,
} from "@dexkit/ui/modules/wizard/types/config";
import NavbarMenu from "../Menu";

const XIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

interface FooterConfig {
  variant?: 'default' | 'glassmorphic' | 'minimal' | 'invisible' | 'custom';
  glassConfig?: {
    blurIntensity?: number;
    glassOpacity?: number;
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
  };
  minimalConfig?: {
    backgroundColor?: string;
    textColor?: string;
    dividerColor?: string;
    fontSize?: number;
    showDividers?: boolean;
    spacing?: number;
  };
  invisibleConfig?: {
    textColor?: string;
    fontSize?: number;
    spacing?: number;
    alignment?: 'left' | 'center' | 'right';
    showOnlySignature?: boolean;
  };
  customConfig?: {
    backgroundColor?: string;
    backgroundType?: 'solid' | 'gradient' | 'image';
    gradientDirection?: string;
    gradientColors?: string[];
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
    backgroundBlur?: number;
    padding?: number;
    borderRadius?: number;
    logo?: {
      url?: string;
      width?: number;
      height?: number;
      position?: {
        x: number;
        y: number;
      };
    };
    columns?: {
      id: string;
      title: string;
      titleStyle?: {
        fontSize?: number;
        fontWeight?: 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
        textDecoration?: 'none' | 'underline';
        color?: string;
      };
      links: {
        id: string;
        text: string;
        url: string;
        style?: {
          fontSize?: number;
          color?: string;
          hoverColor?: string;
          fontWeight?: 'normal' | 'bold';
          fontStyle?: 'normal' | 'italic';
        };
      }[];
      position?: {
        x: number;
        y: number;
        width?: number;
      };
    }[];
    menu?: {
      position?: {
        x: number;
        y: number;
      };
      style?: {
        fontSize?: number;
        color?: string;
        hoverColor?: string;
        fontWeight?: 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
        spacing?: number;
        direction?: 'horizontal' | 'vertical';
      };
    };
    socialMedia?: {
      position?: {
        x: number;
        y: number;
      };
      iconSize?: number;
      iconColor?: string;
      iconHoverColor?: string;
    };
    signature?: {
      position?: {
        x: number;
        y: number;
      };
      style?: {
        fontSize?: number;
        color?: string;
        fontWeight?: 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
      };
    };
  };
  customSignature?: {
    enabled?: boolean;
    text?: string;
    link?: string;
    showAppName?: boolean;
    showLoveBy?: boolean;
  };
  layout?: {
    signaturePosition?: 'left' | 'center' | 'right';
    menuPosition?: 'left' | 'center' | 'right';
    socialMediaPosition?: 'left' | 'center' | 'right';
    borderRadius?: number;
  };
}

interface Props {
  appNFT?: AssetAPI;
  appConfig: AppConfig & { footerConfig?: FooterConfig };
  isPreview?: boolean;
}

const GlassmorphicContainer = styled(Box, {
  shouldForwardProp: (prop) => !['blurIntensity', 'glassOpacity', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundAttachment', 'borderRadius'].includes(prop as string),
})<{
  blurIntensity: number;
  glassOpacity: number;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  borderRadius?: number;
}>(({ theme, blurIntensity, glassOpacity, backgroundColor, backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat, backgroundAttachment, borderRadius }) => {

  const appliedBorderRadius = borderRadius || 0;

  return {
    position: 'relative',
    minHeight: '50px',
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: `${appliedBorderRadius}px`,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: `${appliedBorderRadius}px`,
      background: backgroundImage
        ? `url(${backgroundImage})`
        : `
          linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%), 
          linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.02) 75%), 
          linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%),
          ${backgroundColor || 'rgba(255, 255, 255, 0.05)'}
        `,
      backgroundSize: backgroundImage
        ? (backgroundSize || 'cover')
        : '20px 20px, 20px 20px, 20px 20px, 20px 20px, 100% 100%',
      backgroundPosition: backgroundImage
        ? (backgroundPosition || 'center')
        : '0 0, 0 10px, 10px -10px, -10px 0px, 0 0',
      backgroundRepeat: backgroundRepeat || 'no-repeat',
      backgroundAttachment: backgroundAttachment || 'scroll',
      pointerEvents: 'none',
      zIndex: 0,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: `${appliedBorderRadius}px`,
      background: `rgba(255, 255, 255, ${glassOpacity || 0.1})`,
      backdropFilter: `blur(${blurIntensity || 40}px) saturate(180%) brightness(1.05)`,
      WebkitBackdropFilter: `blur(${blurIntensity || 40}px) saturate(180%) brightness(1.05)`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.6)})`,
      boxShadow: `
        0 -2px 20px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.8)}),
        inset 0 -1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.4)})
      `,
      pointerEvents: 'none',
      zIndex: 1,
    },

    '& > *': {
      position: 'relative',
      zIndex: 2,
    },

    [theme.breakpoints.down('sm')]: {
      borderRadius: Math.min(appliedBorderRadius, 12),
      minHeight: '60px',
      padding: theme.spacing(1, 0),
      '&::before': {
        borderRadius: Math.min(appliedBorderRadius, 12),
      },
      '&::after': {
        borderRadius: Math.min(appliedBorderRadius, 12),
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.4)})`,
        boxShadow: `
          0 -1px 10px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.6)}),
          inset 0 -1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.3)})
        `,
      },
    },
  };
});

const GlassmorphicIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['glassOpacity', 'textColor'].includes(prop as string),
})<{
  glassOpacity: number;
  textColor: string;
}>(({ theme, glassOpacity, textColor }) => ({
  color: textColor,
  backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)})`,
  backdropFilter: `blur(10px) saturate(150%)`,
  WebkitBackdropFilter: `blur(10px) saturate(150%)`,
  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.7)})`,
  borderRadius: theme.spacing(1),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.7)})`,
    backdropFilter: `blur(15px) saturate(170%)`,
    WebkitBackdropFilter: `blur(15px) saturate(170%)`,
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `
      0 8px 25px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})
    `,
  },
}));

const GlassmorphicLink = styled(Link, {
  shouldForwardProp: (prop) => !['textColor', 'glassOpacity'].includes(prop as string),
})<{
  textColor: string;
  glassOpacity: number;
}>(({ theme, textColor, glassOpacity }) => ({
  color: textColor,
  textDecoration: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.4)})`,
  backdropFilter: `blur(8px) saturate(140%)`,
  WebkitBackdropFilter: `blur(8px) saturate(140%)`,
  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)})`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textShadow: textColor.includes('255, 255, 255')
    ? '0 1px 2px rgba(0, 0, 0, 0.3)'
    : '0 1px 2px rgba(255, 255, 255, 0.3)',

  '&:hover': {
    backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.6)})`,
    backdropFilter: `blur(12px) saturate(160%)`,
    WebkitBackdropFilter: `blur(12px) saturate(160%)`,
    transform: 'translateY(-1px)',
    boxShadow: `
      0 6px 20px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})
    `,
  },
}));

const MinimalContainer = styled(Box, {
  shouldForwardProp: (prop) => !['backgroundColor', 'spacing'].includes(prop as string),
})<{
  backgroundColor?: string;
  spacing?: number;
}>(({ theme, backgroundColor, spacing }) => ({
  position: 'relative',
  width: '100%',
  backgroundColor: backgroundColor || 'transparent',
  padding: theme.spacing(spacing || 1, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
}));

const MinimalLink = styled(Link, {
  shouldForwardProp: (prop) => !['textColor', 'fontSize'].includes(prop as string),
})<{
  textColor?: string;
  fontSize?: number;
}>(({ theme, textColor, fontSize }) => ({
  color: textColor || theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: fontSize ? `${fontSize}px` : theme.typography.body2.fontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

const MinimalIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['textColor'].includes(prop as string),
})<{
  textColor?: string;
}>(({ theme, textColor }) => ({
  color: textColor || theme.palette.text.secondary,
  padding: theme.spacing(0.5),
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
}));

const MinimalDivider = styled(Box, {
  shouldForwardProp: (prop) => !['dividerColor'].includes(prop as string),
})<{
  dividerColor?: string;
}>(({ theme, dividerColor }) => ({
  width: '1px',
  height: '16px',
  backgroundColor: dividerColor || theme.palette.divider,
  margin: theme.spacing(0, 1),
}));

const InvisibleContainer = styled(Box, {
  shouldForwardProp: (prop) => !['spacing'].includes(prop as string),
})<{
  spacing?: number;
}>(({ theme, spacing }) => ({
  position: 'relative',
  width: '100%',
  backgroundColor: 'transparent',
  padding: theme.spacing(spacing || 0.5, 0),
  border: 'none',
  transition: 'all 0.2s ease-in-out',
}));

const InvisibleText = styled(Typography, {
  shouldForwardProp: (prop) => !['textColor', 'fontSize'].includes(prop as string),
})<{
  textColor?: string;
  fontSize?: number;
}>(({ theme, textColor, fontSize }) => ({
  color: textColor || theme.palette.text.disabled,
  fontSize: fontSize ? `${fontSize}px` : '12px',
  fontWeight: 300,
  lineHeight: 1.2,
  opacity: 0.7,
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    opacity: 1,
  },
}));

const InvisibleLink = styled(Link, {
  shouldForwardProp: (prop) => !['textColor', 'fontSize'].includes(prop as string),
})<{
  textColor?: string;
  fontSize?: number;
}>(({ theme, textColor, fontSize }) => ({
  color: textColor || theme.palette.text.disabled,
  textDecoration: 'none',
  fontSize: fontSize ? `${fontSize}px` : '12px',
  fontWeight: 300,
  lineHeight: 1.2,
  opacity: 0.7,
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    opacity: 1,
    textDecoration: 'underline',
  },
}));

const CustomContainer = styled(Box, {
  shouldForwardProp: (prop) => !['backgroundColor', 'backgroundType', 'gradientDirection', 'gradientColors', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundAttachment', 'backgroundBlur', 'padding', 'borderRadius'].includes(prop as string),
})<{
  backgroundColor?: string;
  backgroundType?: 'solid' | 'gradient' | 'image';
  gradientDirection?: string;
  gradientColors?: string[];
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  backgroundBlur?: number;
  padding?: number;
  borderRadius?: number;
}>(({
  theme,
  backgroundColor,
  backgroundType,
  gradientDirection,
  gradientColors,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundRepeat,
  backgroundAttachment,
  backgroundBlur,
  padding,
  borderRadius
}) => {
  let background = backgroundColor || theme.palette.background.paper;

  if (backgroundType === 'gradient' && gradientColors && gradientColors.length >= 2) {
    const direction = gradientDirection || '45deg';
    background = `linear-gradient(${direction}, ${gradientColors.join(', ')})`;
  } else if (backgroundType === 'image' && backgroundImage) {
    background = `url(${backgroundImage})`;
  }

  return {
    position: 'relative',
    width: '100%',
    minHeight: '200px',
    padding: theme.spacing(padding || 4),
    borderRadius: borderRadius ? `${borderRadius}px` : 0,
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      background,
      backgroundSize: backgroundType === 'image' ? (backgroundSize || 'cover') : undefined,
      backgroundPosition: backgroundType === 'image' ? (backgroundPosition || 'center') : undefined,
      backgroundRepeat: backgroundType === 'image' ? (backgroundRepeat || 'no-repeat') : undefined,
      backgroundAttachment: backgroundType === 'image' ? (backgroundAttachment || 'scroll') : undefined,
      filter: backgroundBlur ? `blur(${backgroundBlur}px)` : 'none',
    },
  };
});

const CustomColumn = styled(Box, {
  shouldForwardProp: (prop) => !['x', 'y', 'width', 'padding'].includes(prop as string),
})<{
  x: number;
  y: number;
  width?: number;
  padding?: number;
}>(({ theme, x, y, width, padding }) => {
  const paddingValue = padding || 4;
  const scale = 1 - (paddingValue * 0.05);

  const scaledX = 50 + (x - 50) * scale;
  const scaledY = 50 + (y - 50) * scale;

  return {
    position: 'absolute',
    left: `${scaledX}%`,
    top: `${scaledY}%`,
    width: width ? `${width}%` : 'auto',
    minWidth: '150px',
    zIndex: 10,
  };
});

const CustomColumnTitle = styled(Typography, {
  shouldForwardProp: (prop) => !['fontSize', 'fontWeight', 'fontStyle', 'textDecoration', 'color'].includes(prop as string),
})<{
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
}>(({ theme, fontSize, fontWeight, fontStyle, textDecoration, color }) => ({
  fontSize: fontSize ? `${fontSize}px` : theme.typography.h6.fontSize,
  fontWeight: fontWeight === 'bold' ? 700 : 400,
  fontStyle: fontStyle || 'normal',
  textDecoration: textDecoration || 'none',
  color: color || theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  lineHeight: 1.3,
}));

const CustomLink = styled(Link, {
  shouldForwardProp: (prop) => !['fontSize', 'color', 'hoverColor', 'fontWeight', 'fontStyle'].includes(prop as string),
})<{
  fontSize?: number;
  color?: string;
  hoverColor?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}>(({ theme, fontSize, color, hoverColor, fontWeight, fontStyle }) => ({
  display: 'block',
  fontSize: fontSize ? `${fontSize}px` : theme.typography.body2.fontSize,
  color: color || theme.palette.text.secondary,
  fontWeight: fontWeight === 'bold' ? 700 : 400,
  fontStyle: fontStyle || 'normal',
  textDecoration: 'none',
  marginBottom: theme.spacing(1),
  lineHeight: 1.4,
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    color: hoverColor || theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

const CustomLogo = styled('img', {
  shouldForwardProp: (prop) => !['width', 'height', 'x', 'y', 'padding'].includes(prop as string),
})<{
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  padding?: number;
}>(({ width, height, x, y, padding }) => {
  const paddingValue = padding || 4;
  const scale = 1 - (paddingValue * 0.05);
  const xPos = x || 10;
  const yPos = y || 10;
  const scaledX = 50 + (xPos - 50) * scale;
  const scaledY = 50 + (yPos - 50) * scale;

  return {
    position: 'absolute',
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
    maxWidth: '200px',
    maxHeight: '100px',
    objectFit: 'contain',
    zIndex: 10,
    left: `${scaledX}%`,
    top: `${scaledY}%`,
    transform: 'none',
  };
});

const CustomSocialContainer = styled(Box, {
  shouldForwardProp: (prop) => !['x', 'y', 'padding'].includes(prop as string),
})<{
  x: number;
  y: number;
  padding?: number;
}>(({ x, y, padding }) => {
  const paddingValue = padding || 4;
  const scale = 1 - (paddingValue * 0.05);
  const scaledX = 50 + (x - 50) * scale;
  const scaledY = 50 + (y - 50) * scale;

  return {
    position: 'absolute',
    left: `${scaledX}%`,
    top: `${scaledY}%`,
    zIndex: 10,
    display: 'flex',
    gap: '8px',
  };
});

const CustomSocialIcon = styled(IconButton, {
  shouldForwardProp: (prop) => !['iconSize', 'iconColor', 'iconHoverColor'].includes(prop as string),
})<{
  iconSize?: number;
  iconColor?: string;
  iconHoverColor?: string;
}>(({ theme, iconSize, iconColor, iconHoverColor }) => ({
  color: iconColor || theme.palette.text.primary,
  fontSize: iconSize ? `${iconSize}px` : '24px',
  padding: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',

  '& svg': {
    fontSize: iconSize ? `${iconSize}px` : '24px',
  },

  '&:hover': {
    color: iconHoverColor || theme.palette.primary.main,
    transform: 'scale(1.1)',
  },
}));

const CustomSignature = styled(Box, {
  shouldForwardProp: (prop) => !['x', 'y', 'fontSize', 'color', 'fontWeight', 'fontStyle', 'padding'].includes(prop as string),
})<{
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  padding?: number;
}>(({ theme, x, y, fontSize, color, fontWeight, fontStyle, padding }) => {
  const paddingValue = padding || 4;
  const scale = 1 - (paddingValue * 0.05);
  const scaledX = 50 + (x - 50) * scale;
  const scaledY = 50 + (y - 50) * scale;

  return {
    position: 'absolute',
    left: `${scaledX}%`,
    top: `${scaledY}%`,
    zIndex: 10,
    fontSize: fontSize ? `${fontSize}px` : theme.typography.body2.fontSize,
    color: color || theme.palette.text.secondary,
    fontWeight: fontWeight === 'bold' ? 700 : 400,
    fontStyle: fontStyle || 'normal',
    lineHeight: 1.4,
  };
});

const CustomMenuContainer = styled(Box, {
  shouldForwardProp: (prop) => !['x', 'y', 'direction', 'spacing', 'padding'].includes(prop as string),
})<{
  x: number;
  y: number;
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  padding?: number;
}>(({ theme, x, y, direction, spacing, padding }) => {
  const paddingValue = padding || 4;
  const scale = 1 - (paddingValue * 0.05);
  const scaledX = 50 + (x - 50) * scale;
  const scaledY = 50 + (y - 50) * scale;
  const isVertical = direction === 'vertical';
  const spacingValue = spacing || 2;

  return {
    position: 'absolute',
    left: `${scaledX}%`,
    top: `${scaledY}%`,
    zIndex: 10,
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    gap: isVertical ? `${spacingValue * 4}px` : `${spacingValue * 8}px`,
  };
});

const CustomMenuLink = styled(Link, {
  shouldForwardProp: (prop) => !['fontSize', 'color', 'hoverColor', 'fontWeight', 'fontStyle'].includes(prop as string),
})<{
  fontSize?: number;
  color?: string;
  hoverColor?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}>(({ theme, fontSize, color, hoverColor, fontWeight, fontStyle }) => ({
  fontSize: fontSize ? `${fontSize}px` : '14px',
  color: color || '#333333',
  fontWeight: fontWeight === 'bold' ? 700 : 400,
  fontStyle: fontStyle || 'normal',
  textDecoration: 'none',
  cursor: 'pointer',
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: hoverColor || theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

export function FooterVariants({ appConfig, isPreview, appNFT }: Props) {
  const theme = useTheme();
  const footerConfig = appConfig.footerConfig || {};
  const variant = footerConfig.variant || 'default';

  const renderIcon = (media: SocialMedia) => {
    if (media?.type === "instagram") {
      return <InstagramIcon />;
    } else if (media?.type === "twitter") {
      return <XIcon />;
    } else if (media?.type === "reddit") {
      return <Reddit />;
    } else if (media?.type === "youtube") {
      return <YouTube />;
    } else if (media?.type === "linkedin") {
      return <LinkedIn />;
    } else if (media?.type === "facebook") {
      return <Facebook />;
    }
  };

  const renderLink = (media: SocialMedia) => {
    if (media?.type === "instagram") {
      return `https://instagram.com/${media?.handle}`;
    } else if (media?.type === "twitter") {
      return `https://twitter.com/${media?.handle}`;
    } else if (media.type === "reddit") {
      return `https://reddit.com/r/${media?.handle}`;
    } else if (media.type === "youtube") {
      return `https://youtube.com/channel/${media?.handle}`;
    } else if (media.type === "linkedin") {
      return `https://linkedin.com/company/${media.handle}`;
    } else if (media.type === "facebook") {
      return `https://facebook.com/${media.handle}`;
    }
    return "";
  };

  const renderCustomLink = (link?: string) => {
    if (link) {
      return link;
    }
    return "";
  };

  const showAppSignature = useMemo(() => {
    if (appConfig?.hide_powered_by === true) {
      return false;
    }
    return true;
  }, [appNFT, appConfig]);

  const renderSignature = () => {
    const customSignature = footerConfig.customSignature;

    if (!showAppSignature && !customSignature?.enabled) {
      return null;
    }

    if (customSignature?.enabled) {
      return (
        <Typography variant="body1" align="center"
          sx={{
            color: footerConfig.glassConfig?.textColor || theme.palette.text.primary,
            textShadow: footerConfig.glassConfig?.textColor?.includes('255, 255, 255')
              ? '0 1px 2px rgba(0, 0, 0, 0.3)'
              : '0 1px 2px rgba(255, 255, 255, 0.3)'
          }}>
          {customSignature.showAppName && (
            <>
              <Link href="/" color="inherit">
                {appConfig.name}
              </Link>{" "}
            </>
          )}
          {customSignature.showLoveBy && (
            <FormattedMessage
              id="made.with.love.by"
              defaultMessage="made with ❤️ by"
              description="made with ❤️ by"
            />
          )}
          {customSignature.showLoveBy && " "}
          <Link
            variant="inherit"
            href={isPreview ? "#" : (customSignature.link || "https://www.dexkit.com")}
            target="_blank"
            color="inherit"
          >
            <strong>{customSignature.text || "DexKit"}</strong>
          </Link>
        </Typography>
      );
    }

    return (
      <Typography variant="body1" align="center"
        sx={{
          color: footerConfig.glassConfig?.textColor || theme.palette.text.primary,
          textShadow: footerConfig.glassConfig?.textColor?.includes('255, 255, 255')
            ? '0 1px 2px rgba(0, 0, 0, 0.3)'
            : '0 1px 2px rgba(255, 255, 255, 0.3)'
        }}>
        <Link href="/" color="inherit">
          {appConfig.name}
        </Link>{" "}
        <FormattedMessage
          id="made.with.love.by"
          defaultMessage="made with ❤️ by"
          description="made with ❤️ by"
        />{" "}
        <Link
          variant="inherit"
          href={isPreview ? "#" : "https://www.dexkit.com"}
          target="_blank"
          color="inherit"
        >
          <strong>DexKit</strong>
        </Link>
      </Typography>
    );
  };

  if (variant === 'invisible') {
    const invisibleConfig = footerConfig.invisibleConfig || {};
    const textColor = invisibleConfig.textColor || theme.palette.text.disabled;
    const fontSize = invisibleConfig.fontSize || 12;
    const spacing = invisibleConfig.spacing || 0.5;
    const alignment = invisibleConfig.alignment || 'center';
    const showOnlySignature = invisibleConfig.showOnlySignature || false;

    const renderInvisibleSignature = () => {
      const customSignature = footerConfig.customSignature;

      if (!showAppSignature && !customSignature?.enabled) {
        return null;
      }

      if (customSignature?.enabled) {
        return (
          <Typography component="span" sx={{ color: textColor, fontSize: `${fontSize}px` }}>
            {customSignature.showAppName && (
              <>
                <Link href="/" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  {appConfig.name}
                </Link>
                {" · "}
              </>
            )}
            {customSignature.showLoveBy && "made with ❤️ by "}
            <Link
              href={isPreview ? "#" : (customSignature.link || "https://www.dexkit.com")}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: footerConfig.customConfig?.socialMedia?.iconHoverColor || theme.palette.primary.main,
                  textDecoration: 'underline'
                }
              }}
            >
              {customSignature.text || "DexKit"}
            </Link>
          </Typography>
        );
      }

      return (
        <Typography component="span" sx={{ color: textColor, fontSize: `${fontSize}px` }}>
          <Link href="/" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            {appConfig.name}
          </Link>
          {" · made with ❤️ by "}
          <Link
            href={isPreview ? "#" : "https://www.dexkit.com"}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: footerConfig.customConfig?.socialMedia?.iconHoverColor || theme.palette.primary.main,
                textDecoration: 'underline'
              }
            }}
          >
            DexKit
          </Link>
        </Typography>
      );
    };

    if (showOnlySignature) {
      const signatureElements = renderInvisibleSignature();
      if (!signatureElements) return null;

      return (
        <InvisibleContainer spacing={spacing}>
          <Container>
            <Box sx={{ textAlign: alignment }}>
              {signatureElements}
            </Box>
          </Container>
        </InvisibleContainer>
      );
    }

    const elements: React.ReactNode[] = [];

    if (appConfig.footerMenuTree && appConfig.footerMenuTree.length > 0) {
      const menuElements = appConfig.footerMenuTree.map((m, key) =>
        m.children ? (
          <NavbarMenu menu={m} key={key} />
        ) : (
          <Link
            key={key}
            href={isPreview ? "#" : m.href || "/"}
            aria-label={`footer link ${m.name}`}
            target={m.type === "External" ? "_blank" : undefined}
            sx={{
              color: textColor,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <FormattedMessage
              id={m.name.toLowerCase()}
              defaultMessage={m.name}
            />
          </Link>
        )
      );
      elements.push(...menuElements);
    } else {
      elements.push(
        <Link
          key="contact"
          href={isPreview ? "" : "https://dexkit.com/contact-us/"}
          target="_blank"
          sx={{
            color: textColor,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <FormattedMessage
            id="contact.us"
            defaultMessage="Contact us"
            description="Contact us"
          />
        </Link>
      );
    }

    if (showAppSignature || footerConfig.customSignature?.enabled) {
      const signatureElements = renderInvisibleSignature();
      if (signatureElements) {
        elements.push(signatureElements);
      }
    }

    return (
      <InvisibleContainer spacing={spacing}>
        <Container>
          <Box sx={{ textAlign: alignment }}>
            <Typography component="div" sx={{ color: textColor, fontSize: `${fontSize}px` }}>
              {elements.map((element, index) => (
                <span key={index}>
                  {element}
                  {index < elements.length - 1 && " · "}
                </span>
              ))}
            </Typography>
          </Box>
        </Container>
      </InvisibleContainer>
    );
  }

  if (variant === 'minimal') {
    const minimalConfig = footerConfig.minimalConfig || {};
    const textColor = minimalConfig.textColor || theme.palette.text.secondary;
    const fontSize = minimalConfig.fontSize || 14;
    const showDividers = minimalConfig.showDividers !== false;
    const dividerColor = minimalConfig.dividerColor;
    const spacing = minimalConfig.spacing || 1;

    const renderMinimalSignature = () => {
      const customSignature = footerConfig.customSignature;

      if (!showAppSignature && !customSignature?.enabled) {
        return null;
      }

      if (customSignature?.enabled) {
        return (
          <>
            {customSignature.showAppName && (
              <MinimalLink key="app-name" href="/" textColor={textColor} fontSize={fontSize}>
                {appConfig.name}
              </MinimalLink>
            )}
            {customSignature.showLoveBy && (
              <Typography key="love-by" variant="body2" sx={{ color: textColor, fontSize: `${fontSize}px`, ml: customSignature.showAppName ? 0.5 : 0 }}>
                <FormattedMessage
                  id="made.with.love.by"
                  defaultMessage="made with ❤️ by"
                  description="made with ❤️ by"
                />
              </Typography>
            )}
            <MinimalLink
              key="dexkit-link"
              href={isPreview ? "#" : (customSignature.link || "https://www.dexkit.com")}
              target="_blank"
              textColor={textColor}
              fontSize={fontSize}
              sx={{ ml: customSignature.showLoveBy ? 0.5 : (customSignature.showAppName ? 0.5 : 0) }}
            >
              {customSignature.text || "DexKit"}
            </MinimalLink>
          </>
        );
      }

      return (
        <>
          <MinimalLink key="app-name-default" href="/" textColor={textColor} fontSize={fontSize}>
            {appConfig.name}
          </MinimalLink>
          <Typography key="love-by-default" variant="body2" sx={{ color: textColor, fontSize: `${fontSize}px`, ml: 0.5 }}>
            <FormattedMessage
              id="made.with.love.by"
              defaultMessage="made with ❤️ by"
              description="made with ❤️ by"
            />
          </Typography>
          <MinimalLink
            key="dexkit-link-default"
            href={isPreview ? "#" : "https://www.dexkit.com"}
            target="_blank"
            textColor={textColor}
            fontSize={fontSize}
            sx={{ ml: 0.5 }}
          >
            DexKit
          </MinimalLink>
        </>
      );
    };

    const menuItems: React.ReactNode[] = [];
    const socialItems: React.ReactNode[] = [];
    const signatureItems: React.ReactNode[] = [];

    if (appConfig.footerMenuTree && appConfig.footerMenuTree.length > 0) {
      appConfig.footerMenuTree.forEach((m, key) => {
        if (m.children) {
          menuItems.push(<NavbarMenu menu={m} key={key} />);
        } else {
          menuItems.push(
            <MinimalLink
              href={isPreview ? "#" : m.href || "/"}
              key={key}
              aria-label={`footer link ${m.name}`}
              target={m.type === "External" ? "_blank" : undefined}
              textColor={textColor}
              fontSize={fontSize}
            >
              <FormattedMessage
                id={m.name.toLowerCase()}
                defaultMessage={m.name}
              />
            </MinimalLink>
          );
        }
        if (showDividers && key < appConfig.footerMenuTree!.length - 1) {
          menuItems.push(<MinimalDivider key={`divider-${key}`} dividerColor={dividerColor} />);
        }
      });
    } else {
      menuItems.push(
        <MinimalLink
          href={isPreview ? "" : "https://dexkit.com/contact-us/"}
          target="_blank"
          textColor={textColor}
          fontSize={fontSize}
          key="contact"
        >
          <FormattedMessage
            id="contact.us"
            defaultMessage="Contact us"
            description="Contact us"
          />
        </MinimalLink>
      );
    }

    if (appConfig?.social) {
      appConfig.social.forEach((media, index) => {
        socialItems.push(
          <Link
            key={index}
            href={renderLink(media)}
            target="_blank"
            sx={{ textDecoration: 'none' }}
          >
            <MinimalIconButton textColor={textColor}>
              {renderIcon(media)}
            </MinimalIconButton>
          </Link>
        );
      });
    }

    if (appConfig?.social_custom && appConfig.social_custom.length > 0) {
      appConfig.social_custom
        .filter((m) => m?.link !== undefined)
        .forEach((media, index) => {
          socialItems.push(
            <Link
              key={`custom-${index}`}
              href={renderCustomLink(media?.link)}
              target="_blank"
              sx={{ textDecoration: 'none' }}
            >
              <MinimalIconButton textColor={textColor}>
                <Image
                  src={media?.iconUrl}
                  alt={media?.label || ""}
                  height={16}
                  width={16}
                />
              </MinimalIconButton>
            </Link>
          );
        });
    }

    if (showAppSignature || footerConfig.customSignature?.enabled) {
      const signatureElements = renderMinimalSignature();
      if (signatureElements) {
        signatureItems.push(signatureElements);
      }
    }

    return (
      <MinimalContainer
        backgroundColor={minimalConfig.backgroundColor}
        spacing={spacing}
      >
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0}
            sx={{
              flexWrap: 'wrap',
              gap: 0,
              '& > *': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          >
            {menuItems}

            {menuItems.length > 0 && socialItems.length > 0 && showDividers && (
              <MinimalDivider dividerColor={dividerColor} />
            )}

            {socialItems}

            {(menuItems.length > 0 || socialItems.length > 0) && signatureItems.length > 0 && showDividers && (
              <MinimalDivider dividerColor={dividerColor} />
            )}

            {signatureItems}
          </Stack>
        </Container>
      </MinimalContainer>
    );
  }

  if (variant === 'glassmorphic') {
    const glassConfig = footerConfig.glassConfig || {};
    const layoutConfig = footerConfig.layout || {};
    const blurIntensity = glassConfig.blurIntensity || 40;
    const glassOpacity = glassConfig.glassOpacity || 0.10;
    const textColor = glassConfig.textColor || theme.palette.text.primary;
    const borderRadius = layoutConfig.borderRadius || 0;
    const signaturePosition = layoutConfig.signaturePosition || 'left';
    const menuPosition = layoutConfig.menuPosition || 'center';
    const socialMediaPosition = layoutConfig.socialMediaPosition || 'right';

    const renderSection = (position: 'left' | 'center' | 'right') => {
      const sections = [];

      if (menuPosition === position) {
        sections.push(
          <Box key="menu" sx={{ width: '100%' }}>
            {appConfig.footerMenuTree ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 2 },
                  '& > a': {
                    flexShrink: 0,
                    minWidth: 'fit-content'
                  }
                }}
              >
                {appConfig.footerMenuTree.map((m, key) =>
                  m.children ? (
                    <NavbarMenu menu={m} key={key} />
                  ) : (
                    <GlassmorphicLink
                      color="inherit"
                      href={isPreview ? "#" : m.href || "/"}
                      key={key}
                      aria-label={`footer link ${m.name}`}
                      target={m.type === "External" ? "_blank" : undefined}
                      textColor={textColor}
                      glassOpacity={glassOpacity}
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        padding: { xs: theme.spacing(0.5, 1), sm: theme.spacing(1, 2) },
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <FormattedMessage
                        id={m.name.toLowerCase()}
                        defaultMessage={m.name}
                      />
                    </GlassmorphicLink>
                  )
                )}
              </Stack>
            ) : (
              <GlassmorphicLink
                href={isPreview ? "" : "https://dexkit.com/contact-us/"}
                color="inherit"
                target="_blank"
                textColor={textColor}
                glassOpacity={glassOpacity}
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: theme.spacing(0.5, 1), sm: theme.spacing(1, 2) }
                }}
              >
                <FormattedMessage
                  id="contact.us"
                  defaultMessage="Contact us"
                  description="Contact us"
                />
              </GlassmorphicLink>
            )}
          </Box>
        );
      }

      if (signaturePosition === position && (showAppSignature || footerConfig.customSignature?.enabled)) {
        sections.push(
          <Box key="signature" sx={{ textAlign: position }}>
            {renderSignature()}
          </Box>
        );
      }

      if (socialMediaPosition === position) {
        sections.push(
          <Box key="social" sx={{
            display: 'flex',
            justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start',
            width: '100%'
          }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                justifyContent: { xs: 'flex-end', sm: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start' },
                gap: { xs: 1, sm: 1 },
                maxWidth: { xs: '100%', sm: 'auto' },
                '& > a': {
                  flexShrink: 0
                }
              }}
            >
              {appConfig?.social &&
                appConfig.social.map((media, index) => (
                  <Link
                    key={index}
                    href={renderLink(media)}
                    target="_blank"
                    sx={{ textDecoration: 'none' }}
                  >
                    <GlassmorphicIconButton
                      size="small"
                      glassOpacity={glassOpacity}
                      textColor={textColor}
                      sx={{
                        minWidth: { xs: 36, sm: 'auto' },
                        minHeight: { xs: 36, sm: 'auto' }
                      }}
                    >
                      {renderIcon(media)}
                    </GlassmorphicIconButton>
                  </Link>
                ))}
              {appConfig?.social_custom &&
                appConfig.social_custom.length > 0 &&
                appConfig.social_custom
                  .filter((m) => m?.link !== undefined)
                  .map((media, index) => (
                    <Link
                      key={index}
                      href={renderCustomLink(media?.link)}
                      target="_blank"
                      sx={{ textDecoration: 'none' }}
                    >
                      <GlassmorphicIconButton
                        size="small"
                        glassOpacity={glassOpacity}
                        textColor={textColor}
                        sx={{
                          minWidth: { xs: 36, sm: 'auto' },
                          minHeight: { xs: 36, sm: 'auto' }
                        }}
                      >
                        <Image
                          src={media?.iconUrl}
                          alt={media?.label || ""}
                          height={24}
                          width={24}
                        />
                      </GlassmorphicIconButton>
                    </Link>
                  ))}
            </Stack>
          </Box>
        );
      }

      return sections;
    };

    return (
      <GlassmorphicContainer
        py={2}
        px={{ xs: 1, sm: 2 }}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        backgroundColor={glassConfig.backgroundColor}
        backgroundImage={glassConfig.backgroundImage}
        backgroundSize={glassConfig.backgroundSize}
        backgroundPosition={glassConfig.backgroundPosition}
        backgroundRepeat={glassConfig.backgroundRepeat}
        backgroundAttachment={glassConfig.backgroundAttachment}
        borderRadius={borderRadius}
      >
        <Container maxWidth="lg">
          <Grid
            container
            alignItems="center"
            alignContent="center"
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: 'space-between',
              minHeight: { xs: 'auto', sm: '50px' }
            }}
          >
            <Grid size={{ xs: 12, sm: 4 }} sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              order: { xs: 2, sm: 1 }
            }}>
              <Stack spacing={{ xs: 0.5, sm: 1 }} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                {renderSection('left')}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }} sx={{
              display: 'flex',
              justifyContent: 'center',
              order: { xs: 1, sm: 2 }
            }}>
              <Stack spacing={{ xs: 0.5, sm: 1 }} alignItems="center">
                {renderSection('center')}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }} sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-end', sm: 'flex-end' },
              order: { xs: 3, sm: 3 }
            }}>
              <Stack
                spacing={{ xs: 0.5, sm: 1 }}
                alignItems={{ xs: 'flex-end', sm: 'flex-end' }}
                sx={{
                  width: '100%',
                  '& > div': {
                    width: '100%',
                    '& > div': {
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      justifyContent: { xs: 'flex-end', sm: 'flex-end' },
                      gap: { xs: 1, sm: 1 },
                      maxWidth: { xs: '100%', sm: 'auto' }
                    }
                  }
                }}
              >
                {renderSection('right')}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </GlassmorphicContainer>
    );
  }

  if (variant === 'custom') {
    const config = footerConfig.customConfig || {};
    const socialLinks = [
      ...(appConfig?.social || []).map(social => ({
        icon: renderIcon(social),
        url: renderLink(social)
      })),
      ...(appConfig?.social_custom || [])
        .filter(m => m?.link !== undefined)
        .map(media => ({
          icon: (
            <Image
              src={media?.iconUrl}
              alt={media?.label || ""}
              height={config.socialMedia?.iconSize || 24}
              width={config.socialMedia?.iconSize || 24}
            />
          ),
          url: renderCustomLink(media?.link)
        }))
    ];

    const signatureText = (() => {
      const customSignature = footerConfig.customSignature;

      if (customSignature?.enabled) {
        return (
          <span>
            {customSignature.showAppName && (
              <>
                <Link href="/" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  {appConfig.name}
                </Link>
                {" · "}
              </>
            )}
            {customSignature.showLoveBy && "made with ❤️ by "}
            <Link
              href={isPreview ? "#" : (customSignature.link || "https://www.dexkit.com")}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: config.socialMedia?.iconHoverColor || theme.palette.primary.main,
                  textDecoration: 'underline'
                }
              }}
            >
              {customSignature.text || "DexKit"}
            </Link>
          </span>
        );
      }

      return (
        <span>
          <Link href="/" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            {appConfig.name}
          </Link>
          {" · made with ❤️ by "}
          <Link
            href={isPreview ? "#" : "https://www.dexkit.com"}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: config.socialMedia?.iconHoverColor || theme.palette.primary.main,
                textDecoration: 'underline'
              }
            }}
          >
            DexKit
          </Link>
        </span>
      );
    })();

    return (
      <CustomContainer
        backgroundColor={config.backgroundColor}
        backgroundType={config.backgroundType}
        gradientDirection={config.gradientDirection}
        gradientColors={config.gradientColors}
        backgroundImage={config.backgroundImage}
        backgroundSize={config.backgroundSize}
        backgroundPosition={config.backgroundPosition}
        backgroundRepeat={config.backgroundRepeat}
        backgroundAttachment={config.backgroundAttachment}
        backgroundBlur={config.backgroundBlur}
        padding={config.padding}
        borderRadius={config.borderRadius}
      >
        {config.logo?.url && (
          <CustomLogo
            src={config.logo.url}
            alt="Footer Logo"
            width={config.logo.width}
            height={config.logo.height}
            x={config.logo.position?.x}
            y={config.logo.position?.y}
            padding={config.padding}
          />
        )}

        {config.columns?.map((column) => (
          <CustomColumn
            key={column.id}
            x={column.position?.x || 0}
            y={column.position?.y || 0}
            width={column.position?.width}
            padding={config.padding}
          >
            <CustomColumnTitle
              fontSize={column.titleStyle?.fontSize}
              fontWeight={column.titleStyle?.fontWeight}
              fontStyle={column.titleStyle?.fontStyle}
              textDecoration={column.titleStyle?.textDecoration}
              color={column.titleStyle?.color}
            >
              {column.title}
            </CustomColumnTitle>

            {column.links.map((link) => (
              <CustomLink
                key={link.id}
                href={isPreview ? "#" : link.url}
                fontSize={link.style?.fontSize}
                color={link.style?.color}
                hoverColor={link.style?.hoverColor}
                fontWeight={link.style?.fontWeight}
                fontStyle={link.style?.fontStyle}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.text}
              </CustomLink>
            ))}
          </CustomColumn>
        ))}

        {config.menu && appConfig.footerMenuTree && appConfig.footerMenuTree.length > 0 && (
          <CustomMenuContainer
            x={config.menu.position?.x || 5}
            y={config.menu.position?.y || 40}
            direction={config.menu.style?.direction || 'vertical'}
            spacing={config.menu.style?.spacing || 2}
            padding={config.padding}
          >
            {appConfig.footerMenuTree.map((menuItem, index) => (
              <CustomMenuLink
                key={index}
                href={isPreview ? "#" : (menuItem.href || "/")}
                fontSize={config.menu?.style?.fontSize}
                color={config.menu?.style?.color}
                hoverColor={config.menu?.style?.hoverColor}
                fontWeight={config.menu?.style?.fontWeight}
                fontStyle={config.menu?.style?.fontStyle}
                target={menuItem.type === "External" ? "_blank" : undefined}
                rel={menuItem.type === "External" ? "noopener noreferrer" : undefined}
              >
                <FormattedMessage
                  id={menuItem.name.toLowerCase()}
                  defaultMessage={menuItem.name}
                />
              </CustomMenuLink>
            ))}
          </CustomMenuContainer>
        )}

        {config.socialMedia && socialLinks.length > 0 && (
          <CustomSocialContainer
            x={config.socialMedia.position?.x || 0}
            y={config.socialMedia.position?.y || 0}
            padding={config.padding}
          >
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={isPreview ? "#" : social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none' }}
              >
                <CustomSocialIcon
                  iconSize={config.socialMedia?.iconSize}
                  iconColor={config.socialMedia?.iconColor}
                  iconHoverColor={config.socialMedia?.iconHoverColor}
                >
                  {social.icon}
                </CustomSocialIcon>
              </Link>
            ))}
          </CustomSocialContainer>
        )}

        {config.signature && signatureText && (showAppSignature || footerConfig.customSignature?.enabled) && (
          <CustomSignature
            x={config.signature.position?.x || 0}
            y={config.signature.position?.y || 0}
            fontSize={config.signature.style?.fontSize}
            color={config.signature.style?.color}
            fontWeight={config.signature.style?.fontWeight}
            fontStyle={config.signature.style?.fontStyle}
            padding={config.padding}
          >
            {signatureText}
          </CustomSignature>
        )}
      </CustomContainer>
    );
  }

  const layoutConfig = footerConfig.layout || {};
  const borderRadius = layoutConfig.borderRadius || 0;
  const signaturePosition = layoutConfig.signaturePosition || 'center';
  const menuPosition = layoutConfig.menuPosition || 'left';
  const socialMediaPosition = layoutConfig.socialMediaPosition || 'right';

  const renderDefaultSection = (position: 'left' | 'center' | 'right') => {
    const sections = [];

    if (menuPosition === position) {
      sections.push(
        <Box key="menu">
          {appConfig.footerMenuTree ? (
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start' }}
            >
              {appConfig.footerMenuTree.map((m, key) =>
                m.children ? (
                  <NavbarMenu menu={m} key={key} />
                ) : (
                  <Link
                    color="inherit"
                    href={isPreview ? "#" : m.href || "/"}
                    key={key}
                    aria-label={`footer link ${m.name}`}
                    target={m.type === "External" ? "_blank" : undefined}
                  >
                    <FormattedMessage
                      id={m.name.toLowerCase()}
                      defaultMessage={m.name}
                    />
                  </Link>
                )
              )}
            </Stack>
          ) : (
            <Link
              href={isPreview ? "" : "https://dexkit.com/contact-us/"}
              color="inherit"
              target="_blank"
            >
              <FormattedMessage
                id="contact.us"
                defaultMessage="Contact us"
                description="Contact us"
              />
            </Link>
          )}
        </Box>
      );
    }

    if (signaturePosition === position && (showAppSignature || footerConfig.customSignature?.enabled)) {
      sections.push(
        <Box key="signature" sx={{ textAlign: position }}>
          {renderSignature()}
        </Box>
      );
    }

    if (socialMediaPosition === position) {
      sections.push(
        <Box key="social" sx={{ display: 'flex', justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start' }}>
          <Stack direction="row" spacing={1}>
            {appConfig?.social &&
              appConfig.social.map((media, index) => (
                <IconButton
                  key={index}
                  href={renderLink(media)}
                  LinkComponent={Link}
                  target="_blank"
                  size="small"
                >
                  {renderIcon(media)}
                </IconButton>
              ))}
            {appConfig?.social_custom &&
              appConfig.social_custom.length > 0 &&
              appConfig.social_custom
                .filter((m) => m?.link !== undefined)
                .map((media, index) => (
                  <IconButton
                    key={index}
                    href={renderCustomLink(media?.link)}
                    LinkComponent={Link}
                    target="_blank"
                    size="small"
                  >
                    <Image
                      src={media?.iconUrl}
                      alt={media?.label || ""}
                      height={24}
                      width={24}
                    />
                  </IconButton>
                ))}
          </Stack>
        </Box>
      );
    }

    return sections;
  };

  return (
    <Box
      py={2}
      sx={{
        bgcolor: "background.paper",
        minHeight: "50px",
        width: "100%",
        borderRadius: `${borderRadius}px`,
      }}
    >
      <Container>
        <Grid
          container
          alignItems="center"
          alignContent="center"
          spacing={2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: 'space-between'
          }}
        >
          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {renderDefaultSection('left')}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={1} alignItems="center">
              {renderDefaultSection('center')}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-end' }}>
              {renderDefaultSection('right')}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 