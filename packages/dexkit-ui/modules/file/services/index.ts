import axios from "axios";
import { DEXKIT_UI_BASE_API_URL } from "../../../constants/api";
import { getAccessToken } from "../../../services/auth";
import { AccountFile } from "../types";

const MY_APPS_ENDPOINT = `${DEXKIT_UI_BASE_API_URL}/account-file`;

/**
 * send config to server
 * @param formData
 * @returns
 */

const myAppsApi = axios.create({
  baseURL: MY_APPS_ENDPOINT,
  headers: { "content-type": "application/json" },
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

export async function uploadAccountFile(
  formData: FormData,
  onProgressCalback: any,
) {
  return await myAppsApi.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgressCalback,
  });
}

export async function getFilesByOwner(
  owner: string,
  take = 20,
  skip = 0,
  search?: string,
  sort?: string[],
) {
  return await myAppsApi.get<{
    files: AccountFile[];
    total: number;
    skip: number;
    take: number;
  }>(`/by-owner/${owner}`, { params: { skip, take, search, sort } });
}

export async function deleteAccountFile(id: number) {
  return await myAppsApi.delete<AccountFile>(`/${id}`);
}

export async function editAccountFile(id: number, newFileName: string) {
  return await myAppsApi.post<AccountFile>(`/edit/${id}`, {
    name: newFileName,
  });
}
