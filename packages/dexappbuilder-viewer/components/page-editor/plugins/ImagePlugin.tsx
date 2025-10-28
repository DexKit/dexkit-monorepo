import ImageIcon from "@mui/icons-material/Landscape";
import type { CellPlugin } from "@react-page/editor";

import Link from "@dexkit/ui/components/AppLink";
import { DEXKIT_BASE_FILES_HOST } from "@dexkit/ui/constants";
import { Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/legacy/image";
import { useMemo, useState } from "react";

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
  mobileImageAlign?: 'left' | 'center' | 'right';
};

// you can pass the shape of the data as the generic type argument
const ImagePlugin: CellPlugin<Data> = {
  Renderer: ({ data, isEditMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageLoaded, setImageLoaded] = useState(false);

    const src = data?.src;
    const alt = data?.alt;
    const priority = data?.priority ? true : false;
    const openInNewWindow = data?.targetBlank;
    const imageWidth = data.width ? data.width : 250;
    const imageHeight = data.height ? data.height : 250;

    let image;
    if (src && src.startsWith(DEXKIT_BASE_FILES_HOST)) {
      image = (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {!imageLoaded && !isEditMode && (
            <Skeleton
              variant="rectangular"
              width={imageWidth}
              height={imageHeight}
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
          <Image
            alt={alt || "Image"}
            style={{
              borderRadius: data.borderRadius
                ? `${data.borderRadius}%`
                : undefined,
              opacity: imageLoaded || isEditMode ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            src={src}
            priority={priority}
            height={imageHeight}
            width={imageWidth}
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>
      );
    } else {
      image = (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {!imageLoaded && !isEditMode && (
            <Skeleton
              variant="rectangular"
              width={imageWidth}
              height={imageHeight}
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
          <img
            alt={alt || "Image"}
            style={{
              borderRadius: data.borderRadius
                ? `${data.borderRadius}%`
                : undefined,
              opacity: imageLoaded || isEditMode ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            src={src}
            height={imageHeight}
            width={imageWidth}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      );
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
            {image}
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
          {image}
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
            {image}
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
        <ImageIcon sx={{ width: 250, height: 250 }} />
      </Stack>
    );
  },
  id: "image-dexkit-plugin",
  title: "Image",
  description: "Add Image from URL or gallery",
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        src: {
          type: 'string',
          title: 'Image URL',
          default: '',
        },
        alt: {
          type: 'string',
          title: 'Alt Text',
          default: 'Image',
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
        mobileImageAlign: {
          type: 'string',
          title: 'Mobile image alignment',
          enum: ['left', 'center', 'right'],
          default: 'inherit',
        },
      },
      required: ['src'],
    },
  },
};

export default ImagePlugin;
