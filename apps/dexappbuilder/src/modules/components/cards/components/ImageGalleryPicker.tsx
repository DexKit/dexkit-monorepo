import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { Delete, Image as ImageIcon } from '@mui/icons-material';
import { Box, ButtonBase, Card, CardMedia, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

interface ImageGalleryPickerProps {
  value?: string;
  onChange: (url: string | null) => void;
  error?: string;
  disabled?: boolean;
}

export const ImageGalleryPicker: React.FC<ImageGalleryPickerProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [showMediaDialog, setShowMediaDialog] = useState(false);

  const handleSelectImage = (file: { url: string }) => {
    onChange(file.url);
    setShowMediaDialog(false);
  };

  const handleRemoveImage = () => {
    onChange(null);
  };

  const handleOpenGallery = () => {
    if (!disabled) {
      setShowMediaDialog(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <MediaDialog
        dialogProps={{
          open: showMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => setShowMediaDialog(false),
        }}
        onConfirmSelectFile={handleSelectImage}
      />

      {value ? (
        <Card sx={{ position: 'relative', maxWidth: 300 }}>
          <CardMedia
            component="img"
            height="180"
            image={value}
            alt="Selected image"
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
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <Delete />
          </IconButton>
        </Card>
      ) : (
        <ButtonBase
          onClick={handleOpenGallery}
          disabled={disabled}
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
            width: '100%',
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
          <Typography variant="body2" color="textSecondary">
            <FormattedMessage
              id="image.gallery.select"
              defaultMessage="Click to select from gallery"
            />
          </Typography>
        </ButtonBase>
      )}

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}; 