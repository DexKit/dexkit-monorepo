import { ChainId } from '@/modules/common/constants/enums';

export enum KittygotchiTraitType {
  ACCESSORIES,
  BODY,
  CLOTHES,
  EARS,
  EYES,
  MOUTH,
  NOSE,
}

export const KITTYGOTCHI_METADATA_ENDPOINT =
  'https://kittygotchi.dexkit.com/api/';

const KITTYGOTCHI = {
  [ChainId.Polygon]: '0xEA88540adb1664999524d1a698cb84F6C922D2A1',
  [ChainId.Mumbai]: '0xbdd0C521aBb19fA863917e2C807f327957D239ff',
  [ChainId.BSC]: '0xf44112926506318e3Aace4381B2D76791D980Ac3',
  [ChainId.Ethereum]: '0xe76591AD590765e9Ab9EdE82BEa274aFcF5Ce703',
};

export const GET_KITTYGOTCHI_CONTRACT_ADDR = (chainId?: number) => {
  if (
    chainId === ChainId.Polygon ||
    chainId === ChainId.Mumbai ||
    chainId === ChainId.BSC ||
    chainId === ChainId.Ethereum
  ) {
    return KITTYGOTCHI[chainId];
  }

  return undefined;
};

const KITTYGOTCHI_GRAPH_ENDPOINT = {
  [ChainId.Polygon]:
    'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchi',
  [ChainId.Mumbai]:
    'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchimumbai',
  [ChainId.BSC]:
    'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchibsc',
  [ChainId.Ethereum]:
    'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchieth',
};

export const GET_KITTYGOTCHI_GRAPH_ENDPOINT = (chainId?: number) => {
  if (
    chainId === ChainId.Polygon ||
    chainId === ChainId.Mumbai ||
    chainId === ChainId.BSC ||
    chainId === ChainId.Ethereum
  ) {
    return KITTYGOTCHI_GRAPH_ENDPOINT[chainId];
  }

  return undefined;
};

export const KITTY_TRAITS_ITEM_URL =
  'https://dexkit-storage.nyc3.digitaloceanspaces.com/kittygotchi';

