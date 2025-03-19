import { ChainId } from "@/modules/common/constants/enums";
import { NETWORKS } from "@/modules/common/constants/networks";
import { ethers } from "ethers";
import { GET_LEAGUES_CHAIN_ID } from "../constants";



export function getNetworkProvider(chainId: ChainId) {
  const rpcURL = NETWORKS[GET_LEAGUES_CHAIN_ID(chainId)].providerRpcUrl as string;
  return new ethers.providers.JsonRpcProvider(rpcURL);
}