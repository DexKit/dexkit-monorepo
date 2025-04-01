import { Contract, providers } from "ethers";
import { networks } from "../constants";

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "locks",
    outputs: [
      {
        internalType: "bool",
        name: "deployed",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "totalSales",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "yieldedDiscountTokens",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export async function getIsLockAsync({
  address,
  chainId,
  provider,
}: {
  address?: string;
  chainId?: number;
  provider?: providers.JsonRpcProvider;
}) {
  if (!chainId || !address || !provider) {
    return false;
  }
  try {
    if (
      Object.keys(networks)
        .map((n) => Number(n))
        .includes(chainId)
    ) {
      //@ts-ignore
      const LockContract = networks[chainId].unlockAddress;
      const unlock = new Contract(LockContract, abi, provider);
      const lock = await unlock.locks(address);
      if (lock && lock[0]) {
        return lock[0];
      }
      return false;
    }
  } catch {
    return false;
  }
  return false;
}
