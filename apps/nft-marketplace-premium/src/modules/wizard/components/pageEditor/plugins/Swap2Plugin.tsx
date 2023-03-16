import { RenderOptions } from '@dexkit/widgets/src/widgets/swap/types';

import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import { SwapConfigForm } from '../../forms/SwapConfigForm';
import SwapWidget from '../components/SwapWidget';

// you can pass the shape of the data as the generic type argument
const Swap2Plugin: CellPlugin<RenderOptions> = {
  Renderer: ({ data, isEditMode }) => (
    <SwapWidget formData={data} isEditMode={isEditMode} />
  ),
  id: 'swap-settings-plugin',
  title: 'Swap plugin',
  description: 'Swap',
  version: 1,
  controls: {
    type: 'custom',
    Component: (data) => (
      <Container sx={{ p: 2 }}>
        <SwapConfigForm data={data.data} onChange={data.onChange} />
      </Container>
    ),
  },
};

export default Swap2Plugin;
