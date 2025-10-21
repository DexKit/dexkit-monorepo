import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';
import { Box, Button, Card, CardMedia, IconButton, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

interface MediaPickerProps {
  value?: string | File;
  onChange: (file: File | null, url?: string) => void;
  error?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export const MediaPicker = ({
  value,
  onChange,
  error,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  disabled = false,
}: MediaPickerProps) => {
  const [fileInputRef, setFileInputRef] = React.useState<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback((event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (maxSize && file.size > maxSize) {
      return;
    }

    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return;
    }

    const url = URL.createObjectURL(file);
    onChange(file, url);
  }, [onChange, accept, maxSize]);

  const handleRemove = useCallback(() => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef?.click();
    }
  }, [disabled]);

  const previewUrl = React.useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return typeof value === 'string' ? value : undefined;
  }, [value]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <input
        ref={setFileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {previewUrl ? (
        <Card sx={{ position: 'relative', maxWidth: 300 }}>
          <CardMedia
            component="img"
            height="180"
            image={previewUrl}
            alt="Preview"
            sx={{ objectFit: 'cover' }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
            onClick={handleRemove}
            disabled={disabled}
          >
            <Delete />
          </IconButton>
        </Card>
      ) : (
        <Box
          sx={{
            border: error ? '2px dashed #f44336' : '2px dashed #ccc',
            borderRadius: 2,
            padding: 3,
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: disabled ? '#f5f5f5' : 'transparent',
            '&:hover': {
              borderColor: disabled ? '#ccc' : '#1976d2',
              backgroundColor: disabled ? '#f5f5f5' : '#f9f9f9',
            },
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleClick}
        >
          <ImageIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            <FormattedMessage
              id="media.picker.dropzone"
              defaultMessage="Click to select an image"
            />
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            disabled={disabled}
            onClick={(e: any) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <FormattedMessage
              id="media.picker.browse"
              defaultMessage="Browse Files"
            />
          </Button>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      <Typography variant="caption" color="textSecondary">
        <FormattedMessage
          id="media.picker.supportedFormats"
          defaultMessage="Supported formats: JPG, PNG, GIF. Max size: {maxSize}MB"
          values={{ maxSize: Math.round(maxSize / (1024 * 1024)) }}
        />
      </Typography>
    </Box>
  );
}; 