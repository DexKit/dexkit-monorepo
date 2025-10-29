import type { CellPlugin } from '@react-page/editor';

import { PagesPicker } from '../components/ActionsPicker';
import { MediaPicker } from '../components/MediaPicker';

import MediaPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/MediaPlugin';

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

const MediaPlugin: CellPlugin<Data> = {
  ...MediaPluginViewer,
  controls: [
    {
      title: 'From Gallery',
      controls: {
        type: 'autoform',
        schema: {
          properties: {
            src: {
              type: 'string',
              title: 'Media',
              uniforms: {
                component: MediaPicker,
              },
            },

            alt: {
              type: 'string',
              title: 'Media alternative description',
            },
            priority: {
              type: 'boolean',
              title: 'Load media with priority',
            },
            width: {
              type: 'number',
              default: 250,
              title: 'Media width in px',
            },
            height: {
              type: 'number',
              default: 250,
              title: 'Media height in px',
            },

            position: {
              type: 'string',
              title: 'Position',
              default: 'center',
              enum: ['center', 'start', 'end'],
            },
            padding: {
              type: 'number',
              title: 'Padding',
              default: 0,
            },
            borderRadius: {
              type: 'number',
              title: 'Border radius (%)',
              default: 0,
            },
          },
          required: ['src'],
        },
      },
    },
    {
      title: 'From URL',
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
    },
    {
      title: 'Actions',
      controls: {
        type: 'autoform',
        schema: {
          properties: {
            action: {
              type: 'string',
              title: 'Choose action on click',
              enum: ['Open page', 'Open link', 'Custom'],
              default: 'Open page',
            },
            pageUri: {
              type: 'string',
              title: 'Page URI',
              uniforms: {
                component: PagesPicker,
              },
            },
            href: {
              type: 'string',
              title: 'Link URL',
            },
            targetBlank: {
              type: 'boolean',
              title: 'Open in new tab',
              default: false,
            },
          },
        },
      },
    },
  ],
};

export default MediaPlugin;
