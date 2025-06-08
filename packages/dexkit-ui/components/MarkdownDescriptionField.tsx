import { Box, FormControl, FormHelperText, FormLabel } from "@mui/material";
import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from "formik";
import { useEffect, useState } from "react";
import DKMDEditor from "./DKMDEditor";

interface MarkdownDescriptionFieldProps {
  name: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function MarkdownDescriptionField({
  name,
  label,
  helperText,
  required = false,
  disabled = false,
  value: externalValue,
  onChange: externalOnChange,
}: MarkdownDescriptionFieldProps) {
  const [internalValue, setInternalValue] = useState(externalValue || "");

  let field: FieldInputProps<string> | undefined;
  let meta: FieldMetaProps<string> | undefined;
  let helpers: FieldHelperProps<string> | undefined;
  let isFormikAvailable = true;

  try {
    [field, meta, helpers] = useField(name);
  } catch (error) {
    isFormikAvailable = false;
    field = undefined;
    meta = undefined;
    helpers = undefined;
  }

  const currentValue = isFormikAvailable ? (field?.value || "") : internalValue;
  const hasError = isFormikAvailable ? (meta?.touched && !!meta?.error) : false;
  const error = isFormikAvailable ? meta?.error : undefined;

  const handleChange = (val?: string) => {
    const value = val || "";
    if (isFormikAvailable && helpers) {
      helpers.setValue(value);
    } else {
      setInternalValue(value);
      if (externalOnChange) {
        externalOnChange(value);
      }
    }
  };

  useEffect(() => {
    if (!isFormikAvailable && externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue, isFormikAvailable]);

  return (
    <FormControl fullWidth error={hasError} disabled={disabled}>
      {label && (
        <FormLabel component="legend" required={required} sx={{ mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <Box
        sx={{
          border: (theme) =>
            `1px solid ${hasError
              ? theme.palette.error.main
              : theme.palette.divider
            }`,
          borderRadius: 1,
          '& .w-md-editor': {
            backgroundColor: 'transparent',
          },
          '& .w-md-editor-text-pre, & .w-md-editor-text-input, & .w-md-editor-text': {
            fontSize: '14px !important',
            lineHeight: '1.4375em !important',
          },
        }}
      >
        <DKMDEditor
          value={currentValue}
          setValue={handleChange}
        />
      </Box>
      {(hasError || helperText) && (
        <FormHelperText>
          {hasError ? error : helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
} 