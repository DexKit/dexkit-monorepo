import { GatedConditionView } from '@/modules/wizard/components/GatedConditionView';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { useCheckGatedConditions } from '@/modules/wizard/hooks';
import { GatedCondition, GatedPageLayout } from '@/modules/wizard/types';
import { useWeb3React } from '@web3-react/core';
import { useAuth } from 'src/hooks/account';
import { useProtectedAppConfig } from 'src/hooks/app';

export default function ProtectedContent({
  isProtected,
  conditions,
  site,
  page,
  layout,
  slug,
}: {
  isProtected: boolean;
  layout?: GatedPageLayout;
  conditions?: GatedCondition[];
  site: string;
  slug?: string;
  page: string;
}) {
  const { account } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const { data: conditionsData } = useCheckGatedConditions({
    conditions,
    account,
  });
  const { data } = useProtectedAppConfig({
    isProtected,
    domain: site,
    slug,
    page,
    result: conditionsData?.result,
  });

  if (data?.data?.result) {
    return <SectionsRenderer sections={data?.data?.sections} />;
  }

  return (
    <>
      <GatedConditionView
        account={account}
        conditions={conditions}
        layout={layout}
        isLoggedIn={isLoggedIn}
        result={conditionsData?.result}
        partialResults={conditionsData?.partialResults}
        balances={conditionsData?.balances}
      />
    </>
  );
}
