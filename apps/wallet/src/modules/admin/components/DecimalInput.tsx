// in LatLongInput.js
import { TextField, useInput } from 'react-admin';

const DecimalInput = (props: any) => {
  const { onChange, onBlur, label, helperText, ...rest } = props;

  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired,
  } = useInput({
    onChange,
    onBlur,
    source: props.source,
  });

  return <TextField value={field.value} onChange={field.onChange} />;
};

export default DecimalInput;
