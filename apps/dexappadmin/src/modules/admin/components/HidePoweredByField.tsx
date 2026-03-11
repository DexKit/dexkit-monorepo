import { useRecordContext } from "react-admin";

export const HidePoweredByField = ({
  source,
  label,
  showLabel,
}: {
  source: string;
  label?: string;
  showLabel?: boolean;
}) => {
  const record = useRecordContext();
  const hideKitField = JSON.parse(record?.config).hide_powered_by;

  return (
    <>
      {label && showLabel && <span> Hide Powered by</span>}
      <span style={{ color: hideKitField ? "green" : "red" }}>
        {hideKitField ? "true" : "false"}
      </span>
    </>
  );
};
