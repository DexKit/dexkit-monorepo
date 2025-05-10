import { AxiosInstance } from 'axios';

export async function getIntegrationData({
  type,
  siteId,
  instance,
}: {
  type: string;
  siteId?: number;
  instance?: AxiosInstance;
}) {
  if (siteId === undefined) {
    return null;
  }

  return (await instance?.get(`/integrations/admin/${siteId}/${type}`))?.data;
}

export async function getApiKeyData({
  type,
  siteId,
  instance,
}: {
  type: string;
  siteId?: number;
  instance?: AxiosInstance;
}) {
  if (siteId === undefined) {
    return null;
  }

  return (await instance?.get(`/integrations/admin/apikeys/${siteId}/${type}`))
    ?.data as { value: string };
}
