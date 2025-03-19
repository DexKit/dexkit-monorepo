import type { OAuthExtension } from "@magic-ext/oauth";
import type { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";
import { useMutation } from "@tanstack/react-query";
import { magicConnector } from "../connectors/magic-wagmi/magicConnector";
import { MagicApiKey } from "../constants/magic";
export function useConnectMagic() {
  return useMutation<
    unknown,
    Error,
    { oauthProvider?: string; email?: string }
  >(async ({ oauthProvider, email }) => {
    let { id, name, type, getAccount, getMagicSDK, getProvider } =
      magicConnector({
        options: { apiKey: MagicApiKey, connectorType: "dedicated" },
      });
    const magic = (await getMagicSDK()) as InstanceWithExtensions<
      SDKBase,
      OAuthExtension[]
    >;

    try {
      if (!magic) {
        return false;
      }

      const isLoggedIn = await magic.user.isLoggedIn();

      if (isLoggedIn) return true;
    } catch (e) {}

    if (oauthProvider) {
      await magic.oauth.loginWithRedirect({
        //@ts-ignore
        provider: oauthProvider,
        redirectURI: window.location.href,
      });
    }

    // LOGIN WITH MAGIC USING EMAIL
    if (email)
      await magic.auth.loginWithEmailOTP({
        email: email,
      });
  });
}
