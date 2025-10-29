import { Alert, ButtonBase, Container, Snackbar, Stack, styled, useTheme } from '@mui/material';
import { useState } from 'react';

import { useIsMobile } from '@dexkit/core';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { getAcceptedImageTypes, validateImageFile } from '@dexkit/ui/utils/fileValidation';
import ImageIcon from '@mui/icons-material/Image';
import { connectField, useForm } from 'uniforms';

const CustomImage = styled('img')(({ theme }) => ({
  height: '100%',
  width: '100%',
  objectFit: 'contain',
  maxWidth: '100%',
  maxHeight: '100%',
}));

const CustomImageIcon = styled(ImageIcon)(({ theme }) => ({
  height: 'auto',
  width: '100%',
}));

// @dev check here how to connect uniforms and custom form components: https://github.com/react-page/react-page/blob/master/packages/editor/src/ui/ColorPicker/ColorPickerField.tsx
export const ImagePicker = connectField<{
  value: string;
  label: string;
  onChange: (v: string | void) => void;
}>((props: any) => {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { formRef, onChange } = useForm();

  const handleFileSelect = (file: any) => {
    if (file instanceof File) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid image file');
        return;
      }
    }

    props.onChange(file.url);
    setValidationError(null);

    const image = new Image();
    image.src = file.url;
    image.onload = () => {
      formRef.change('width', image.width);
      formRef.change('height', image.height);
    };
  };

  return (
    <Container sx={{ mb: isMobile ? theme.spacing(0.5) : theme.spacing(1), px: isMobile ? 0 : 'inherit' }}>
      <MediaDialog
        dialogProps={{
          open: openMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => {
            setOpenMediaDialog(false);
            setValidationError(null);
          },
        }}
        onConfirmSelectFile={handleFileSelect}
        accept={getAcceptedImageTypes()}
      />

      <Snackbar
        open={!!validationError}
        autoHideDuration={6000}
        onClose={() => setValidationError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setValidationError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {validationError}
        </Alert>
      </Snackbar>
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
              <CustomImage src={props.value} />
            ) : (
              <CustomImageIcon sx={{
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
