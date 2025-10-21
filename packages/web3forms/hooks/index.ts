import { DexkitApiProvider } from "@dexkit/core/providers";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { providers } from "ethers";
import {
  BigNumber,
  Contract,
  ContractFactory,
  ContractInterface,
} from "ethers";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import axios from "axios";

import { ChainId } from "@dexkit/core/constants";

import { ETHER_SCAN_API_URL } from "../constants";

import { getNormalizedUrl } from "@dexkit/core/utils";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useContext, useEffect, useState } from "react";
import {
  AbiFragment,
  ContractDeployParams,
  ContractFormParams,
  FormConfigParams,
  ThirdwebMetadata,
} from "../types";

const getDexKitLogo = (isDark: boolean = false) => {
  return isDark
    ? "https://dexkit.com/branding/Normal_logo/Normal_Isotype/white_Isotype_DexKit.png"
    : "https://dexkit.com/branding/Normal_logo/Normal_Isotype/black_Isotype_DexKit.png";
};

export interface UseContractCallMutationOptions {
  contractAddress?: string;
  abi: ContractInterface;
  signer?: providers.JsonRpcSigner;
  onSuccess?: (data: { name: string; result: any }) => void;
}

export interface UseContractCallMutationParams {
  call?: boolean;
  args: any[];
  name: string;
  payable?: boolean;
  value?: BigNumber;
  rpcProvider?: providers.JsonRpcProvider;
}

export function useContractCallMutation({
  contractAddress,
  abi,
  signer,
  onSuccess,
}: UseContractCallMutationOptions) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      call,
      name,
      args,
      payable,
      value,
      rpcProvider,
    }: UseContractCallMutationParams) => {
      let contract: Contract;

      let currProvider = rpcProvider ? rpcProvider : signer;

      if (!contractAddress || !signer) {
        throw new Error("no provider");
      }

      let cb;

      if (call) {
        contract = new Contract(contractAddress, abi, signer);
      } else {
        contract = new Contract(contractAddress, abi, currProvider);
      }

      try {
        cb = contract[name];

        let result: any;

        if (args.length > 0) {
          if (payable) {
            result = await cb(...args, { value });
          } else {
            result = await cb(...args);
          }
        } else {
          if (payable) {
            result = await cb({ value });
          } else {
            result = await cb();
          }
        }

        return { name, result };
      } catch (err) {
        throw err;
      }
    },
    {
      onSuccess: onSuccess,
      onError: (err: any) => {
        enqueueSnackbar(
          formatMessage(
            { id: "error.err", defaultMessage: "Error: {err}" },
            { err: String(err.code) }
          ),
          { variant: "error" }
        );
      },
    }
  );
}

export interface UseContractDeployMutationOptions {
  contractBytecode?: string;
  abi: ContractInterface;
  signer?: providers.JsonRpcSigner;
  onContractCreated?: (contract: Contract) => void;
}

export function useContractDeployMutation({
  contractBytecode,
  abi,
  signer,
  onContractCreated,
}: UseContractDeployMutationOptions) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      params,
      value,
    }: {
      params: ContractDeployParams;
      value: BigNumber;
    }) => {
      if (!contractBytecode || !signer) {
        return;
      }

      const { payable, args } = params;

      const factory = new ContractFactory(
        abi,
        contractBytecode,
        signer
      );

      let result;

      try {
        if (args.length > 0) {
          if (payable) {
            result = await factory.deploy(...args, { value });
          } else {
            result = await factory.deploy(...args);
          }
        } else {
          if (payable) {
            result = await factory.deploy({ value });
          } else {
            result = await factory.deploy();
          }
        }

        if (onContractCreated) {
          onContractCreated(result);
        }
      } catch (err: any) {
        enqueueSnackbar(
          formatMessage(
            { id: "error.err", defaultMessage: "Error: {err}" },
            { err: String(err.code) }
          ),
          { variant: "error" }
        );
      }

      return result;
    }
  );
}

export const CALL_ON_MOUNT_QUERY = "CALL_ON_MOUNT_QUERY";

export function useCallOnMountFields({
  contractAddress,
  abi,
  provider,
  params,
  onSuccess,
}: {
  contractAddress: string;
  abi: AbiFragment[];
  provider?: providers.JsonRpcProvider;
  params: ContractFormParams;
  onSuccess: (results: { [key: string]: any }) => void;
}) {
  return useQuery(
    [CALL_ON_MOUNT_QUERY, params],
    async () => {
      if (provider) {
        let contract = new Contract(contractAddress, abi, provider);

        let results: { [key: string]: any } = {};

        for (let field of Object.keys(params.fields)) {
          if (params.fields[field].callOnMount) {
            const cb = contract[field];
            const args = Object.keys(params.fields[field].input).map(
              (key) => params.fields[field].input[key].defaultValue
            );

            let result = await cb(...args);

            results[field] = result;
          }
        }

        return results;
      }

      return {};
    },
    { onSuccess }
  );
}

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359

export const SCAN_CONTRACT_ABI = "SCAN_CONTRACT_ABI";

export function useScanContractAbiMutation() {
  return useMutation(
    async ({
      contractAddress,
      chainId,
    }: {
      contractAddress: string;
      chainId: ChainId;
    }) => {
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
        }
      );

      if (resp.data.message === "NOTOK") {
        throw new Error("rate limit");
      }

      return JSON.parse(resp.data.result);
    }
  );
}

