import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  AppPageSection,
  CustomEditorSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { BuilderKit } from '../../constants';
import PageEditor from '../pageEditor/PageEditor';
import { AppDialogPageEditorTitle } from './AppDialogPageEditorTitle';

interface Props {
  dialogProps: DialogProps;
  section?: CustomEditorSection;
  initialData?: string | null;
  onSave: (section: CustomEditorSection, index: number) => void;
  index: number;
  builderKit?: BuilderKit;
}

export default function PageEditorDialog({
  dialogProps,
  section,
  index,
  onSave,
  builderKit,
}: Props) {
  const [data, setData] = useState<string | null | undefined>(section?.data);

  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const [name, setName] = useState(
    section?.name
      ? section.name
      : formatMessage({
          id: 'unnamed.section',
          defaultMessage: 'Unnamed Section',
        }),
  );

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setData('null');
    }
  };

  const onChangeEditor = (val: string | null) => {
    setData(val);
  };

  const theme = useTheme();

  const handleChangeName = (name: string) => {
    setName(name);
  };

  return (
    <Dialog {...dialogProps} sx={{ zIndex: 1199 }}>
      <Box sx={{ paddingLeft: 4 }}>
        <AppDialogPageEditorTitle
          section={section}
          onClose={handleClose}
          index={index}
          onSave={onSave}
          name={name}
          onChangeName={handleChangeName}
        />
      </Box>
      <DialogContent>
        <Box sx={{ paddingLeft: 25, paddingRight: 25, paddingTop: 5 }}>
          <PageEditor
            value={data}
            onChange={onChangeEditor}
            builderKit={builderKit}
            theme={theme}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ paddingRight: 10 }} direction={'row'} spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              let saveData: AppPageSection = {
                ...section,
                type: 'custom',
                data,
              };

              if (name) {
                saveData.name = name;
              }

              onSave(saveData, index);

              handleClose();
            }}
          >
            <FormattedMessage id="save.section" defaultMessage="Save section" />
          </Button>
          <Button onClick={handleClose}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
