import type { CellPlugin } from '@react-page/editor';

import { PagesPicker } from '../components/ActionsPicker';
import { ImagePicker } from '../components/ImagePicker';

import ImagePluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/ImagePlugin';

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
};

// you can pass the shape of the data as the generic type argument
const ImagePlugin: CellPlugin<Data> = {
  ...ImagePluginViewer,
  controls: [
    {
      title: 'From Gallery',
      controls: {
        type: 'autoform',
        schema: {
          // this JSONschema is type checked against the generic type argument
          // the autocompletion of your IDE helps to create this schema
          properties: {
            src: {
              type: 'string',
              title: 'Image',
              uniforms: {
                component: ImagePicker,
              },
            },

            alt: {
              type: 'string',
              title: 'Image alternative description',
            },
            width: {
              type: 'number',
              default: 250,
              title: 'Image width in px',
            },
            height: {
              type: 'number',
              default: 250,
              title: 'Image height in px',
            },

            position: {
              type: 'string',
              title: 'Position',
              default: 'center',
              enum: ['center', 'start', 'end'],
            },
            padding: {
              type: 'number',
              default: 0,
              minimum: 0,
            },
            borderRadius: {
              type: 'number',
              default: 0,
              minimum: 0,
              maximum: 50,
              title: 'Border radius (%)',
            },
            action: {
              type: 'string',
              enum: ['Open page', 'Open link'],
              title: 'Choose action on click',
            },

            href: {
              type: 'string',
              title: 'Link to open image click',
              uniforms: {
                showIf(data) {
                  return data.action === 'Open link';
                },
              },
            },
            pageUri: {
              type: 'string',
              uniforms: {
                component: PagesPicker,
                showIf(data) {
                  return data.action === 'Open page';
                },
              },
            },
            targetBlank: {
              type: 'boolean',
              title: 'Open in new tab?',
              uniforms: {
                showIf(data) {
                  return (
                    data.action == 'Open page' || data.action == 'Open link'
                  );
                },
              },
            },
          },
          required: ['src', 'width', 'height', 'alt'],
        },
      },
    },
    {
      title: 'From Url',
      controls: {
        type: 'autoform',
        schema: {
          // this JSONschema is type checked against the generic type argument
          // the autocompletion of your IDE helps to create this schema
          properties: {
            src: {
              type: 'string',
              title: 'Image Url',
            },
            alt: {
              type: 'string',
              title: 'Image alternative description',
            },
            width: {
              type: 'number',
              title: 'Image width in px',
            },
            height: {
              type: 'number',
              title: 'Image height in px',
            },
            position: {
              type: 'string',
              title: 'Position',
              enum: ['center', 'start', 'end'],
            },
            padding: {
              type: 'number',
              default: 2,
              minimum: 0,
            },
            borderRadius: {
              type: 'number',
              default: 0,
              minimum: 0,
              maximum: 50,
              title: 'Border radius (%)',
            },
            action: {
              type: 'string',
              enum: ['Open page', 'Open link'],
              title: 'Choose action on click',
            },
            href: {
              type: 'string',
              title: 'Link to open image click',
              uniforms: {
                showIf(data) {
                  return data.action === 'Open link';
                },
              },
            },
            pageUri: {
              type: 'string',
              uniforms: {
                component: PagesPicker,
                showIf(data) {
                  return data.action === 'Open page';
                },
              },
            },
            targetBlank: {
              type: 'boolean',
              title: 'Open in new tab?',
              uniforms: {
                showIf(data) {
                  return (
                    data.action == 'Open page' || data.action == 'Open link'
                  );
                },
              },
            },
          },
          required: ['src'],
        },
      },
    },
  ],
};

export default ImagePlugin;
