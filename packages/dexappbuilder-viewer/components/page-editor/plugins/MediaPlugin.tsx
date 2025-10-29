import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import type { CellPlugin } from "@react-page/editor";

import Link from "@dexkit/ui/components/AppLink";
import { DEXKIT_BASE_FILES_HOST } from "@dexkit/ui/constants";
import { Box, Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";

// Helper function to detect media type from URL
const getMediaTypeFromUrl = (url: string): 'video' | 'audio' => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm')) {
    return 'video';
  }
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.ogg') || lowerUrl.includes('.flac')) {
    return 'audio';
  }
  // Default to video for unknown multimedia formats
  return 'video';
};

type Data = {
  src: string;
  alt: string;
  width: number;
  height: number;
  position: string;
  borderRadius: number;
  href: string;
  pageUri: string;
  action: string;
  targetBlank: boolean;
  padding: number;
  priority: boolean;
  forceCenterOnMobile?: boolean;
  mobileMediaAlign?: 'left' | 'center' | 'right';
};

// you can pass the shape of the data as the generic type argument
const MediaPlugin: CellPlugin<Data> = {
  Renderer: ({ data, isEditMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mediaLoaded, setMediaLoaded] = useState(false);

    const src = data?.src;
    const alt = data?.alt;
    const priority = data?.priority ? true : false;
    const openInNewWindow = data?.targetBlank;
    const mediaWidth = data.width ? data.width : 250;
    const mediaHeight = data.height ? data.height : 250;
    const mediaType = src ? getMediaTypeFromUrl(src) : 'video';

    let mediaElement;
    if (src && src.startsWith(DEXKIT_BASE_FILES_HOST)) {
      if (mediaType === 'video') {
        mediaElement = (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {!mediaLoaded && !isEditMode && (
              <Skeleton
                variant="rectangular"
                width={mediaWidth}
                height={mediaHeight}
                sx={{
                  borderRadius: data.borderRadius
                    ? `${data.borderRadius}%`
                    : undefined,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
            )}
            <Box
              component="video"
              sx={{
                borderRadius: data.borderRadius
                  ? `${data.borderRadius}%`
                  : undefined,
                opacity: mediaLoaded || isEditMode ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                width: mediaWidth,
                height: mediaHeight,
                objectFit: 'contain',
              }}
              src={src}
              controls
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setMediaLoaded(true)}
            />
          </div>
        );
      } else {
        // Audio
        mediaElement = (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {!mediaLoaded && !isEditMode && (
              <Skeleton
                variant="rectangular"
                width={mediaWidth}
                height={mediaHeight}
                sx={{
                  borderRadius: data.borderRadius
                    ? `${data.borderRadius}%`
                    : undefined,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
            )}
            <Box
              sx={{
                borderRadius: data.borderRadius
                  ? `${data.borderRadius}%`
                  : undefined,
                opacity: mediaLoaded || isEditMode ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                width: mediaWidth,
                height: mediaHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              }}
            >
              <Box
                component="audio"
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.3)'
                }}
                src={src}
                controls
                onLoadedData={() => setMediaLoaded(true)}
              />
            </Box>
          </div>
        );
      }
    } else {
      // External URLs
      if (mediaType === 'video') {
        mediaElement = (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {!mediaLoaded && !isEditMode && (
              <Skeleton
                variant="rectangular"
                width={mediaWidth}
                height={mediaHeight}
                sx={{
                  borderRadius: data.borderRadius
                    ? `${data.borderRadius}%`
                    : undefined,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
            )}
            <Box
              component="video"
              sx={{
                borderRadius: data.borderRadius
                  ? `${data.borderRadius}%`
                  : undefined,
                opacity: mediaLoaded || isEditMode ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                width: mediaWidth,
                height: mediaHeight,
                objectFit: 'contain',
              }}
              src={src}
              controls
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setMediaLoaded(true)}
            />
          </div>
        );
      } else {
        // Audio
        mediaElement = (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {!mediaLoaded && !isEditMode && (
              <Skeleton
                variant="rectangular"
                width={mediaWidth}
                height={mediaHeight}
                sx={{
                  borderRadius: data.borderRadius
                    ? `${data.borderRadius}%`
                    : undefined,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
            )}
            <Box
              sx={{
                borderRadius: data.borderRadius
                  ? `${data.borderRadius}%`
                  : undefined,
                opacity: mediaLoaded || isEditMode ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                width: mediaWidth,
                height: mediaHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              }}
            >
              <Box
                component="audio"
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.3)'
                }}
                src={src}
                controls
                onLoadedData={() => setMediaLoaded(true)}
              />
            </Box>
          </div>
        );
      }
    }

    const position = useMemo(() => {
      if (isMobile && data.forceCenterOnMobile) {
        return "center";
      }

      if (data.position === "center") {
        return "center";
      }
      if (data.position === "start") {
        return "flex-start";
      }
      if (data.position === "end") {
        return "flex-end";
      }
    }, [data.position, isMobile, data.forceCenterOnMobile]);

    return data.src ? (
      data.href ? (
        <Stack
          alignItems={position}
          sx={{
            p: data.padding,
            justifyContent: isMobile && data.forceCenterOnMobile ? 'center' : 'flex-start',
            width: isMobile && data.forceCenterOnMobile ? '100%' : 'auto'
          }}
        >
          <Link
            onClick={isEditMode ? (e: any) => e.preventDefault() : undefined}
            href={data?.href}
            target={openInNewWindow ? "_blank" : undefined}
            rel={openInNewWindow ? "noreferrer noopener" : undefined}
          >
            {mediaElement}
          </Link>
        </Stack>
      ) : !data.href && !data.pageUri ? (
        <Stack
          alignItems={position}
          sx={{
            p: data.padding,
            justifyContent: isMobile ? 'center' : 'flex-start',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          {mediaElement}
        </Stack>
      ) : data.pageUri ? (
        <Stack
          alignItems={position}
          sx={{
            p: data.padding,
            justifyContent: isMobile ? 'center' : 'flex-start',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          <Link
            href={data.pageUri}
            onClick={isEditMode ? (e: any) => e.preventDefault() : undefined}
            target={openInNewWindow ? "_blank" : undefined}
            rel={openInNewWindow ? "noreferrer noopener" : undefined}
          >
            {mediaElement}
          </Link>
        </Stack>
      ) : (
        <></>
      )
    ) : (
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        alignContent={"center"}
      >
        <VideoLibraryIcon sx={{ width: 250, height: 250 }} />
      </Stack>
    );
  },
  id: "media-dexkit-plugin",
  title: "Media",
  description: "Add Video or Audio from URL or gallery",
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        src: {
          type: 'string',
          title: 'Media URL',
          default: '',
        },
        alt: {
          type: 'string',
          title: 'Alt Text',
          default: 'Media',
        },
        width: {
          type: 'number',
          title: 'Width',
          default: 250,
          minimum: 1,
        },
        height: {
          type: 'number',
          title: 'Height',
          default: 250,
          minimum: 1,
        },
        position: {
          type: 'string',
          title: 'Position',
          enum: ['center', 'start', 'end'],
          default: 'center',
        },
        borderRadius: {
          type: 'number',
          title: 'Border Radius (%)',
          default: 0,
          minimum: 0,
          maximum: 100,
        },
        href: {
          type: 'string',
          title: 'Link URL',
        },
        pageUri: {
          type: 'string',
          title: 'Page URI',
        },
        action: {
          type: 'string',
          title: 'Action',
          enum: ['Open page', 'Open link', 'Custom'],
          default: 'Open page',
        },
        targetBlank: {
          type: 'boolean',
          title: 'Open in new tab',
          default: false,
        },
        padding: {
          type: 'number',
          title: 'Padding',
          default: 0,
          minimum: 0,
        },
        priority: {
          type: 'boolean',
          title: 'High Priority',
          default: false,
        },
        forceCenterOnMobile: {
          type: 'boolean',
          title: 'Force center on mobile',
          default: false,
        },
        mobileMediaAlign: {
          type: 'string',
          title: 'Mobile media alignment',
          enum: ['left', 'center', 'right'],
          default: 'inherit',
        },
      },
      required: ['src'],
    },
  },
};

export default MediaPlugin;
