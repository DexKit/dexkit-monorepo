import { useIsMobile } from '@dexkit/core';
import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Dashboard from '@mui/icons-material/Dashboard';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import {
  Button,
  ButtonBase,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface PageSectionsHeaderProps {
  onClose: () => void;
  onPreview: () => void;
  onClone: () => void;
  onEditTitle: (title: string) => void;
  onEditLayout: () => void;
  page: AppPage;
}

export default function PageSectionsHeader({
  onClose,
  onPreview,
  onClone,
  onEditTitle,
  onEditLayout,
  page,
}: PageSectionsHeaderProps) {
  const [isEditTitle, setIsEditTitle] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleEdit = () => {
    setIsEditTitle(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const [title, setTitle] = useState(page?.title ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    onEditTitle(title);
    setIsEditTitle(false);
  };

  const handleCancel = () => {
    setIsEditTitle(false);
    setTitle(page?.title || '');
  };

  const isMobile = useIsMobile();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={isMobile ? 0.25 : 0.5}
      sx={{
        px: 0,
        pt: 0,
        pb: isMobile ? 0.25 : 0.25,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        width: '100%',
        justifyContent: 'flex-start',
        ml: -0.5
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.25}
        sx={{
          width: isMobile ? '100%' : 'auto',
          mb: isMobile ? 0.25 : 0,
          justifyContent: 'flex-start'
        }}
      >
        <IconButton onClick={onClose} sx={{ p: 0 }}>
          <ArrowBack color="primary" fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        {isEditTitle ? (
          <TextField
            inputRef={(ref) => (inputRef.current = ref)}
            value={title}
            variant="standard"
            size={isMobile ? "small" : "medium"}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            onChange={handleChange}
            fullWidth={isMobile}
            sx={{
              maxWidth: isMobile ? 'calc(100% - 60px)' : undefined,
              '& .MuiInputBase-input': {
                fontSize: isMobile ? '1.1rem' : '1.5rem'
              }
            }}
          />
        ) : (
          <ButtonBase
            sx={{
              px: 0.25,
              py: 0,
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              '&: hover': {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
              },
            }}
            onClick={handleEdit}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                cursor: 'pointer',
              }}
            >
              {page?.title}
            </Typography>
          </ButtonBase>
        )}
        {isEditTitle && isMobile && (
          <Stack direction="row" alignItems="center" spacing={0.25}>
            <IconButton size="small" onClick={handleSave}>
              <Check fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCancel}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </Stack>

      <Stack
        direction="row"
        spacing={isMobile ? 0.25 : 0.5}
        sx={{
          ml: isMobile ? 0 : 'auto !important',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: isMobile ? 'flex-start' : 'flex-end'
        }}
      >
        <Button
          onClick={onPreview}
          startIcon={<Visibility fontSize={isMobile ? "small" : "medium"} />}
          size={isMobile ? "small" : "medium"}
          sx={{
            minWidth: isMobile ? 'auto' : undefined,
            px: isMobile ? 0.25 : 0.5
          }}
        >
          <FormattedMessage id="preview" defaultMessage="Preview" />
        </Button>
        <Button
          startIcon={<Dashboard fontSize={isMobile ? "small" : "medium"} />}
          onClick={onEditLayout}
          size={isMobile ? "small" : "medium"}
          sx={{
            minWidth: isMobile ? 'auto' : undefined,
            px: isMobile ? 0.25 : 0.5
          }}
        >
          <FormattedMessage id="edit.layout" defaultMessage="Edit layout" />
        </Button>
      </Stack>
    </Stack>
  );
}
