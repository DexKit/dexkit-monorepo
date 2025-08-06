import { Icon, IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const SelectIconDialog = dynamic(() => import('@dexkit/ui/components/dialogs/SelectIconDialog'), {
  ssr: false,
});

interface IconPickerFieldProps {
  label: React.ReactNode;
  value: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
  helperText?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  TextFieldProps?: Omit<TextFieldProps, 'value' | 'onChange' | 'label' | 'error' | 'helperText' | 'fullWidth' | 'disabled'>;
}

export const IconPickerField: React.FC<IconPickerFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select an icon...',
  helperText,
  error,
  fullWidth = true,
  disabled,
  TextFieldProps,
}) => {
  const [openIconDialog, setOpenIconDialog] = useState(false);

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setOpenIconDialog(false);
  };

  return (
    <>
      <TextField
        {...TextFieldProps}
        fullWidth={fullWidth}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        disabled={disabled}
        InputProps={{
          ...TextFieldProps?.InputProps,
          endAdornment: (
            <>
              {value && (
                <InputAdornment position="end">
                  <Icon sx={{ mr: 1, color: 'text.secondary' }}>{value}</Icon>
                </InputAdornment>
              )}
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setOpenIconDialog(true)}
                  edge="end"
                  disabled={disabled}
                  size="small"
                  title="Browse icons"
                >
                  <Icon>search</Icon>
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />

      {openIconDialog && (
        <SelectIconDialog
          DialogProps={{
            open: openIconDialog,
            onClose: () => setOpenIconDialog(false),
            maxWidth: 'md',
            fullWidth: true,
          }}
          onConfirm={handleIconSelect}
        />
      )}
    </>
  );
}; 