export function useContractCreation() {
  return useMutation(
    async ({
      contractAddress,
      chainId,
    }: {
      contractAddress: string;
      chainId: ChainId;
    }) => {
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
            action: "getcontractcreation",
            module: "contract",
            contractaddresses: contractAddress,
          },
        }
      );

      if (resp.data.message === "NOTOK") {
        throw new Error("rate limit");
      }

      return resp.data.result;
    }
  );
}

export function useIfpsUploadMutation() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      content,
      isImage,
    }: {
      content: Buffer;
      token?: string;
      isImage?: boolean;
    }) => {
      const formData = new FormData();

      formData.append("file", new Blob([new Uint8Array(content)]));

      if (isImage) {
      }

      if (instance) {
        const pinataKey = (await instance.get("/auth/pinata-key")).data.JWT;

        const res = await axios.post<{
          IpfsHash: string;
          PinSize: number;
          Timestamp: string;
        }>(`https://api.pinata.cloud/pinning/pinFileToIPFS`, formData, {
          headers: {
            "Content-Type": `multipart/form-data;`,
            Authorization: `Bearer ${pinataKey}`,
          },
        });

        await instance.post("/account-file/ipfs/add-file", {
          cid: res.data.IpfsHash,
          isImage,
        });

        return res.data.IpfsHash;
      }
    }
  );
}

export function useServerUploadMutation() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ content }: { content: string }) => {
    if (instance) {
      const res = await instance.post("/account-file/upload-json", {
        metadata: content,
      });
      return res.data;
    }
  });
}

export function useServerUploadMerkleTreeMutation() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      content,
      merkleProof,
    }: {
      content: string;
      merkleProof: string;
    }) => {
      if (instance) {
        const res = await instance.post("/account-file/upload-merkle-tree", {
          metadata: content,
          merkleProof,
        });
        return res.data;
      }
    }
  );
}

export const IPFS_FILE_LIST_QUERY = "IPFS_FILE_LIST_QUERY";

export function useIpfsFileListQuery({
  page = 1,
  onlyImages,
}: {
  page?: number;
  onlyImages?: boolean;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery<{ items: { cid: string }[]; nextCursor?: number }>(
    [IPFS_FILE_LIST_QUERY, page],
    async ({ pageParam }) => {
      if (instance) {
        return (
          await instance.get("/account-file/ipfs/files", {
            params: { cursor: pageParam, limit: 12, onlyImages },
          })
        ).data;
      }

      return { items: [], nextCursor: undefined };
    },
    { getNextPageParam: ({ nextCursor }) => nextCursor }
  );
}

export const FORM_CONFIG_PARAMS_QUERY = "FORM_CONFIG_PARAMS_QUERY";

export function useFormConfigParamsQuery({
  creator,
  contract,
}: {
  contract: string;
  creator: string;
}) {
  return useQuery<FormConfigParams>(
    [FORM_CONFIG_PARAMS_QUERY, creator, contract],
    async () => {
      const result = (
        await axios.get(
          `https://raw.githubusercontent.com/DexKit/assets/main/contracts/${creator}/${contract}.json`
        )
      ).data;

      return result;
    },
    { refetchOnWindowFocus: false }
  );
}

export function useDeployThirdWebContractMutation({
  clientId,
}: {
  clientId: string;
}) {
  const { signer, chainId } = useWeb3React();
  const [sdk, setSdk] = useState<ThirdwebSDK>();

  useEffect(() => {
    if (signer) {
      setSdk(new ThirdwebSDK(signer, { clientId }));
    }
  }, [signer, chainId]);

  return useMutation(
    async ({
      params,
      chainId,
      order,
      metadata,
    }: {
      params: any;
      chainId: number;
      order: string[];
      metadata: ThirdwebMetadata;
    }) => {
      if (sdk) {
        const orderedParams = order.map((key) => {
          if (params[key]) {
            return params[key];
          }

          return null;
        });

        const tx = await sdk.deployer.deployPublishedContract.prepare(
          metadata.publisher,
          metadata.name,
          orderedParams
        );

        const transaction = await tx.send();
        const receipt = await transaction.wait();
        let address;
        if (receipt.events && receipt.events?.length > 1) {
          if (
            receipt.events[0] &&
            receipt.events[0].args &&
            receipt.events[0].args[1]
          ) {
            address = receipt.events[0].args[1];
          }
        }
        return { tx: transaction.hash, address: address };
      }
    }
  );
}

export const THIRDWEB_CONTRACT_METADATA = "THIRDWEB_CONTRACT_METADATA";

export default function useThirdwebContractMetadataQuery({
  id,
  clientId,
  creator,
}: {
  id: string;
  creator?: string;
  clientId?: string;
}) {
  return useQuery([THIRDWEB_CONTRACT_METADATA, id, creator], async () => {
    let publisher = "deployer.thirdweb.eth";
    let isThirdwebContract = true;

    if (creator === "blast" || creator === "dexkit") {
      publisher = "0x5265Bde27F57E738bE6c1F6AB3544e82cdc92a8f";
      isThirdwebContract = false;
    }

    const contract = await new ThirdwebSDK("polygon", { clientId })
      .getPublisher()
      .getLatest(publisher, id);

    if (contract) {
      const normalizedUrl = getNormalizedUrl(contract.metadataUri);

      const result = (
        await axios.get<ThirdwebMetadata>(
          normalizedUrl.replace("gateway.pinata.cloud", "ipfs.io")
        )
      ).data;


      return result;
    }

    return null;
  });
}
