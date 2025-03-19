import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DEXKIT_STORAGE_MERKLE_TREE_URL } from "../../../constants/api";

export function useMerkleTreeAllowListQuery({
  merkleProof,
}: {
  merkleProof?: string;
}) {
  return useQuery(["GET_MERKLE_TREE_ALLOW_LIST", merkleProof], async () => {
    if (
      !merkleProof ||
      merkleProof ===
        "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      return null;
    }
    const response = await axios.get<
      { address: string; maxClaimable: string }[]
    >(`${DEXKIT_STORAGE_MERKLE_TREE_URL}${merkleProof}.json`);
    return response.data;
  });
}
