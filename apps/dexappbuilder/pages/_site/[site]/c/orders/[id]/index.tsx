import MainLayout from '@dexkit/ui/components/layouts/main';
import { default as DynamicImport } from 'next/dynamic';

// Import the component dynamically to avoid SSR issues
const OrderDetailsPageComponent = DynamicImport(
  () => import('@/modules/commerce/OrderDetailsPageComponent'),
  { ssr: false }
);

export default function OrderDetailsPage() {
  return <OrderDetailsPageComponent />;
}

OrderDetailsPage.getLayout = (page: any) => {
  return <MainLayout>{page}</MainLayout>;
};

// Prevent prerendering by returning no paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
