import { useRecordContext } from "react-admin";

export const HidePoweredByField = ({
  source,
  label,
}: {
  source: string;
  label?: string;
}) => {
  const record = useRecordContext();
  const hideKitField = JSON.parse(record?.config).hide_powered_by;

  return (
    <span style={{ color: hideKitField ? "green" : "red" }}>
      {hideKitField ? "true" : "false"}
    </span>
  );
};
