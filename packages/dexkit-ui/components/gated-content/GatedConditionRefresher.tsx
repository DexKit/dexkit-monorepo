import { GatedCondition } from '@dexkit/ui/modules/wizard/types/config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCheckGatedConditions } from '../../hooks';

export function GatedConditionRefresher({
  conditions,
  account,
}: {
  conditions?: GatedCondition[];
  account?: string;
}) {
  const router = useRouter();
  const { data } = useCheckGatedConditions({ conditions, account });

  useEffect(() => {
    if (data?.result) {
      router.reload();
    }
  }, [data]);

  return <></>;
}
