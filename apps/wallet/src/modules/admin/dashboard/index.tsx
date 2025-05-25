// in src/admin/App.jsx
import { Admin, Resource, ShowGuesser } from 'react-admin';
import { AuthProvider } from './authProvider';

import dataProvider from './dataProvider';
import { AssetEdit } from './edits/asset';
import { CollectionEdit } from './edits/collection';
import { CreditGrantEdit } from './edits/credit-grant-edit';
import { FeatPriceEdit } from './edits/feat-price-edit';
import { SiteEdit } from './edits/site';
import { AssetList } from './lists/asset';
import { CoinList } from './lists/coin';
import { CoinPlatformList } from './lists/coinPlatform';
import { CollectionList } from './lists/collection';
import CreditGrantsList from './lists/credit-grants';
import FeatPricesList from './lists/feat-prices';
import { SiteList } from './lists/site';
import { UserEventList } from './lists/userEvents';
import MyLoginPage from './pages/loginPage';
import { AssetShow } from './shows/asset';
import { CoinShow } from './shows/coin';
import { CoinPlatformShow } from './shows/coinPlatform';
import { CollectionShow } from './shows/collection';

const App = () => (
  <Admin
    dataProvider={dataProvider as any}
    loginPage={MyLoginPage}
    authProvider={AuthProvider as any}
  >
    <Resource
      name="collection"
      list={CollectionList}
      show={CollectionShow}
      edit={CollectionEdit}
    />
    <Resource name="asset" list={AssetList} show={AssetShow} edit={AssetEdit} />
    <Resource name="user-events" list={UserEventList} />
    <Resource name="site" list={SiteList} show={ShowGuesser} edit={SiteEdit} />
    <Resource name="coin" list={CoinList} show={CoinShow} />
    <Resource
      name="coin-platform"
      list={CoinPlatformList}
      show={CoinPlatformShow}
    />
    <Resource
      name="feature-prices"
      list={FeatPricesList}
      edit={FeatPriceEdit}
    />
    <Resource
      name="credit-grants"
      list={CreditGrantsList}
      edit={CreditGrantEdit}
    />
  </Admin>
);

export default App;
