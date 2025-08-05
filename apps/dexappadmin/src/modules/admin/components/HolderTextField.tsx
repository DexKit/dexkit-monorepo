import { useHoldDexkitQuery } from "@dexkit/ui/hooks/account";
import { useRecordContext } from "react-admin";

export const HolderTextField = ({
  source,
  label,
}: {
  source: string;
  label?: string;
}) => {
  const record = useRecordContext();
  const holdDexKitQuery = useHoldDexkitQuery({
    account: record?.owner,
  });

  return (
    <span style={{ color: holdDexKitQuery.data ? "green" : "red" }}>
      {holdDexKitQuery.data ? "true" : "false"}
    </span>
  );
};
