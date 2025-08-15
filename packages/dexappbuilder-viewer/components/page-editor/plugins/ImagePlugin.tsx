import ImageIcon from "@mui/icons-material/Landscape";
import type { CellPlugin } from "@react-page/editor";

import Link from "@dexkit/ui/components/AppLink";
import { DEXKIT_BASE_FILES_HOST } from "@dexkit/ui/constants";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/legacy/image";
import { useMemo } from "react";

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

    const src = data?.src;
    const alt = data?.alt;
    const priority = data?.priority ? true : false;
    const openInNewWindow = data?.targetBlank;
    let image;
    if (src && src.startsWith(DEXKIT_BASE_FILES_HOST)) {
      image = (
        <Image
          alt={alt || "Image"}
          style={{
            borderRadius: data.borderRadius
              ? `${data.borderRadius}%`
              : undefined,
          }}
          src={src}
          priority={priority}
          height={data.height ? data.height : 250}
          width={data.width ? data.width : 250}
        />
      );
    } else {
      image = (
        <img
          alt={alt || "Image"}
          style={{
            borderRadius: data.borderRadius
              ? `${data.borderRadius}%`
              : undefined,
          }}
          src={src}
          height={data.height ? data.height : 250}
          width={data.width ? data.width : 250}
        />
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
            onClick={isEditMode ? (e) => e.preventDefault() : undefined}
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
            onClick={isEditMode ? (e) => e.preventDefault() : undefined}
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
  description: "Add Image from url or gallery",
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
