import { useHoldDexkitQuery } from "@dexkit/ui/hooks/account";
import { useRecordContext } from "react-admin";

export const HolderTextField = ({
  source,
  label,
  showLabel,
}: {
  source: string;
  label?: string;
  showLabel?: boolean;
}) => {
  const record = useRecordContext();
  const holdDexKitQuery = useHoldDexkitQuery({
    account: record?.owner,
  });

  return (
    <>
      {label && showLabel && <span> KIT holder </span>}
      <span style={{ color: holdDexKitQuery.data ? "green" : "red" }}>
        {holdDexKitQuery.data ? "true" : "false"}
      </span>
    </>
  );
};
