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

import { useIsMobile } from '@dexkit/core';
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
  const isMobile = useIsMobile();
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
    <Dialog
      {...dialogProps}
      sx={{ zIndex: 1199 }}
      fullScreen={true}
    >
      <Box sx={{ paddingLeft: isMobile ? theme.spacing(1) : theme.spacing(4) }}>
        <AppDialogPageEditorTitle
          section={section}
          onClose={handleClose}
          index={index}
          onSave={onSave}
          name={name}
          onChangeName={handleChangeName}
        />
      </Box>
      <DialogContent sx={{
        height: 'calc(100vh - 120px)',
        overflow: 'hidden',
        padding: 0
      }}>
        <Box sx={{
          paddingLeft: isMobile ? 0 : theme.spacing(12.5),
          paddingRight: isMobile ? 0 : theme.spacing(12.5),
          paddingTop: isMobile ? theme.spacing(1) : theme.spacing(5),
          height: '100%',
          overflow: 'auto'
        }}>
          <PageEditor
            value={data}
            onChange={onChangeEditor}
            builderKit={builderKit}
            theme={theme}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: isMobile ? theme.spacing(2) : 'inherit', justifyContent: isMobile ? 'center' : 'flex-end' }}>
        <Stack
          sx={{ paddingRight: isMobile ? 0 : theme.spacing(5) }}
          direction={'row'}
          spacing={2}
          width={isMobile ? '100%' : 'auto'}
          justifyContent={isMobile ? 'space-between' : 'flex-end'}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth={isMobile}
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
          <Button onClick={handleClose} fullWidth={isMobile} variant={isMobile ? "outlined" : "text"}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
