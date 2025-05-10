import { DexkitApiProvider } from '@dexkit/core/providers';
import { Feature, FeatureSum, Subscription } from '@dexkit/ui/types/ai';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const USER_PAYMENT_METHODS = 'USER_PAYMENT_METHODS';

export function useUserPaymentMethods() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([USER_PAYMENT_METHODS], async () => {
    return (await instance?.get('/payments/methods'))?.data;
  });
}

export const USER_PLANS_QUERY = 'USER_PLANS_QUERY';

export const BILLING_HISTORY_QUERY = 'BILLING_HISTORY_QUERY';

export function useBillingHistoryQuery() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([BILLING_HISTORY_QUERY], async () => {
    return (await instance?.get('/payments/billing-history'))?.data;
  });
}

export const BILLING_QUERY = 'BILLING_QUERY';

export function useBillingQuery({ id }: { id: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([BILLING_QUERY, id], async () => {
    return (await instance?.get(`/payments/billing/${id}`))?.data;
  });
}

export const BILLING_BY_FEATURE_QUERY = 'BILLING_QUERY';

export function useBillingUsageByFeature({ id }: { id: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([BILLING_BY_FEATURE_QUERY, id], async () => {
    return (await instance?.get(`/payments/billing/${id}`))?.data;
  });
}

export const BILLING_BY_FEAT_QUERY = 'BILLING_QUERY';

export function useBillingByFeatQuery({
  id,
  feat,
}: {
  id: number;
  feat?: string;
}) {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<FeatureSum[]>([BILLING_BY_FEAT_QUERY, id, feat], async () => {
    return (await instance?.get(`/payments/billing/${id}/summary`))?.data;
  });
}

export const FEAT_QUERY = 'FEAT_QUERY';

export function useFeatQuery({ id }: { id: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery<Feature>([FEAT_QUERY, id], async () => {
    return (await instance?.get(`/payments/feat/${id}`))?.data;
  });
}

export const SUBSCRIPTION_QUERY = 'SUBSCRIPTION_QUERY';

export function useSubscription() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<Subscription>([SUBSCRIPTION_QUERY], async () => {
    return (await instance?.get('/payments/subscription'))?.data;
  });
}
