import { useIsMobile } from '@dexkit/core';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
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

export interface LeaderboardHeaderProps {
  onClose: () => void;
  onPreview: () => void;
  onEditTitle: (title: string) => void;
  title: string;
}

export default function LeaderboardHeader({
  onClose,
  onPreview,
  onEditTitle,
  title,
}: LeaderboardHeaderProps) {
  const [isEditTitle, setIsEditTitle] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleEdit = () => {
    setIsEditTitle(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const [value, setValue] = useState(title ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSave = () => {
    onEditTitle(value);
    setIsEditTitle(false);
  };

  const handleCancel = () => {
    setIsEditTitle(false);
    setValue(title || '');
  };

  const isMobile = useIsMobile();

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={onClose}>
          <ArrowBack color="primary" />
        </IconButton>
        {isEditTitle ? (
          <TextField
            inputRef={(ref) => (inputRef.current = ref)}
            value={value}
            variant="standard"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            onBlur={() => {
              handleSave();
            }}
            onChange={handleChange}
          />
        ) : (
          <ButtonBase
            sx={{
              px: 1,
              py: 0.25,

              borderRadius: (theme) => theme.shape.borderRadius / 2,
              '&: hover': {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
              },
            }}
            onClick={handleEdit}
          >
            <Typography
              variant="h5"
              sx={{
                cursor: 'pointer',
              }}
            >
              {title}
            </Typography>
          </ButtonBase>
        )}
      </Stack>
      {isEditTitle && isMobile && (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton size="small" onClick={handleSave}>
            <Check />
          </IconButton>
          <IconButton size="small" onClick={handleCancel}>
            <Close />
          </IconButton>
        </Stack>
      )}

      <Button onClick={onPreview} startIcon={<Visibility />}>
        <FormattedMessage id="preview" defaultMessage="Preview" />
      </Button>
    </Stack>
  );
}
