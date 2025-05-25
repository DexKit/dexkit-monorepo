import { SxProps, Theme } from '@mui/material';
import { useField } from 'formik';
import {
  MuiColorInput,
  MuiColorInputColors,
  MuiColorInputFormat,
  MuiColorInputValue,
} from 'mui-color-input';

export interface FormikMuiColorInputProps {
  name: string;
  label: React.ReactNode;
  fullWidth: boolean;
  format?: MuiColorInputFormat;
  sx?: SxProps<Theme>;
}

export default function FormikMuiColorInput({
  name,
  fullWidth,
  label,
  format,
  sx,
}: FormikMuiColorInputProps) {
  const [props, meta, helpers] = useField<MuiColorInputValue>(name);

  const handleChange = (color: string, colors: MuiColorInputColors) => {
    helpers.setValue(color);
  };

  return (
    <MuiColorInput
      fullWidth={fullWidth}
      label={label}
      format={format ? format : 'hex'}
      onChange={handleChange}
      value={props.value}
      sx={sx}
    />
  );
}
