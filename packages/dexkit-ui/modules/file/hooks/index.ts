import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth, useLoginAccountMutation } from "../../../hooks/auth";
import {
  deleteAccountFile,
  editAccountFile,
  getFilesByOwner,
  uploadAccountFile,
} from "../services";

export function useUploadAccountFile() {
  const [progress, setProgress] = useState<number>(0);
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  const onUploadProgress = (event: any) => {
    const percentage = Math.round((100 * event.loaded) / event.total);
    setProgress(percentage);
  };
  const fileUploadMutation = useMutation(async (file: FormData) => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }
    return await uploadAccountFile(file, onUploadProgress);
  });

  return {
    fileUploadMutation,
    fileUploadProgress: progress,
  };
}

export function useDeleteAccountFile() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(async (id: number) => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }
    return await deleteAccountFile(id);
  });
}

export function useEditAccountFile() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({ id, newFileName }: { id: number; newFileName: string }) => {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      return await editAccountFile(id, newFileName);
    },
  );
}

const GET_ACCOUNT_FILES_BY_OWNER = "GET_ACCOUNT_FILES_BY_OWNER";

export function useGetAccountFiles({
  skip,
  search,
  sort,
}: {
  skip?: number;
  search?: string;
  sort?: string[];
}) {
  const { account } = useWeb3React();

  return useQuery(
    [GET_ACCOUNT_FILES_BY_OWNER, account, search, skip, sort],
    async () => {
      if (!account) {
        return;
      }
      const files = await getFilesByOwner(account, 20, skip, search, sort);
      return files.data;
    },
  );
}
