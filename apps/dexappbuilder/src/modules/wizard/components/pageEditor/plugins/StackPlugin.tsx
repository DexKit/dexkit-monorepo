import StackPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/StackPlugin';
import type { CellPlugin } from '@react-page/editor';

type Data = {
  padding: number;
  spacing: number;
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  position: string;
};

const StackPlugin: CellPlugin<Data> = {
  ...StackPluginViewer,
  controls: {
    type: 'autoform',
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        padding: {
          type: 'number',
          default: 2,
          minimum: 0,
        },
        position: {
          type: 'string',
          title: 'Position',
          enum: ['center', 'start', 'end'],
        },
        direction: {
          type: 'string',
          title: 'Direction',
          enum: ['row', 'row-reverse', 'column', 'column-reverse'],
        },
      },
      required: [],
    },
  },
};

export default StackPlugin;
