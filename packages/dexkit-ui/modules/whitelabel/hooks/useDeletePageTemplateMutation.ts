import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAuth, useLoginAccountMutation } from "../../../hooks/auth";
import { deletePageTemplate } from "../services";
import { usePageTemplatesByOwnerQuery } from "./usePageTemplatesByOwnerQuery";

export const useDeletePageTemplateMutation = ({
  options,
}: {
  options?: UseMutationOptions;
}) => {
  const { account, provider, chainId } = useWeb3React();
  const { refetch } = usePageTemplatesByOwnerQuery({ owner: account });
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation<any, any, any>(async ({ id }: { id: string }) => {
    if (account && provider && chainId !== undefined && id) {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      await deletePageTemplate(id);
      refetch();
    }
  }, options);
};