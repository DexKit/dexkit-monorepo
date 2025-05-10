import AssetListPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/AssetListPlugin';
import type { CellPlugin } from '@react-page/editor';
import { NETWORKS } from '../../../../../constants/chain';
import { CollectionAutocomplete } from '../components/CollectionAutocomplete';

type Data = {
  network: string;
  contractAddress: string;
};
// you can pass the shape of the data as the generic type argument
const AssetListPlugin: CellPlugin<Data> = {
  ...AssetListPluginViewer,
  controls: [
    {
      title: 'From Collections',
      controls: {
        type: 'custom',
        Component: (data) => <CollectionAutocomplete data={data} />,
      },
    },

    {
      title: 'Import',
      controls: {
        type: 'autoform',
        schema: {
          // this JSONschema is type checked against the generic type argument
          // the autocompletion of your IDE helps to create this schema
          properties: {
            network: {
              type: 'string',
              enum: Object.values(NETWORKS)
                .filter((n) => !n.testnet)
                .map((n) => String(n.name)),
            },
            contractAddress: {
              type: 'string',
            },
          },
          required: ['network', 'contractAddress'],
        },
      },
    },
  ],
};

export default AssetListPlugin;
