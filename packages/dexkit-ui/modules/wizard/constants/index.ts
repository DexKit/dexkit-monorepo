import { AppPageOptions } from "../types/config";


export const WIDGET_PAGE_KEY = '__widget_dexappbuilder';

export const CORE_PAGES: { [key: string]: AppPageOptions } = {
  ['swap']: {
    title: 'Swap',
    uri: '/swap'
  },
  ['collections']: {
    title: 'Collections',
    uri: '/collections'
  },
  ['wallet']: {
    title: 'Wallet',
    uri: '/wallet'
  }
}