import { styled } from '@mui/material';
import { useEffect, useRef } from 'react';

import ImageIcon from '@mui/icons-material/Image';

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  borderRadius: '50%',
}));

interface Props {
  file: File | null;
  small?: boolean;
}

export function WizardFileImage({ file, small }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (file) {
      if (imgRef.current) {
        imgRef.current.src = URL.createObjectURL(file);
      }
    }
  }, [file]);

  return file ? (
    <CustomImage
      sx={
        small
          ? (theme) => ({
              height: theme.spacing(8),
              width: theme.spacing(8),
            })
          : undefined
      }
      alt=""
      ref={imgRef}
    />
  ) : (
    <ImageIcon />
  );
}

export default WizardFileImage;
