import CategoriesContainer from "./CategoriesContainer";
import CheckoutCreateContainer from "./CheckoutCreateContainer";
import CheckoutsContainer from "./CheckoutsContainer";
import CollectionsContainer from "./CollectionsContainer";
import ContainerProvider from "./ContainerProvider";
import CreateCategoryContainer from "./CreateCategoryContainer";
import CreateCollectionContainer from "./CreateCollectionContainer";
import CreateProductContainer from "./CreateProductContainer";
import DashboardContainer from "./DashboardContainer";
import EditCheckoutContainer from "./EditCheckoutContainer";
import EditCollectionContainer from "./EditCollectionContainer";
import EditProductContainer from "./EditProductContainer";
import NotificationsContainer from "./NotificationsContainer";
import OrderContainer from "./OrderContainer";
import OrdersContainer from "./OrdersContainer";
import ProductsContainer from "./ProductsContainer";
import SettingsContainer from "./SettingsContainer";

export const CONTAINERS: { [key: string]: React.ReactNode } = {
  "commerce.dashboard": <DashboardContainer />,
  "commerce.notifications": <NotificationsContainer />,
  "commerce.settings": <SettingsContainer />,
  "commerce.orders": <OrdersContainer />,
  "commerce.order.edit": <OrderContainer />,
  "commerce.products.items": <ProductsContainer />,
  "commerce.products.edit": <EditProductContainer />,
  "commerce.products.create": <CreateProductContainer />,
  "commerce.products.collections": <CollectionsContainer />,
  "commerce.products.categories": <CategoriesContainer />,
  "commerce.checkouts": <CheckoutsContainer />,
  "commerce.checkouts.create": <CheckoutCreateContainer />,
  "commerce.checkouts.edit": <EditCheckoutContainer />,
  "commerce.products.categories.create": <CreateCategoryContainer />,
  "commerce.products.collection.create": <CreateCollectionContainer />,
  "commerce.products.collection.edit": <EditCollectionContainer />,
};

export interface CommerceContainerRendererProps {
  containerId: string;
  onActiveMenu: (activeMenu: string) => void;
}

export default function CommerceContainerRenderer({
  containerId,
  onActiveMenu,
}: CommerceContainerRendererProps) {
  return (
    <ContainerProvider containerId={containerId} onActiveMenu={onActiveMenu}>
      {(id) => CONTAINERS[id]}
    </ContainerProvider>
  );
}
