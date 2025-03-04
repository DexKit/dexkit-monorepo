import SearchNFTPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/SearchNFTPlugin';
import type { CellPlugin } from '@react-page/editor';
import { CollectionAutcompleteUniform } from '../components/CollectionAutocompleteUniform';

type Data = {
  padding: number;
  position: string;
  collections?: {
    name: string;
    contractAddress: string;
    backgroundImage: string;
    network: string;
    chainId: number;
    image: string;
  }[];
};

// you can pass the shape of the data as the generic type argument
const SearchNFTPlugin: CellPlugin<Data> = {
  ...SearchNFTPluginViewer,
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
        collections: {
          type: 'array',
          items: { properties: {} },
          uniforms: {
            component: CollectionAutcompleteUniform,
          },
        },
      },
      required: [],
    },
  },
};

export default SearchNFTPlugin;
