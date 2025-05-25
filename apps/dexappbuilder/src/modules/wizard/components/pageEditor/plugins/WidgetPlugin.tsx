import Container from '@mui/material/Container';
import type { CellPlugin } from '@react-page/editor';
import { TextareaControl } from '../components/TextareaControl';

import WidgetPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/WidgetPlugin';

type Data = {
  html?: string;
};
// you can pass the shape of the data as the generic type argument
const WidgetPlugin: CellPlugin<Data> = {
  ...WidgetPluginViewer,
  controls: {
    type: 'custom',
    Component: (data) => (
      <Container sx={{ p: 2 }}>
        {' '}
        <TextareaControl data={data} />
      </Container>
    ),
  },
};

export default WidgetPlugin;
