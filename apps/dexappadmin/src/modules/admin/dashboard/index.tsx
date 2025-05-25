// in src/admin/App.jsx
import { Admin, Resource, ShowGuesser } from "react-admin";
import { AuthProvider } from "./authProvider";

import dataProvider from "./dataProvider";
import { AssetEdit } from "./edits/asset";
import { CollectionEdit } from "./edits/collection";
import { CreditGrantEdit } from "./edits/credit-grant-edit";
import { SiteEdit } from "./edits/site";
import { AssetList } from "./lists/asset";
import { CoinList } from "./lists/coin";
import { CoinPlatformList } from "./lists/coinPlatform";
import { CollectionList } from "./lists/collection";
import CreditGrantsList from "./lists/credit-grants";
import { OrdersList } from "./lists/orders";
import { SiteList } from "./lists/site";
import { UserEventList } from "./lists/userEvents";
import MyLoginPage from "./pages/loginPage";
import { AssetShow } from "./shows/asset";
import { CoinShow } from "./shows/coin";
import { CoinPlatformShow } from "./shows/coinPlatform";
import { CollectionShow } from "./shows/collection";
import { OrderShow } from "./shows/order";
import { ProductShow } from "./shows/product";
import { ProductCategoryShow } from "./shows/productCategory";

import { CheckoutShow } from "./shows/checkout";

import { FeatEdit } from "./edits/feat-edit";
import { FeatUsageEdit } from "./edits/feat-usage-edit";
import { CheckoutList } from "./lists/checkouts";
import FeatsList from "./lists/feats";
import FeatUsagesList from "./lists/featUsages";
import { NotificationsList } from "./lists/notifications";
import { ProductCategoryList } from "./lists/productCategories";
import { ProductList } from "./lists/products";
import { NotificationShow } from "./shows/notifications";

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
    <Resource name="orders" list={OrdersList} show={OrderShow} />
    <Resource name="products" list={ProductList} show={ProductShow} />
    <Resource
      name="product-category"
      list={ProductCategoryList}
      show={ProductCategoryShow}
    />
    <Resource name="checkouts" list={CheckoutList} show={CheckoutShow} />
    <Resource
      name="notifications"
      list={NotificationsList}
      show={NotificationShow}
    />

    <Resource
      name="coin-platform"
      list={CoinPlatformList}
      show={CoinPlatformShow}
    />
    <Resource name="feature" list={FeatsList} edit={FeatEdit} />
    <Resource
      name="credit-grant"
      list={CreditGrantsList}
      edit={CreditGrantEdit}
    />
    <Resource name="feature-usage" list={FeatUsagesList} edit={FeatUsageEdit} />
  </Admin>
);

export default App;
