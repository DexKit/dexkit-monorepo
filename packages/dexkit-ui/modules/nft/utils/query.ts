import { Row, Value } from "@react-page/editor";

export function returnNFTmap({
  address,
  tokenId,
  chainId,
  currentMap,
}: {
  address: string;
  tokenId: string;
  chainId?: number;
  currentMap?: Map<number, Map<string, Set<string>>>;
}) {
  let assetsToFetch;
  if (currentMap) {
    assetsToFetch = currentMap;
  } else {
    assetsToFetch = new Map<number, Map<string, Set<string>>>();
  }

  if (chainId && assetsToFetch.has(chainId)) {
    const collectionMap = assetsToFetch.get(chainId);
    if (collectionMap) {
      if (collectionMap.has(address.toLowerCase())) {
        const tokenIdSet = collectionMap.get(address.toLowerCase());

        if (tokenIdSet) {
          tokenIdSet?.add(tokenId);
          collectionMap.set(address.toLowerCase(), tokenIdSet);
          assetsToFetch.set(chainId, collectionMap);
        } else {
          const tokenIdSet = new Set<string>();
          tokenIdSet.add(tokenId);
          collectionMap.set(address.toLowerCase(), tokenIdSet);
          assetsToFetch.set(chainId, collectionMap);
        }
      } else {
        const tokenIdSet = new Set<string>();
        tokenIdSet.add(tokenId);
        collectionMap.set(address.toLowerCase(), tokenIdSet);
        assetsToFetch.set(chainId, collectionMap);
      }
    } else {
      const collectionMap = new Map();
      const tokenIdSet = new Set<string>();
      tokenIdSet.add(tokenId);
      collectionMap.set(address.toLowerCase(), tokenIdSet);
      assetsToFetch.set(chainId, collectionMap);
    }
  } else {
    if (chainId) {
      const collectionMap = new Map();
      const tokenIdSet = new Set<string>();
      tokenIdSet.add(tokenId);
      collectionMap.set(address.toLowerCase(), tokenIdSet);
      assetsToFetch.set(chainId, collectionMap);
    }
  }

  return assetsToFetch;
}

function ParseRow({ rows, acc }: { rows: Row[]; acc: any[] }) {
  for (const row of rows) {
    for (const cell of row.cells) {
      if (cell.plugin && cell.plugin.id === "nft-plugin") {
        const data = cell.dataI18n;
        if (data) {
          acc.push(data["default"]);
        }
      }
      if (cell.rows) {
        ParseRow({ rows: cell.rows, acc });
      }
    }
  }
}

interface NFTItem {
  contractAddress: string;
  network: string;
  id: string;
}

export function parseNFTPageEditorConfig({
  config,
}: {
  config: Value;
}): NFTItem[] {
  const rows = config.rows;
  let acc: any = [];
  ParseRow({ rows, acc });
  return acc;
}

/**
 * We create here the where query to send to server to get multiple nfts at once;
 * @param param0
 */
export function getWhereNFTQuery({
  mapData,
}: {
  mapData: Map<number, Map<string, Set<string>>>;
}) {
  const whereQuery: any = {};
  whereQuery.where = {};
  whereQuery.where.OR = [];

  for (const networkData of mapData) {
    const chainId = Number(networkData[0]);
    const contractAddressMap = networkData[1];
    for (const contractData of contractAddressMap) {
      whereQuery.where.OR.push({
        chainId,
        address: contractData[0],
        tokenId: { in: Array.from(contractData[1]) },
      });
    }
  }
  return whereQuery;
}
