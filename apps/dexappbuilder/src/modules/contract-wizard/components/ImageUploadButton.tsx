import { ButtonBase, styled } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';

import ImageIcon from '@mui/icons-material/Image';

const CustomButton = styled(ButtonBase)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignCOntent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.10)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },
  '&:hover .btn': {},
}));

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  borderRadius: '50%',
}));

export interface ImageUploadButtonProps {
  onChange: (file: File | null) => void;
  file: File | null;
  error?: boolean;
}

export function ImageUploadButton(props: ImageUploadButtonProps) {
  const { onChange, file, error } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {}, []);

  const handleClick = useCallback(() => {
    if (file !== null) {
      onChange(null);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
    inputRef.current?.click();
  }, [onChange, file, inputRef]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files !== null && e.target.files.length > 0) {
        let file = e.target.files[0];

        onChange(file);
      } else {
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (file) {
      if (imgRef.current) {
        imgRef.current.src = URL.createObjectURL(file);
      }
    }
  }, [file]);

  return (
    <>
      <input
        onChange={handleChange}
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept="image/png, image/gif, image/jpeg, image/svg"
      />
      <CustomButton
        sx={
          error
            ? {
                border: (theme) => `1px solid ${theme.palette.error.main}`,
              }
            : undefined
        }
        onClick={handleClick}
      >
        {file ? <CustomImage alt="" ref={imgRef} /> : <ImageIcon />}
      </CustomButton>
    </>
  );
}

export default ImageUploadButton;
