import { Checkbox } from "@mui/material";
import { useFormikContext } from "formik";

export interface BooleanFormInputProps {
  name: string;
}

export default function BooleanFormInput({ name }: BooleanFormInputProps) {
  const { values, setFieldValue } = useFormikContext<{
    [key: string]: string;
  }>();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setFieldValue(name, checked);
  };

  return (
    <Checkbox
      checked={Boolean(values[name] as string)}
      onChange={handleChange}
    />
  );
}
