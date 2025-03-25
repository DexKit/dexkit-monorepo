import axios from "axios";
import { TokenMetadata } from "../types/nfts";
import { getNormalizedUrl } from "../utils";



export const getTokenMetadata = async (url: string) => {
  return axios
    .get<TokenMetadata>(getNormalizedUrl(url))
    .then((response) => response.data);
};