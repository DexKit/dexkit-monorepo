import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, Stack, styled } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'));

const CustomImage = styled('img')(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
}));

const CustomImageIcon = styled(ImageIcon)(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
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
          onConfirmSelectFile={(file) => {
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
              <CustomImage
                alt=""
                src={value as string}
                height={imageHeight}
                width={imageWidth}
              />
            ) : (
              <CustomImageIcon height={imageHeight} width={imageWidth} />
            )}
          </Button>
        </Stack>
      </Box>
    </>
  );
}
