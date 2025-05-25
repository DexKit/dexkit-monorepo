import ShowCasePluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/ShowCasePlugin';
import { ShowCaseParams } from '@dexkit/ui/modules/wizard/types/section';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import AddShowCaseSectionForm from '../../forms/AddShowCaseSectionForm';

// you can pass the shape of the data as the generic type argument
const ShowCasePlugin: CellPlugin<ShowCaseParams> = {
  ...ShowCasePluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Container sx={{ p: 2 }}>
          <AddShowCaseSectionForm
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

export default ShowCasePlugin;
