import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAuth, useLoginAccountMutation } from "../../../hooks/auth";
import { deleteConfig } from "../services";
import { useWhitelabelConfigsByOwnerQuery } from "./useWhitelabelConfigsByOwnerQuery";

export const useDeleteMyAppMutation = ({
  options,
}: {
  options?: UseMutationOptions;
}) => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn, user } = useAuth();
  const { refetch } = useWhitelabelConfigsByOwnerQuery({ owner: user?.address });

  const loginMutation = useLoginAccountMutation();

  return useMutation<any, any, any>(async ({ slug }: { slug: string }) => {
    if (account && provider && chainId !== undefined) {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }

      await deleteConfig(slug);
      refetch();
    }
  }, options);
};