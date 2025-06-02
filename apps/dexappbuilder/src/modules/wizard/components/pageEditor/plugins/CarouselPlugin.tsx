import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';

import AddCarouselForm from '@/modules/wizard/components/forms/AddCarouselForm';

import CarouselPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/CarouselPlugin';

// you can pass the shape of the data as the generic type argument
const CarouselPlugin: CellPlugin<any> = {
  ...CarouselPluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Container sx={{ p: 2 }}>
          <AddCarouselForm
            data={data}
            onChange={(data) => onChange({ ...data })}
            onSave={(data) => onChange({ ...data })}
            saveOnChange
            disableButtons
          />
        </Container>
      );
    },
  },
};

export default CarouselPlugin;