export const KittygotchiTraits: any = {
  [KittygotchiTraitType.ACCESSORIES]: [
    {
      value: 'piercing',
      path: 'piercing',
      holding: 20,
    },
    {
      value: 'hat',
      path: 'hat',
      holding: 50,
    },
    {
      value: 'headphones',
      path: 'headphones',
      holding: 100,
    },
    {
      value: 'headphones2',
      path: 'headphones2',
      holding: 250,
    },
    {
      value: 'flower',
      path: 'flower',
      holding: 500,
    },
    {
      value: 'cap',
      path: 'cap',
      holding: 1000,
    },
    {
      value: 'winter',
      path: 'winter',
      holding: 3000,
    },
    {
      value: 'astro-helmet',
      path: 'astro-helmet',
      holding: 3000,
    },
    {
      value: 'punk-hair',
      path: 'punk-hair',
      holding: 5000,
    },
    {
      value: 'crown',
      path: 'crown',
      holding: 10000,
    },
  ],
  [KittygotchiTraitType.BODY]: [
    {
      value: 'body',
      path: 'body',
      holding: 0,
    },
  ],
  [KittygotchiTraitType.CLOTHES]: [
    {
      value: 'dance',
      path: 'dance',
      holding: 20,
    },
    {
      value: 'job',
      path: 'job',
      holding: 50,
    },
    {
      value: 'love-date',
      path: 'love-date',
      holding: 100,
    },
    {
      value: 'astronaut',
      path: 'astronaut',
      holding: 250,
    },
    {
      value: 'school',
      path: 'school',
      holding: 500,
    },
    {
      value: 'bad-boy',
      path: 'bad-boy',
      holding: 1000,
    },
    {
      value: 'scarf',
      path: 'scarf',
      holding: 2000,
    },
    {
      value: 'hippie',
      path: 'hippie',
      holding: 3000,
    },
    {
      value: 'tie',
      path: 'tie',
      holding: 4000,
    },
    {
      value: 'tour',
      path: 'tour',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.EARS]: [
    {
      value: 'pointed',
      path: 'pointed',
      holding: 20,
    },
    {
      value: 'fun',
      path: 'fun',
      holding: 50,
    },
    {
      value: 'alert',
      path: 'alert',
      holding: 250,
    },
    {
      value: 'rounded',
      path: 'rounded',
      holding: 500,
    },
    {
      value: 'angora',
      path: 'angora',
      holding: 1000,
    },
    {
      value: 'lynx',
      path: 'lynx',
      holding: 2000,
    },
    {
      value: 'rounded2',
      path: 'rounded2',
      holding: 3000,
    },
    {
      value: 'short',
      path: 'short',
      holding: 4000,
    },
  ],
  [KittygotchiTraitType.EYES]: [
    {
      value: 'star',
      path: 'star',
      holding: 20,
    },
    {
      value: 'circle',
      path: 'circle',
      holding: 50,
    },
    {
      value: 'eyeliner',
      path: 'eyeliner',
      holding: 100,
    },
    {
      value: 'cute',
      path: 'cute',
      holding: 250,
    },
    {
      value: 'flash',
      path: 'flash',
      holding: 500,
    },
    {
      value: 'beach-glasses',
      path: 'beach-glasses',
      holding: 1000,
    },
    {
      value: 'love',
      path: 'love',
      holding: 2000,
    },
    {
      value: 'thunder',
      path: 'thunder',
      holding: 3000,
    },
    {
      value: 'canoe',
      path: 'canoe',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.MOUTH]: [
    {
      value: 'cute',
      path: 'cute',
      holding: 20,
    },
    {
      value: 'angry',
      path: 'angry',
      holding: 50,
    },
    {
      value: 'happy',
      path: 'happy',
      holding: 100,
    },
    {
      value: 'cute-smile',
      path: 'cute-smile',
      holding: 250,
    },
    {
      value: 'over-the-moon',
      path: 'over-the-moon',
      holding: 500,
    },
    {
      value: 'mask',
      path: 'mask',
      holding: 1000,
    },
    {
      value: 'mustache',
      path: 'mustache',
      holding: 2000,
    },
    {
      value: 'smile',
      path: 'smile',
      holding: 3000,
    },
    {
      value: 'teeth',
      path: 'teeth',
      holding: 4000,
    },
    {
      value: 'sad',
      path: 'sad',
      holding: 5000,
    },
  ],
  [KittygotchiTraitType.NOSE]: [
    {
      value: 'fan',
      path: 'fan',
      holding: 20,
    },
    {
      value: 'ellipse',
      path: 'ellipse',
      holding: 50,
    },
    {
      value: 'pug-nose',
      path: 'pug-nose',
      holding: 100,
    },
    {
      value: 'little-mustache',
      path: 'little-mustache',
      holding: 250,
    },
    {
      value: 'rhombus',
      path: 'rhombus',
      holding: 500,
    },
    {
      value: 'love',
      path: 'love',
      holding: 1000,
    },
    {
      value: 'pig',
      path: 'pig',
      holding: 2000,
    },
    {
      value: 'septum',
      path: 'septum',
      holding: 3000,
    },
    {
      value: 'tiny',
      path: 'tiny',
      holding: 4000,
    },
    {
      value: 'small',
      path: 'small',
      holding: 5000,
    },
  ],
};

export const KITTYGOTCHI_EDIT_MIN_AMOUNT = 20;

export const IMAGE_PATHS: any = {
  'body/body.png': '/kittygotchi/body/body.png',
  'accessories/flower.png': '/kittygotchi/accessories/flower.png',
  'accessories/hat.png': '/kittygotchi/accessories/hat.png',
  'accessories/headphones.png': '/kittygotchi/accessories/headphones.png',
  'accessories/punk-hair.png': '/kittygotchi/accessories/punk-hair.png',
  'accessories/piercing.png': '/kittygotchi/accessories/piercing.png',
  // new
  'accessories/astro-helmet.png': '/kittygotchi/accessories/astro-helmet.png',
  'accessories/cap.png': '/kittygotchi/accessories/cap.png',
  'accessories/crown.png': '/kittygotchi/accessories/crown.png',
  'accessories/headphones2.png': '/kittygotchi/accessories/headphones2.png',
  'accessories/winter.png': '/kittygotchi/accessories/winter.png',
  'clothes/job.png': '/kittygotchi/clothes/job.png',
  'clothes/dance.png': '/kittygotchi/clothes/dance.png',
  'clothes/love-date.png': '/kittygotchi/clothes/love-date.png',
  'clothes/school.png': '/kittygotchi/clothes/school.png',
  'clothes/tour.png': '/kittygotchi/clothes/tour.png',
  // new
  'clothes/astronaut.png': '/kittygotchi/clothes/astronaut.png',
  'clothes/bad-boy.png': '/kittygotchi/clothes/bad-boy.png',
  'clothes/hippie.png': '/kittygotchi/clothes/hippie.png',
  'clothes/scarf.png': '/kittygotchi/clothes/scarf.png',
  'clothes/tie.png': '/kittygotchi/clothes/tie.png',
  'ears/fun.png': '/kittygotchi/ears/fun.png',
  'ears/pointed.png': '/kittygotchi/ears/pointed.png',
  'ears/rounded.png': '/kittygotchi/ears/rounded.png',
  // new
  'ears/alert.png': '/kittygotchi/ears/alert.png',
  'ears/angora.png': '/kittygotchi/ears/angora.png',
  'ears/lynx.png': '/kittygotchi/ears/lynx.png',
  'ears/rounded2.png': '/kittygotchi/ears/rounded2.png',
  'ears/short.png': '/kittygotchi/ears/short.png',
  'eyes/circle.png': '/kittygotchi/eyes/circle.png',
  'eyes/canoe.png': '/kittygotchi/eyes/canoe.png',
  'eyes/eyeliner.png': '/kittygotchi/eyes/eyeliner.png',
  'eyes/flash.png': '/kittygotchi/eyes/flash.png',
  'eyes/star.png': '/kittygotchi/eyes/star.png',
  // new
  'eyes/beach-glasses.png': '/kittygotchi/eyes/beach-glasses.png',
  'eyes/code-glasses.png': '/kittygotchi/eyes/code-glasses.png',
  'eyes/cute.png': '/kittygotchi/eyes/cute.png',
  'eyes/love.png': '/kittygotchi/eyes/love.png',
  'eyes/thunder.png': '/kittygotchi/eyes/thunder.png',
  'mouth/angry.png': '/kittygotchi/mouth/angry.png',
  'mouth/cute.png': '/kittygotchi/mouth/cute.png',
  'mouth/happy.png': '/kittygotchi/mouth/happy.png',
  'mouth/over-the-moon.png': '/kittygotchi/mouth/over-the-moon.png',
  'mouth/sad.png': '/kittygotchi/mouth/sad.png',
  // new
  'mouth/cute-smile.png': '/kittygotchi/mouth/cute-smile.png',
  'mouth/mask.png': '/kittygotchi/mouth/mask.png',
  'mouth/mustache.png': '/kittygotchi/mouth/mustache.png',
  'mouth/smile.png': '/kittygotchi/mouth/smile.png',
  'mouth/teeth.png': '/kittygotchi/mouth/teeth.png',
  'nose/ellipse.png': '/kittygotchi/nose/ellipse.png',
  'nose/fan.png': '/kittygotchi/nose/fan.png',
  'nose/pug-nose.png': '/kittygotchi/nose/pug-nose.png',
  'nose/rhombus.png': '/kittygotchi/nose/rhombus.png',
  'nose/small.png': '/kittygotchi/nose/small.png',
  // new
  'nose/little-mustache.png': '/kittygotchi/nose/little-mustache.png',
  'nose/love.png': '/kittygotchi/nose/love.png',
  'nose/pig.png': '/kittygotchi/nose/pig.png',
  'nose/septum.png': '/kittygotchi/nose/septum.png',
  'nose/tiny.png': '/kittygotchi/nose/tiny.png',
};

export const IMAGE_PATHS_ICONS: any = {
  'accessories/flower.png': '/kittygotchi/icons/accessories/flower.png',
  'accessories/hat.png': '/kittygotchi/icons/accessories/hat.png',
  'accessories/headphones.png': '/kittygotchi/icons/accessories/headphones.png',
  'accessories/punk-hair.png': '/kittygotchi/icons/accessories/punk-hair.png',
  'accessories/piercing.png': '/kittygotchi/icons/accessories/piercing.png',
  // new
  'accessories/astro-helmet.png': '/kittygotchi/accessories/astro-helmet.png',
  'accessories/cap.png': '/kittygotchi/accessories/cap.png',
  'accessories/crown.png': '/kittygotchi/accessories/crown.png',
  'accessories/headphones2.png': '/kittygotchi/accessories/headphones2.png',
  'accessories/winter.png': '/kittygotchi/accessories/winter.png',
  'clothes/job.png': '/kittygotchi/icons/clothes/job.png',
  'clothes/dance.png': '/kittygotchi/icons/clothes/dance.png',
  'clothes/love-date.png': '/kittygotchi/icons/clothes/love-date.png',
  'clothes/school.png': '/kittygotchi/icons/clothes/school.png',
  'clothes/tour.png': '/kittygotchi/icons/clothes/tour.png',
  // new
  'clothes/astronaut.png': '/kittygotchi/clothes/astronaut.png',
  'clothes/bad-boy.png': '/kittygotchi/clothes/bad-boy.png',
  'clothes/hippie.png': '/kittygotchi/clothes/hippie.png',
  'clothes/scarf.png': '/kittygotchi/clothes/scarf.png',
  'clothes/tie.png': '/kittygotchi/clothes/tie.png',
  'ears/fun.png': '/kittygotchi/icons/ears/fun.png',
  'ears/pointed.png': '/kittygotchi/icons/ears/pointed.png',
  'ears/rounded.png': '/kittygotchi/icons/ears/rounded.png',
  // new
  'ears/alert.png': '/kittygotchi/ears/alert.png',
  'ears/angora.png': '/kittygotchi/ears/angora.png',
  'ears/lynx.png': '/kittygotchi/ears/lynx.png',
  'ears/rounded2.png': '/kittygotchi/ears/rounded2.png',
  'ears/short.png': '/kittygotchi/ears/short.png',
  'eyes/circle.png': '/kittygotchi/icons/eyes/circle.png',
  'eyes/canoe.png': '/kittygotchi/icons/eyes/canoe.png',
  'eyes/eyeliner.png': '/kittygotchi/icons/eyes/eyeliner.png',
  'eyes/flash.png': '/kittygotchi/icons/eyes/flash.png',
  'eyes/star.png': '/kittygotchi/icons/eyes/star.png',
  // new
  'eyes/beach-glasses.png': '/kittygotchi/eyes/beach-glasses.png',
  'eyes/code-glasses.png': '/kittygotchi/eyes/code-glasses.png',
  'eyes/cute.png': '/kittygotchi/eyes/cute.png',
  'eyes/love.png': '/kittygotchi/eyes/love.png',
  'eyes/thunder.png': '/kittygotchi/eyes/thunder.png',
  'mouth/angry.png': '/kittygotchi/icons/mouth/angry.png',
  'mouth/cute.png': '/kittygotchi/icons/mouth/cute.png',
  'mouth/happy.png': '/kittygotchi/icons/mouth/happy.png',
  'mouth/over-the-moon.png': '/kittygotchi/icons/mouth/over-the-moon.png',
  'mouth/sad.png': '/kittygotchi/icons/mouth/sad.png',
  // new
  'mouth/cute-smile.png': '/kittygotchi/mouth/cute-smile.png',
  'mouth/mask.png': '/kittygotchi/mouth/mask.png',
  'mouth/mustache.png': '/kittygotchi/mouth/mustache.png',
  'mouth/smile.png': '/kittygotchi/mouth/smile.png',
  'mouth/teeth.png': '/kittygotchi/mouth/teeth.png',
  'nose/ellipse.png': '/kittygotchi/icons/nose/ellipse.png',
  'nose/fan.png': '/kittygotchi/icons/nose/fan.png',
  'nose/pug-nose.png': '/kittygotchi/icons/nose/pug-nose.png',
  'nose/rhombus.png': '/kittygotchi/icons/nose/rhombus.png',
  'nose/small.png': '/kittygotchi/icons/nose/small.png',
  // new
  'nose/little-mustache.png': '/kittygotchi/nose/little-mustache.png',
  'nose/love.png': '/kittygotchi/nose/love.png',
  'nose/pig.png': '/kittygotchi/nose/pig.png',
  'nose/septum.png': '/kittygotchi/nose/septum.png',
  'nose/tiny.png': '/kittygotchi/nose/tiny.png',
};
