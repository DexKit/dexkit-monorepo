import { memo, useMemo } from "react";
import { useAppConfig } from "../hooks";

function AppFeePercentageSpan() {
  const appConfig = useAppConfig();
  const { fees } = appConfig;

  const feeTotal = useMemo(() => {
    if (fees) {
      return fees?.map((f: { amount_percentage: number; recipient: string }) => f.amount_percentage).reduce((p: number, c: number) => p + c, 0);
    }

    return 0;
  }, [fees]);

  return <span>{feeTotal}%</span>;
}

export default memo(AppFeePercentageSpan);
