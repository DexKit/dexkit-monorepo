import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation } from "@tanstack/react-query";
import { useAuth, useLoginAccountMutation } from "../../../hooks/auth";
import { upsertWidgetConfig } from "../services/widget";

export const useSendWidgetConfigMutation = ({ id }: { id?: number }) => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({ config }: { config: string }) => {
      if (account && provider && chainId !== undefined) {

        if (!isLoggedIn) {
          await loginMutation.mutateAsync();
        }

        let response;

        if (id) {
          response = await upsertWidgetConfig({ id, config });
        } else {
          response = await upsertWidgetConfig({ config });
        }


        return response.data;
      }
    }
  );
};