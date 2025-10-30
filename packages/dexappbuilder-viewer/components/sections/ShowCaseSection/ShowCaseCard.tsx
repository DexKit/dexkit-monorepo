import { ChainId } from "@dexkit/core";
import { getNetworkSlugFromChainId } from "@dexkit/core/utils/blockchain";
import { AppExpandableTypography } from "@dexkit/ui/components/AppExpandableTypography";
import Link from "@dexkit/ui/components/AppLink";
import useContractMetadata from "@dexkit/ui/hooks/blockchain";
import { NFTCardMedia } from "@dexkit/ui/modules/nft/components/NFTCardMedia";
import { useAsset } from "@dexkit/ui/modules/nft/hooks";
import { useJsonRpcProvider } from "@dexkit/ui/modules/wizard/hooks";
import { ShowCaseItem } from "@dexkit/ui/modules/wizard/types/section";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { useMemo } from "react";

export interface ShowCaseCardProps {
  item: ShowCaseItem;
  sectionSettings?: any;
}

export default function ShowCaseCard({ item, sectionSettings }: ShowCaseCardProps) {
  const theme = useTheme();
  const providerQuery = useJsonRpcProvider({
    chainId:
      item.type === "asset" || item.type === "collection"
        ? item.chainId
        : ChainId.Ethereum,
  });

  const assetArgs = useMemo(() => {
    if (item.type === "asset") {
      return [
        item.contractAddress,
        item.tokenId,
        {},
        true,
        item.chainId,
      ] as any;
    }

    return [];
  }, [item]);

  const nftQuery = useAsset(...assetArgs);

  const contractMetadata = useContractMetadata(
    item.type === "collection"
      ? {
        chainId: item.chainId,
        contractAddress: item.contractAddress,
        provider: providerQuery.data,
      }
      : undefined
  );

  const getImageScaling = (): 'cover' | 'contain' | 'fill' | 'center' | 'mosaic' | 'expanded' => {
    if (item.type === "image" && item.customImageScaling) {
      return item.customImageScaling;
    }
    return sectionSettings?.imageScaling || "cover";
  };

  const getImagePosition = (): 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' => {
    if (item.type === "image" && item.customImagePosition) {
      return item.customImagePosition;
    }
    return sectionSettings?.imagePosition || "center";
  };

  const getHoverEffect = (): 'none' | 'zoom' | 'lift' | 'glow' | 'fade' | 'slide' | 'rotate' | 'scale' => {
    if (item.type === "image" && item.customHoverEffect) {
      return item.customHoverEffect;
    }
    return sectionSettings?.hoverEffect || "none";
  };

  const getCardStyle = (): 'default' | 'minimal' | 'elevated' | 'bordered' | 'glassmorphism' => {
    if (item.type === "image" && item.customCardStyle) {
      return item.customCardStyle;
    }
    return sectionSettings?.cardStyle || "default";
  };

  const getBorderRadius = (): number => {
    if (item.type === "image" && item.customBorderRadius !== undefined) {
      return item.customBorderRadius;
    }
    return sectionSettings?.borderRadius || 1;
  };

  const getShadowIntensity = (): 'none' | 'low' | 'medium' | 'high' => {
    if (item.type === "image" && item.customShadowIntensity) {
      return item.customShadowIntensity;
    }
    return sectionSettings?.shadowIntensity || "medium";
  };

  const getOverlayColor = () => {
    if (item.type === "image" && item.customOverlayColor) {
      return item.customOverlayColor;
    }
    return "rgba(0,0,0,0.5)";
  };

  const getOverlayOpacity = () => {
    if (item.type === "image" && item.customOverlayOpacity !== undefined) {
      return item.customOverlayOpacity;
    }
    return 0.5;
  };

  const getOverlayStyle = () => {
    if (item.type === "image" && item.customOverlayStyle) {
      return item.customOverlayStyle;
    }
    return "linear-bottom";
  };

  const getOverlayBackground = () => {
    const style = getOverlayStyle();
    const color = getOverlayColor();
    const opacity = getOverlayOpacity();

    const getColorWithOpacity = (baseColor: string, alpha: number) => {
      if (baseColor.startsWith('#')) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      if (baseColor.startsWith('rgb(')) {
        return baseColor.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
      }
      return baseColor;
    };

    const colorWithOpacity = getColorWithOpacity(color, opacity);

    switch (style) {
      case "linear-top":
        return `linear-gradient(to top, ${colorWithOpacity} 0%, transparent 100%)`;
      case "linear-bottom":
        return `linear-gradient(to bottom, ${colorWithOpacity} 0%, transparent 100%)`;
      case "linear-left":
        return `linear-gradient(to left, ${colorWithOpacity} 0%, transparent 100%)`;
      case "linear-right":
        return `linear-gradient(to right, ${colorWithOpacity} 0%, transparent 100%)`;
      case "linear-top-left":
        return `linear-gradient(to top left, ${colorWithOpacity} 0%, transparent 100%)`;
      case "linear-top-right":
        return `linear-gradient(to top right, ${colorWithOpacity} 0%, transparent 100%)`;
      case "linear-bottom-left":
        return `linear-gradient(to bottom left, ${colorWithOpacity} 0%, transparent 100%)`;
      case "linear-bottom-right":
        return `linear-gradient(to bottom right, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-center":
        return `radial-gradient(circle at center, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-top":
        return `radial-gradient(circle at top, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-bottom":
        return `radial-gradient(circle at bottom, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-left":
        return `radial-gradient(circle at left, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-right":
        return `radial-gradient(circle at right, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-top-left":
        return `radial-gradient(circle at top left, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-top-right":
        return `radial-gradient(circle at top right, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-bottom-left":
        return `radial-gradient(circle at bottom left, ${colorWithOpacity} 0%, transparent 100%)`;
      case "radial-bottom-right":
        return `radial-gradient(circle at bottom right, ${colorWithOpacity} 0%, transparent 100%)`;
      case "uniform":
        return `${color}`;
      default:
        return `linear-gradient(to bottom, ${colorWithOpacity} 0%, transparent 100%)`;
    }
  };

  const getTextOverlayBackground = () => {
    const backgroundType = sectionSettings?.textOverlayBackground || 'none';
    const backgroundColor = sectionSettings?.textOverlayBackgroundColor || '#000000';
    const borderRadius = sectionSettings?.textOverlayBorderRadius !== undefined ? `${sectionSettings.textOverlayBorderRadius * 4}px` : '8px';

    switch (backgroundType) {
      case 'solid':
        return {
          background: backgroundColor,
          padding: 1,
          borderRadius,
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}40 50%, ${backgroundColor}20 100%)`,
          padding: 1,
          borderRadius,
        };
      case 'blur':
        return {
          backdropFilter: 'blur(20px)',
          background: `${backgroundColor}30`,
          padding: 1,
          borderRadius,
        };
      case 'none':
      default:
        return {
          padding: 1,
          borderRadius,
        };
    }
  };

  const getCardStyles = (): any => {
    const baseStyles = {
      borderRadius: getBorderRadius(),
      transition: 'all 0.3s ease-in-out',
      overflow: 'hidden',
    };

    const shadowStyles: Record<'none' | 'low' | 'medium' | 'high', any> = {
      none: {},
      low: { boxShadow: theme.shadows[1] },
      medium: { boxShadow: theme.shadows[4] },
      high: { boxShadow: theme.shadows[8] },
    };

    const cardStyles: Record<'default' | 'minimal' | 'elevated' | 'bordered' | 'glassmorphism', any> = {
      default: {
        ...baseStyles,
        ...shadowStyles[getShadowIntensity()],
      },
      minimal: {
        ...baseStyles,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
      },
      elevated: {
        ...baseStyles,
        boxShadow: theme.shadows[8],
        transform: 'translateY(-2px)',
      },
      bordered: {
        ...baseStyles,
        border: `2px solid ${theme.palette.primary.main}`,
        boxShadow: 'none',
      },
      glassmorphism: {
        ...baseStyles,
        background: `rgba(255, 255, 255, 0.1)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid rgba(255, 255, 255, 0.2)`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
    };

    return cardStyles[getCardStyle()];
  };

  const getHoverStyles = (): any => {
    const baseHover = {
      '&:hover': {
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease-in-out',
      },
    };

    const hoverEffects: Record<'none' | 'zoom' | 'lift' | 'glow' | 'fade' | 'slide' | 'rotate' | 'scale', any> = {
      none: {},
      zoom: {
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'all 0.3s ease-in-out',
        },
      },
      lift: {
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12],
          transition: 'all 0.3s ease-in-out',
        },
      },
      glow: {
        '&:hover': {
          boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
          transition: 'all 0.3s ease-in-out',
        },
      },
      fade: {
        '&:hover': {
          opacity: 0.8,
          transition: 'all 0.3s ease-in-out',
        },
      },
      slide: {
        '&:hover': {
          transform: 'translateX(8px)',
          transition: 'all 0.3s ease-in-out',
        },
      },
      rotate: {
        '&:hover': {
          transform: 'rotate(2deg) scale(1.02)',
          transition: 'all 0.3s ease-in-out',
        },
      },
      scale: {
        '&:hover': {
          transform: 'scale(1.08)',
          transition: 'all 0.3s ease-in-out',
        },
      },
    };

    return hoverEffects[getHoverEffect()];
  };

  const getImageStyles = (): any => {
    const scaling = getImageScaling();
    const position = getImagePosition();

    const backgroundSize: Record<'cover' | 'contain' | 'fill' | 'center' | 'mosaic' | 'expanded', string> = {
      cover: 'cover',
      contain: 'contain',
      fill: '100% 100%',
      center: 'auto',
      mosaic: '200px 200px',
      expanded: '120%',
    };

    const backgroundPosition: Record<'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', string> = {
      center: 'center center',
      top: 'center top',
      bottom: 'center bottom',
      left: 'left center',
      right: 'right center',
      'top-left': 'left top',
      'top-right': 'right top',
      'bottom-left': 'left bottom',
      'bottom-right': 'right bottom',
    };

    const backgroundSizeValue = backgroundSize[scaling];
    const backgroundPositionValue = backgroundPosition[position];
    const backgroundRepeat = scaling === 'mosaic' ? 'repeat' : 'no-repeat';

    const keyframes = scaling === 'mosaic' ? {
      '@keyframes mosaicFloat': {
        '0%': { backgroundPosition: '0px 0px' },
        '100%': { backgroundPosition: '100px 100px' },
      },
    } : scaling === 'expanded' ? {
      '@keyframes expandedPulse': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
        '100%': { transform: 'scale(1)' },
      },
    } : {};

    return {
      backgroundSize: backgroundSizeValue,
      backgroundPosition: backgroundPositionValue,
      backgroundRepeat,
      transition: 'all 0.3s ease-in-out',
      ...(scaling === 'mosaic' && {
        animation: 'mosaicFloat 8s ease-in-out infinite alternate',
      }),
      ...(scaling === 'expanded' && {
        animation: 'expandedPulse 3s ease-in-out infinite',
      }),
      ...keyframes,
    };
  };

  const renderEnhancedImage = (imageUrl: string, alt?: string) => {
    const showOverlay = sectionSettings?.showOverlay || false;
    const textOverlay = sectionSettings?.textOverlay || false;
    const textOverlayPosition = sectionSettings?.textOverlayPosition || "bottom";
    const textOverlayBackground = sectionSettings?.textOverlayBackground || "none";

    return (
      <Box
        sx={{
          position: 'relative',
          aspectRatio: "1/1",
          height: (theme) => theme.spacing(24),
          width: "100%",
          backgroundImage: `url('${imageUrl}')`,
          ...getImageStyles(),
          [theme.breakpoints.down('sm')]: {
            height: theme.spacing(20),
          },
          [theme.breakpoints.down('xs')]: {
            height: theme.spacing(16),
          },
        }}
      >
        {showOverlay && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: getOverlayBackground(),
              display: 'flex',
              alignItems: textOverlayPosition === 'center' ? 'center' :
                textOverlayPosition === 'top' ? 'flex-start' :
                  textOverlayPosition === 'bottom' ? 'flex-end' :
                    textOverlayPosition === 'left' ? 'center' :
                      textOverlayPosition === 'right' ? 'center' : 'center',
              justifyContent: textOverlayPosition === 'center' ? 'center' :
                textOverlayPosition === 'top' ? 'center' :
                  textOverlayPosition === 'bottom' ? 'center' :
                    textOverlayPosition === 'left' ? 'flex-start' :
                      textOverlayPosition === 'right' ? 'flex-end' : 'center',
              padding: 2,
            }}
          >
            {textOverlay && (
              <>
                {(textOverlayPosition === 'top-left' || textOverlayPosition === 'top-right' ||
                  textOverlayPosition === 'bottom-left' || textOverlayPosition === 'bottom-right') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: textOverlayPosition === 'top-left' || textOverlayPosition === 'top-right' ? 16 : 'auto',
                        bottom: textOverlayPosition === 'bottom-left' || textOverlayPosition === 'bottom-right' ? 16 : 'auto',
                        left: textOverlayPosition === 'top-left' || textOverlayPosition === 'bottom-left' ? 16 : 'auto',
                        right: textOverlayPosition === 'top-right' || textOverlayPosition === 'bottom-right' ? 16 : 'auto',
                        textAlign: 'center',
                        color: sectionSettings?.textOverlayTextColor || 'white',
                        ...getTextOverlayBackground(),
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {item.type === "image" ? item.title : "View Details"}
                      </Typography>
                      {item.type === "image" && item.subtitle && (
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {item.subtitle}
                        </Typography>
                      )}
                    </Box>
                  )}

                {!['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(textOverlayPosition) && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      color: sectionSettings?.textOverlayTextColor || 'white',
                      ...getTextOverlayBackground(),
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {item.type === "image" ? item.title : "View Details"}
                    </Typography>
                    {item.type === "image" && item.subtitle && (
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {item.subtitle}
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {!showOverlay && textOverlay && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: textOverlayPosition === 'center' ? 'center' :
                textOverlayPosition === 'top' ? 'flex-start' :
                  textOverlayPosition === 'bottom' ? 'flex-end' :
                    textOverlayPosition === 'left' ? 'center' :
                      textOverlayPosition === 'right' ? 'center' : 'center',
              justifyContent: textOverlayPosition === 'center' ? 'center' :
                textOverlayPosition === 'top' ? 'center' :
                  textOverlayPosition === 'bottom' ? 'center' :
                    textOverlayPosition === 'left' ? 'flex-start' :
                      textOverlayPosition === 'right' ? 'flex-end' : 'center',
              padding: 2,
            }}
          >
            {(textOverlayPosition === 'top-left' || textOverlayPosition === 'top-right' ||
              textOverlayPosition === 'bottom-left' || textOverlayPosition === 'bottom-right') && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: textOverlayPosition === 'top-left' || textOverlayPosition === 'top-right' ? 16 : 'auto',
                    bottom: textOverlayPosition === 'bottom-left' || textOverlayPosition === 'bottom-right' ? 16 : 'auto',
                    left: textOverlayPosition === 'top-left' || textOverlayPosition === 'bottom-left' ? 16 : 'auto',
                    right: textOverlayPosition === 'top-right' || textOverlayPosition === 'bottom-right' ? 16 : 'auto',
                    textAlign: 'center',
                    color: sectionSettings?.textOverlayTextColor || 'white',
                    ...getTextOverlayBackground(),
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {item.type === "image" ? item.title : "View Details"}
                  </Typography>
                  {item.type === "image" && item.subtitle && (
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {item.subtitle}
                    </Typography>
                  )}
                </Box>
              )}

            {!['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(textOverlayPosition) && (
              <Box
                sx={{
                  textAlign: 'center',
                  color: sectionSettings?.textOverlayTextColor || 'white',
                  ...getTextOverlayBackground(),
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {item.type === "image" ? item.title : "View Details"}
                </Typography>
                {item.type === "image" && item.subtitle && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  if (item.type === "image") {
    const hasValidLink = item.actionType && item?.actionType === "link" && item?.url;
    const hasValidPage = item.actionType && item.actionType === "page" && item?.page;
    const href = hasValidLink ? item.url : hasValidPage ? item?.page : null;

    return (
      <Card sx={getCardStyles()}>
        {href ? (
          <CardActionArea
            LinkComponent={Link}
            href={href}
            sx={getHoverStyles()}
          >
            {item.imageUrl ? (
              renderEnhancedImage(item.imageUrl)
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{
                  aspectRatio: "1/1",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </CardActionArea>
        ) : (
          <Box sx={getHoverStyles()}>
            {item.imageUrl ? (
              renderEnhancedImage(item.imageUrl)
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{
                  aspectRatio: "1/1",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </Box>
        )}
        <Divider />
        {(item?.title || item?.subtitle) && (item.showTextBelow !== false) && (
          <CardContent sx={{
            minHeight: (theme) => theme.spacing(12),
            display: item.textAlign === 'center' ? 'flex' : 'block',
            alignItems: item.textAlign === 'center' ? 'center' : 'flex-start',
            justifyContent: item.textAlign === 'center' ? 'center' : 'flex-start',
            textAlign: item.textAlign || 'inherit',
            '@media (max-width: 600px)': {
              minHeight: theme.spacing(10),
              padding: theme.spacing(1.5),
            },
            '@media (max-width: 480px)': {
              minHeight: theme.spacing(8),
              padding: theme.spacing(1),
            },
          }}>
            <Stack spacing={1} alignItems={item.textAlign === 'center' ? 'center' : 'flex-start'}>
              <Box>
                {item.title && (
                  <Typography
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      textAlign: item.textAlign || 'inherit',
                      color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
                      '@media (max-width: 600px)': {
                        fontSize: '0.9rem',
                        lineHeight: 1.2,
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '0.8rem',
                        lineHeight: 1.1,
                      },
                    }}
                    variant="body1"
                    fontWeight="bold"
                  >
                    {item.title}
                  </Typography>
                )}
                {item.subtitle && (
                  <Typography
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      textAlign: item.textAlign || 'inherit',
                      color: theme.palette.mode === 'dark' ? '#cccccc' : 'inherit',
                      '@media (max-width: 600px)': {
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '0.7rem',
                        lineHeight: 1.1,
                      },
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    <AppExpandableTypography
                      TypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      value={item.subtitle || ""}
                      asInlineElement={true}
                    />
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        )}
      </Card>
    );
  }

  if (item.type === "collection") {
    return (
      <Card sx={getCardStyles()}>
        <CardActionArea
          LinkComponent={Link}
          href={`/collection/${getNetworkSlugFromChainId(item.chainId)}/${item.contractAddress
            }`}
          sx={getHoverStyles()}
        >
          {item.imageUrl ? (
            <NFTCardMedia
              metadata={{ image: item.imageUrl } as any}
              chainId={item.chainId}
              contractAddress={item.contractAddress}
              aspectRatio="1/1"
            />
          ) : contractMetadata.data?.image ? (
            <NFTCardMedia
              metadata={contractMetadata.data as any}
              chainId={item.chainId}
              contractAddress={item.contractAddress}
              aspectRatio="1/1"
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: "1/1",
                display: "block",
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </CardActionArea>

        <Divider />
        <CardContent sx={{
          minHeight: (theme) => theme.spacing(16),
          display: item.textAlign === 'center' ? 'flex' : 'block',
          alignItems: item.textAlign === 'center' ? 'center' : 'flex-start',
          justifyContent: item.textAlign === 'center' ? 'center' : 'flex-start',
          textAlign: item.textAlign || 'inherit',
          '@media (max-width: 600px)': {
            minHeight: theme.spacing(14),
            padding: theme.spacing(1.5),
          },
          '@media (max-width: 480px)': {
            minHeight: theme.spacing(12),
            padding: theme.spacing(1),
          },
        }}>
          <Stack spacing={1} alignItems={item.textAlign === 'center' ? 'center' : 'flex-start'}>
            <Box>
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  textAlign: item.textAlign || 'inherit',
                  color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
                  '@media (max-width: 600px)': {
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                  },
                  '@media (max-width: 480px)': {
                    fontSize: '0.8rem',
                    lineHeight: 1.1,
                  },
                }}
                variant="body1"
                fontWeight="bold"
              >
                {item.title ? (
                  item.title
                ) : contractMetadata.data?.name ? (
                  contractMetadata.data?.name
                ) : (
                  <Skeleton />
                )}
              </Typography>

              {item.subtitle ? (
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    textAlign: item.textAlign || 'inherit',
                    color: theme.palette.mode === 'dark' ? '#cccccc' : 'inherit',
                    '@media (max-width: 600px)': {
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '0.7rem',
                      lineHeight: 1.1,
                    },
                  }}
                  variant="body2"
                  color="text.secondary"
                >
                  <AppExpandableTypography
                    TypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                    }}
                    value={contractMetadata.data?.name || ""}
                    asInlineElement={true}
                  />
                </Typography>
              ) : (
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    textAlign: item.textAlign || 'inherit',
                    color: theme.palette.mode === 'dark' ? '#cccccc' : 'inherit',
                    '@media (max-width: 600px)': {
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '0.7rem',
                      lineHeight: 1.1,
                    },
                  }}
                  variant="body2"
                  color="text.secondary"
                >
                  <AppExpandableTypography
                    TypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                    }}
                    value={contractMetadata.data?.description || ""}
                    asInlineElement={true}
                  />
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={getCardStyles()}>
      <CardActionArea
        LinkComponent={Link}
        href={`/asset/${getNetworkSlugFromChainId(item.chainId)}/${item.contractAddress
          }/${item.tokenId}`}
        sx={getHoverStyles()}
      >
        {nftQuery.data?.metadata ? (
          <NFTCardMedia
            metadata={nftQuery.data.metadata as any}
            chainId={item.chainId}
            contractAddress={item.contractAddress}
            tokenId={item.tokenId}
            aspectRatio="1/1"
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{
              aspectRatio: "1/1",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </CardActionArea>
      <Divider />
      <CardContent sx={{
        minHeight: (theme) => theme.spacing(16),
        display: item.textAlign === 'center' ? 'flex' : 'block',
        alignItems: item.textAlign === 'center' ? 'center' : 'flex-start',
        justifyContent: item.textAlign === 'center' ? 'center' : 'flex-start',
        textAlign: item.textAlign || 'inherit',
        '@media (max-width: 600px)': {
          minHeight: theme.spacing(14),
          padding: theme.spacing(1.5),
        },
        '@media (max-width: 480px)': {
          minHeight: theme.spacing(12),
          padding: theme.spacing(1),
        },
      }}>
        <Stack spacing={1} alignItems={item.textAlign === 'center' ? 'center' : 'flex-start'}>
          <Box>
            <Typography
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                textAlign: item.textAlign || 'inherit',
                color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
                '@media (max-width: 600px)': {
                  fontSize: '0.9rem',
                  lineHeight: 1.2,
                },
                '@media (max-width: 480px)': {
                  fontSize: '0.8rem',
                  lineHeight: 1.1,
                },
              }}
              variant="body1"
              fontWeight="bold"
            >
              {nftQuery.isLoading ? (
                <Skeleton />
              ) : (
                <>
                  {nftQuery.data?.metadata?.name
                    ? nftQuery.data?.metadata?.name
                    : `${nftQuery.data?.collectionName} #${nftQuery.data?.id}`}
                </>
              )}
            </Typography>
            <Typography
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                textAlign: item.textAlign || 'inherit',
                color: theme.palette.mode === 'dark' ? '#cccccc' : 'inherit',
                '@media (max-width: 600px)': {
                  fontSize: '0.8rem',
                  lineHeight: 1.2,
                },
                '@media (max-width: 480px)': {
                  fontSize: '0.7rem',
                  lineHeight: 1.1,
                },
              }}
              variant="body2"
              color="text.secondary"
            >
              {nftQuery.isLoading ? (
                <Skeleton />
              ) : (
                <AppExpandableTypography
                  value={
                    nftQuery.data?.metadata?.description
                      ? nftQuery.data?.metadata?.description || ""
                      : `${nftQuery.data?.collectionName} #${nftQuery.data?.id}`
                  }
                  TypographyProps={{
                    variant: "body2",
                    color: "text.secondary",
                  }}
                  asInlineElement={true}
                />
              )}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
