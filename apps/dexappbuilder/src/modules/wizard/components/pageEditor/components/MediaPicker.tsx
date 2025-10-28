import { Box, ButtonBase, Container, Stack, styled, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

import { useIsMobile } from '@dexkit/core';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { connectField, useForm } from 'uniforms';

const getMediaTypeFromUrl = (url: string): 'video' | 'audio' => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm')) {
    return 'video';
  }
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.ogg') || lowerUrl.includes('.flac')) {
    return 'audio';
  }
  return 'video';
};

const CustomMediaIcon = styled(VideoLibraryIcon)(({ theme }) => ({
  height: 'auto',
  width: '100%',
}));

export const MediaPicker = connectField<{
  value: string;
  label: string;
  onChange: (v: string | void) => void;
}>((props: any) => {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { formRef, onChange } = useForm();

  return (
    <Container sx={{ mb: isMobile ? theme.spacing(0.5) : theme.spacing(1), px: isMobile ? 0 : 'inherit' }}>
      <MediaDialog
        dialogProps={{
          open: openMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => {
            setOpenMediaDialog(false);
          },
        }}
        onConfirmSelectFile={(file) => {
          props.onChange(file.url);

          if (file.mimeType?.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = file.url;
            video.onloadedmetadata = () => {
              formRef.change('width', video.videoWidth);
              formRef.change('height', video.videoHeight);
            };
          }
        }}
      />
      <Stack alignItems="center">
        <ButtonBase
          onClick={() => {
            setOpenMediaDialog(true);
          }}
          sx={{
            height: theme.spacing(isMobile ? 20 : 24),
            width: theme.spacing(isMobile ? 20 : 24),
            borderRadius: (theme: any) => theme.shape.borderRadius / 2,
            backgroundColor:
              theme.palette.mode === 'light'
                ? 'rgba(0,0,0, 0.2)'
                : theme.alpha(theme.palette.common.white, 0.1),
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              p: isMobile ? theme.spacing(1) : theme.spacing(2),
            }}
          >
            {props.value ? (
              (() => {
                const mediaType = getMediaTypeFromUrl(props.value);
                if (mediaType === 'video') {
                  return (
                    <Box
                      component="video"
                      src={props.value}
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  );
                } else {
                  return (
                    <Box
                      sx={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      }}
                    >
                      <Typography variant="h2" color="white">♪</Typography>
                    </Box>
                  );
                }
              })()
            ) : (
              <CustomMediaIcon sx={{
                fontSize: isMobile
                  ? `${theme.typography.fontSize * 2.5}px`
                  : `${theme.typography.fontSize * 3}px`
              }} />
            )}
          </Stack>
        </ButtonBase>
      </Stack>
    </Container>
  );
});
