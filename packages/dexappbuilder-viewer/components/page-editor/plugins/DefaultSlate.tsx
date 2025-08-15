import slate from "@react-page/plugins-slate";
// import css as well. currently, we caannot do this here in the demo project and have moved that to _app.tsx
// see https://github.com/vercel/next.js/issues/19717
// import '@react-page/plugins-slate/lib/index.css';

import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { useMediaQuery, useTheme } from "@mui/material";
import { ColorPickerField } from "@react-page/editor";
import { pluginFactories } from "@react-page/plugins-slate";
import { useMemo } from "react";

const mobileCenteredText = pluginFactories.createComponentPlugin<{}>({
  addHoverButton: false,
  addToolbarButton: false,
  type: "MobileCenteredText",
  object: "block",
  icon: <TextFieldsIcon />,
  label: "Mobile Centered Text",
  Component: ({ children, attributes, ...props }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const style = useMemo(() => ({
      textAlign: (isMobile ? 'center' : 'inherit') as 'center' | 'inherit',
      width: '100%',
      display: 'block' as const
    }), [isMobile]);

    return (
      <div {...attributes} style={style} {...props}>
        {children}
      </div>
    );
  },
  controls: {
    type: "autoform",
    schema: {
      type: "object",
      properties: {},
    },
  },
});

const mobileTextAlignment = pluginFactories.createComponentPlugin<{}>({
  addHoverButton: false,
  addToolbarButton: false,
  type: "MobileTextAlignment",
  object: "mark",
  icon: <TextFieldsIcon />,
  label: "Mobile Text Alignment",
  Component: ({ children, attributes, ...props }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const style = useMemo(() => ({
      textAlign: (isMobile ? 'center' : 'inherit') as 'center' | 'inherit',
      display: 'inline-block' as const,
      width: (isMobile ? '100%' : 'auto') as string
    }), [isMobile]);

    return (
      <span {...attributes} style={style} {...props}>
        {children}
      </span>
    );
  },
  controls: {
    type: "autoform",
    schema: {
      type: "object",
      properties: {},
    },
  },
});

const colorSlate = pluginFactories.createComponentPlugin<{
  color: string;
}>({
  addHoverButton: true, // whether to show it above the text when selected
  addToolbarButton: true, // whether to show it in the bottom toolbar
  type: "SetColor", // a well defined string, this is kind of the id of the plugin
  object: "mark", // mark is like a span, other options are inline and block
  icon: <ColorLensIcon />, // an icon to show
  label: "Set Color",
  Component: "span", // the component to render
  getStyle: ({ color }) => ({ color }),
  controls: {
    // identical to custom cell plugins
    type: "autoform",
    schema: {
      type: "object",
      required: ["color"],
      properties: {
        color: {
          uniforms: {
            component: ColorPickerField,
          },
          default: "rgba(0,0,255,1)",
          type: "string",
        },
      },
    },
  },
});

const fontSlate = pluginFactories.createComponentPlugin<{
  fontSize: number;
}>({
  addHoverButton: true, // whether to show it above the text when selected
  addToolbarButton: true, // whether to show it in the bottom toolbar
  type: "SetFontSize", // a well defined string, this is kind of the id of the plugin
  object: "mark", // mark is like a span, other options are inline and block
  icon: <TextFieldsIcon />, // an icon to show
  label: "Set Font size",
  Component: "span", // the component to render
  getStyle: ({ fontSize }) => ({ fontSize }),
  controls: {
    // identical to custom cell plugins123
    type: "autoform",
    schema: {
      type: "object",
      required: ["fontSize"],
      properties: {
        fontSize: {
          type: "number",
        },
      },
    },
  },
});

const lineHeightSlate = pluginFactories.createComponentPlugin<{
  lineHeight: number;
}>({
  addHoverButton: true, // whether to show it above the text when selected
  addToolbarButton: true, // whether to show it in the bottom toolbar
  type: "SetLineHeight", // a well defined string, this is kind of the id of the plugin
  object: "mark", // mark is like a span, other options are inline and block
  icon: <FormatLineSpacingIcon />, // an icon to show
  label: "Set line height",
  Component: "span", // the component to render
  getStyle: ({ lineHeight }) => ({ lineHeight }),
  controls: {
    // identical to custom cell plugins123
    type: "autoform",
    schema: {
      type: "object",
      required: ["lineHeight"],
      properties: {
        lineHeight: {
          type: "number",
        },
      },
    },
  },
});

export const DefaultSlate = slate((def) => ({
  ...def,
  plugins: {
    // this will pull in all predefined plugins
    ...def.plugins,
    // you can also add custom plugins. The namespace `custom` is just for organizing plugins
    custom: {
      color: colorSlate,
      fontSize: fontSlate,
      lineHeight: lineHeightSlate,
      mobileCenteredText: mobileCenteredText,
      mobileTextAlignment: mobileTextAlignment,
    },
  },
}));
