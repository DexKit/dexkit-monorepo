import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContract } from '@thirdweb-dev/react';
import axios from 'axios';
import { Contract, ContractFactory, providers } from 'ethers';
import { useAtomValue, useSetAtom } from 'jotai';

import { myAppsApi } from 'src/services/whitelabel';
import { holdsKitDialogAtom } from 'src/state/atoms';


import { isIpfsUri } from '@dexkit/core/utils/ipfs';
import { useAuth, useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { getMultipleAssetDexKitApi } from '@dexkit/ui/modules/nft/services';
import { CollectionAPI } from '@dexkit/ui/modules/nft/types';
import { collectionsAtom, tokensAtom } from '../atoms';
import {
  ERC20_BASE_CONTRACT_URL,
  ERC721_BASE_CONTRACT_URL,
} from '../constants';
import { ERC721Abi } from '../constants/contracts/abis/ERC721Abi';
import { TokenForm, WizardCollection, WizardItem } from '../types';

const wizardBaseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WIZARD_API_ENDPOINT,
});

const dexKitAppApi = myAppsApi;

export function useCreateCollection(
  provider?: providers.Web3Provider,
  onSubmitted?: (hash: string) => void,
) {
  return useMutation(
    async ({
      name,
      symbol,
      royalty,
    }: {
      name: string;
      symbol: string;
      royalty: number;
    }) => {
      if (!provider) {
        return;
      }

      const contractCode = (
        await axios.get<{ abi: any; bytecode: string }>(
          ERC721_BASE_CONTRACT_URL,
        )
      ).data;

      const contractFactory = new ContractFactory(
        contractCode.abi,
        contractCode.bytecode,
        provider.getSigner(),
      );

      const contract = await contractFactory.deploy(name, symbol, royalty);

      if (onSubmitted) {
        onSubmitted(contract.deployTransaction.hash);
      }

      await contract.deployTransaction.wait();

      return {
        contractAddress: contract.address,
        tx: contract.deployTransaction.hash,
      };
    },
  );
}

export function useCreateItems(
  provider?: providers.Web3Provider,
  onSubmitted?: (hash: string) => void,
) {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({
      contractAddress,
      items,
    }: {
      contractAddress: string;
      items: { tokenURI: string; to: string }[];
    }) => {
      if (!provider) {
        return;
      }
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }

      const contractCode = (
        await axios.get<{ abi: any; bytecode: string }>(
          ERC721_BASE_CONTRACT_URL,
        )
      ).data;

      const contract = new Contract(
        contractAddress,
        contractCode.abi,
        provider.getSigner(),
      );

      const tx = await contract.multiSafeMint(items);

      if (onSubmitted) {
        onSubmitted(tx.hash);
      }

      return await tx.wait();
    },
  );
}

export function useUploadImagesMutation() {
  return useMutation(async (files: (File | null)[]) => {
    const items = [];

    for (let file of files) {
      let form = new FormData();

      if (file) {
        form.append('file', file);
      }

      let resp = await wizardBaseAPI.post<{ hash: string }>(
        '/nft/image/upload',
        form,
      );

      items.push(resp.data.hash);
    }

    return items;
  });
}

export function useUploadImageMutation() {
  return useMutation(async (file: File) => {
    let form = new FormData();

    form.append('file', file);

    let resp = await wizardBaseAPI.post<{ hash: string }>(
      '/nft/image/upload',
      form,
    );

    return resp.data.hash;
  });
}

export function useSendItemsMetadataMutation() {
  return useMutation(async (items: WizardItem[]) => {
    return (
      await wizardBaseAPI.post<{ hashes: string[]; error: null | string }>(
        '/nft/metadata',
        {
          metadata_type: 'items',
          data: items,
        },
      )
    ).data.hashes;
  });
}

export function useCreateAssetsMetadataMutation() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({
      nfts,
      network,
      address,
    }: {
      nfts: WizardItem[];
      network: string;
      address: string;
    }) => {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      return (
        await dexKitAppApi.post<any>('/contract/create/collection/assets', {
          networkId: network,
          address: address,
          nfts,
        })
      ).data;
    },
  );
}

export function useEditAssetMetadataMutation() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({
      nft,
      network,
      address,
    }: {
      nft: WizardItem;
      network: string;
      address: string;
    }) => {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      return (
        await dexKitAppApi.post<any>('/contract/update/collection/asset', {
          networkId: network,
          address: address,
          nft,
        })
      ).data;
    },
  );
}
//@deprecated
export function useCreateAIImageMutation() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  // const isHoldingKit = useAccountHoldDexkitMutation();
  const setIsHoldingKitDialog = useSetAtom(holdsKitDialogAtom);
  return useMutation(async ({ description }: { description: string }) => {
    return
    try {
      //   await isHoldingKit.mutateAsync();
    } catch {
      setIsHoldingKitDialog(true);
      return;
    }

    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }

    return (
      await dexKitAppApi.post<any>('/account-file/create-image-ai', {
        description,
      })
    ).data.url;
  });
}

export function useCreateCollectionMetadataMutation() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(async (collection: WizardCollection) => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }

    //TODO: adapt to ERC1155

    return (
      await dexKitAppApi.post<CollectionAPI>('/contract/create', {
        type: 'ERC721',
        tx: collection.tx,
        networkId: collection.networkId,
        address: collection.address,
        metadata: JSON.stringify({
          description: collection.description,
          image: collection.image,
          external_link: collection.external_link,
        }),
      })
    ).data;
  });
}

