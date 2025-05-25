import { MenuItem } from '@mui/material';
import { FastField } from 'formik';
import { Select } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface ContractFormOptionsInputProps {
  options: { label: string; value: string }[];
  name: string;
}

export default function ContractFormOptionsInput({
  name,
  options,
}: ContractFormOptionsInputProps) {
  return (
    <FastField name={name} component={Select}>
      <MenuItem value="">
        <FormattedMessage id="empty" defaultMessage="Empty" />
      </MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </FastField>
  );
}
