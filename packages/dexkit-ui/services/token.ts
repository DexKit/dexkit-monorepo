import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import axios from 'axios';
import { encode, getContract, prepareContractCall, readContract, resolveMethod } from 'thirdweb';
import { defineChain } from 'thirdweb/chains';
export async function getTokenData(chainId: number, address: string) {
  const response = await axios.get<{
    decimals: number;
    name: string;
    symbol: string;
  }>('/api/token', { params: { chainId, address } });

  return response.data;
}

export async function getTokenMetadata({ chainId, address }: { chainId: number, address: string }) {

  const contract = getContract({
    chain: defineChain(chainId),
    address,
    client
  })

  const name = prepareContractCall({
    contract: contract,
    method: "function name() public view returns (string)",
    params: [],
  })

  const symbol = prepareContractCall({
    contract: contract,
    method: "function symbol() public view returns (string)",
    params: [],
  })

  const decimals = prepareContractCall({
    contract: contract,
    method: "function decimals() public view returns (uint256)",
    params: [],
  })

  const encodedTxs = [
    {
      target: address,
      callData: await encode(name)
    },
    {
      target: address,
      callData: await encode(symbol)
    },
    {
      target: address,
      callData: await encode(decimals)
    }
  ]

  const data = await readContract({ contract, method: resolveMethod('aggregate'), params: [encodedTxs] })

  return {
    name: data[0] as string,
    symbol: data[1] as string,
    decimals: data[2] as number
  }

}

