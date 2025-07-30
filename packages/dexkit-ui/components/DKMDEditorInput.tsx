import { Box, FormHelperText, Typography } from '@mui/material';
import React from 'react';
import DKMDEditor from './DKMDEditor';

interface DKMDEditorInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  errorText?: string;
  height?: number;
  disabled?: boolean;
}

export default function DKMDEditorInput({
  value,
  onChange,
  label,
  helperText,
  error = false,
  errorText,
  height = 350,
  disabled = false,
}: DKMDEditorInputProps) {
  const handleChange = (newValue?: string) => {
    onChange(newValue || '');
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
          border: error ? '1px solid #d32f2f' : '1px solid #e0e0e0',
          borderRadius: 1,
          overflow: 'hidden',
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <DKMDEditor
          value={value || ''}
          setValue={handleChange}
        />
      </Box>

      {error && errorText && (
        <FormHelperText error sx={{ mt: 0.5 }}>
          {errorText}
        </FormHelperText>
      )}

      {helperText && !error && (
        <FormHelperText sx={{ mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
} 