export function useSendCollectionMetadataMutation() {
  return useMutation(async (collection: WizardCollection) => {
    return (
      await wizardBaseAPI.post<{ hash: string; error: null | string }>(
        '/nft/metadata',
        {
          metadata_type: 'collection',
          data: collection,
        },
      )
    ).data.hash;
  });
}

export function useCollectionList() {
  const collections = useAtomValue(collectionsAtom);

  return { collections };
}

export function useTokensList() {
  const tokens = useAtomValue(tokensAtom);

  return { tokens };
}

export function useLazyMintMutation({
  address,
  isERC1155,
  onSubmitted,
}: {
  address: string;
  isERC1155?: boolean;
  onSubmitted?: (hash: string) => void;
}) {
  const { contract } = useContract(address);

  return useMutation(async ({ metadatas }: any) => {
    if (!metadatas) {
      return;
    }
    let tx;
    if (isERC1155) {
      tx = await contract?.erc1155.lazyMint.prepare(metadatas);
    } else {
      tx = await contract?.erc721.lazyMint.prepare(metadatas);
    }
    const sentTx = await tx?.send();

    if (onSubmitted && sentTx?.hash) {
      onSubmitted(sentTx?.hash);
    }
    if (sentTx) {
      return await sentTx.wait();
    }
  });
}

export function useFetchAssetsMutation({
  address,
  network,
}: {
  address?: string;
  network?: string;
}) {
  return useMutation(async ({ tokenIds }: { tokenIds: string[] }) => {
    if (!address || !network || tokenIds.length === 0) {
      return;
    }
    const assets = await getMultipleAssetDexKitApi({
      contractAddress: address,
      networkId: network,
      tokenIds,
    });
    return assets;
  });
}

/*export function useCollection(address?: string) {
  const { collections } = useCollectionList();
  const collection = useMemo(() => {
    if (address) {
      let collectionIndex = collections.findIndex(
        (collection) => collection.address === address,
      );
      if (collectionIndex) {
        return collections[collectionIndex];
      }
    }
  }, [collections, address]);

  return { collection };
}*/

export function useCollectionMetadataQuery(address?: string) {
  const { provider } = useWeb3React();

  return useQuery([address, provider], async () => {
    if (!provider || !address) {
      return;
    }

    const contract = new Contract(
      address,
      ERC721Abi,
      provider.getSigner(),
    );

    let contractURI: string = await contract.contractURI();

    if (isIpfsUri(contractURI)) {
      let cleanImageHash = new URL(contractURI).pathname.replace('//', '');
      contractURI = `https://ipfs.io/ipfs/${cleanImageHash}`;
    }

    let metadata: { name: string; description: string; image: string } =
      await axios.get(contractURI).then((response) => response.data);

    let contractImage = metadata.image;

    if (isIpfsUri(contractImage)) {
      let cleanImageHash = new URL(contractImage).pathname.replace('//', '');
      contractImage = `https://ipfs.io/ipfs/${cleanImageHash}`;
    }

    return {
      image: contractImage,
      name: metadata.name,
      description: metadata.description,
    };
  });
}

// export function useCollectionItemsQuery(address?: string) {
//   const { provider } = useWeb3React();

//   return useQuery([address, provider], async () => {
//     if (!address || !provider) {
//       return;
//     }

//     var contract = new ethers.Contract(
//       address,
//       ERC721Abi,
//       provider.getSigner()
//     );

//     let eventFilter = await contract.filters.Transfer();

//     let events = await contract.queryFilter(eventFilter);

//     let tokenIds = new Set<string>([]);

//     for (let event of events) {
//       if (event.args) {
//         tokenIds.add((event.args[2] as BigNumber).toNumber().toString());
//       }
//     }

//     let tokens: {
//       tokenId: string;
//       name: string;
//       description: string;
//       imageUrl: string;
//     }[] = [];

//     for (const tokenId of tokenIds.values()) {
//       const tokenURI: string = await contract.tokenURI(tokenId);

//       let url = tokenURI;

//       if (isIpfsUrl(tokenURI)) {
//         let cleanHash = new URL(tokenURI).pathname.replace('//', '');
//         url = `https://ipfs.io/ipfs/${cleanHash}`;
//       }

//       let metadata: { name: string; description: string; image: string } =
//         await axios.get(url).then((response) => response.data);

//       let imageUrl = metadata.image;

//       if (isIpfsUrl(imageUrl)) {
//         let cleanImageHash = new URL(imageUrl).pathname.replace('//', '');
//         imageUrl = `https://ipfs.io/ipfs/${cleanImageHash}`;
//       }

//       tokens.push({
//         tokenId,
//         imageUrl,
//         name: metadata.name,
//         description: metadata.description,
//       });
//     }
//     return tokens;
//   });
// }

export const TOKEN_CONTRACT_DATA = 'TOKEN_CONTRACT_DATA';

export function useTokenContractData() {
  return useQuery([TOKEN_CONTRACT_DATA], async () => {
    return (
      await axios.get<{ bytecode: string; abi: any }>(ERC20_BASE_CONTRACT_URL)
    ).data;
  });
}

export function useCreateToken(
  provider?: providers.Web3Provider,
  onSubmitted?: (hash: string, contractAddress: string) => void,
) {
  const { data: contractData } = useTokenContractData();

  return useMutation(async ({ name, symbol, maxSupply }: TokenForm) => {
    if (!provider || !contractData) {
      return;
    }

    const { bytecode, abi } = contractData;

    const contractFactory = new ContractFactory(
      abi,
      bytecode,
      provider.getSigner(),
    );

    const contract = await contractFactory.deploy(name, symbol, maxSupply);

    if (onSubmitted) {
      onSubmitted(contract.deployTransaction.hash, contract.address);
    }

    return await contract.deployTransaction.wait();
  });
}
