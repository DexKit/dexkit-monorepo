import { Box, FormHelperText, Typography } from '@mui/material';
import { useField } from 'formik';
import React from 'react';
import DKMDEditor from './DKMDEditor';

interface DKMDEditorFieldProps {
  name: string;
  label?: React.ReactNode;
  helperText?: string;
  height?: number;
  disabled?: boolean;
}

export default function DKMDEditorField({
  name,
  label,
  helperText,
  height = 350,
  disabled = false,
}: DKMDEditorFieldProps) {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value?: string) => {
    helpers.setValue(value || '');
  };

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}
      
      <Box
        sx={{
          border: meta.touched && meta.error ? '1px solid #d32f2f' : '1px solid #e0e0e0',
          borderRadius: 1,
          overflow: 'hidden',
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <DKMDEditor
          value={field.value || ''}
          setValue={handleChange}
        />
      </Box>
      
      {(meta.touched && meta.error) && (
        <FormHelperText error sx={{ mt: 0.5 }}>
          {meta.error}
        </FormHelperText>
      )}
      
      {helperText && !meta.error && (
        <FormHelperText sx={{ mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
} 