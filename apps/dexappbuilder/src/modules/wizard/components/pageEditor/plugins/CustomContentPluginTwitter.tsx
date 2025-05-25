import CustomContentPluginTwitterViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/CustomContentPluginTwitter';
import type { CellPlugin } from '@react-page/editor';

type Data = {
  screenName: string;
  height: number;
  title: string;
};
// you can pass the shape of the data as the generic type argument
const CustomContentPluginTwitter: CellPlugin<Data> = {
  ...CustomContentPluginTwitterViewer,
  controls: {
    type: 'autoform',
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        title: {
          type: 'string',
          default: 'A Sample Twitter plugin',
        },
        screenName: {
          type: 'string',
          default: 'dexkit',
        },
        height: {
          type: 'number',
          default: 500,
        },
      },
      required: ['screenName'],
    },
  },
};

export default CustomContentPluginTwitter;
