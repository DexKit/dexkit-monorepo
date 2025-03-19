export const isIpfsUri = (uri?: string) => {
  if (uri === undefined) {
    return "";
  }

  return uri?.startsWith("ipfs://");
};

export const ipfsUriToUrl = (uri: string) => {
  if (!isIpfsUri(uri)) {
    return uri;
  }

  if (uri === "" || uri === undefined || uri === null) {
    return "";
  }
  if (uri?.startsWith("ipfs://ipfs/")) {
    return uri.replace("ipfs://ipfs/", "https://dweb.link/ipfs/");
  }

  return uri.replace("ipfs://", "https://dweb.link/ipfs/");
};
