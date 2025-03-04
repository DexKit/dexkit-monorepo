import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useIsMobile } from '@dexkit/core';
import { CustomEditorSection } from '@dexkit/ui/modules/wizard/types/section';
import Check from '@mui/icons-material/CheckOutlined';
import { KeyboardEvent, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  section?: CustomEditorSection;
  onSave?: (section: CustomEditorSection, index: number) => void;
  index?: number;
  onClose?: () => void;
  disableClose?: boolean;
  onChangeName: (name: string) => void;
  name: string;
}

export function AppDialogPageEditorTitle({
  section,
  onClose,
  onSave,
  disableClose,
  name,
  onChangeName,
  index,
}: Props) {
  const [isEditMode, setIsEditMode] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = () => {
    setIsEditMode(false);

    if (onSave && index !== undefined) {
      onSave({ ...section, name, type: 'custom', data: section?.data }, index);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditMode) {
        handleSave();
      }
    }
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const isMobile = useIsMobile();

  const renderSectionName = () => {
    if (name) {
      return name;
    }

    if (section?.name) {
      return section.name;
    }

    if (section?.title) {
      return section.title;
    }

    return (
      <FormattedMessage id="unnamed.section" defaultMessage="Unnamed section" />
    );
  };

  return (
    <DialogTitle
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        alignContent="center"
      >
        {isEditMode ? (
          <>
            <Typography variant="inherit">
              <FormattedMessage
                id="section.editor"
                defaultMessage="Section editor"
              />{' '}
            </Typography>
            <TextField
              variant="standard"
              value={name}
              onKeyDown={handleKeyDown}
              onBlur={handleCancel}
              inputRef={(ref) => (inputRef.current = ref)}
              onChange={(ev) => onChangeName(ev.target.value)}
            />
            {isMobile && (
              <>
                <IconButton onClick={handleCancel}>
                  <Tooltip
                    title={
                      <FormattedMessage id="save" defaultMessage="cancel" />
                    }
                  >
                    <CloseIcon />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={handleSave}>
                  <Tooltip
                    title={<FormattedMessage id="save" defaultMessage="Save" />}
                  >
                    <Check />
                  </Tooltip>
                </IconButton>
              </>
            )}
          </>
        ) : (
          <>
            <Typography variant="inherit">
              <FormattedMessage
                id="edit.section.name"
                defaultMessage="Edit section: {name}"
                values={{
                  name: (
                    <Typography
                      variant="inherit"
                      fontWeight="400"
                      component="span"
                    >
                      {renderSectionName()}
                    </Typography>
                  ),
                }}
              />
            </Typography>
            <IconButton
              aria-label="edit"
              onClick={() => {
                setIsEditMode(true);

                setTimeout(() => {
                  inputRef.current?.focus();
                }, 200);
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
      {onClose && (
        <IconButton disabled={disableClose} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}
