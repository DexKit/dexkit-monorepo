import { isIpfsUrl } from '@/modules/common/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
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

export function useCreateCollection(
  provider?: ethers.providers.Web3Provider,
  onSubmitted?: (hash: string) => void
) {
  return useMutation(
    async ({
      name,
      symbol,
      contractURI,
    }: {
      name: string;
      symbol: string;
      contractURI: string;
    }) => {
      if (!provider) {
        return;
      }

      const contractCode = (
        await axios.get<{ abi: any; bytecode: string }>(
          ERC721_BASE_CONTRACT_URL
        )
      ).data;

      const contractFactory = new ethers.ContractFactory(
        contractCode.abi,
        contractCode.bytecode,
        provider.getSigner()
      );

      const contract = await contractFactory.deploy(name, symbol, contractURI);

      if (onSubmitted) {
        onSubmitted(contract.deployTransaction.hash);
      }

      await contract.deployTransaction.wait();

      return contract.address;
    }
  );
}

export function useCreateItems(
  provider?: ethers.providers.Web3Provider,
  onSubmitted?: (hash: string) => void
) {
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

      const contractCode = (
        await axios.get<{ abi: any; bytecode: string }>(
          ERC721_BASE_CONTRACT_URL
        )
      ).data;

      const contract = new ethers.Contract(
        contractAddress,
        contractCode.abi,
        provider.getSigner()
      );

      const tx = await contract.multiSafeMint(items);

      if (onSubmitted) {
        onSubmitted(tx.hash);
      }

      return await tx.wait();
    }
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
        form
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
      form
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
        }
      )
    ).data.hashes;
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
        }
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

export function useCollection(address?: string) {
  const { collections } = useCollectionList();
  const collection = useMemo(() => {
    if (address) {
      let collectionIndex = collections.findIndex(
        (collection) => collection.address === address
      );
      if (collectionIndex) {
        return collections[collectionIndex];
      }
    }
  }, [collections, address]);

  return { collection };
}

export function useCollectionMetadataQuery(address?: string) {
  const { provider } = useWeb3React();

  return useQuery([address, provider], async () => {
    if (!provider || !address) {
      return;
    }

    const contract = new ethers.Contract(
      address,
      ERC721Abi,
      provider.getSigner()
    );

    let contractURI: string = await contract.contractURI();

    if (isIpfsUrl(contractURI)) {
      let cleanImageHash = new URL(contractURI).pathname.replace('//', '');
      contractURI = `https://ipfs.io/ipfs/${cleanImageHash}`;
    }

    let metadata: { name: string; description: string; image: string } =
      await axios.get(contractURI).then((response) => response.data);

    let contractImage = metadata.image;

    if (isIpfsUrl(contractImage)) {
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
  provider?: ethers.providers.Web3Provider,
  onSubmitted?: (hash: string, contractAddress: string) => void
) {
  const { data: contractData } = useTokenContractData();

  return useMutation(async ({ name, symbol, maxSupply }: TokenForm) => {
    if (!provider || !contractData) {
      return;
    }

    const { bytecode, abi } = contractData;

    const contractFactory = new ethers.ContractFactory(
      abi,
      bytecode,
      provider.getSigner()
    );

    const contract = await contractFactory.deploy(name, symbol, maxSupply);

    if (onSubmitted) {
      onSubmitted(contract.deployTransaction.hash, contract.address);
    }

    return await contract.deployTransaction.wait();
  });
}
