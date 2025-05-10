import ColumnPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/ColumnPlugin';
import type { CellPlugin } from '@react-page/editor';

type Data = {
  width: number;
};

// you can pass the shape of the data as the generic type argument
const ColumnPlugin: CellPlugin<Data> = {
  ...ColumnPluginViewer,
  controls: {
    type: 'autoform',
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        width: {
          type: 'number',
          default: 4,
          minimum: 1,
          maximum: 12,
          multipleOf: 1,
        },
      },
      required: ['width'],
    },
  },
};

export default ColumnPlugin;
