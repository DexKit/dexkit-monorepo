import { useEffect } from 'react';

export default function ChangeListener({
  values,
  onChange,
  isValid,
}: {
  values: any;
  onChange: any;
  isValid: any;
}) {
  useEffect(() => {
    if (onChange) {
      onChange(values, isValid);
    }
  }, [values, isValid]);

  return <></>;
}
