import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Box, Button, Stack, styled, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'));

const getMediaTypeFromUrl = (url: string): 'image' | 'video' | 'audio' => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm')) {
    return 'video';
  }
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.ogg') || lowerUrl.includes('.flac')) {
    return 'audio';
  }
  return 'image';
};

const CustomImage = styled('img')<{ height?: number; width?: number }>(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
  borderRadius: '50%',
  objectFit: 'cover',
  aspectRatio: '1/1',
}));

const CustomImageIcon = styled(ImageIcon)<{ height?: number; width?: number }>(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
  borderRadius: '50%',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.grey[400],
}));

const CustomVideo = styled('video')<{ height?: number; width?: number }>(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
  borderRadius: '50%',
  objectFit: 'cover',
  aspectRatio: '1/1',
}));

const CustomAudioContainer = styled(Box)<{ height?: number; width?: number }>(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
  borderRadius: '50%',
  aspectRatio: '1/1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
}));

const CustomMediaIcon = styled(VideoLibraryIcon)<{ height?: number; width?: number }>(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
  borderRadius: '50%',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.grey[400],
}));

interface Props {
  onSelectFile: (file: string) => void;
  error: boolean;
  value: string | null;
  imageHeight?: number;
  imageWidth?: number;
  isDisabled?: boolean;
}

export function ImageFormUpload(props: Props) {
  const { onSelectFile, error, value, imageHeight, imageWidth, isDisabled } =
    props;
  const [openMediaDialog, setOpenMediaDialog] = useState(false);

  return (
    <>
      {openMediaDialog && (
        <MediaDialog
          dialogProps={{
            open: openMediaDialog,
            maxWidth: 'lg',
            fullWidth: true,
            onClose: () => {
              setOpenMediaDialog(false);
            },
          }}
          onConfirmSelectFile={(file: any) => {
            if (file) {
              onSelectFile(file.url);
            }

            setOpenMediaDialog(false);
          }}
        />
      )}
      <Box>
        <Stack direction="row" justifyContent="center">
          <Button
            onClick={() => {
              setOpenMediaDialog(true);
            }}
            disabled={isDisabled}
            sx={
              error
                ? {
                  border: (theme) => `1px solid ${theme.palette.error.main}`,
                }
                : undefined
            }
          >
            {value ? (
              (() => {
                const mediaType = getMediaTypeFromUrl(value as string);
                if (mediaType === 'video') {
                  return (
                    <CustomVideo
                      src={value as string}
                      height={imageHeight}
                      width={imageWidth}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  );
                } else if (mediaType === 'audio') {
                  return (
                    <CustomAudioContainer height={imageHeight} width={imageWidth}>
                      <Typography variant="h4" color="white">♪</Typography>
                    </CustomAudioContainer>
                  );
                } else {
                  return (
                    <CustomImage
                      alt=""
                      src={value as string}
                      height={imageHeight}
                      width={imageWidth}
                    />
                  );
                }
              })()
            ) : (
              <CustomMediaIcon height={imageHeight} width={imageWidth} />
            )}
          </Button>
        </Stack>
      </Box>
    </>
  );
}
