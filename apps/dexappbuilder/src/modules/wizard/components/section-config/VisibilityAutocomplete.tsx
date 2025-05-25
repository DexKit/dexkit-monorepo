import { Autocomplete, Chip, TextField, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

const options = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'mobile', label: 'Mobile' },
];

export interface VisibilityAutocompleteProps {
  onChange: (desktop: boolean, mobile: boolean) => void;
  desktop?: boolean;
  mobile?: boolean;
}

const VisibilityAutocomplete = ({
  onChange,
  desktop,
  mobile,
}: VisibilityAutocompleteProps) => {
  const theme = useTheme();

  const handleSelectionChange = (
    event: any,
    newValue: { id: string; label: string }[]
  ) => {
    onChange(
      Boolean(newValue.find((opt) => opt.id === 'desktop')),
      Boolean(newValue.find((opt) => opt.id === 'mobile'))
    );
  };

  const value = useMemo(() => {
    const values = [];

    if (desktop) {
      values.push({ id: 'desktop', label: 'Desktop' });
    }

    if (mobile) {
      values.push({ id: 'mobile', label: 'Mobile' });
    }

    return values;
  }, [desktop, mobile]);

  const { formatMessage } = useIntl();

  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={handleSelectionChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.label}
            {...getTagProps({ index })}
            key={index}
            sx={{
              mr: theme.spacing(0.5),
              fontSize: theme.typography.caption.fontSize
            }}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          placeholder={
            !desktop && !mobile
              ? formatMessage({
                id: 'display.on.device',
                defaultMessage: 'Display on Device',
              })
              : undefined
          }
          {...params}
          variant="standard"
        />
      )}
      ListboxProps={{
        sx: { maxHeight: theme.spacing(40) }
      }}
    />
  );
};

export default VisibilityAutocomplete;
