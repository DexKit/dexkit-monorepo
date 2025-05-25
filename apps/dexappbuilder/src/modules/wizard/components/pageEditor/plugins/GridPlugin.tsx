import type { CellPlugin } from '@react-page/editor';

import GridPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/GridPlugin';

type Data = {
  spacing: number;
};

// you can pass the shape of the data as the generic type argument
const GridPlugin: CellPlugin<Data> = {
  ...GridPluginViewer,
  controls: {
    type: 'autoform',
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        spacing: {
          type: 'number',
          default: 2,
        },
      },
      required: ['spacing'],
    },
  },
};

export default GridPlugin;
