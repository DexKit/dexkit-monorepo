import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { useIsMobile } from '@dexkit/core';
import { CustomEditorSection } from '@dexkit/ui/modules/wizard/types/section';
import Check from '@mui/icons-material/CheckOutlined';
import { useRef, useState } from 'react';
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
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const renderSectionName = () => {
    if (section?.name) {
      return section.name;
    }

    if (name) {
      return name;
    }

    return (
      <FormattedMessage
        id="unnamed.section"
        defaultMessage="Unnamed Section"
      />
    );
  };

  return (
    <DialogTitle
      sx={(theme) => ({
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })}
    >
      <Stack
        spacing={1}
        direction={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        sx={{ width: isMobile ? '90%' : 'auto' }}
      >
        {isEditMode && (
          <Box
            sx={{
              paddingTop: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <TextField
              sx={{ flex: 1 }}
              inputRef={(ref) => (inputRef.current = ref)}
              value={name}
              variant="standard"
              size={isMobile ? "small" : "medium"}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditMode(false);
                }
                if (e.key === 'Escape') {
                  setIsEditMode(false);
                }
              }}
              onChange={(e) => {
                onChangeName(e.target.value);
              }}
            />
            <IconButton
              onClick={() => {
                setIsEditMode(false);
              }}
              size={isMobile ? "small" : "medium"}
            >
              <Check fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>
        )}
        {!isEditMode && (
          <>
            <Typography variant={isMobile ? "h6" : "inherit"} sx={isMobile ? { fontSize: '1.1rem' } : undefined}>
              <FormattedMessage
                id="edit.section.name"
                defaultMessage="Edit section: {name}"
                values={{
                  name: (
                    <Typography
                      variant={isMobile ? "h6" : "inherit"}
                      fontWeight="400"
                      component="span"
                      sx={isMobile ? { fontSize: '1.1rem' } : undefined}
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
              size={isMobile ? "small" : "medium"}
            >
              <EditIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </>
        )}
      </Stack>
      {onClose && (
        <IconButton
          disabled={disableClose}
          onClick={onClose}
          size={isMobile ? "small" : "medium"}
          sx={{ position: isMobile ? 'absolute' : 'static', right: isMobile ? 8 : 'auto', top: isMobile ? 8 : 'auto' }}
        >
          <CloseIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      )}
    </DialogTitle>
  );
}
