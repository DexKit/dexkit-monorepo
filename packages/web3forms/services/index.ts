import { ChainId } from "@dexkit/core/constants";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import axios from "axios";
import { ETHER_SCAN_API_URL } from "../constants";

export async function generatePinataKey(secretKey: string) {
  var data = JSON.stringify({
    keyName: "Client key",
    permissions: {
      endpoints: {
        data: {
          pinList: false,
          userPinnedDataTotal: false,
        },
        pinning: {
          hashMetadata: false,
          hashPinPolicy: false,
          pinByHash: true,
          pinFileToIPFS: true,
          pinJSONToIPFS: false,
          pinJobs: false,
          unpin: false,
          userPinPolicy: false,
        },
      },
    },
  });

  var config = {
    method: "post",
    url: "https://api.pinata.cloud/users/generateApiKey",
    headers: {
      Authorization: "Bearer PINATA JWT",
      "Content-Type": "application/json",
    },
    data: data,
  };

  const res = await axios(config);
}

export async function fetchAbi({
  contractAddress,
  chainId,
}: {
  contractAddress: string;
  chainId: ChainId;
}) {
  if (!isAddress(contractAddress)) {
    throw new Error("invalid contract address");
  }

  if (!chainId) {
    throw new Error("no chain id");
  }

  const resp = await axios.get(
    `https://${ETHER_SCAN_API_URL[chainId] ?? ""}/api`,
    {
      params: {
        action: "getabi",
        module: "contract",
        address: contractAddress,
      },
    },
  );

  if (resp.data.message === "NOTOK") {
    throw new Error("rate limit");
  }

  return JSON.parse(resp.data.result);
}
