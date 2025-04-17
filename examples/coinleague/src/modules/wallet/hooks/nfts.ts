import { ERC721Abi } from '@/modules/wizard/constants/contracts/abis/ERC721Abi';
import MultiCall, { CallInput } from '@indexed-finance/multicall';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ethers, providers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import moment from 'moment';
import { useEffect } from 'react';
import { nftsAtom, nftsLastFetchAtom } from '../atoms';
import { DkApiAccountsNftResult } from '../types/dexkitapi';
import { Nft, NftMetadata } from '../types/nfts';

export const NFT_QUERY = 'NFT_QUERY';

export function useNft({
  chainId,
  contractAddress,
  tokenId,
  provider,
}: {
  chainId?: number;
  contractAddress?: string;
  tokenId?: string;
  provider?: providers.Web3Provider;
}) {
  return useQuery<Nft>(
    [NFT_QUERY, chainId, contractAddress, tokenId],
    async () => {
      if (!provider || !chainId || !tokenId || !contractAddress) {
        return {} as any;
      }

      const multicall = new MultiCall(provider);
      const iface = new Interface(ERC721Abi);

      const calls: CallInput[] = [];

      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'symbol',
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        args: [tokenId],
        function: 'ownerOf',
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'name',
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        args: [tokenId],
        function: 'tokenURI',
      });

      const [, results] = await multicall.multiCall(calls);

      return {
        symbol: results[0],
        owner: results[1],
        collectionName: results[2],
        tokenURI: results[3],
        contractAddress,
        tokenId,
      } as Nft;
    },
    { enabled: tokenId !== undefined && contractAddress !== undefined }
  );
}

export const NFT_METADATA_QUERY = 'NFT_METADATA_QUERY';

export function useNftMetadata({ tokenURI }: { tokenURI?: string }) {
  return useQuery(
    [NFT_METADATA_QUERY, tokenURI],
    async () => {
      if (!tokenURI) {
        throw new Error('empty uri');
      }

      return (await axios.get<NftMetadata>(tokenURI)).data;
    },
    { enabled: Boolean(tokenURI) }
  );
}

export function useNftTransfer({
  contractAddress,
  provider,
  onSubmit,
}: {
  contractAddress?: string;
  tokenId?: string;
  provider?: ethers.providers.Web3Provider;
  onSubmit?: (hash: string) => void;
}) {
  return useMutation(
    async ({
      to,
      from,
      tokenId,
    }: {
      to: string;
      from: string;
      tokenId: string;
    }) => {
      if (!contractAddress || !tokenId || !provider) {
        return false;
      }

      const contract = new ethers.Contract(
        contractAddress,
        ERC721Abi,
        provider?.getSigner()
      );

      const tx = await contract.transferFrom(from, to, tokenId);

      if (onSubmit) {
        onSubmit(tx.hash);
      }

      return await tx.wait();
    }
  );
}

export const LIST_NFTS_QUERY = 'LIST_NFTS_QUERY';

export function useListNfts({
  accounts,
  networks,
}: {
  accounts: string[];
  networks: string[];
}) {
  const [lastFetch, setLastFetch] = useAtom(nftsLastFetchAtom);
  const [nfts, setNfts] = useAtom(nftsAtom);

  const query = useQuery(
    [LIST_NFTS_QUERY, accounts, networks],
    async ({ signal }) => {
      const lf = moment(lastFetch);
      const now = moment();
      const difference = now.diff(lf, 'minutes');

      if (lastFetch > 0 && !(difference > 5)) {
        return nfts;
      }

      const req = axios.get<DkApiAccountsNftResult[]>('/api/wallet/nft', {
        params: {
          accounts: accounts.join(','),
          networks: networks.join(','),
        },
        signal: signal,
      });

      const results = (await req).data?.map((result) => result.assets);

      setLastFetch(new Date().getTime());

      const ret = results.flat();

      setNfts(ret);

      return ret;
    },
    { suspense: true }
  );

  useEffect(() => {
    setLastFetch(0);

    query.refetch({ cancelRefetch: true });
  }, [networks]);

  const lf = moment(lastFetch);
  const now = moment();
  const difference = now.diff(lf, 'minutes');

  return {
    nfts: lastFetch > 0 && !(difference > 5) ? nfts : query.data,
    setNfts,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
