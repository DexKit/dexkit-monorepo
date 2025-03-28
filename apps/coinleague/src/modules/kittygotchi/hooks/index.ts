import { ChainId } from '@/modules/common/constants/enums';
import { useNetworkProvider } from '@/modules/common/hooks/network';
import { getTokenBalances } from '@/modules/common/services/multicall';
import { getTokenMetadata } from '@/modules/common/services/nft';
import { Token } from '@/modules/common/types/transactions';
import { getNormalizedUrl } from '@/modules/common/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import request from 'graphql-request';
import { useCallback, useState } from 'react';

import {
  GET_KITTYGOTCHI_CONTRACT_ADDR,
  GET_KITTYGOTCHI_GRAPH_ENDPOINT,
} from '../constants';
import kittygotchiAbi from '../constants/ABI/kittygotchi.json';
import {
  GET_KITTYGOTCHI,
  GET_KITTYGOTCHI_RANKING,
  GET_MY_KITTYGOTCHIES,
} from '../constants/gql';
import { feed, getOnchainAttritbutes, mint, update } from '../services';
import { Kittygotchi, KittygotchiTraitItem } from '../types';
import {
  getImageFromTrait,
  getKittygotchiApi,
  GET_DEXKIT,
  GET_KITTYGOTCHI_MINT_RATE,
  isKittygotchiNetworkSupported,
  KittygotchiTraitType,
  signUpdate,
} from '../utils';

interface CallbackProps {
  onSubmit?: (hash?: string) => void;
  onConfirmation?: (hash?: string) => void;
  onError?: (error?: any) => void;
}

interface MintCallbacks {
  onSubmit?: (hash?: string) => void;
  onConfirmation?: (hash?: string, tokenId?: number) => void;
  onError?: (error?: any) => void;
}
// Queries
export function useKittygotchi({
  id,
  kittyAddress,
  provider,
  chainId,
}: {
  id?: string;
  kittyAddress?: string;
  provider?: ethers.providers.JsonRpcProvider;
  chainId?: number;
}) {
  const query = useQuery(
    ['GET_KITTYGOTCHI_META', id, chainId, kittyAddress],
    async () => {
      if (id && provider && chainId && kittyAddress) {
        const api = getKittygotchiApi(chainId);
        if (api) {
          const response = await api.get(`${id}`);
          const data = response.data;
          const attr = await getOnchainAttritbutes(id, kittyAddress, provider);

          return {
            id,
            ...data,
            ...{
              attack: attr.attack.toNumber(),
              defense: attr.defense.toNumber(),
              run: attr.run.toNumber(),
              lastUpdated: attr.lastUpdated.toNumber(),
            },
          } as Kittygotchi;
        }
      }
    }
  );
  return query;
}

export const useKittygotchiList = (address?: string) => {
  const { chainId } = useWeb3React();

  const graphEndpoint = GET_KITTYGOTCHI_GRAPH_ENDPOINT(chainId);

  return useQuery([graphEndpoint, address], async () => {
    if (graphEndpoint && address) {
      const { tokens } = await request(graphEndpoint, GET_MY_KITTYGOTCHIES, {
        owner: address?.toLowerCase(),
      });

      return tokens.map((k: any) => ({
        id: k.id,
        name: `Kitty #${k.id}`,
        attack: k.attack ? BigNumber.from(k.attack).toNumber() : 0,
        defense: k.defense ? BigNumber.from(k.defense).toNumber() : 0,
        run: k.run ? BigNumber.from(k.run).toNumber() : 0,
        lastUpdated: parseInt(k.lastUpdated)
          ? BigNumber.from(k.lastUpdated).toNumber()
          : 0,
      }));
    }
  });
};

export function useKittygotchiGraph(id?: string) {
  const { chainId } = useWeb3React();
  const graphEndpoint = GET_KITTYGOTCHI_GRAPH_ENDPOINT(chainId);

  return useQuery([id, graphEndpoint], async () => {
    if (!graphEndpoint || !id) {
      return undefined;
    }

    const { token } = await request(graphEndpoint, GET_KITTYGOTCHI, {
      id: id?.toLowerCase(),
    });

    let resultData = token;

    if (!token) {
      throw new Error('Kittygotchi not found');
    }

    let data: Kittygotchi = {
      id: resultData.id,
      attack: resultData.attack
        ? BigNumber.from(resultData.attack).toNumber()
        : 0,
      defense: resultData.defense
        ? BigNumber.from(resultData.defense).toNumber()
        : 0,
      run: resultData.run ? BigNumber.from(resultData.run).toNumber() : 0,
      lastUpdated: parseInt(resultData.lastUpdated)
        ? BigNumber.from(resultData.lastUpdated).toNumber()
        : 0,
    };

    let metadata = await getTokenMetadata(resultData.uri);

    if (metadata.image) {
      data.image = getNormalizedUrl(metadata.image);
    }

    if (metadata.attributes) {
      data.attributes = metadata.attributes;
    }

    if (metadata.name) {
      data.name = metadata.name;
    }

    if (metadata.description) {
      data.description = metadata.description;
    }
    return data;
  });
}

