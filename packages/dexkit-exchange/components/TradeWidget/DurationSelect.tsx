import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { ORDER_LIMIT_DURATIONS } from "../../constants";

export interface DurationSelectProps {
  value: number;
  onChange: (value: number) => void;
  SelectProps?: Omit<SelectProps, "onChange">;
}

export default function DurationSelect({
  value,
  onChange,
  SelectProps,
}: DurationSelectProps) {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (typeof event.target.value === "number") {
      onChange(event.target.value);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{SelectProps?.label}</InputLabel>
      <Select onChange={handleChange} value={value} {...(SelectProps as any)} fullWidth>
        {ORDER_LIMIT_DURATIONS.map((duration, key) => (
          <MenuItem key={key} value={duration.value}>
            <FormattedMessage
              id={duration.messageId}
              defaultMessage={duration.defaultMessage}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
