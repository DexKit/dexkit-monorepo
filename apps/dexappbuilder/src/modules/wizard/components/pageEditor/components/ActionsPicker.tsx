import { useMemo } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormattedMessage } from 'react-intl';
import { connectField } from 'uniforms';
import { CORE_PAGES } from '../../../constants';
import { useAppWizardConfig } from '../../../hooks';
// @dev check here how to connect uniforms and custom form components: https://github.com/react-page/react-page/blob/master/packages/editor/src/ui/ColorPicker/ColorPickerField.tsx
export const PagesPicker = connectField<{
  value: string;
  label: string;
  onChange: (v: string | void) => void;
}>((props) => {
  const { wizardConfig } = useAppWizardConfig();
  const pages = wizardConfig.pages;

  const allPages = useMemo(() => {
    return { ...pages, ...CORE_PAGES };
  }, [pages]);

  const pageKeys = Object.keys(allPages);

  return (
    <FormControl fullWidth>
      <InputLabel id="pages-picker-label">{props.label}</InputLabel>
      <Select
        labelId="select-pages-picker-label"
        id="select-pages-picker"
        value={props.value}
        fullWidth
        label={<FormattedMessage id={'pages'} defaultMessage={'Pages'} />}
        onChange={(event) => props.onChange(event?.target.value as string)}
      >
        {pageKeys.map((pk, key) => (
          <MenuItem value={allPages[pk].uri} key={key}>
            {allPages[pk].title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
