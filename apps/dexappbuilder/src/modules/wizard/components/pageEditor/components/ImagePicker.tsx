import { ButtonBase, Container, Stack, alpha, styled } from '@mui/material';
import { useState } from 'react';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import ImageIcon from '@mui/icons-material/Image';
import { connectField, useForm } from 'uniforms';

const CustomImage = styled('img')(({ theme }) => ({
  height: 'auto',
  width: '100%',
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
}>((props) => {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);

  const { formRef, onChange } = useForm();

  return (
    <Container sx={{ mb: 1 }}>
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

          const image = new Image();

          image.src = file.url;

          image.onload = () => {
            formRef.change('width', image.width);
            formRef.change('height', image.height);
          };
        }}
      />
      <Stack alignItems="center">
        <ButtonBase
          onClick={() => {
            setOpenMediaDialog(true);
          }}
          sx={{
            height: (theme) => theme.spacing(24),
            width: (theme) => theme.spacing(24),
            borderRadius: (theme) => theme.shape.borderRadius / 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(0,0,0, 0.2)'
                : alpha(theme.palette.common.white, 0.1),
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            {props.value ? (
              <CustomImage src={props.value} />
            ) : (
              <CustomImageIcon />
            )}
          </Stack>
        </ButtonBase>
      </Stack>
    </Container>
  );
});
