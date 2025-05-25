import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import { NETWORKS } from '../../../../../constants/chain';

import { SearchNFTAutocomplete } from '../components/SearchNFTAutocomplete';
import { SingleNFTAutocomplete } from '../components/SingleNFTAutocomplete';

import AssetPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/AssetPlugin';

type Data = {
  network: string;
  contractAddress: string;
  id: string;
};
// you can pass the shape of the data as the generic type argument
const AssetPlugin: CellPlugin<Data> = {
  ...AssetPluginViewer,
  controls: [
    {
      title: 'Search NFT',
      controls: {
        type: 'custom',
        Component: (data) => (
          <Container sx={{ p: 2 }}>
            <SearchNFTAutocomplete data={data} />
          </Container>
        ),
      },
    },
    {
      title: 'From Collections',
      controls: {
        type: 'custom',
        Component: (data) => (
          <Container sx={{ p: 2 }}>
            <SingleNFTAutocomplete data={data} />
          </Container>
        ),
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
            id: {
              type: 'string',
            },
          },
          required: ['network', 'contractAddress', 'id'],
        },
      },
    },
  ],
};

export default AssetPlugin;
