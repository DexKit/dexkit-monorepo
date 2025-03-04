import Container from '@mui/material/Container';
import type { CellPlugin } from '@react-page/editor';
import { NETWORKS } from '../../../../../constants/chain';

import { CollectionAutocomplete } from '../components/CollectionAutocomplete';
import { ImagePicker } from '../components/ImagePicker';

import CollectionPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/CollectionPlugin';

type Data = {
  image: string;
  name: string;
  backgroundImage: string;
  network: string;
  contractAddress: string;
  description?: string;
  uri?: string;
};

// you can pass the shape of the data as the generic type argument
const CollectionPlugin: CellPlugin<Data> = {
  ...CollectionPluginViewer,
  controls: [
    {
      title: 'Your collections',
      controls: {
        type: 'custom',
        Component: (data) => (
          <Container sx={{ p: 2 }}>
            {' '}
            <CollectionAutocomplete data={data} />{' '}
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
            image: {
              type: 'string',
              uniforms: {
                component: ImagePicker,
              },
            },
            backgroundImage: {
              type: 'string',
              uniforms: {
                component: ImagePicker,
              },
              // pattern: '(https?://.*.(?:png|jpg|jpeg|gif|svg))',
            },
            name: {
              type: 'string',
            },
            network: {
              type: 'string',
              enum: Object.values(NETWORKS)
                .filter((n) => !n.testnet)
                .map((n) => String(n.name)),
            },
            contractAddress: {
              type: 'string',
              pattern: '^0x[a-fA-F0-9]{40}$',
            },
            description: {
              type: 'string',
            },
          },
          required: [
            'network',
            'contractAddress',
            'name',
            'image',
            'backgroundImage',
          ],
        },
      },
    },
  ],
};

export default CollectionPlugin;