export function useKittygotchiOnChain() {
  const { chainId, provider } = useWeb3React();
  return useMutation(async ({ id }: { id?: string }) => {
    if (!provider || !chainId) {
      return;
    }
    const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId) || '';

    const contract = new ethers.Contract(
      kittyAddress,
      kittygotchiAbi,
      provider
    );

    let attack = await contract.getAttackOf(id);
    let defense = await contract.getDefenseOf(id);
    let run = await contract.getRunOf(id);
    let lastUpdated = await contract.getLastUpdateOf(id);
    let uri = await contract.tokenURI(id);

    let data: Kittygotchi = {
      id: id ? id : '',
      attack: attack ? BigNumber.from(attack).toNumber() : 0,
      defense: defense ? BigNumber.from(defense).toNumber() : 0,
      run: run ? BigNumber.from(run).toNumber() : 0,
      lastUpdated: parseInt(lastUpdated)
        ? BigNumber.from(lastUpdated).toNumber()
        : 0,
    };

    let metadata = await getTokenMetadata(uri);

    if (metadata.image) {
      data.image = getNormalizedUrl(metadata.image);
    }
    return data;
  });
}

export function useKitHolding(account?: string) {
  const { chainId } = useWeb3React();

  const networkProvider = useNetworkProvider(chainId);

  const query = useQuery(['GET_KITTY_HOLDING', account, chainId], async () => {
    if (account && isKittygotchiNetworkSupported(chainId) && networkProvider) {
      if (chainId) {
        const DexKit = GET_DEXKIT(chainId);

        const tokens = [DexKit];

        const [, tb] = await getTokenBalances(
          (tokens.filter((t) => t !== undefined) as Token[]).map(
            (t) => t.address
          ),
          account,
          networkProvider
        );

        return (tokens.filter((t) => t !== undefined) as Token[]).map((t) => {
          return {
            token: t,
            balance: tb[t.address],
          };
        });
      }
    }
  });

  return query;
}

export function useKittygotchiRanking(
  chainId?: ChainId,
  offset: number = 0,
  limit: number = 10
) {
  const graphEndpoint = GET_KITTYGOTCHI_GRAPH_ENDPOINT(chainId);

  const { data, isLoading, error, isError } = useQuery<
    { tokenId: string; owner: string; strength: number }[]
  >([graphEndpoint, offset, limit], async () => {
    if (graphEndpoint) {
      const { tokens } = await request(graphEndpoint, GET_KITTYGOTCHI_RANKING, {
        offset,
        limit,
      });
      return (
        tokens?.map((r: any) => ({
          tokenId: r.id,
          owner: r.owner.id,
          strength: parseInt(r.totalStrength),
        })) || []
      );
    }

    return [];
  });

  return { results: data || [], isLoading, error, isError };
}

// Mutations
export function useKittygotchiFeed({
  chainId,
  provider,
  kittyAddress,
}: {
  kittyAddress?: string;
  provider?: ethers.providers.Web3Provider;
  chainId?: number;
}) {
  return useMutation(
    async ({ id, callbacks }: { id: string; callbacks?: CallbackProps }) => {
      if (
        !chainId ||
        !isKittygotchiNetworkSupported(chainId) ||
        !kittyAddress ||
        !provider
      ) {
        return;
      }
      const tx = await feed(id, kittyAddress, provider);

      if (callbacks?.onSubmit) {
        callbacks?.onSubmit(tx.hash);
      }
      await tx.wait();
      if (callbacks?.onConfirmation) {
        callbacks?.onConfirmation(tx.hash);
      }
    }
  );
}

export function useKittygotchiMint() {
  const { chainId, provider } = useWeb3React();

  const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

  return useMutation(async ({ callbacks }: { callbacks?: MintCallbacks }) => {
    if (
      !provider ||
      !chainId ||
      !isKittygotchiNetworkSupported(chainId) ||
      !kittyAddress
    ) {
      if (callbacks?.onError) {
        callbacks?.onError(
          new Error('There is no address for Binance Smart Chain')
        );
      }
      return;
    }

    const tx = await mint(
      kittyAddress,
      provider,
      GET_KITTYGOTCHI_MINT_RATE(chainId)
    );

    if (callbacks?.onSubmit) {
      callbacks?.onSubmit(tx.hash);
    }

    let result = await tx.wait();

    if (callbacks?.onConfirmation) {
      if (result.events) {
        if (result.events?.length > 2) {
          let events = result.events;

          let firstEvent = events[1];

          if (firstEvent.args) {
            let topic = firstEvent.args[2];

            if (topic) {
              let tokenId = (topic as BigNumber).toNumber();

              callbacks?.onConfirmation(tx.hash, tokenId);
            }
          } else {
            callbacks?.onConfirmation(tx.hash);
          }
        }
      }
    }

    return result;
  });
}

interface UpdaterParams {
  cloth?: string;
  eyes?: string;
  mouth?: string;
  nose?: string;
  ears?: string;
  accessories?: string;
  body?: string;
}

