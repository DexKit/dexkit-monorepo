import { getAccessToken } from '@dexkit/ui/services/auth';
import axios from 'axios';
import { GetListParams, UpdateParams } from 'react-admin';
import { DEXKIT_BASE_API_URL } from 'src/constants';

const DEXKIT_DASH_ENDPOINT = `${DEXKIT_BASE_API_URL}`;
//const DEXKIT_DASH_ENDPOINT = `http://localhost:3001`;
export const myAppsApi = axios.create({
  baseURL: DEXKIT_DASH_ENDPOINT,
  headers: { 'content-type': 'application/json' },
});

myAppsApi.interceptors.request.use(async (config) => {
  const access_token = await getAccessToken();
  if (access_token)
    config.headers = {
      ...config.headers,
      authorization: `Bearer ${access_token}`,
    };
  return config;
});

export default {
  getList: async (resource: string, params: GetListParams) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    let path = '';

    if (resource === 'coin-platform') {
      path = '/coin/platforms';

      return (
        await myAppsApi.get(`${path}/admin/all`, {
          params: {
            skip: (page - 1) * perPage,
            take: perPage,
            sort: field ? [field, order] : undefined,
            filter: params.filter,
          },
        })
      ).data;
    } else if (resource === 'feature-prices') {
      const data = (
        await myAppsApi.get('/payments/feature-prices', {
          params: {
            skip: (page - 1) * perPage,
            take: perPage,
            sort: field ? [field, order] : undefined,
            filter: params.filter,
          },
        })
      ).data;
      return { data: data, total: data.length };
    } else if (resource === 'credit-grants') {
      const data = (
        await myAppsApi.get('/payments/credit-grants', {
          params: {
            skip: (page - 1) * perPage,
            take: perPage,
            sort: field ? [field, order] : undefined,
            filter: params.filter,
          },
        })
      ).data;
      return { data: data, total: data.length };
    }

    return (
      await myAppsApi.get(`${resource}/admin/all`, {
        params: {
          skip: (page - 1) * perPage,
          take: perPage,
          sort: field ? [field, order] : undefined,
          filter: params.filter,
        },
      })
    ).data;

    return { data: [], total: 0 };
  },

  getOne: async (resource: any, params: any) => {
    let path = '';

    if (resource === 'coin-platform') {
      path = '/coin/platforms';

      const data = (await myAppsApi.get(`${path}/admin/all/${params.id}`)).data;
      return {
        data,
      };
    } else if (resource === 'feature-prices') {
      return {
        data: (await myAppsApi.get(`/payments/feature-prices/${params.id}`))
          .data,
      };
    } else if (resource === 'credit-grants') {
      return {
        data: (await myAppsApi.get(`/payments/credit-grants/${params.id}`))
          .data,
      };
    }
    const data = (await myAppsApi.get(`${resource}/admin/all/${params.id}`))
      .data;
    return {
      data,
    };
  },

  getMany: (resource: any, params: any) => {},

  getManyReference: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    return (
      await myAppsApi.get(`${resource}/admin/all`, {
        params: { skip: (page - 1) * perPage, take: perPage },
      })
    ).data;
  },

  create: (resource: any, params: any) => {},

  update: async (resource: any, params: UpdateParams) => {
    let path = '';

    if (resource === 'feature-prices') {
      return {
        data: (
          await myAppsApi.put(`/payments/feature-prices/${params.id}`, {
            price: params.data.price.toString(),
          })
        ).data,
      };
    } else if (resource === 'coin-platform') {
      path = '/coin/platforms';

      const data = (
        await myAppsApi.post(`${path}/admin/all/${params.id}`, params.data)
      ).data;

      return {
        data,
      };
    } else if (resource === 'credit-grants') {
      path = `/payments/credit-grants/${params.id}`;

      const data = (
        await myAppsApi.put(path, {
          ...params.data,
          amount: params.data.amount.toString(),
        })
      ).data;

      return {
        data,
      };
    }

    const data = (
      await myAppsApi.post(`${resource}/admin/all/${params.id}`, params.data)
    ).data;

    return {
      data,
    };

    return { data: [] };
  },

  updateMany: (resource: any, params: any) => {},

  delete: (resource: any, params: any) => {},

  deleteMany: (resource: any, params: any) => {},
};
