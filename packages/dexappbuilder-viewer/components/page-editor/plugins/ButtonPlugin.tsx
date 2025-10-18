import type { CellPlugin } from "@react-page/editor";

import Link from "@dexkit/ui/components/AppLink";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";

type Data = {
  variant: "text" | "contained" | "outlined";
  color:
  | "secondary"
  | "success"
  | "error"
  | "inherit"
  | "primary"
  | "info"
  | "warning";
  size: "small" | "medium" | "large";
  href: string;
  text: string;
  padding: number;
  pageUri: string;
  action: string;
  fullWidth: boolean;
  position: string;
  targetBlank: boolean;
  forceCenterOnMobile?: boolean;
  mobileButtonAlign?: 'left' | 'center' | 'right';
};

const ButtonPlugin: CellPlugin<Data> = {
  Renderer: ({ data, isEditMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const href = data.pageUri || data.href;
    //    const openInNewWindow = data?.targetBlank;
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

    const getMinWidth = () => {
      if (isMobile) {
        return '200px';
      }

      const textLength = data.text?.length || 0;
      if (textLength <= 8) {
        return '140px';
      } else if (textLength <= 15) {
        return '160px';
      } else {
        return '180px';
      }
    };

    const getHorizontalPadding = () => {
      if (isMobile) {
        return 4;
      } else if (isTablet) {
        return 3;
      } else {
        return 2.5;
      }
    };

    return (
      <Box 
        sx={{ 
          p: data.padding,
          width: '100%'
        }} 
        display={"flex"} 
        justifyContent={position}
      >
        {data.targetBlank ? (
          <Link
            href={href}
            target={"_blank"}
            variant={"inherit"}
            sx={{ color: data.color }}
            underline={"none"}
          >
            <Button
              variant={data.variant ? data.variant : undefined}
              color={data.color ? data.color : undefined}
              size={data.size ? data.size : undefined}
              fullWidth={isMobile ? true : data.fullWidth}
              sx={{
                minWidth: getMinWidth(),
                px: getHorizontalPadding(),
                py: isMobile ? 1.5 : 1,
                whiteSpace: 'nowrap',
                fontSize: isMobile ? '1rem' : '0.875rem',
                fontWeight: 500,
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: isMobile ? 'translateY(-1px)' : 'none',
                  boxShadow: isMobile ? theme.shadows[4] : theme.shadows[2],
                }
              }}
              onClick={isEditMode ? (e: any) => e.preventDefault() : undefined}
            >
              {data.text ? data.text : "Button"}
            </Button>
          </Link>
        ) : (
          <Button
            variant={data.variant ? data.variant : undefined}
            color={data.color ? data.color : undefined}
            size={data.size ? data.size : undefined}
            fullWidth={isMobile ? true : data.fullWidth}
            href={href}
            sx={{
              minWidth: getMinWidth(),
              px: getHorizontalPadding(),
              py: isMobile ? 1.5 : 1,
              whiteSpace: 'nowrap',
              fontSize: isMobile ? '1rem' : '0.875rem',
              fontWeight: 500,
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: isMobile ? 'translateY(-1px)' : 'none',
                boxShadow: isMobile ? theme.shadows[4] : theme.shadows[2],
              }
            }}
              onClick={isEditMode ? (e: any) => e.preventDefault() : undefined}
          >
            {data.text ? data.text : "Button"}
          </Button>
        )}
      </Box>
    );
  },
  id: "button-dexkit-plugin",
  title: "Button",
  description: "Add button with actions",
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        variant: {
          type: 'string',
          title: 'Variant',
          enum: ['text', 'contained', 'outlined'],
          default: 'contained',
        },
        color: {
          type: 'string',
          title: 'Color',
          enum: ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'inherit'],
          default: 'primary',
        },
        size: {
          type: 'string',
          title: 'Size',
          enum: ['small', 'medium', 'large'],
          default: 'medium',
        },
        text: {
          type: 'string',
          title: 'Button Text',
          default: 'Button',
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
          enum: ['Open page', 'Open link', 'Submit form', 'Custom'],
          default: 'Open page',
        },
        fullWidth: {
          type: 'boolean',
          title: 'Full Width',
          default: false,
        },
        position: {
          type: 'string',
          title: 'Position',
          enum: ['center', 'start', 'end'],
          default: 'center',
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
        forceCenterOnMobile: {
          type: 'boolean',
          title: 'Force center on mobile',
          default: false,
        },
        mobileButtonAlign: {
          type: 'string',
          title: 'Mobile button alignment',
          enum: ['left', 'center', 'right'],
          default: 'inherit',
        },
      },
      required: ['text'],
    },
  },
};

export default ButtonPlugin;