export function useKittygotchiUpdate() {
  const { chainId, account, provider } = useWeb3React();

  const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

  return useMutation(
    async ({
      id,
      params,
      callbacks,
    }: {
      id: string;
      params: UpdaterParams;
      callbacks: CallbackProps;
    }) => {
      if (
        !chainId ||
        !isKittygotchiNetworkSupported(chainId) ||
        !kittyAddress ||
        !account ||
        !provider
      ) {
        return;
      }

      const { sig, message } = await signUpdate(provider, chainId);

      if (callbacks?.onSubmit) {
        callbacks?.onSubmit();
      }
      return await update(sig, message, params, id, account, chainId);
    }
  );
}

interface KittyValues {
  cloth?: string;
  eyes?: string;
  mouth?: string;
  nose?: string;
  ears?: string;
  accessory?: string;
  body?: string;
}

export function useKittygotchiStyleEdit() {
  const [values, setValues] = useState<KittyValues>({ body: 'body' });

  const getImageArray = useCallback(() => {
    let arr = [];

    if (values?.body) {
      arr.push(getImageFromTrait(KittygotchiTraitType.BODY, values?.body));
    }

    if (values?.ears) {
      arr.push(getImageFromTrait(KittygotchiTraitType.EARS, values?.ears));
    }

    if (values?.eyes) {
      arr.push(getImageFromTrait(KittygotchiTraitType.EYES, values?.eyes));
    }

    if (values?.nose) {
      arr.push(getImageFromTrait(KittygotchiTraitType.NOSE, values?.nose));
    }

    if (values?.mouth) {
      arr.push(getImageFromTrait(KittygotchiTraitType.MOUTH, values?.mouth));
    }

    if (values?.cloth) {
      arr.push(getImageFromTrait(KittygotchiTraitType.CLOTHES, values?.cloth));
    }

    if (values?.accessory) {
      arr.push(
        getImageFromTrait(KittygotchiTraitType.ACCESSORIES, values?.accessory)
      );
    }

    return arr;
  }, [values]);

  const handleSelectCloth = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({ ...values, cloth: item.value });
    },
    [values]
  );

  const handleSelectBody = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({ ...values, body: item.value });
    },
    [values]
  );

  const handleSelectEyes = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({ ...values, eyes: item.value });
    },
    [values]
  );

  const handleSelectNose = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({ ...values, nose: item.value });
    },
    [values]
  );

  const handleSelectEars = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({ ...values, ears: item.value });
    },
    [values]
  );

  const handleSelectAccessory = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({ ...values, accessory: item.value });
    },
    [values]
  );

  const handleSelectMouth = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({ ...values, mouth: item.value });
    },
    [values]
  );

  const isEmpty = useCallback(() => {
    return (
      !values?.cloth &&
      !values?.eyes &&
      !values?.mouth &&
      !values?.nose &&
      !values?.ears &&
      !values?.body &&
      !values?.accessory
    );
  }, [values]);

  const fromTraits = useCallback(
    (traits: { value: string; trait_type: string }[]) => {
      let newValues: KittyValues = {};

      for (let t of traits) {
        let traitType = t.trait_type.toLowerCase();

        if (
          traitType === 'attack' ||
          traitType === 'defense' ||
          traitType === 'run'
        ) {
          continue;
        }

        let value = t.value.toLowerCase().replace(new RegExp(' ', 'g'), '-');

        switch (traitType) {
          case 'eyes':
            newValues.eyes = value;

            break;
          case 'ears':
            newValues.ears = value;

            break;
          case 'clothes':
            newValues.cloth = value;
            break;
          case 'mouth':
            newValues.mouth = value;
            break;
          case 'body':
            newValues.body = value;
            break;
          case 'nose':
            newValues.nose = value;
            break;
          case 'accessories':
            newValues.accessory = value;

            break;
        }
      }

      if (!newValues.body) {
        newValues.body = 'body';
      }

      if (!newValues.ears) {
        newValues.ears = 'pointed';
      }

      if (!newValues.eyes) {
        newValues.eyes = 'star';
      }

      if (!newValues.mouth) {
        newValues.mouth = 'cute';
      }

      if (!newValues.nose) {
        newValues.nose = 'fan';
      }

      if (!newValues.accessory) {
        newValues.accessory = 'piercing';
      }

      setValues(newValues);
    },
    []
  );

  return {
    fromTraits,
    isEmpty,
    getImageArray,
    handleSelectCloth,
    handleSelectBody,
    handleSelectEyes,
    handleSelectAccessory,
    handleSelectEars,
    handleSelectNose,
    handleSelectMouth,
    cloth: values?.cloth,
    eyes: values?.eyes,
    mouth: values?.mouth,
    nose: values?.nose,
    ears: values?.ears,
    body: values?.body,
    accessory: values?.accessory,
    params: {
      clothes: values?.cloth,
      eyes: values?.eyes,
      mouth: values?.mouth,
      nose: values?.nose,
      ears: values?.ears,
      body: values?.body,
      accessories: values?.accessory,
    },
  };
}
