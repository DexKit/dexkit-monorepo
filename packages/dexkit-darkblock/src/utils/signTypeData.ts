export const SIGNING_TYPE = {
  accessAuth: "access",
  upgradeNft: "upgradeNft",
  upgradeCollection: "upgradeCollection",
}

const signMessage = async ({ message, account, provider }: { message: string, account: string, provider: any }) => {
  // const message = "Hello World";
  const from = account;
  const params = [message, from];
  const method = "personal_sign";
  return await provider.request({
    method,
    params,
    from,
  });
};


const signTypedData = async ({ data, account, type, provider }: { data: string, type: string, account: string, provider: any }) => {

  let msgParams = ""
  switch (type) {
    case SIGNING_TYPE.accessAuth:
      msgParams = `You are unlocking content via the Darkblock Protocol.\n\nPlease sign to authenticate.\n\nThis request will not trigger a blockchain transaction or cost any fee.\n\nAuthentication Token: ${data}`
      break
    case SIGNING_TYPE.upgradeNft:
      msgParams = `You are interacting with the Darkblock Protocol.\n\nPlease sign to upgrade this NFT.\n\nThis request will not trigger a blockchain transaction or cost any fee.\n\nAuthentication Token: ${data}`
      break
    case SIGNING_TYPE.upgradeCollection:
      msgParams = `You are interacting with the Darkblock Protocol.\n\nAttention: You are attempting to upgrade an entire NFT collection!\n\nPlease sign to continue.\n\nThis request will not trigger a blockchain transaction or cost any fee.\nAuthentication Token: ${data}`
      break
    default:
      msgParams = `You are unlocking content via the Darkblock Protocol.\n\nPlease sign to authenticate.\n\nThis request will not trigger a blockchain transaction or cost any fee.\n\nAuthentication Token: ${data}`
      break
  }
  return new Promise(async (resolve, reject) => {
    try {
      const signedMessage = await signMessage({ message: msgParams, account, provider });
      resolve(signedMessage);
    } catch (err) {
      reject(err);
    }
  });

}
export default signTypedData