import axios from 'axios';
import { DEXKIT_BASE_API_URL } from '../constants';
//const MY_APPS_ENDPOINT = 'https://dexkitapi-8oo4v.ondigitalocean.app';
//const AUTH_ENDPOINT = 'http://localhost:3001/auth';
//const AUTH_ENDPOINT = 'https://goldfish-app-lh5o5.ondigitalocean.app/auth'
const AUTH_ENDPOINT = `${DEXKIT_BASE_API_URL}/auth`;

//const MY_APPS_ENDPOINT = 'https://squid-app-xzo63.ondigitalocean.app';

/**
 * send config to server
 * @param formData
 * @returns
 */
const authApi = axios.create({
  baseURL: AUTH_ENDPOINT,
  headers: { 'content-type': 'application/json' },
});

/**
 * Login in DexKit backend
 * @param param0
 * @returns
 */
export async function login({
  address,
  signature,
}: {
  address: string;
  signature: string;
}) {
  return authApi.post<{ access_token: string; refresh_token: string }>(
    '/login',
    { data: { address, signature } }
  );
}
/**
 * Api route that logins in DexKit backend
 * @param param0
 * @returns
 */
export async function loginApp({
  address,
  signature,
  siteId,
  referral
}: {
  address: string;
  signature: string;
  siteId?: number;
  referral?: string;
}) {
  return axios.post<{ access_token: string; refresh_token: string }>(
    '/api/dex-auth/login',
    { data: { address, signature, siteId, referral } }
  );
}

/**
 * Logout in DexKit backend
 * @param param0
 * @returns
 */

export async function logout({ accessTk }: { accessTk: string }) {
  return authApi.get<{ logout: boolean }>('/logout', {
    headers: {
      Authorization: `Bearer ${accessTk}`,
    },
  });
}

/**
 * Api route that logouts in DexKit backend
 * @param param0
 * @returns
 */

export async function logoutApp({ accessTk }: { accessTk: string }) {
  return axios.get<{ logout: boolean }>('/api/dex-auth/logout', {
    headers: {
      Authorization: `Bearer ${accessTk}`,
    },
  });
}

export async function requestAccestoken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  return authApi.get<{ access_token: string }>('refresh-token', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
}

export async function requestSignature({ address }: { address: string }) {
  return authApi.get<string>(`/message-to-sign/${address}`);
}

let access_token: string | undefined;
let refreshedWasCalled = false;

export function getAccessToken() {
  if (access_token) {
    return access_token;
  }
}
/**
 * We refresh here the access token, this is called on 401 error
 * @returns
 */
export async function getRefreshAccessToken() {
  try {
    const response = await axios.get('/api/dex-auth/refresh-token', {
      withCredentials: true,
    });
    access_token = response.data.access_token;
    return access_token;
  } catch (error) {
    await axios.get('/api/dex-auth/logout', { withCredentials: true });
    access_token = undefined;
    return access_token;
  }
}

export async function getAccessTokenAndRefresh() {
  if (access_token) {
    return access_token;
  }


  if (!access_token && !refreshedWasCalled) {
    try {
      const response = await axios.get('/api/dex-auth/refresh-token', {
        withCredentials: true,
      });

      refreshedWasCalled = false;
      access_token = response.data.access_token;
      return access_token;
    } catch (error) {
      access_token = undefined;
      refreshedWasCalled = true;
      return access_token;
    }
  }
}

export function setAccessToken(token: string | undefined) {
  access_token = token;
}
