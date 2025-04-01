import axios from "axios";

import { DEXKIT_UI_BASE_API_URL, myAppsApi } from "../../../constants/api";
import { UserOptions } from "../types";

const USER_ENDPOINT = `${DEXKIT_UI_BASE_API_URL}/user`;
/**
 * NOTE: this endpoint is intended to use without the interceptor, we set the bearear token automatically
 */
export const userApi = axios.create({
  baseURL: USER_ENDPOINT,
  headers: { "content-type": "application/json" },
});

export function getUserByAccount() {
  return myAppsApi.get<
    UserOptions & { accounts: { address: string }[] } & {
      credentials?: { provider: string; username: string }[];
    }
  >(`/user/authenticated/account`);
}
