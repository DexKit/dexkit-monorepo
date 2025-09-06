import { default as DynamicImport } from 'next/dynamic';
import AuthMainLayout from 'src/components/layouts/authMain';

// Import the component dynamically to avoid SSR issues
const CategoriesPageComponent = DynamicImport(
  () => import('@/modules/commerce/CategoriesPageComponent'),
  { ssr: false }
);

export default function CategoriesPage() {
  return <CategoriesPageComponent />;
}

(CategoriesPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
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
