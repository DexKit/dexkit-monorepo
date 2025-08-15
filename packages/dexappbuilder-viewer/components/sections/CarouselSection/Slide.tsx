import Link from '@dexkit/ui/components/AppLink';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';

import { SlideAction } from '@dexkit/ui/modules/wizard/types/section';

export interface SlideProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  imageUrl: string;
  action?: SlideAction;
  height?: { desktop?: number; mobile?: number };
  textColor?: string;
  overlayPercentage?: number;
  overlayColor?: string;
  imageScaling?: 'cover' | 'contain' | 'fill' | 'center' | 'mosaic' | 'expanded';
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  visualEffect?: 'none' | 'pulse' | 'float' | 'zoom' | 'slide' | 'rotate' | 'shake' | 'glow';
  effectIntensity?: 'low' | 'medium' | 'high';
  effectSpeed?: 'slow' | 'normal' | 'fast';
  effectDirection?: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
}

export default function Slide({
  title,
  subtitle,
  action,
  imageUrl,
  height,
  textColor,
  overlayPercentage,
  overlayColor,
  imageScaling = 'cover',
  imagePosition = 'center',
  visualEffect = 'none',
  effectIntensity = 'medium',
  effectSpeed = 'normal',
  effectDirection = 'horizontal',
}: SlideProps) {

  const getBackgroundSize = () => {
    switch (imageScaling) {
      case 'cover':
        return 'cover';
      case 'contain':
        return 'contain';
      case 'fill':
        return '100% 100%';
      case 'center':
        return 'auto';
      case 'mosaic':
        return '200px 200px';
      case 'expanded':
        return '120%';
      default:
        return 'cover';
    }
  };

  const getBackgroundPosition = () => {
    switch (imagePosition) {
      case 'center':
        return 'center center';
      case 'top':
        return 'center top';
      case 'bottom':
        return 'center bottom';
      case 'left':
        return 'left center';
      case 'right':
        return 'right center';
      case 'top-left':
        return 'left top';
      case 'top-right':
        return 'right top';
      case 'bottom-left':
        return 'left bottom';
      case 'bottom-right':
        return 'right bottom';
      default:
        return 'center center';
    }
  };

  const getBackgroundRepeat = () => {
    return imageScaling === 'mosaic' ? 'repeat' : 'no-repeat';
  };

  const getVisualEffectStyles = () => {
    if (visualEffect === 'none') return {};

    const intensityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 2
    }[effectIntensity];

    const speedMultiplier = {
      slow: 1.5,
      normal: 1,
      fast: 0.5
    }[effectSpeed];

    const duration = `${3 * speedMultiplier}s`;
    const scale = 1 + (0.05 * intensityMultiplier);
    const translate = 10 * intensityMultiplier;
    const rotate = 5 * intensityMultiplier;

    const baseStyles = {
      transition: 'all 0.3s ease-in-out',
    };

    switch (visualEffect) {
      case 'pulse':
        return {
          ...baseStyles,
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: `scale(${scale})` },
            '100%': { transform: 'scale(1)' }
          },
          animation: `pulse ${duration} ease-in-out infinite`
        };

      case 'float':
        const floatKeyframes = {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: `translateY(-${translate}px)` },
          '100%': { transform: 'translateY(0px)' }
        };
        return {
          ...baseStyles,
          '@keyframes float': floatKeyframes,
          animation: `float ${duration} ease-in-out infinite`
        };

      case 'zoom':
        const zoomKeyframes = {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: `scale(${scale})` }
        };
        return {
          ...baseStyles,
          '@keyframes zoom': zoomKeyframes,
          animation: `zoom ${duration} ease-in-out infinite alternate`
        };

      case 'slide':
        const slideDirection = effectDirection || 'horizontal';
        const slideKeyframes = slideDirection === 'horizontal' ? {
          '0%': { transform: 'translateX(0px)' },
          '50%': { transform: `translateX(${translate}px)` },
          '100%': { transform: 'translateX(0px)' }
        } : {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: `translateY(${translate}px)` },
          '100%': { transform: 'translateY(0px)' }
        };
        return {
          ...baseStyles,
          '@keyframes slide': slideKeyframes,
          animation: `slide ${duration} ease-in-out infinite`
        };

      case 'rotate':
        const rotateKeyframes = {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: `rotate(${rotate}deg)` }
        };
        return {
          ...baseStyles,
          '@keyframes rotate': rotateKeyframes,
          animation: `rotate ${duration} ease-in-out infinite alternate`
        };

      case 'shake':
        const shakeDirection = effectDirection || 'horizontal';
        const shakeKeyframes = shakeDirection === 'horizontal' ? {
          '0%, 100%': { transform: 'translateX(0px)' },
          '25%': { transform: `translateX(-${translate}px)` },
          '75%': { transform: `translateX(${translate}px)` }
        } : {
          '0%, 100%': { transform: 'translateY(0px)' },
          '25%': { transform: `translateY(-${translate}px)` },
          '75%': { transform: `translateY(${translate}px)` }
        };
        return {
          ...baseStyles,
          '@keyframes shake': shakeKeyframes,
          animation: `shake ${duration} ease-in-out infinite`
        };

      case 'glow':
        const glowIntensity = intensityMultiplier * 0.3;
        return {
          ...baseStyles,
          filter: `brightness(${1 + glowIntensity}) contrast(${1 + glowIntensity * 0.2})`,
          boxShadow: `0 0 ${20 * intensityMultiplier}px rgba(255, 255, 255, ${0.3 * intensityMultiplier})`
        };

      default:
        return baseStyles;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          height: height?.mobile !== undefined ? height?.mobile : 250,
          [theme.breakpoints.up('sm')]: {
            height: height?.desktop !== undefined ? height?.desktop : 500,
          },
          width: '100%',
        })}
      >
        <Box
          sx={{
            backgroundImage: imageUrl ? `linear-gradient(0deg, ${overlayColor || 'rgba(0,0,0,0.3)'} 0%, rgba(0,0,0,0) ${overlayPercentage || 50}%), url("${imageUrl}")` : 'none',
            backgroundColor: imageUrl ? 'transparent' : '#e0e0e0',
            aspectRatio: '16/9',
            backgroundSize: getBackgroundSize(),
            backgroundPosition: getBackgroundPosition(),
            backgroundRepeat: getBackgroundRepeat(),
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'block',
            ...getVisualEffectStyles(),
            ...(imageUrl ? {} : {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '1.2rem',
              border: '2px dashed #ccc',
            }),
          }}
        >
          {!imageUrl && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                No image available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please add an image URL for this slide
              </Typography>
            </Box>
          )}
        </Box>
        <Stack
          sx={{
            position: 'absolute',
            display: 'block',
            bottom: (theme) => theme.spacing(4),
            left: (theme) => theme.spacing(4),
            right: (theme) => theme.spacing(4),
            p: 4,
            '@media (max-width: 600px)': {
              bottom: '16px',
              left: '16px',
              right: '16px',
              p: 2,
            },
          }}
          spacing={2}
        >
          {(title || subtitle || action) && (
            <>
              <Box
                sx={{
                  zIndex: 5,
                }}
              >
                {title && (
                  <Typography
                    sx={{
                      color: textColor ? textColor : undefined,
                      '@media (max-width: 600px)': {
                        fontSize: '1.5rem',
                        lineHeight: 1.2,
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '1.25rem',
                        lineHeight: 1.1,
                      },
                    }}
                    variant="h5"
                  >
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography
                    sx={{
                      color: textColor ? textColor : undefined,
                      '@media (max-width: 600px)': {
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '1rem',
                        lineHeight: 1.1,
                      },
                    }}
                    variant="h6"
                    fontWeight="400"
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {action && (
                <Box>
                  {action.type === 'link' && action.caption && (
                    <Button
                      variant="contained"
                      LinkComponent={Link}
                      href={action.url}
                      sx={{
                        '@media (max-width: 600px)': {
                          fontSize: '0.875rem',
                          padding: '8px 16px',
                          minHeight: '32px',
                        },
                        '@media (max-width: 480px)': {
                          fontSize: '0.8rem',
                          padding: '6px 12px',
                          minHeight: '28px',
                        },
                      }}
                    >
                      {action.caption}
                    </Button>
                  )}
                  {action.type === 'page' && action.caption && (
                    <Button
                      variant="contained"
                      LinkComponent={Link}
                      href={action.page}
                      sx={{
                        '@media (max-width: 600px)': {
                          fontSize: '0.875rem',
                          padding: '8px 16px',
                          minHeight: '32px',
                        },
                        '@media (max-width: 480px)': {
                          fontSize: '0.8rem',
                          padding: '6px 12px',
                          minHeight: '28px',
                        },
                      }}
                    >
                      {action.caption}
                    </Button>
                  )}
                </Box>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
