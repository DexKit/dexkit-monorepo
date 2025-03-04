import { getWhereNFTQuery, parseNFTPageEditorConfig, returnNFTmap } from "./nfts";


const data = "{\"id\":\"4dz4l7\",\"version\":1,\"rows\":[{\"id\":\"ihxpas\",\"cells\":[{\"id\":\"0iyqj8\",\"size\":12,\"plugin\":{\"id\":\"ory/editor/core/layout/background\",\"version\":1},\"dataI18n\":{\"default\":{\"modeFlag\":3,\"backgroundColor\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}},\"rows\":[{\"id\":\"xverex\",\"cells\":[{\"id\":\"ln3bdg\",\"size\":12,\"plugin\":{\"id\":\"ory/editor/core/content/spacer\",\"version\":1},\"dataI18n\":{\"default\":{\"height\":50,\"hideInDesktop\":false,\"hideInMobile\":true}},\"rows\":[],\"inline\":null}]},{\"id\":\"umb5m5\",\"cells\":[{\"id\":\"vark7v\",\"size\":12,\"plugin\":{\"id\":\"container\",\"version\":1},\"dataI18n\":{\"default\":null},\"rows\":[{\"id\":\"4tggl8\",\"cells\":[{\"id\":\"siklnv\",\"size\":12,\"plugin\":{\"id\":\"ory/editor/core/content/slate\",\"version\":1},\"dataI18n\":{\"default\":{\"slate\":[{\"type\":\"HEADINGS/HEADING-FOUR\",\"children\":[{\"text\":\"\\n\\n\"},{\"text\":\"Check examples of Bored Apes\\n\",\"SetColor\":{\"color\":\"rgba(250, 199, 72, 1)\"}},{\"text\":\"\\n\"}]}]}},\"rows\":[],\"inline\":null}]},{\"id\":\"j2k9nl\",\"cells\":[{\"id\":\"vbugcg\",\"size\":4,\"plugin\":{\"id\":\"nft-plugin\",\"version\":1},\"dataI18n\":{\"default\":{\"name\":\"BoredApeYachtClub #5230\",\"contractAddress\":\"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d\",\"network\":\"Ethereum\",\"chainId\":1,\"image\":\"https://dexkit-storage.nyc3.digitaloceanspaces.com/dexkit/images/optimized/ethereum/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5230.png\",\"id\":\"5230\"}},\"rows\":[],\"inline\":null},{\"id\":\"g503zg\",\"size\":4,\"plugin\":{\"id\":\"nft-plugin\",\"version\":1},\"dataI18n\":{\"default\":{\"name\":\"BoredApeYachtClub #2\",\"contractAddress\":\"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d\",\"network\":\"Ethereum\",\"chainId\":1,\"image\":\"https://dexkit-storage.nyc3.digitaloceanspaces.com/dexkit/images/optimized/ethereum/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/2.png\",\"id\":\"2\"}},\"rows\":[],\"inline\":null},{\"id\":\"dtjier\",\"size\":4,\"plugin\":{\"id\":\"nft-plugin\",\"version\":1},\"dataI18n\":{\"default\":{\"name\":\"BoredApeYachtClub #1000\",\"contractAddress\":\"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d\",\"network\":\"Ethereum\",\"chainId\":1,\"image\":\"https://dexkit-storage.nyc3.digitaloceanspaces.com/dexkit/images/optimized/ethereum/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1000.png\",\"id\":\"1000\"}},\"rows\":[],\"inline\":null}]},{\"id\":\"rfmezh\",\"cells\":[{\"id\":\"fzd2af\",\"size\":12,\"plugin\":{\"id\":\"ory/editor/core/content/spacer\",\"version\":1},\"dataI18n\":{\"default\":{\"height\":100,\"hideInDesktop\":false,\"hideInMobile\":true}},\"rows\":[],\"inline\":null}]}],\"inline\":null}]}],\"inline\":null}]}]}";

const nftData = [
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    chainId: 1,
    id: '5230'
  },
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    chainId: 1,
    id: '2'
  },
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    chainId: 1,
    id: '1000'
  },
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    chainId: 2,
    id: '5230'
  },
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    chainId: 3,
    id: '2'
  },
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    chainId: 4,
    id: '1000'
  },
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    chainId: 4,
    id: '55'
  },
  {
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13f',
    chainId: 4,
    id: '55'
  }
]

describe('testing nft utils', () => {
  test('should parse correctly react editor json', () => {
    const acc = parseNFTPageEditorConfig({ config: JSON.parse(data) });
    expect(acc).toStrictEqual([
      {
        name: 'BoredApeYachtClub #5230',
        contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        network: 'Ethereum',
        chainId: 1,
        image: 'https://dexkit-storage.nyc3.digitaloceanspaces.com/dexkit/images/optimized/ethereum/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5230.png',
        id: '5230'
      },
      {
        name: 'BoredApeYachtClub #2',
        contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        network: 'Ethereum',
        chainId: 1,
        image: 'https://dexkit-storage.nyc3.digitaloceanspaces.com/dexkit/images/optimized/ethereum/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/2.png',
        id: '2'
      },
      {
        name: 'BoredApeYachtClub #1000',
        contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        network: 'Ethereum',
        chainId: 1,
        image: 'https://dexkit-storage.nyc3.digitaloceanspaces.com/dexkit/images/optimized/ethereum/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1000.png',
        id: '1000'
      }
    ])
  });
  test('should return a unique map of nfts', () => {
    const config = JSON.parse(data);
    let assetsToFetch = new Map<number, Map<string, Set<string>>>();
    const editorNfts = parseNFTPageEditorConfig({ config });
    for (const item of editorNfts) {
      assetsToFetch = returnNFTmap({
        address: item.contractAddress.toLowerCase(),
        chainId: item.chainId,
        tokenId: item.id,
        currentMap: assetsToFetch,
      });
    }
    const expectedMap = new Map<number, Map<string, Set<string>>>();
    const collectionMap = new Map<string, Set<string>>();
    const tokenIdsSet = new Set<string>();
    tokenIdsSet.add('5230')
    tokenIdsSet.add('2')
    tokenIdsSet.add('1000')
    collectionMap.set('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', tokenIdsSet);
    expectedMap.set(1, collectionMap)


    expect(assetsToFetch).toStrictEqual(expectedMap)

  })



  test('should get where query nfts to send to server', () => {
    const config = JSON.parse(data);
    let assetsToFetch = new Map<number, Map<string, Set<string>>>();
    const editorNfts = parseNFTPageEditorConfig({ config });
    for (const item of editorNfts) {
      assetsToFetch = returnNFTmap({
        address: item.contractAddress.toLowerCase(),
        chainId: item.chainId,
        tokenId: item.id,
        currentMap: assetsToFetch,
      });
    }
    const whereQuery = getWhereNFTQuery({ mapData: assetsToFetch });
    expect(whereQuery).toStrictEqual({
      where: {
        OR: [
          {
            chainId: 1,
            address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
            tokenId: ['5230', '2', '1000']
          }
        ]
      }
    })

  }




  );



});