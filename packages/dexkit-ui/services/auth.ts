import axios from "axios";

let access_token: string | undefined;
let refreshedWasCalled = false;

const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT
  ? `${process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT}/auth`
  : "http://localhost:3001/auth";

/**
 * send config to server
 * @param formData
 * @returns
 */
const authApi = axios.create({
  baseURL: AUTH_ENDPOINT,
  headers: { "content-type": "application/json" },
});

export async function requestSignature({ address }: { address: string }) {
  return authApi.get<string>(`/message-to-sign/${address}`);
}

export function getAccessToken() {
  if (access_token) {
    return access_token;
  }
}

export function setAccessToken(token: string | undefined) {
  access_token = token;
}

export async function getAccessTokenAndRefresh({ isWidget }: { isWidget?: boolean }) {
  if (access_token) {
    return access_token;
  }
  if (!access_token && !refreshedWasCalled) {
    try {
      const response = await axios.get(isWidget ? `${AUTH_ENDPOINT}/refresh-token` : "/api/dex-auth/refresh-token", {
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

/**
 * We refresh here the access token, this is called on 401 error
 * @returns
 */
export async function getRefreshAccessToken({ isWidget }: { isWidget?: boolean }) {
  try {
    const response = await axios.get(isWidget ? `${AUTH_ENDPOINT}/refresh-token` : "/api/dex-auth/refresh-token", {
      withCredentials: true,
    });
    access_token = response.data.access_token;
    return access_token;
  } catch (error) {
    await axios.get(isWidget ? `${AUTH_ENDPOINT}/logout` : "/api/dex-auth/logout", { withCredentials: true });
    access_token = undefined;
    return access_token;
  }
}

/**
 * Api route that logouts in DexKit backend
 * @param param0
 * @returns
 */

export async function logoutApp({ accessTk, isWidget }: { accessTk: string, isWidget?: boolean }) {
  return axios.get<{ logout: boolean }>(isWidget ? `${AUTH_ENDPOINT}/logout` : "/api/dex-auth/logout", {
    headers: {
      Authorization: `Bearer ${accessTk}`,
    },
  });
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
  referral,
  chainId,
  isWidget,
}: {
  address: string;
  signature: `0x${string}`;
  chainId?: number;
  siteId?: number;
  referral?: string;
  isWidget?: boolean;
}) {
  return axios.post<{ access_token: string; refresh_token: string }>(
    isWidget ? `${AUTH_ENDPOINT}/login` : "/api/dex-auth/login",
    { data: { address, signature, siteId, referral, chainId } }
  );
}

/**
 * Logout in DexKit backend
 * @param param0
 * @returns
 */

export async function logout({ accessTk }: { accessTk: string }) {
  return authApi.get<{ logout: boolean }>("/logout", {
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
  return authApi.get<{ access_token: string }>("refresh-token", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
}

/**
 * Login in DexKit backend
 * @param param0
 * @returns
 */
export async function login({
  address,
  signature,
  chainId,
}: {
  address: string;
  signature: string;
  chainId?: number;
}) {
  return authApi.post<{ access_token: string; refresh_token: string }>(
    "/login",
    { data: { address, signature, chainId } }
  );
}
