import { useDebounce } from '@/modules/common/hooks/misc';
import { TextField, TextFieldProps } from '@mui/material';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';

interface Props {
  onChange: (value: string) => void;
  TextFieldProps?: TextFieldProps;
}

export function SearchTextField({ onChange, TextFieldProps }: Props) {
  const [value, setValue] = useState('');

  const lazyString = useDebounce<string>(value, 500);

  useEffect(() => {
    onChange(lazyString);
  }, [lazyString]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <TextField {...TextFieldProps} value={value} onChange={handleChange} />
  );
}
