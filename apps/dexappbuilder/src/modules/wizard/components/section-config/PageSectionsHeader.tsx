import { useIsMobile } from '@dexkit/core';
import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Code from '@mui/icons-material/Code';
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
  onEmbed?: () => void;
  onEditTitle: (title: string) => void;
  onEditLayout: () => void;
  page: AppPage;
  pageKey?: string;
}

export default function PageSectionsHeader({
  onClose,
  onPreview,
  onEmbed,
  onClone,
  onEditTitle,
  onEditLayout,
  page,
  pageKey,
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
        px: isMobile ? 0 : 0,
        pt: 0,
        pb: isMobile ? 0.25 : 0.25,
        mt: isMobile ? -2 : 0,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        width: '100%',
        justifyContent: 'flex-start',
        ml: !isMobile ? 0 : undefined,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.25}
        sx={{
          width: isMobile ? '100%' : 'auto',
          mb: isMobile ? 0.25 : 0,
          justifyContent: 'flex-start',
        }}
      >
        {title && (
          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <ArrowBack
              color="primary"
              fontSize={isMobile ? 'small' : 'medium'}
            />
          </IconButton>
        )}
        {isEditTitle && pageKey !== 'home' ? (
          <TextField
            inputRef={(ref) => (inputRef.current = ref)}
            value={title}
            variant="standard"
            size={isMobile ? 'small' : 'medium'}
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
                fontSize: isMobile ? '1.1rem' : '1.5rem',
              },
            }}
          />
        ) : (
          <ButtonBase
            sx={{
              px: 0.25,
              py: 0,
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              '&: hover': {
                backgroundColor:
                  pageKey === 'home'
                    ? 'transparent'
                    : (theme) => alpha(theme.palette.primary.main, 0.1),
              },
              pointerEvents: pageKey === 'home' ? 'none' : 'auto',
            }}
            onClick={pageKey !== 'home' ? handleEdit : undefined}
            disabled={pageKey === 'home'}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                cursor: pageKey === 'home' ? 'default' : 'pointer',
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
          ml: 'auto !important',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: 'flex-end',
          width: isMobile ? '100%' : 'auto',
          pr: isMobile ? 0 : 0,
        }}
      >
        {onEmbed && (
          <Button
            onClick={onEmbed}
            startIcon={<Code fontSize={isMobile ? 'small' : 'medium'} />}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              minWidth: isMobile ? 'auto' : undefined,
              px: isMobile ? 0.5 : 2,
            }}
          >
            <FormattedMessage id="embed" defaultMessage="Embed" />
          </Button>
        )}
        <Button
          onClick={onPreview}
          startIcon={<Visibility fontSize={isMobile ? 'small' : 'medium'} />}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            minWidth: isMobile ? 'auto' : undefined,
            px: isMobile ? 0.5 : 2,
          }}
        >
          <FormattedMessage id="preview" defaultMessage="Preview" />
        </Button>
        <Button
          startIcon={<Dashboard fontSize={isMobile ? 'small' : 'medium'} />}
          onClick={onEditLayout}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            minWidth: isMobile ? 'auto' : undefined,
            px: isMobile ? 2 : 2,
          }}
        >
          <FormattedMessage id="edit.layout" defaultMessage="Edit layout" />
        </Button>
      </Stack>
    </Stack>
  );
}
